const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Check if file is an image
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB limit
  }
});

// Middleware for processing uploaded image
const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Get image dimensions
    const metadata = await sharp(req.file.path).metadata();
    
    // Create a thumbnail (300px wide)
    const thumbnailFilename = path.join(thumbnailDir, req.file.filename);
    await sharp(req.file.path)
      .resize({ width: 300 })
      .jpeg({ quality: 80 })
      .toFile(thumbnailFilename);

    // Optimize the original image if it's larger than 1920px
    if (metadata.width > 1920) {
      const tempPath = req.file.path + '.temp';
      await sharp(req.file.path)
        .resize({ width: 1920 })
        .jpeg({ quality: 85 })
        .toFile(tempPath);
        
      fs.unlinkSync(req.file.path);
      fs.renameSync(tempPath, req.file.path);
    }

    // Add file information to request
    req.file.thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;
    req.file.imagePath = `/uploads/images/${req.file.filename}`;
    req.file.optimizedSize = fs.statSync(req.file.path).size;

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 3MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  next(err);
};

module.exports = {
  uploadSingleImage: upload.single('image'),
  processImage,
  handleMulterError
};