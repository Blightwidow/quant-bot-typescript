import AWS from 'aws-sdk';

import { Env, initConfig } from './config';
import { getInitialState } from './state';
import { getTrades } from './trade';

// Create client outside of handler to reuse
// const lambda = new AWS.Lambda();

// Handler
exports.handler = async function (
  event: AWS.Lambda.Types.EventSourceMappingConfiguration,
  context: any,
) {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
  console.log('## CONTEXT: ' + serialize(context));
  console.log('## EVENT: ' + serialize(event));

  try {
    parameterChecks();
    const config = initConfig(process.env as Env);

    console.debug('Running bot with following configuration', serialize(config));
    const state = await getInitialState(config.dataProvider);
    const trades = getTrades(state);

    console.log('Executing the following trades', serialize(trades));
    await config.dataProvider.sendTrades(trades);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

function parameterChecks() {
  if (!process.env.BACKTEST) {
    throw new Error(
      'Live trading not implemented yet, only backtesting is possible for now',
    );
  }
}

function serialize(object: any) {
  return JSON.stringify(object, null, 2);
}
