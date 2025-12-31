import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { getBooks } from '../controllers/bookController.js';

const bookRouter = express.Router();

bookRouter.get('/', asyncWrapper(getBooks));

export default bookRouter;
