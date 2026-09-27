const asyncHandler = require('express-async-handler');
const { classifyTicket } = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Classify ticket text and return category, priority & department suggestions
 * @route   POST /api/ai/classify-ticket
 * @access  Private
 */
const getAiTicketClassification = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title && !description) {
    return sendError(res, 'Please provide a title or description for AI classification', 400);
  }

  const aiResult = await classifyTicket(title || '', description || '');

  sendSuccess(
    res,
    {
      category: aiResult.category,
      priority: aiResult.priority,
      department: aiResult.category === 'Electrical' ? 'Electrical Maintenance' : aiResult.category === 'Plumbing' ? 'Plumbing & Facilities' : aiResult.category === 'Hardware' || aiResult.category === 'Software' || aiResult.category === 'IT Support' ? 'IT Infrastructure' : 'General Support',
      confidence: aiResult.confidence
    },
    'AI ticket classification generated successfully'
  );
});

module.exports = {
  getAiTicketClassification
};
