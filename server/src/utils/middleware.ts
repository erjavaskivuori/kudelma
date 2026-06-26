import crypto from 'node:crypto';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import { HttpError } from './errors/index.js';

const SENSITIVE_KEYS = new Set(
  ['email', 'password', 'token', 'accessToken', 'refreshToken', 'secret', 'latitude', 'longitude']
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

export const requestId: RequestHandler = (req, _res, next) => {
  req.id = crypto.randomUUID();
  next();
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info('Request', {
      reqId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      userId: req.user?.id,
    });
  });

  const body: unknown = req.body;
  if (body && typeof body === 'object' && !Array.isArray(body) && Object.keys(body).length > 0) {
    logger.info('Request body', { body: sanitizeBody(body) as Record<string, unknown> });
  }

  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const status = (error as HttpError).status || 500;

  logger.error('Unhandled error', {
    reqId: req.id,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    status,
    errorName: error.name,
    message: error.message,
    stack: error.stack,
    details: (error as HttpError).details as Record<string, unknown> | undefined,
  });

  const rawMessage = error.message || 'Something went wrong';
  const isPrismaRuntimeError =
    error.name.startsWith('PrismaClient')
    || rawMessage.includes('@prisma/client/runtime')
    || rawMessage.includes('prisma.');
  const message = status === 500 && isPrismaRuntimeError
    ? 'Database is temporarily unavailable'
    : rawMessage;

  res.status(status).json({ error: message });
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
  requestId,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  requireAuth,
  optionalAuth,
};
