const express = require('express');
const router = express.Router();
const { registerUser, registerStaffVerification, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadStaffIdCard } = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/register-staff', uploadStaffIdCard.single('idCard'), registerStaffVerification);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
