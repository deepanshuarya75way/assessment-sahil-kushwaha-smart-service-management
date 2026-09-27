const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment
} = require('../controllers/ticketController');
const {
  assignTicket,
  updateTicketStatus,
  rejectTicket
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All ticket routes require authentication

router.route('/')
  .get(getTickets)
  .post(authorize('USER'), createTicket); // Only USER role is permitted to create service tickets

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(authorize('ADMIN'), deleteTicket);

router.put('/:id/assign', authorize('STAFF', 'ADMIN'), assignTicket);
router.put('/:id/status', updateTicketStatus);
router.put('/:id/reject', authorize('STAFF', 'ADMIN'), rejectTicket);

router.post('/:id/comments', addComment);

module.exports = router;

