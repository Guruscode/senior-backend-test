"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const logger_1 = __importDefault(require("./config/logger"));
const env_1 = __importDefault(require("./config/env"));
const PORT = env_1.default.PORT || 3000;
(0, db_1.connectToDatabase)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        logger_1.default.info(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    logger_1.default.error('Database connection failed', error);
    process.exit(1);
});
