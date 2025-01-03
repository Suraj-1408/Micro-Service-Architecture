//Helps in defining the endpoint or routing for locking , unlocking and update of row on file.
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/fileController');
const fileAccessController = require('../controllers/FileAccessController');
const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //const uploadDir = path.join(__dirname,'..', 'uploads');
    const uploadDir = path.join(process.cwd(), 'uploads'); // Relative to project root

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.oasis.opendocument.spreadsheet') {
      cb(null, true);
    } else {
      cb(new Error('Only .ods files are allowed!'), false);
    }
  },
});


//routes
router.post('/:filename/lock-row', fileController.lockRow);
router.post('/:filename/unlock-row', fileController.unlockRow);
router.post('/:filename/update-row', fileController.updateRow);


// Endpoint for uploading files
router.post('/upload',upload.single('file'), fileController.uploadFile);


// Error-handling middleware for multer and other errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});


//NOte: exports.uploadFile is defined in filecontroller.js  
router.get('/shared-files', fileController.getSharedFiles);
router.get('/admin-dashboard', fileController.getAdminDashboardData);
router.post('/admin/permit-access',fileController.getAccessPermit);
router.post('/api/user-files',fileController.getUserFiles);

router.post('/api/access',fileAccessController.grantAccessHandler);
router.get('/api/files/accessible/',fileAccessController.getAccessibleFilesHandler);
module.exports = router;