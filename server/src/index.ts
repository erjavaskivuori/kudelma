import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import logger from './utils/logger.js';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  logger.info('Server started', { port: PORT });
});
