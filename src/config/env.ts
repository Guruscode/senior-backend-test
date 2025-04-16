import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/banking_ledger',
  JWT_SECRET: process.env.JWT_SECRET as string || 'your_jwt_secret_here',  
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};

export default env;
