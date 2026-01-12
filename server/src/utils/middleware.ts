import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import { HttpError } from './errors/index.js';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Query: ', JSON.stringify(req.query, null, 2));
  if (process.env.NODE_ENV === 'development') {
    logger.info('Body:', req.body);
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
  const message = error.message || 'Something went wrong';

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
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Access token expired' });
  }

  return;
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  requireAuth,
};
