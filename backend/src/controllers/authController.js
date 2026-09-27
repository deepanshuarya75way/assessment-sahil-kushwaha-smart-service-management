const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const StaffVerification = require('../models/StaffVerification');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Register a new customer/user account
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, department, role } = req.body;

  // Strict Security Rule: Never allow public registration to specify role=ADMIN
  if (role === 'ADMIN') {
    return sendError(res, 'Administrator registration is prohibited. Admin accounts are managed by backend configuration.', 403);
  }

  if (!name || !email || !password) {
    return sendError(res, 'Please provide full name, email address, and password', 400);
  }

  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long', 400);
  }

  // Check if email is already registered
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return sendError(res, 'An account with this email address already exists', 400);
  }

  // Public user registration is ALWAYS forced to USER role with ACTIVE status
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: (phone || '').trim(),
    department: (department || '').trim(),
    role: 'USER',
    status: 'ACTIVE'
  });

  const token = generateToken(user);

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        createdAt: user.createdAt
      }
    },
    'User account created successfully',
    201
  );
});

/**
 * @desc    Submit a Staff Verification request with credentials and ID card
 * @route   POST /api/auth/register-staff
 * @access  Public (Requires verification and admin approval)
 */
const registerStaffVerification = asyncHandler(async (req, res) => {
  const { name, email, password, phone, employeeId, department, jobRole, role } = req.body;

  // Strict Security Rule: Never allow role=ADMIN
  if (role === 'ADMIN') {
    return sendError(res, 'Administrator registration is prohibited.', 403);
  }

  if (!name || !email || !password || !phone || !employeeId || !department || !jobRole) {
    return sendError(res, 'Please provide all required fields: name, company email, password, phone, employee ID, department, and job title.', 400);
  }

  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long', 400);
  }

  if (!req.file) {
    return sendError(res, 'Please upload a clear copy of your Staff ID Card or Employee Credential document (JPG, PNG, or PDF)', 400);
  }

  // Duplicate email check
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 'An account with this organization email is already registered', 400);
  }

  // Duplicate employee ID check
  const existingEmployee = await StaffVerification.findOne({ employeeId: employeeId.trim() });
  if (existingEmployee) {
    return sendError(res, `Employee ID '${employeeId.trim()}' is already registered with an existing verification request`, 400);
  }

  // Create User with role: 'USER' (does NOT become 'STAFF' until approved) and status: 'PENDING_VERIFICATION'
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone.trim(),
    department: department.trim(),
    employeeId: employeeId.trim(),
    jobRole: jobRole.trim(),
    role: 'USER',
    status: 'PENDING_VERIFICATION'
  });

  // Create Staff Verification record
  const verification = await StaffVerification.create({
    user: user._id,
    fullName: name.trim(),
    organizationEmail: email.toLowerCase().trim(),
    phone: phone.trim(),
    employeeId: employeeId.trim(),
    department: department.trim(),
    jobRole: jobRole.trim(),
    idCardPath: req.file.path,
    idCardOriginalName: req.file.originalname,
    idCardMimeType: req.file.mimetype,
    idCardSize: req.file.size,
    status: 'PENDING'
  });

  sendSuccess(
    res,
    {
      verificationId: verification._id,
      name: user.name,
      email: user.email,
      employeeId: verification.employeeId,
      department: verification.department,
      status: 'PENDING_VERIFICATION'
    },
    'Staff verification request submitted successfully. Your credentials are under review by an administrator. You will be able to log in once your application is approved.',
    201
  );
});

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide email and password', 400);
  }

  // Find user and explicitly select password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  // Account status validation
  if (user.status === 'PENDING_VERIFICATION') {
    return sendError(
      res,
      'Your staff verification request is pending administrator review. You will be able to log in once an administrator approves your credentials.',
      403
    );
  }

  if (user.status === 'REJECTED') {
    return sendError(
      res,
      'Your staff verification application was not approved. Please contact system support for assistance.',
      403
    );
  }

  if (user.status === 'INACTIVE') {
    return sendError(res, 'Your account has been deactivated. Please contact an administrator.', 403);
  }

  const token = generateToken(user);

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        createdAt: user.createdAt
      }
    },
    'Login successful'
  );
});

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  sendSuccess(
    res,
    {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      department: req.user.department,
      createdAt: req.user.createdAt
    },
    'User profile retrieved successfully'
  );
});

module.exports = {
  registerUser,
  registerStaffVerification,
  loginUser,
  getMe
};
