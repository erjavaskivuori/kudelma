import express from 'express';
import cors from 'cors';
import middleware from './utils/middleware.js';
import authRouter from './auth/authRoutes.js';
import weatherRouter from './routes/weatherRoutes.js';
import artRouter from './art/artRoutes.js';
import genAiKeywordRouter from './routes/genAIRoutes.js';
import colorRouter from './routes/colorRoutes.js';
import bookRouter from './book/bookRoutes.js';
import imageProxyRouter from './routes/imageProxyRoutes.js';
import recipeRouter from './routes/recipeRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

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
