import { Trade } from '../trade';

export interface Provider {
  sendTrades: (trades: Trade[]) => void;
}
