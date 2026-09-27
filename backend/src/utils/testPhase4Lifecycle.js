const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const TicketHistory = require('../models/TicketHistory');
const { isValidTransition, logTicketHistory } = require('./lifecycleHelper');
const generateTicketNumber = require('./ticketNumberGenerator');

const testPhase4Lifecycle = async () => {
  console.log('[Phase 4 Test] Connecting to MongoDB...');
  await connectDB();

  try {
    // 1. Test Transition Rules Engine
    console.log('[Phase 4 Test 1] Testing Status Transition Logic Rules...');
    if (!isValidTransition('PENDING', 'ASSIGNED')) throw new Error('PENDING -> ASSIGNED should be valid');
    if (!isValidTransition('ASSIGNED', 'IN_PROGRESS')) throw new Error('ASSIGNED -> IN_PROGRESS should be valid');
    if (!isValidTransition('IN_PROGRESS', 'RESOLVED')) throw new Error('IN_PROGRESS -> RESOLVED should be valid');
    if (!isValidTransition('RESOLVED', 'CLOSED')) throw new Error('RESOLVED -> CLOSED should be valid');

    // Test Invalid Transitions
    if (isValidTransition('PENDING', 'RESOLVED')) throw new Error('PENDING -> RESOLVED jump should be invalid');
    if (isValidTransition('RESOLVED', 'ASSIGNED')) throw new Error('RESOLVED -> ASSIGNED jump should be invalid');
    if (isValidTransition('CLOSED', 'IN_PROGRESS')) throw new Error('CLOSED -> IN_PROGRESS jump should be invalid');

    console.log(' -> Status transition rules validation passed.');

    // 2. Setup Test User and Staff
    let testUser = await User.findOne({ email: 'phase4user@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Phase 4 Test User',
        email: 'phase4user@example.com',
        password: 'password123',
        role: 'USER',
        department: 'Engineering'
      });
    }

    let testStaff = await User.findOne({ email: 'phase4staff@example.com' });
    if (!testStaff) {
      testStaff = await User.create({
        name: 'Phase 4 Test Staff',
        email: 'phase4staff@example.com',
        password: 'password123',
        role: 'STAFF',
        department: 'Facilities'
      });
    }

    // 3. Create Ticket and log TICKET_CREATED
    console.log('[Phase 4 Test 2] Creating Ticket & verifying TICKET_CREATED Audit Log...');
    const ticketNumber = await generateTicketNumber();
    const ticket = await Ticket.create({
      ticketNumber,
      title: 'Phase 4 Lifecycle Verification Ticket',
      description: 'Testing 5-state lifecycle and audit logging',
      category: 'Maintenance',
      priority: 'HIGH',
      status: 'PENDING',
      createdBy: testUser._id
    });

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'TICKET_CREATED',
      previousValue: '',
      newValue: 'PENDING',
      changedBy: testUser._id
    });

    // 4. Staff Assignment
    console.log('[Phase 4 Test 3] Assigning Staff and transitioning to ASSIGNED...');
    ticket.assignedTo = testStaff._id;
    const prevStatus1 = ticket.status;
    ticket.status = 'ASSIGNED';
    await ticket.save();

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STAFF_ASSIGNED',
      previousValue: 'Unassigned',
      newValue: testStaff.name,
      changedBy: testStaff._id
    });

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus1,
      newValue: 'ASSIGNED',
      changedBy: testStaff._id
    });

    // 5. Transition to IN_PROGRESS
    console.log('[Phase 4 Test 4] Transitioning status to IN_PROGRESS...');
    const prevStatus2 = ticket.status;
    ticket.status = 'IN_PROGRESS';
    await ticket.save();

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus2,
      newValue: 'IN_PROGRESS',
      changedBy: testStaff._id
    });

    // 6. Transition to RESOLVED with Notes
    console.log('[Phase 4 Test 5] Transitioning status to RESOLVED with Resolution Notes...');
    const prevStatus3 = ticket.status;
    ticket.status = 'RESOLVED';
    ticket.resolutionNotes = 'Replaced faulty power cord and restored full operation.';
    await ticket.save();

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus3,
      newValue: 'RESOLVED',
      changedBy: testStaff._id
    });

    // 7. User Confirms and transitions to CLOSED
    console.log('[Phase 4 Test 6] User confirming resolution and transitioning status to CLOSED...');
    const prevStatus4 = ticket.status;
    ticket.status = 'CLOSED';
    await ticket.save();

    await logTicketHistory({
      ticketId: ticket._id,
      action: 'STATUS_CHANGED',
      previousValue: prevStatus4,
      newValue: 'CLOSED',
      changedBy: testUser._id
    });

    // 8. Query and Verify Audit History Trail
    console.log('[Phase 4 Test 7] Fetching Ticket History Records from MongoDB...');
    const historyRecords = await TicketHistory.find({ ticketId: ticket._id }).sort({ createdAt: 1 });
    console.log(` -> Found ${historyRecords.length} history log entries for ticket ${ticket.ticketNumber}:`);

    historyRecords.forEach((rec, idx) => {
      console.log(`    ${idx + 1}. Action: ${rec.action} | Prev: "${rec.previousValue}" | New: "${rec.newValue}"`);
    });

    if (historyRecords.length < 5) {
      throw new Error(`Expected at least 5 history records, found ${historyRecords.length}`);
    }

    // Cleanup test records
    await TicketHistory.deleteMany({ ticketId: ticket._id });
    await Ticket.deleteOne({ _id: ticket._id });
    await User.deleteMany({ email: { $in: ['phase4user@example.com', 'phase4staff@example.com'] } });

    console.log('\n===================================================================');
    console.log('✅ ALL PHASE 4 LIFECYCLE & AUDIT LOG TESTS PASSED SUCCESSFULLY!');
    console.log('===================================================================\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 4 Test Failed:', error);
    process.exit(1);
  }
};

testPhase4Lifecycle();
