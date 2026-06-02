import { asyncHandler } from '../middlewares/errorMiddleware.js';
import * as curriculoService from '../services/curriculoService.js';

export const upload = asyncHandler(async (req, res) => {
  res.status(201).json({ curriculo: await curriculoService.saveCurriculo(req.user.id, req.file) });
});

export const getById = asyncHandler(async (req, res) => {
  res.json({ curriculo: await curriculoService.getCurriculo(req.params.id, req.user.id) });
});

export const remove = asyncHandler(async (req, res) => {
  await curriculoService.deleteCurriculo(req.params.id, req.user.id);
  res.status(204).send();
});
