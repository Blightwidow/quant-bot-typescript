import { IAlgorithm } from './Algorithm';
import { SecurityChanges } from './Security';
import { SecuritySymbol } from './Security';

export enum InsightDirection {
  Up = 'Up',
  Down = 'Down',
}

export type Insight = {
  symbol: SecuritySymbol;
  direction: InsightDirection;
  confidence: number; // 0<x<1
  magnitude?: number;
  period?: number;
};

export interface IAlpha {
  update: (algorithm: IAlgorithm) => Insight[];
  onSecurityChange?: (changes: SecurityChanges) => void;
}
