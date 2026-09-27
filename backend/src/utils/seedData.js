const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedDemoAccounts = async () => {
  console.log('=============== SEEDING DEMO & ADMIN ACCOUNTS ===============');
  try {
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    const staffEmail = (process.env.DEMO_STAFF_EMAIL || 'staff@example.com').toLowerCase();
    const staffPassword = process.env.DEMO_STAFF_PASSWORD || 'StaffPassword123!';

    const userEmail = (process.env.DEMO_USER_EMAIL || 'user@example.com').toLowerCase();
    const userPassword = process.env.DEMO_USER_PASSWORD || 'UserPassword123!';

    // 1. Primary System Administrator (Single Admin Rule)
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        department: 'Operations & Management'
      });
      console.log(`[Seed] ✓ Primary Admin created: ${adminEmail}`);
    } else {
      admin.role = 'ADMIN';
      admin.status = 'ACTIVE';
      await admin.save();
      console.log(`[Seed] ✓ Primary Admin verified: ${adminEmail}`);
    }

    // 2. Demo Verified Staff Member (Service Resolver)
    let staff = await User.findOne({ email: staffEmail });
    if (!staff) {
      staff = await User.create({
        name: 'Alex Rivera (Staff)',
        email: staffEmail,
        password: staffPassword,
        role: 'STAFF',
        status: 'ACTIVE',
        employeeId: 'EMP-7701',
        department: 'Technical Support',
        jobRole: 'Senior Support Engineer'
      });
      console.log(`[Seed] ✓ Demo Staff created: ${staffEmail}`);
    } else {
      staff.role = 'STAFF';
      staff.status = 'ACTIVE';
      await staff.save();
      console.log(`[Seed] ✓ Demo Staff verified: ${staffEmail}`);
    }

    // 3. Demo User Member (Service Requester)
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: 'Jordan Smith (Customer)',
        email: userEmail,
        password: userPassword,
        role: 'USER',
        status: 'ACTIVE',
        department: 'Marketing Operations'
      });
      console.log(`[Seed] ✓ Demo User created: ${userEmail}`);
    } else {
      user.role = 'USER';
      user.status = 'ACTIVE';
      await user.save();
      console.log(`[Seed] ✓ Demo User verified: ${userEmail}`);
    }

    console.log('\nSeed accounts initialized successfully:');
    console.log(`- ADMIN: ${adminEmail} (Role: ADMIN, Status: ACTIVE)`);
    console.log(`- STAFF: ${staffEmail} (Role: STAFF, Status: ACTIVE)`);
    console.log(`- USER:  ${userEmail} (Role: USER, Status: ACTIVE)`);
    console.log('==============================================================');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seedDemoAccounts();
