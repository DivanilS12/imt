import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase.js';
import { AppError, asyncHandler } from './errorMiddleware.js';
import { getUserById } from '../services/userService.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    throw new AppError('Token de autenticacao ausente', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    try {
      const firebaseToken = await auth.verifyIdToken(token);
      decoded = { uid: firebaseToken.uid, email: firebaseToken.email };
    } catch {
      throw new AppError('Token invalido ou expirado', 401);
    }
  }

  const user = await getUserById(decoded.uid);
  if (!user) throw new AppError('Usuario nao encontrado', 401);

  req.user = user;
  next();
});
