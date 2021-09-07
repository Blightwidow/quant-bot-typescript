import { Insight } from '../../models/Alpha';
import { Transaction } from '../../models/Execution';
import { PortfolioTarget } from '../../models/Portfolio';

export type LogInstance<T> = {
  data: T
  timestamp: Date
}

export interface IReporter {
  reportInsight: (insight: Insight, timestamp: Date) => void;
  reportTarget: (target: PortfolioTarget, timestamp: Date) => void;
  reportRiskAdjustedTarget: (reportRiskAdjustedTarget: PortfolioTarget, timestamp: Date) => void;
  reportTransaction: (transaction: Transaction, timestamp: Date) => void;
  onEnd?: () => void;
}
