import { asyncHandler } from '../middlewares/errorMiddleware.js';
import * as forumService from '../services/forumService.js';

export const listTopics = asyncHandler(async (_req, res) => {
  res.json({ topics: await forumService.listTopics() });
});

export const getTopic = asyncHandler(async (req, res) => {
  res.json({ topic: await forumService.getTopicById(req.params.id) });
});

export const createTopic = asyncHandler(async (req, res) => {
  res.status(201).json({ topic: await forumService.createTopic(req.user, req.body) });
});

export const updateTopic = asyncHandler(async (req, res) => {
  res.json({ topic: await forumService.updateTopic(req.params.id, req.user.id, req.body) });
});

export const deleteTopic = asyncHandler(async (req, res) => {
  await forumService.deleteTopic(req.params.id, req.user.id);
  res.status(204).send();
});

export const listComments = asyncHandler(async (req, res) => {
  res.json({ comments: await forumService.listComments(req.params.id) });
});

export const createComment = asyncHandler(async (req, res) => {
  res.status(201).json({
    comment: await forumService.createComment(req.params.id, req.user, req.body)
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await forumService.deleteComment(req.params.id, req.user.id);
  res.status(204).send();
});
