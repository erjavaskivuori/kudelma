import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { register, login } from './authController.js';

const authRouter = express.Router();

authRouter.post('/register', asyncWrapper(register));

authRouter.post('/login', asyncWrapper(login));

export default authRouter;
