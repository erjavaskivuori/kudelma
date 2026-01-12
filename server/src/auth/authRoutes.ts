import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { register, login, refresh, logout } from './authController.js';

const authRouter = express.Router();

authRouter.post('/register', asyncWrapper(register));

authRouter.post('/login', asyncWrapper(login));

authRouter.post('/refresh', asyncWrapper(refresh));

authRouter.post('/logout', asyncWrapper(logout));

export default authRouter;
