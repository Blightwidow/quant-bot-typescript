import {
  IAlgorithm,
  IRiskManager,
  PortfolioTarget,
  Security,
  SecuritySymbol,
} from '../models';

export class MaximumDrawdownPercentSecurity implements IRiskManager {
  maximumDrawdownPercent: number;
  isTrailing: boolean;
  securitiesMaxValues: Record<SecuritySymbol, number | undefined>;

  constructor(maximumDrawdownPercent = 0.05, isTrailing = true) {
    this.maximumDrawdownPercent = -Math.abs(maximumDrawdownPercent);
    this.isTrailing = isTrailing;
    this.securitiesMaxValues = {};
  }

  public manageRisk(
    algorithm: IAlgorithm,
    targets: PortfolioTarget[],
  ): PortfolioTarget[] {
    const securities = targets
      .map((target) => algorithm.securities.get(target.symbol))
      .filter<Security>((security): security is Security => !!security);

    for (const security of securities) {
      if (!this.securitiesMaxValues[security.symbol]) {
        this.securitiesMaxValues[security.symbol] = security.price;
      }
    }

    return securities.reduce((acc, security) => {
      const max = this.securitiesMaxValues[security.symbol];
      if (!max || max === 0) {
        return acc;
      }

      const drawdown = security.price / max - 1.0;

      if (drawdown < this.maximumDrawdownPercent) {
        this.securitiesMaxValues[security.symbol] = undefined;
        return [...acc, new PortfolioTarget(security.symbol, 0)];
      }

      return acc;
    }, []);
  }
}
