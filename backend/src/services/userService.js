import { db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';
import { AppError } from '../middlewares/errorMiddleware.js';

export const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const getUserById = async (id) => {
  const doc = await db.collection(collections.users).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const getUserByEmail = async (email) => {
  const snapshot = await db
    .collection(collections.users)
    .where('email', '==', email)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const getProfile = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new AppError('Usuario nao encontrado', 404);
  return sanitizeUser(user);
};

export const updateProfile = async (userId, payload) => {
  const data = {
    updatedAt: FieldValue.serverTimestamp()
  };

  if (payload.nome !== undefined) data.nome = payload.nome;
  if (payload.foto !== undefined) data.foto = payload.foto;

  await db.collection(collections.users).doc(userId).update(data);
  return getProfile(userId);
};

export const addFavorite = async (userId, professionId) => {
  const professionRef = db.collection(collections.professions).doc(professionId);
  const professionDoc = await professionRef.get();
  if (!professionDoc.exists) throw new AppError('Profissao nao encontrada', 404);

  const favoriteId = `${userId}_${professionId}`;
  await db.collection(collections.favorites).doc(favoriteId).set({
    id: favoriteId,
    userId,
    professionId,
    createdAt: FieldValue.serverTimestamp()
  });

  await db.collection(collections.users).doc(userId).update({
    profissoesFavoritas: FieldValue.arrayUnion(professionId),
    updatedAt: FieldValue.serverTimestamp()
  });

  return getFavorites(userId);
};

export const removeFavorite = async (userId, professionId) => {
  await db.collection(collections.favorites).doc(`${userId}_${professionId}`).delete();
  await db.collection(collections.users).doc(userId).update({
    profissoesFavoritas: FieldValue.arrayRemove(professionId),
    updatedAt: FieldValue.serverTimestamp()
  });
};

export const getFavorites = async (userId) => {
  const snapshot = await db
    .collection(collections.favorites)
    .where('userId', '==', userId)
    .get();

  const professionIds = snapshot.docs.map((doc) => doc.data().professionId);
  if (!professionIds.length) return [];

  const docs = await Promise.all(
    professionIds.map((id) => db.collection(collections.professions).doc(id).get())
  );

  return docs
    .filter((doc) => doc.exists)
    .map((doc) => ({ id: doc.id, ...doc.data() }));
};
