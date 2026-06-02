import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import userRoutes, { favoriteRouter } from './routes/userRoutes.js';
import professionRoutes from './routes/professionRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import curriculoRoutes from './routes/curriculoRoutes.js';
import iaRoutes, { analisadorRouter } from './routes/iaRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { sanitizeInput } from './middlewares/sanitizeMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'imt-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professions', professionRoutes);
app.use('/api/favorites', favoriteRouter);
app.use('/api/forum', forumRoutes);
app.use('/api/curriculo', curriculoRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/analisador', analisadorRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`IMT API running on port ${port}`);
});
