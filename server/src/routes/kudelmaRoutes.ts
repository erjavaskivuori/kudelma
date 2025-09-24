import express from 'express';
import { getKudelma } from '../controllers/kudelmaController.js';

const kudelmaRouter = express.Router();

kudelmaRouter.get('/', getKudelma);

export default kudelmaRouter;