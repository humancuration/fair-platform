import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// File Filter for Images
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// File Filter for Videos
const videoFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /mp4|mov|avi|wmv|flv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only videos are allowed'));
  }
};

// Initialize Multer Uploads
const uploadImage = multer({ storage, fileFilter: imageFileFilter });
const uploadVideo = multer({ storage, fileFilter: videoFileFilter });

// Upload Image Handler
export const uploadImageHandler = [
  uploadImage.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // In a real-world scenario, you'd upload the file to cloud storage (e.g., AWS S3) and return the URL
    // For simplicity, we'll return a local URL
    const fileUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  },
];

// Upload Video Handler
export const uploadVideoHandler = [
  uploadVideo.single('video'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded.' });
    }

    // Similarly, upload to cloud storage in production
    const fileUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  },
];
