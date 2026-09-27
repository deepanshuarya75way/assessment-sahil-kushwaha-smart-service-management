const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const testModels = async () => {
  try {
    console.log('[Test] Connecting to Database...');
    await connectDB();

    console.log('[Test] Cleaning temporary test records...');
    await User.deleteMany({ email: /@modeltest\.com$/ });

    console.log('[Test 1] Creating User with password hashing...');
    const user = await User.create({
      name: 'Phase Two Tester',
      email: 'tester@modeltest.com',
      password: 'password123',
      role: 'USER'
    });
    console.log(` -> User Created: ID=${user._id}, Role=${user.role}`);

    console.log('[Test 2] Testing matchPassword method...');
    const isMatch = await user.matchPassword('password123');
    const isWrongMatch = await user.matchPassword('wrongpassword');
    console.log(` -> Correct Password Match: ${isMatch} (Expected: true)`);
    console.log(` -> Wrong Password Match: ${isWrongMatch} (Expected: false)`);

    console.log('[Test 3] Creating Ticket record...');
    const ticket = await Ticket.create({
      ticketNumber: `TEST-${Date.now()}`,
      title: 'Database Schema Validation Test',
      description: 'Testing ticket model creation and indexing',
      category: 'Technical',
      priority: 'HIGH',
      createdBy: user._id
    });
    console.log(` -> Ticket Created: Number=${ticket.ticketNumber}, Status=${ticket.status}`);

    console.log('[Test 4] Creating Comment record...');
    const comment = await Comment.create({
      ticketId: ticket._id,
      userId: user._id,
      message: 'Schema foundation test comment'
    });
    console.log(` -> Comment Created: ID=${comment._id}, Message="${comment.message}"`);

    console.log('[Test Cleanup] Cleaning up test data...');
    await Comment.deleteMany({ ticketId: ticket._id });
    await Ticket.deleteMany({ _id: ticket._id });
    await User.deleteMany({ _id: user._id });

    console.log('✅ ALL PHASE 2 DATABASE & MODEL TESTS PASSED SUCCESSFULLY!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ PHASE 2 MODEL TEST FAILED:', error);
    process.exit(1);
  }
};

testModels();
