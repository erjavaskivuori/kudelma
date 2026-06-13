import express from 'express';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { register, login, refresh, logout, deleteUserController } from './authController.js';
import { requireAuth } from '../utils/middleware.js';

const authRouter = express.Router();

authRouter.post('/register', asyncWrapper(register));

authRouter.post('/login', asyncWrapper(login));

authRouter.post('/refresh', asyncWrapper(refresh));

authRouter.post('/logout', asyncWrapper(logout));

authRouter.delete('/delete/:userId', requireAuth, asyncWrapper(deleteUserController));

export default authRouter;
