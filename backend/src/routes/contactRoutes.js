const express = require('express');
const router = express.Router();
const { submitContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitContactMessage);
router.get('/', protect, authorize('ADMIN'), getContactMessages);

module.exports = router;
