const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Comment must be associated with a ticket'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must be associated with a user']
    },
    message: {
      type: String,
      required: [true, 'Comment message cannot be empty'],
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

commentSchema.index({ ticketId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
