import app from './app';
import { connectToDatabase } from './config/db';
import logger from './config/logger';
import env from './config/env';

const PORT = env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Database connection failed', error);
    process.exit(1);
  });
