import type { Request, Response } from 'express';

export const getKudelma = async (_req: Request, res: Response) => {
  // Here different services would be called to gather data
  // For now, we return a placeholder response
  res.send({ message: 'Hello from Kudelma backend!' });
};