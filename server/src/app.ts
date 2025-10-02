import express from 'express';
import cors from 'cors';
import middleware from './utils/middleware.js';
import weatherRouter from './routes/weatherRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use(middleware.requestLogger);
app.use('/weather', weatherRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;