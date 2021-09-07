import { add } from 'date-fns';
import {
  IAlgorithm,
  IPortfolioManager,
  PortfolioTarget,
  Resolution,
} from '../models';

export class EqualWeightPortfolio implements IPortfolioManager {
  private rebalancingPeriod: Resolution;
  private lastRebalancing?: Date;

  constructor(rebalancingPeriod = Resolution.Daily) {
    this.rebalancingPeriod = rebalancingPeriod;
  }

  public update(algorithm: IAlgorithm): PortfolioTarget[] {
    if (this.isRebalancingDue(algorithm.timestamp)) {
      const newTarget = this.rebalance(algorithm);
      this.lastRebalancing = algorithm.timestamp;

      return newTarget;
    }

    return [];
  }

  public rebalance(algorithm: IAlgorithm): PortfolioTarget[] {
    if (algorithm.activeSecurities.getAll().length === 0) {
      return [];
    }

    const percent = 1 / algorithm.activeSecurities.getAll().length;

    return algorithm.activeSecurities
      .getAll()
      .map((security) =>
        PortfolioTarget.Percent(algorithm, security.symbol, percent),
      );
  }

  public isRebalancingDue(timestamp: Date): boolean {
    return (
      !this.lastRebalancing ||
      add(this.lastRebalancing, this.rebalancingPeriod) < timestamp
    );
  }
}
