const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const TicketHistory = require('../models/TicketHistory');

const testPhase1 = async () => {
  console.log('[Phase 1 Test] Connecting to MongoDB...');
  await connectDB();

  try {
    console.log('[Phase 1 Test] Testing User status field...');
    const user = await User.create({
      name: 'Phase1 User',
      email: `p1user_${Date.now()}@example.com`,
      password: 'Password123!',
      role: 'USER',
      status: 'ACTIVE'
    });
    console.log(` -> User created: ID=${user._id}, Status=${user.status}`);

    console.log('[Phase 1 Test] Testing Ticket expanded schema & 5-state status enum...');
    const ticket = await Ticket.create({
      ticketNumber: `P1-TICK-${Date.now()}`,
      title: 'Phase 1 Schema Validation Test',
      description: 'Testing location, department, resolutionNotes, and aiSuggestion fields',
      category: 'IT Support',
      department: 'IT Support',
      location: 'Building B, 3rd Floor, Office 302',
      status: 'PENDING',
      createdBy: user._id,
      aiSuggestion: {
        category: 'IT Support',
        priority: 'HIGH',
        department: 'IT Support',
        confidence: 0.95
      }
    });
    console.log(` -> Ticket created: Number=${ticket.ticketNumber}, Status=${ticket.status}, Location="${ticket.location}", Dept="${ticket.department}"`);
    console.log(` -> AI Suggestion Subdocument: Category=${ticket.aiSuggestion.category}, Confidence=${ticket.aiSuggestion.confidence}`);

    console.log('[Phase 1 Test] Testing TicketHistory creation...');
    const history = await TicketHistory.create({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: 'PENDING',
      newValue: 'ASSIGNED',
      changedBy: user._id
    });
    console.log(` -> TicketHistory created: ID=${history._id}, Action=${history.action}, Transition="${history.previousValue}" -> "${history.newValue}"`);

    // Cleanup test records
    await TicketHistory.deleteMany({ _id: history._id });
    await Ticket.deleteMany({ _id: ticket._id });
    await User.deleteMany({ _id: user._id });

    console.log('\n===================================================================');
    console.log('✅ ALL PHASE 1 SCHEMA EXPANSION & MODEL TESTS PASSED SUCCESSFULLY!');
    console.log('===================================================================\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 1 Model Test Failed:', error);
    process.exit(1);
  }
};

testPhase1();
