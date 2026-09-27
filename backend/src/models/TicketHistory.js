const mongoose = require('mongoose');

const ticketHistorySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'TicketId is required for history tracking'],
      index: true
    },
    action: {
      type: String,
      required: [true, 'Action description is required'],
      trim: true
    },
    previousValue: {
      type: String,
      default: ''
    },
    newValue: {
      type: String,
      default: ''
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User performing action is required']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

ticketHistorySchema.index({ ticketId: 1, createdAt: -1 });

module.exports = mongoose.model('TicketHistory', ticketHistorySchema);
