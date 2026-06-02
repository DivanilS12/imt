import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as curriculoController from '../controllers/curriculoController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { idParam } from '../validators/index.js';

const uploadDir = process.env.UPLOAD_DIR || 'uploads/curriculos';
fs.mkdirSync(uploadDir, { recursive: true });

export const pdfUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new AppError('Apenas arquivos PDF sao permitidos', 400));
      return;
    }
    cb(null, true);
  }
});

const router = Router();

router.use(protect);
router.post('/upload', pdfUpload.single('curriculo'), curriculoController.upload);
router.get('/:id', idParam, curriculoController.getById);
router.delete('/:id', idParam, curriculoController.remove);

export default router;
