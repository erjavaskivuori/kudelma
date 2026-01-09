import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleware from './utils/middleware.js';
import authRouter from './auth/authRoutes.js';
import weatherRouter from './weather/weatherRoutes.js';
import artRouter from './art/artRoutes.js';
import genAiKeywordRouter from './genAI/genAIRoutes.js';
import colorRouter from './color/colorRoutes.js';
import bookRouter from './book/bookRoutes.js';
import imageProxyRouter from './imageProxy/imageProxyRoutes.js';
import recipeRouter from './recipe/recipeRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(middleware.requestLogger);
app.use('/auth', authRouter);
app.use('/weather', weatherRouter);
app.use('/art', artRouter);
app.use('/keywords', genAiKeywordRouter);
app.use('/colors', colorRouter);
app.use('/books', bookRouter);
app.use('/image-proxy', imageProxyRouter);
app.use('/recipes', recipeRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
