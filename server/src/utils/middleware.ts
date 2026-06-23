import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import { HttpError } from './errors/index.js';

const SENSITIVE_KEYS = new Set(
  ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'latitude', 'longitude']
);

const sanitizeBody = (body: unknown): unknown => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.has(k) ? '[REDACTED]' : v,
    ])
  );
};

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Query: ', JSON.stringify(req.query, null, 2));
  if (process.env.NODE_ENV === 'development') {
    logger.info('Body:', sanitizeBody(req.body));
  }
  logger.info('---');
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error caught in errorHandler:', error);

  const status = (error as HttpError).status || 500;
  const rawMessage = error.message || 'Something went wrong';
  const isPrismaRuntimeError =
    error.name.startsWith('PrismaClient')
    || rawMessage.includes('@prisma/client/runtime')
    || rawMessage.includes('prisma.');
  const message = status === 500 && isPrismaRuntimeError
    ? 'Database is temporarily unavailable'
    : rawMessage;

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken as string | undefined;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'string') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded as jwt.JwtPayload & { id: number };
    next();
  } catch {
    return res.status(401).json({ error: 'Access token expired' });
  }

  return;
};

export const optionalAuth: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken as string | undefined;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded !== 'string') {
      req.user = decoded as jwt.JwtPayload & { id: number };
    }
  } catch {
    // Leave req.user unset if token is invalid.
  }

  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  requireAuth,
  optionalAuth,
};
