const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

/**
 * Protect routes: Verify JWT bearer token and attach req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized: No authentication token provided', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_smart_service_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 'Not authorized: User account no longer exists', 401);
    }

    if (user.status === 'INACTIVE') {
      return sendError(res, 'Your account has been deactivated. Please contact an administrator.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized: Invalid or expired token', 401);
  }
});

/**
 * Grant access to specific user roles
 * Example: authorize('ADMIN', 'STAFF')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user?.role || 'Guest'}' is not authorized to access this resource`,
        403
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
