export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFound = (req, _res, next) => {
  next(new AppError(`Rota nao encontrada: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Erro interno do servidor'
  };

  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;

  res.status(statusCode).json(payload);
};
