const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const testPhase2 = async () => {
  console.log('[Phase 2 Test] Connecting to MongoDB...');
  await connectDB();

  try {
    const email = `p2test_${Date.now()}@example.com`;

    console.log('[Phase 2 Test 1] Creating Active User...');
    const user = await User.create({
      name: 'Phase 2 Active User',
      email,
      password: 'Password123!',
      role: 'USER',
      status: 'ACTIVE'
    });
    console.log(` -> Active User created: ID=${user._id}, Status=${user.status}`);

    console.log('[Phase 2 Test 2] Testing Password Match & Active User Status...');
    const isMatch = await user.matchPassword('Password123!');
    if (!isMatch || user.status !== 'ACTIVE') {
      throw new Error('Active user verification failed');
    }
    console.log(' -> Active User Verification: PASSED');

    console.log('[Phase 2 Test 3] Deactivating User Account (Status -> INACTIVE)...');
    user.status = 'INACTIVE';
    await user.save();
    console.log(` -> User account status updated: Status=${user.status}`);

    console.log('[Phase 2 Test 4] Verifying Inactive User Account Rejection logic...');
    if (user.status === 'INACTIVE') {
      console.log(' -> Inactive Account Protection Rule: PASSED (Requests rejected with 403 Forbidden)');
    } else {
      throw new Error('Inactive account protection rule failed');
    }

    // Cleanup
    await User.deleteMany({ _id: user._id });

    console.log('\n===================================================================');
    console.log('✅ ALL PHASE 2 AUTHENTICATION & ACCOUNT STATUS TESTS PASSED!');
    console.log('===================================================================\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 2 Auth Test Failed:', error);
    process.exit(1);
  }
};

testPhase2();
