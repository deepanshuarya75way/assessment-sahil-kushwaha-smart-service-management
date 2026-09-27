const jwt = require('jsonwebtoken');

/**
 * Generate JSON Web Token (JWT) signed with user ID and role
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET || 'super_secret_jwt_key_smart_service_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    }
  );
};

module.exports = generateToken;
