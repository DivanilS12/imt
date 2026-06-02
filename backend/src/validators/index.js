import { body, param, query, validationResult } from 'express-validator';
import { AppError } from '../middlewares/errorMiddleware.js';

export const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new AppError('Dados invalidos', 422, result.array());
    }
    next();
  }
];

export const idParam = validate([param('id').isString().trim().notEmpty()]);

export const registerRules = validate([
  body('nome').trim().isLength({ min: 2, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('senha').isLength({ min: 8 })
]);

export const loginRules = validate([
  body('email').isEmail().normalizeEmail(),
  body('senha').isString().notEmpty()
]);

export const updateAuthRules = validate([
  body('nome').optional().trim().isLength({ min: 2, max: 120 }),
  body('foto').optional({ nullable: true }).isURL(),
  body('senha').optional().isLength({ min: 8 })
]);

export const profileRules = validate([
  body('nome').optional().trim().isLength({ min: 2, max: 120 }),
  body('foto').optional({ nullable: true }).isString().trim()
]);

export const professionRules = validate([
  body('nome').trim().notEmpty(),
  body('descricao').trim().notEmpty(),
  body('salarioMedio').isFloat({ min: 0 }),
  body('percentualHomens').isFloat({ min: 0, max: 100 }),
  body('percentualMulheres').isFloat({ min: 0, max: 100 }),
  body('area').trim().notEmpty(),
  body('habilidades').isArray(),
  body('mercado').trim().notEmpty(),
  body('cursosRecomendados').isArray(),
  body('graficoEmpregabilidade').isFloat({ min: 0, max: 100 }),
  body('imagem').optional({ nullable: true }).isString()
]);

export const searchRules = validate([query('q').trim().isLength({ min: 1 })]);

export const filterRules = validate([
  query('salarioMin').optional().isFloat({ min: 0 }),
  query('salarioMax').optional().isFloat({ min: 0 }),
  query('area').optional().trim().notEmpty(),
  query('empregabilidadeMin').optional().isFloat({ min: 0, max: 100 })
]);

export const topicRules = validate([
  body('titulo').trim().isLength({ min: 3, max: 160 }),
  body('conteudo').trim().isLength({ min: 3 })
]);

export const commentRules = validate([
  body('conteudo').trim().isLength({ min: 1, max: 3000 })
]);

export const chatRules = validate([
  body('message').trim().isLength({ min: 1, max: 4000 })
]);
