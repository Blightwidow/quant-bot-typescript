import dotenv from 'dotenv';

import { SimpleAlgorithm } from './algorithms/SimpleAlgorithm';
import { logger } from './core/logger';
import { BackTest } from './core/Backtest';
import { ErrorCodes } from './models/ErrorCodes';

dotenv.config();

if (process.env.BACKTEST) {
  const startDateString = process.env.BACKTEST_START;
  const endDateString = process.env.BACKTEST_END;

  if (!startDateString || !endDateString) {
    logger.error('Missing start or end date for backtest');
    process.exit(ErrorCodes.missingBacktestParameter);
  }

  logger.info(`Starting backtest from ${startDateString} to ${endDateString}`);

  const backtest = new BackTest(
    startDateString,
    endDateString,
    SimpleAlgorithm,
  );

  backtest.run();
} else {
  logger.error('Live trading not implemented yet');
}
