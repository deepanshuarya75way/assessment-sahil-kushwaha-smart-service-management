const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { classifyTicket } = require('../services/aiService');

const testPhase3 = async () => {
  console.log('[Phase 3 Test] Connecting to MongoDB...');
  await connectDB();

  try {
    console.log('[Phase 3 Test 1] Testing AI Classification Engine with Electrical Input...');
    const result1 = await classifyTicket(
      'My electricity meter is showing abnormal readings and the power goes off frequently',
      'Frequent power outage in building 2 office 104'
    );
    console.log(` -> AI Result 1: Category=${result1.category}, Priority=${result1.priority}, Confidence=${result1.confidence}`);
    if (result1.category !== 'Electrical' || result1.priority !== 'URGENT') {
      throw new Error('Electrical AI Classification Mismatch');
    }

    console.log('[Phase 3 Test 2] Testing AI Classification Engine with Database Input...');
    const result2 = await classifyTicket(
      'Database Server Connection Timeout',
      'The SQL cluster is failing to respond on port 5432 during checkout.'
    );
    console.log(` -> AI Result 2: Category=${result2.category}, Priority=${result2.priority}, Confidence=${result2.confidence}`);
    if (result2.category !== 'Technical') {
      throw new Error('Technical AI Classification Mismatch');
    }

    console.log('[Phase 3 Test 3] Testing AI Fallback with Empty Input...');
    const result3 = await classifyTicket('', '');
    console.log(` -> AI Result 3 (Fallback): Category=${result3.category}, Priority=${result3.priority}`);
    if (result3.category !== 'General') {
      throw new Error('AI Fallback Mismatch');
    }

    console.log('\n===================================================================');
    console.log('✅ ALL PHASE 3 AI CLASSIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('===================================================================\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 3 AI Test Failed:', error);
    process.exit(1);
  }
};

testPhase3();
