import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { loginRules, registerRules, updateAuthRules } from '../validators/index.js';

const router = Router();

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.me);
router.patch('/update', protect, updateAuthRules, authController.update);
router.delete('/delete', protect, authController.remove);

export default router;
