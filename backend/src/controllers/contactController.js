const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Submit a public contact / inquiry message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return sendError(res, 'Please provide name, email, subject, and message', 400);
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return sendError(res, 'Please provide a valid email address', 400);
  }

  const contactRecord = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim()
  });

  sendSuccess(
    res,
    {
      id: contactRecord._id,
      name: contactRecord.name,
      createdAt: contactRecord.createdAt
    },
    'Thank you for contacting Smart Service Management. Your message has been received.',
    201
  );
});

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Private (ADMIN)
 */
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  sendSuccess(res, messages, `Retrieved ${messages.length} contact messages`);
});

module.exports = {
  submitContactMessage,
  getContactMessages
};
