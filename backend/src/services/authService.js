import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { auth, db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { getUserByEmail, sanitizeUser } from './userService.js';

const signToken = (uid, email) =>
  jwt.sign({ uid, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const register = async ({ nome, email, senha }) => {
  const existing = await getUserByEmail(email);
  if (existing) throw new AppError('Email ja cadastrado', 409);

  const passwordHash = await bcrypt.hash(senha, 12);
  const firebaseUser = await auth.createUser({
    displayName: nome,
    email,
    password: senha
  });

  const userData = {
    id: firebaseUser.uid,
    nome,
    email,
    foto: null,
    passwordHash,
    profissoesFavoritas: [],
    historicoIA: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };

  await db.collection(collections.users).doc(firebaseUser.uid).set(userData);

  return {
    token: signToken(firebaseUser.uid, email),
    user: sanitizeUser(userData)
  };
};

export const login = async ({ email, senha }) => {
  const user = await getUserByEmail(email);
  if (!user) throw new AppError('Credenciais invalidas', 401);

  const validPassword = await bcrypt.compare(senha, user.passwordHash || '');
  if (!validPassword) throw new AppError('Credenciais invalidas', 401);

  return {
    token: signToken(user.id, user.email),
    user: sanitizeUser(user)
  };
};

export const updateAuthUser = async (userId, payload) => {
  const updateData = {
    updatedAt: FieldValue.serverTimestamp()
  };

  if (payload.nome) updateData.nome = payload.nome;
  if (payload.foto !== undefined) updateData.foto = payload.foto;
  if (payload.senha) updateData.passwordHash = await bcrypt.hash(payload.senha, 12);

  const firebaseUpdate = {};
  if (payload.nome) firebaseUpdate.displayName = payload.nome;
  if (payload.foto !== undefined) firebaseUpdate.photoURL = payload.foto;
  if (payload.senha) firebaseUpdate.password = payload.senha;

  await db.collection(collections.users).doc(userId).update(updateData);
  if (Object.keys(firebaseUpdate).length) await auth.updateUser(userId, firebaseUpdate);

  const updated = await db.collection(collections.users).doc(userId).get();
  return sanitizeUser({ id: updated.id, ...updated.data() });
};

export const deleteAuthUser = async (userId) => {
  await db.collection(collections.users).doc(userId).delete();
  await auth.deleteUser(userId);
};
