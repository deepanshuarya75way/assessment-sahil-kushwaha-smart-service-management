const mongoose = require('mongoose');

const staffVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    organizationEmail: {
      type: String,
      required: [true, 'Organization email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      trim: true,
      index: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    jobRole: {
      type: String,
      required: [true, 'Job title/role is required'],
      trim: true
    },
    idCardPath: {
      type: String,
      required: [true, 'Staff ID card file path is required']
    },
    idCardOriginalName: {
      type: String,
      required: true
    },
    idCardMimeType: {
      type: String,
      default: ''
    },
    idCardSize: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid verification status'
      },
      default: 'PENDING',
      index: true
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StaffVerification', staffVerificationSchema);
