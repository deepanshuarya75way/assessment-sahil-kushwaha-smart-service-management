const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['USER', 'STAFF', 'ADMIN'],
        message: '{VALUE} is not a valid role'
      },
      default: 'USER',
      index: true
    },
      status: {
        type: String,
        enum: {
          values: ['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'REJECTED'],
          message: '{VALUE} is not a valid user status'
        },
        default: 'ACTIVE',
        index: true
      },
      phone: {
        type: String,
        trim: true,
        default: ''
      },
      employeeId: {
        type: String,
        trim: true,
        default: ''
      },
      department: {
        type: String,
        trim: true,
        default: ''
      },
      jobRole: {
        type: String,
        trim: true,
        default: ''
      }
    },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
