import { Router } from 'express';
import * as forumController from '../controllers/forumController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { commentRules, idParam, topicRules } from '../validators/index.js';

const router = Router();

router.get('/topics', forumController.listTopics);
router.get('/topics/:id', idParam, forumController.getTopic);
router.post('/topics', protect, topicRules, forumController.createTopic);
router.put('/topics/:id', protect, topicRules, forumController.updateTopic);
router.delete('/topics/:id', protect, idParam, forumController.deleteTopic);
router.get('/topics/:id/comments', idParam, forumController.listComments);
router.post('/topics/:id/comments', protect, commentRules, forumController.createComment);
router.delete('/comments/:id', protect, idParam, forumController.deleteComment);

export default router;
