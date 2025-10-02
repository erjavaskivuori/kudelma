import type { Request, Response, NextFunction } from 'express';

// A utility to wrap async route handlers and pass errors to the error handler middleware
export const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
