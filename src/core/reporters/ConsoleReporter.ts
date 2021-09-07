import { format } from 'date-fns';

import {
  Insight,
  IReporter,
  LogInstance,
  PortfolioTarget,
  Transaction,
} from '../../models';

export class ConsoleReporter implements IReporter {
  private insightLogs: LogInstance<Insight>[] = [];
  private targetLogs: LogInstance<PortfolioTarget>[] = [];
  private riskAdjustedTargetLogs: LogInstance<PortfolioTarget>[] = [];
  private executionLogs: LogInstance<Transaction>[] = [];

  reportInsight(insight: Insight, timestamp: Date): void {
    this.insightLogs.push({ data: insight, timestamp });
  }

  reportTarget(target: PortfolioTarget, timestamp: Date): void {
    this.targetLogs.push({ data: target, timestamp });
  }

  reportRiskAdjustedTarget(
    reportRiskAdjustedTarget: PortfolioTarget,
    timestamp: Date,
  ): void {
    this.riskAdjustedTargetLogs.push({
      data: reportRiskAdjustedTarget,
      timestamp,
    });
  }

  reportTransaction(transaction: Transaction, timestamp: Date): void {
    this.executionLogs.push({ data: transaction, timestamp });
  }

  onEnd(): void {
    console.log(`-------- Insights --------`);
    for (const log of this.insightLogs) {
      console.log(
        `${this.formatTimestamp(log.timestamp)}: ${log.data.symbol} will go ${
          log.data.direction
        }`,
      );
    }
    console.log(`-------- Targets --------`);
    for (const log of this.targetLogs) {
      console.log(
        `${this.formatTimestamp(log.timestamp)}: New target of ${
          log.data.quantity
        } shared for ${log.data.symbol}`,
      );
    }
    console.log(`-------- RiskManagement --------`);
    for (const log of this.riskAdjustedTargetLogs) {
      console.log(
        `${this.formatTimestamp(
          log.timestamp,
        )}: Risk management adjusted target for ${log.data.symbol} to ${
          log.data.quantity
        }`,
      );
    }
    console.log(`-------- Trades --------`);
    for (const log of this.executionLogs) {
      console.log(
        `${this.formatTimestamp(log.timestamp)}: Order placed for ${
          log.data.quantity
        } of ${log.data.symbol}`,
      );
    }
  }

  private formatTimestamp(date: Date): string {
    return format(date, 'yyyy MM dd');
  }
}
