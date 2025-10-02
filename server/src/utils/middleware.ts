import { type Request, type Response } from 'express';
import logger from './logger.js';
import { HttpError } from './errors/index.js';

const requestLogger = (req: Request, _res: Response, next: () => void) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Query: ', req.query);
  if (process.env.NODE_ENV === 'development') {
    logger.info('Body:', req.body);
  }
  logger.info('---');
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, res: Response) => {
  logger.error(error);

  const status = (error as HttpError).status || 500;
  const message = error.message || 'Something went wrong';

  res.status(status).json({
	error: {
	  message,
	  ...(process.env.NODE_ENV === "development" && { stack: error.stack })
	}
  });
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
};