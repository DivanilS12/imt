import { asyncHandler } from '../middlewares/errorMiddleware.js';
import * as iaService from '../services/iaService.js';

export const chat = asyncHandler(async (req, res) => {
  const result = await iaService.chat(req.user.id, req.body.message);
  res.json(result);
});

export const history = asyncHandler(async (req, res) => {
  res.json({ history: await iaService.getHistory(req.user.id) });
});

export const clearHistory = asyncHandler(async (req, res) => {
  await iaService.deleteHistory(req.user.id);
  res.status(204).send();
});

export const analisador = asyncHandler(async (req, res) => {
  res.json(await iaService.analyzeCurriculo(req.user.id, req.file));
});
