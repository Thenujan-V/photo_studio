const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1e6);

        if (ext === '.pdf' || file.mimetype === 'application/pdf') {
            cb(null, `INC_${timestamp}_${randomSuffix}${ext}`);
        } else {
            cb(null, `${timestamp}_${randomSuffix}${ext}`);
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 * 8 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only JPEG, PNG, and PDF files are allowed!!');
        }
    }
});

module.exports = upload;