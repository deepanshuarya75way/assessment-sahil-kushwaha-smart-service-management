const express = require('express');
const router = express.Router();
const { getAiTicketClassification } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/classify-ticket', getAiTicketClassification);

module.exports = router;
