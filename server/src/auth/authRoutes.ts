import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { register } from './authController.js';

const authRouter = express.Router();

authRouter.post('/register', asyncWrapper(register));

export default authRouter;
