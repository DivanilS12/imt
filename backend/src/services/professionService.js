import { db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';
import { AppError } from '../middlewares/errorMiddleware.js';

const professionCollection = () => db.collection(collections.professions);

export const listProfessions = async () => {
  const snapshot = await professionCollection().orderBy('nome').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProfessionById = async (id) => {
  const doc = await professionCollection().doc(id).get();
  if (!doc.exists) throw new AppError('Profissao nao encontrada', 404);
  return { id: doc.id, ...doc.data() };
};

export const createProfession = async (payload) => {
  const doc = await professionCollection().add({
    ...payload,
    nomeLower: payload.nome.toLowerCase(),
    areaLower: payload.area.toLowerCase(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return getProfessionById(doc.id);
};

export const updateProfession = async (id, payload) => {
  await getProfessionById(id);
  await professionCollection().doc(id).update({
    ...payload,
    nomeLower: payload.nome.toLowerCase(),
    areaLower: payload.area.toLowerCase(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return getProfessionById(id);
};

export const deleteProfession = async (id) => {
  await getProfessionById(id);
  await professionCollection().doc(id).delete();
};

export const searchProfessions = async (term) => {
  const query = term.toLowerCase();
  const snapshot = await professionCollection().get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((item) => {
      const text = [
        item.nome,
        item.descricao,
        item.area,
        item.mercado,
        ...(item.habilidades || []),
        ...(item.cursosRecomendados || [])
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(query);
    });
};

export const filterProfessions = async ({ salarioMin, salarioMax, area, empregabilidadeMin }) => {
  const snapshot = await professionCollection().get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((item) => {
      if (salarioMin !== undefined && Number(item.salarioMedio) < Number(salarioMin)) return false;
      if (salarioMax !== undefined && Number(item.salarioMedio) > Number(salarioMax)) return false;
      if (area && item.area?.toLowerCase() !== area.toLowerCase()) return false;
      if (
        empregabilidadeMin !== undefined &&
        Number(item.graficoEmpregabilidade) < Number(empregabilidadeMin)
      ) return false;
      return true;
    });
};
