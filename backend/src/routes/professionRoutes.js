import { Router } from 'express';
import * as professionController from '../controllers/professionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { filterRules, idParam, professionRules, searchRules } from '../validators/index.js';

const router = Router();

router.get('/', professionController.list);
router.get('/search', searchRules, professionController.search);
router.get('/filter', filterRules, professionController.filter);
router.get('/:id', idParam, professionController.getById);
router.post('/', protect, professionRules, professionController.create);
router.put('/:id', protect, professionRules, professionController.update);
router.delete('/:id', protect, idParam, professionController.remove);

export default router;
