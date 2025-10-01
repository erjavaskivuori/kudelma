import express from 'express';
import cors from 'cors';
import weatherRouter from './routes/weatherRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/weather', weatherRouter);

export default app;