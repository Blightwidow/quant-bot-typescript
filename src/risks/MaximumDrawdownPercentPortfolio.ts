import { IAlgorithm, IRiskManager, PortfolioTarget } from '../models';

export class MaximumDrawdownPercentPortfolio implements IRiskManager {
  maximumDrawdownPercent: number;
  isTrailing: boolean;
  portfolioMaxValue?: number;

  constructor(maximumDrawdownPercent = 0.05, isTrailing = true) {
    this.maximumDrawdownPercent = -Math.abs(maximumDrawdownPercent);
    this.isTrailing = isTrailing;
  }

  public manageRisk(algorithm: IAlgorithm, targets: PortfolioTarget[]): PortfolioTarget[] {
    const currentValue = algorithm.portfolio.totalValue;

    if (!this.portfolioMaxValue) {
      this.portfolioMaxValue = currentValue;
    }

    if (this.isTrailing && this.portfolioMaxValue < currentValue) {
      this.portfolioMaxValue = currentValue;
      return [];
    }

    const drawdown = currentValue / this.portfolioMaxValue - 1.0;

    if (drawdown < this.maximumDrawdownPercent) {
      this.portfolioMaxValue = undefined;
      return targets.map((target) => new PortfolioTarget(target.symbol, 0));
    }

    return [];
  }
}
