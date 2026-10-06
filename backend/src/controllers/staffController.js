const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { isValidTransition, logTicketHistory } = require('../utils/lifecycleHelper');
const {emitTicketEvent} = require('../services/realtimeService');
/**
 * @desc    Get tickets assigned to the logged in staff member
 * @route   GET /api/staff/tickets
 * @access  Private (STAFF, ADMIN)
 */
const getStaffTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ assignedTo: req.user._id })
    .populate('createdBy', 'name email role')
    .sort({ updatedAt: -1 });

  sendSuccess(res, tickets, `Retrieved ${tickets.length} tickets assigned to staff`);
});

/**
 * @desc    Assign ticket to staff member (or self-claim by staff)
 * @route   PUT /api/tickets/:id/assign
 * @access  Private (STAFF self-claim, ADMIN reassign)
 */
const assignTicket = asyncHandler(async (req, res) => {
  const { staffId } = req.body;
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  const prevStaffId = ticket.assignedTo ? ticket.assignedTo.toString() : 'Unassigned';
  const targetStaffId = req.body.staffId || req.body.assignedTo || req.user._id;

  ticket.assignedTo = targetStaffId;

  // Controlled status transition: When assigned to staff, set status to ASSIGNED
  const prevStatus = ticket.status;
  ticket.status = 'ASSIGNED';

  const updatedTicket = await ticket.save();
  const populated = await Ticket.findById(updatedTicket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  // Log Audit Trail History Records
  await logTicketHistory({
    ticketId: ticket._id,
    action: 'STAFF_ASSIGNED',
    previousValue: prevStaffId,
    newValue: populated.assignedTo?.name || targetStaffId,
    changedBy: req.user._id
  });

  if (prevStatus !== ticket.status) {
    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus,
      newValue: ticket.status,
      changedBy: req.user._id
    });
  }

  emitTicketEvent({
    type:'ticke_assigned',
    ticket :populated,
    actor :req.user
  });
  sendSuccess(res, populated, 'Ticket assigned successfully');
});

/**
 * @desc    Update ticket status (PENDING -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED)
 * @route   PUT /api/tickets/:id/status
 * @access  Private (STAFF, ADMIN, Ticket Owner for CLOSED)
 */
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const validStatuses = ['PENDING', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  if (!status || !validStatuses.includes(status)) {
    return sendError(res, 'Please provide a valid status (PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED)', 400);
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  // Enforce controlled sequential status transitions
  if (!isValidTransition(ticket.status, status)) {
    return sendError(
      res,
      `Invalid status transition from '${ticket.status}' to '${status}'. Expected sequential lifecycle order.`,
      400
    );
  }

  // Authorization check
  const isOwner = ticket.createdBy.toString() === req.user._id.toString();
  const isStaffOrAdmin = ['STAFF', 'ADMIN'].includes(req.user.role);

  if (!isOwner && !isStaffOrAdmin) {
    return sendError(res, 'Not authorized to change ticket status', 403);
  }

  // Users can only confirm resolution (RESOLVED -> CLOSED)
  if (isOwner && !isStaffOrAdmin && status !== 'CLOSED') {
    return sendError(res, 'Users can only mark resolved tickets as CLOSED to confirm resolution', 403);
  }

  const prevStatus = ticket.status;
  ticket.status = status;

  if (resolutionNotes) {
    ticket.resolutionNotes = resolutionNotes.trim();
  }

  const updatedTicket = await ticket.save();
  const populated = await Ticket.findById(updatedTicket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  // Log Audit Trail History
  await logTicketHistory({
    ticketId: ticket._id,
    action: 'STATUS_CHANGED',
    previousValue: prevStatus,
    newValue: status,
    changedBy: req.user._id
  });
  emitTicketEvent({
    type:'ticke_status_confimed',
    ticket :populated,
    actor :req.user
  });

  sendSuccess(res, populated, `Ticket status updated to ${status}`);
});

/**
 * @desc    Reject assigned ticket by staff member
 * @route   PUT /api/tickets/:id/reject or PUT /api/staff/tickets/:id/reject
 * @access  Private (STAFF assigned to ticket, ADMIN)
 */
const rejectTicket = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const rejectionReason = (reason || '').trim();

  if (!rejectionReason) {
    return sendError(res, 'Please provide a reason for rejecting the assigned ticket', 400);
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  if (ticket.status !== 'ASSIGNED' && !ticket.assignedTo) {
    return sendError(res, 'Only currently assigned tickets can be rejected', 400);
  }

  // Authorization check: Must be the assigned staff member or an ADMIN
  const isAssignedStaff = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';

  if (!isAssignedStaff && !isAdmin) {
    return sendError(res, 'Not authorized: You can only reject tickets assigned to you', 403);
  }

  const prevStaffName = req.user.name || 'Assigned Staff';
  const prevStatus = ticket.status;

  // Return ticket to unassigned PENDING queue
  ticket.assignedTo = null;
  ticket.status = 'PENDING';
  ticket.rejectionReason = rejectionReason;

  const updatedTicket = await ticket.save();
  const populated = await Ticket.findById(updatedTicket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  // Log rejection in TicketHistory audit trail
  await logTicketHistory({
    ticketId: ticket._id,
    action: 'TICKET_REJECTED',
    previousValue: prevStaffName,
    newValue: `Unassigned (Reason: ${rejectionReason})`,
    changedBy: req.user._id
  });

  if (prevStatus !== 'PENDING') {
    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus,
      newValue: 'PENDING',
      changedBy: req.user._id
    });
  }
  emitTicketEvent({
    type:'ticke_updated',
    ticket :populated,
    actor :req.user
  });

  sendSuccess(res, populated, 'Ticket rejected and returned to unassigned queue');
});

module.exports = {
  getStaffTickets,
  assignTicket,
  updateTicketStatus,
  rejectTicket
};

