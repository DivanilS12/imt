import { Router } from 'express';
import * as iaController from '../controllers/iaController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { chatRules } from '../validators/index.js';
import { pdfUpload } from './curriculoRoutes.js';

const router = Router();

router.use(protect);
router.post('/chat', chatRules, iaController.chat);
router.get('/history', iaController.history);
router.delete('/history', iaController.clearHistory);

export const analisadorRouter = Router();
analisadorRouter.use(protect);
analisadorRouter.post('/', pdfUpload.single('curriculo'), iaController.analisador);

export default router;
