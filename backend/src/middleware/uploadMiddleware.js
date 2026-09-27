const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Target directory for private staff verification ID cards (NOT exposed via express.static)
const uploadDir = path.join(__dirname, '../../uploads/verifications');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage with cryptographically generated random filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `idcard_${Date.now()}_${randomBytes}${safeExt}`);
  }
});

// File filter: Only images (JPEG, PNG, WebP) and PDF documents allowed
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, PNG, WEBP, and PDF documents are allowed.'), false);
  }
};

// 5 MB maximum file size
const uploadStaffIdCard = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

module.exports = {
  uploadStaffIdCard,
  uploadDir
};
