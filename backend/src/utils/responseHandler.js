/**
 * Standardized API Success Response Format
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standardized API Error Response Format
 */
const sendError = (res, message = 'Error', statusCode = 500, errorDetails = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetails && { errors: errorDetails }),
    ...(process.env.NODE_ENV !== 'production' && { stack: errorDetails?.stack })
  });
};

module.exports = {
  sendSuccess,
  sendError
};
