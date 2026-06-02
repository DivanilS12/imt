import { AppError, asyncHandler } from '../middlewares/errorMiddleware.js';
import * as userService from '../services/userService.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: await userService.getProfile(req.user.id) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  res.json({ user: await userService.updateProfile(req.user.id, req.body) });
});

export const getFavorites = asyncHandler(async (req, res) => {
  res.json({ favorites: await userService.getFavorites(req.user.id) });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const professionId = req.params.professionId || req.body.professionId || req.body.id;
  if (!professionId) throw new AppError('ID da profissao e obrigatorio', 400);
  res.status(201).json({ favorites: await userService.addFavorite(req.user.id, professionId) });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const professionId = req.params.professionId || req.params.id;
  await userService.removeFavorite(req.user.id, professionId);
  res.status(204).send();
});
