const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const TicketHistory = require('../models/TicketHistory');
const generateTicketNumber = require('../utils/ticketNumberGenerator');
const { classifyTicket } = require('../services/aiService');
const { logTicketHistory } = require('../utils/lifecycleHelper');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Create a new service request ticket (with location, department, AI classification & history logging)
 * @route   POST /api/tickets
 * @access  Private (USER only)
 */
const createTicket = asyncHandler(async (req, res) => {
  // Enforce role permission: Only USER role can create customer service requests
  if (req.user.role !== 'USER') {
    return sendError(res, 'Access denied: Only users can create service request tickets', 403);
  }

  const { title, description, category, priority, department, location, attachment } = req.body;


  if (!title || !description) {
    return sendError(res, 'Please provide a title and detailed description', 400);
  }

  // Perform AI Classification
  const aiResult = await classifyTicket(title, description);

  const ticketNumber = await generateTicketNumber();

  const ticket = await Ticket.create({
    ticketNumber,
    title,
    description,
    category: category || aiResult.category,
    department: department || aiResult.department || 'General',
    location: location || '',
    attachment: attachment || null,
    priority: priority || aiResult.priority,
    status: 'PENDING',
    createdBy: req.user._id,
    aiCategory: aiResult.category,
    aiPriority: aiResult.priority,
    aiSuggestion: {
      category: aiResult.category,
      priority: aiResult.priority,
      department: aiResult.department || 'General',
      confidence: aiResult.confidence
    }
  });

  const populatedTicket = await Ticket.findById(ticket._id).populate('createdBy', 'name email role');

  // Log Audit History: TICKET_CREATED
  await logTicketHistory({
    ticketId: ticket._id,
    action: 'TICKET_CREATED',
    previousValue: '',
    newValue: 'PENDING',
    changedBy: req.user._id
  });

  sendSuccess(res, populatedTicket, 'Service request ticket created successfully', 201);
});

/**
 * @desc    Get tickets list (Filtered by role and query params)
 * @route   GET /api/tickets
 * @access  Private
 */
const getTickets = asyncHandler(async (req, res) => {
  const { status, category, priority, search } = req.query;

  let query = {};

  if (req.user.role === 'USER') {
    query.createdBy = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    query.$or = [
      { ticketNumber: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  const tickets = await Ticket.find(query)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .sort({ createdAt: -1 });

  sendSuccess(res, tickets, `Retrieved ${tickets.length} tickets`);
});

/**
 * @desc    Get single ticket details with comments and audit history timeline
 * @route   GET /api/tickets/:id
 * @access  Private
 */
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  if (req.user.role === 'USER' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to view this ticket', 403);
  }

  const comments = await Comment.find({ ticketId: ticket._id })
    .populate('userId', 'name role email')
    .sort({ createdAt: 1 });

  const history = await TicketHistory.find({ ticketId: ticket._id })
    .populate('changedBy', 'name role email')
    .sort({ createdAt: -1 });

  sendSuccess(res, { ticket, comments, history }, 'Ticket details retrieved successfully');
});

/**
 * @desc    Update ticket content (Title, Description, Category, Location)
 * @route   PUT /api/tickets/:id
 * @access  Private
 */
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  if (req.user.role === 'USER' && ticket.createdBy.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to update this ticket', 403);
  }

  const { title, description, category, priority, department, location } = req.body;

  const prevCategory = ticket.category;
  const prevPriority = ticket.priority;

  if (title) ticket.title = title;
  if (description) ticket.description = description;
  if (category) ticket.category = category;
  if (priority) ticket.priority = priority;
  if (department) ticket.department = department;
  if (location) ticket.location = location;

  const updatedTicket = await ticket.save();
  const populated = await Ticket.findById(updatedTicket._id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');

  if (prevPriority !== ticket.priority) {
    await logTicketHistory({
      ticketId: ticket._id,
      action: 'PRIORITY_CHANGED',
      previousValue: prevPriority,
      newValue: ticket.priority,
      changedBy: req.user._id
    });
  }

  if (prevCategory !== ticket.category) {
    await logTicketHistory({
      ticketId: ticket._id,
      action: 'CATEGORY_CHANGED',
      previousValue: prevCategory,
      newValue: ticket.category,
      changedBy: req.user._id
    });
  }

  sendSuccess(res, populated, 'Ticket updated successfully');
});

/**
 * @desc    Delete ticket (ADMIN only)
 * @route   DELETE /api/tickets/:id
 * @access  Private (ADMIN)
 */
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  await Comment.deleteMany({ ticketId: ticket._id });
  await TicketHistory.deleteMany({ ticketId: ticket._id });
  await ticket.deleteOne();

  sendSuccess(res, null, 'Ticket and associated records deleted successfully');
});

/**
 * @desc    Add a comment to a ticket
 * @route   POST /api/tickets/:id/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return sendError(res, 'Comment message cannot be empty', 400);
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return sendError(res, 'Ticket not found', 404);
  }

  if (req.user.role === 'USER' && ticket.createdBy.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to comment on this ticket', 403);
  }

  const comment = await Comment.create({
    ticketId: ticket._id,
    userId: req.user._id,
    message: message.trim()
  });

  const populatedComment = await Comment.findById(comment._id).populate('userId', 'name role email');

  sendSuccess(res, populatedComment, 'Comment added successfully', 201);
});

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment
};
