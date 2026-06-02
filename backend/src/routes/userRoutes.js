import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { profileRules } from '../validators/index.js';

const router = Router();

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', profileRules, userController.updateProfile);
router.get('/favorites', userController.getFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:id', userController.removeFavorite);

export default router;

export const favoriteRouter = Router();
favoriteRouter.use(protect);
favoriteRouter.get('/', userController.getFavorites);
favoriteRouter.post('/:professionId', userController.addFavorite);
favoriteRouter.delete('/:professionId', userController.removeFavorite);
