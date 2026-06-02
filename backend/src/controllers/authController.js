import { asyncHandler } from '../middlewares/errorMiddleware.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: 'Logout realizado. Remova o token no cliente.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const update = asyncHandler(async (req, res) => {
  const user = await authService.updateAuthUser(req.user.id, req.body);
  res.json({ user });
});

export const remove = asyncHandler(async (req, res) => {
  await authService.deleteAuthUser(req.user.id);
  res.status(204).send();
});
