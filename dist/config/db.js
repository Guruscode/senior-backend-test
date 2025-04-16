"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const env_1 = __importDefault(require("./env"));
const connectToDatabase = async () => {
    try {
        const connectionOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            authSource: 'admin',
        };
        await mongoose_1.default.connect(env_1.default.MONGODB_URI, connectionOptions);
        // Connection events
        mongoose_1.default.connection.on('connected', () => {
            logger_1.default.info('Mongoose connected to MongoDB');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.default.error('Mongoose connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.warn('Mongoose disconnected from MongoDB');
        });
        logger_1.default.info('Connected to MongoDB successfully');
    }
    catch (error) {
        logger_1.default.error('MongoDB initial connection error:', error);
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
