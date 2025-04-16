import mongoose from 'mongoose';
import logger from './logger';
import env from './env';

const connectToDatabase = async () => {
  try {
    const connectionOptions: mongoose.ConnectOptions = {
      
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000, 
      authSource: 'admin',
    };

    await mongoose.connect(env.MONGODB_URI, connectionOptions);
    
    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('MongoDB initial connection error:', error);
    throw error;
  }
};

export { connectToDatabase };