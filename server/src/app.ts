import express from 'express';
import cors from 'cors';
import kudelmaRouter from './routes/kudelmaRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/kudelma', kudelmaRouter);

export default app;