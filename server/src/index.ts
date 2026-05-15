import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

if (!process.env.PORT) {
  throw new Error('PORT is not defined in environment variables');
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
