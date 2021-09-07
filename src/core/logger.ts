import simpleLogger from 'simple-node-logger';
import dotenv from 'dotenv';

dotenv.config();

const logger = simpleLogger.createSimpleLogger();
logger.setLevel(process.env.LOGGER_LEVEL || 'info');

export { logger };
