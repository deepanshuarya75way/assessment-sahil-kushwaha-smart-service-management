const express = require('express');
const router = express.Router();
const { getStaffTickets, assignTicket, updateTicketStatus, rejectTicket } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/tickets', authorize('STAFF', 'ADMIN'), getStaffTickets);
router.put('/tickets/:id/assign', authorize('STAFF', 'ADMIN'), assignTicket);
router.put('/tickets/:id/status', updateTicketStatus);
router.put('/tickets/:id/reject', authorize('STAFF', 'ADMIN'), rejectTicket);

module.exports = router;

