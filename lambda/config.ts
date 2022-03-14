import { Provider } from './providers/IProvider';

export interface Env {
  BACK_TEST?: boolean;
}

export interface Config {
  isBacktest: boolean;
  dataProvider: Provider;
}

export function initConfig(env: Env): Readonly<Config> {
  return {
    isBacktest: env.BACK_TEST ?? false,
    dataProvider: {
      sendTrades: () => {},
    },
  };
}
