import { asyncHandler } from '../middlewares/errorMiddleware.js';
import * as professionService from '../services/professionService.js';

export const list = asyncHandler(async (_req, res) => {
  res.json({ professions: await professionService.listProfessions() });
});

export const getById = asyncHandler(async (req, res) => {
  res.json({ profession: await professionService.getProfessionById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ profession: await professionService.createProfession(req.body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ profession: await professionService.updateProfession(req.params.id, req.body) });
});

export const remove = asyncHandler(async (req, res) => {
  await professionService.deleteProfession(req.params.id);
  res.status(204).send();
});

export const search = asyncHandler(async (req, res) => {
  res.json({ professions: await professionService.searchProfessions(req.query.q) });
});

export const filter = asyncHandler(async (req, res) => {
  res.json({ professions: await professionService.filterProfessions(req.query) });
});
