import fs from 'fs/promises';
import path from 'path';
import { db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';
import { AppError } from '../middlewares/errorMiddleware.js';

export const saveCurriculo = async (userId, file) => {
  if (!file) throw new AppError('Arquivo PDF e obrigatorio', 400);

  const doc = await db.collection(collections.curriculos).add({
    nomeArquivo: file.originalname,
    nomeSalvo: file.filename,
    caminho: file.path,
    mimetype: file.mimetype,
    tamanho: file.size,
    usuario: userId,
    data: FieldValue.serverTimestamp()
  });

  const saved = await doc.get();
  return { id: saved.id, ...saved.data() };
};

export const getCurriculo = async (id, userId) => {
  const doc = await db.collection(collections.curriculos).doc(id).get();
  if (!doc.exists) throw new AppError('Curriculo nao encontrado', 404);

  const curriculo = { id: doc.id, ...doc.data() };
  if (curriculo.usuario !== userId) throw new AppError('Sem permissao para acessar este curriculo', 403);
  return curriculo;
};

export const deleteCurriculo = async (id, userId) => {
  const curriculo = await getCurriculo(id, userId);
  await db.collection(collections.curriculos).doc(id).delete();

  const resolved = path.resolve(curriculo.caminho);
  await fs.rm(resolved, { force: true });
};
