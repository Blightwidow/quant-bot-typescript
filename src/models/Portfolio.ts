import { IDataProvider } from '../core/providers/IDataProvider';
import { IAlgorithm } from './Algorithm';
import { Insight } from './Alpha';
import { SecurityChanges, SecuritySymbol } from './Security';

export interface IPortfolioManager {
  update: (algorithm: IAlgorithm, insights: Insight[]) => PortfolioTarget[];
  onSecurityChange?: (changes: SecurityChanges) => void;
}

export class PortfolioTarget {
  readonly symbol: SecuritySymbol;
  readonly quantity: number;

  static Percent(
    algorithm: IAlgorithm,
    symbol: SecuritySymbol,
    percent: number,
  ): PortfolioTarget {
    const security = algorithm.securities.get(symbol);

    if (!security) {
      throw new Error('Trying to calculate percent of inexisting security');
    }

    const quantity = Math.ceil(
      (algorithm.portfolio.totalValue * percent) / security.price,
    );

    return new PortfolioTarget(symbol, quantity);
  }

  constructor(symbol: SecuritySymbol, quantity: number) {
    if (!Number.isInteger(quantity)) {
      throw new Error(
        'PortfolioTarget.quantity must be an integer, factional shares are not supported yet',
      );
    }

    this.symbol = symbol;
    this.quantity = quantity;
  }
}

export class TargetRepository {
  private provider: IDataProvider;

  constructor(provider: IDataProvider) {
    this.provider = provider;
  }

  get(symbol: SecuritySymbol): PortfolioTarget | undefined {
    return this.provider.getTarget(symbol);
  }

  getAll(): PortfolioTarget[] {
    return this.provider.getAllTarget();
  }

  set(target: PortfolioTarget): void {
    this.provider.setTarget(target);
  }
}

export class Portfolio {
  private readonly provider: IDataProvider;

  constructor(provider: IDataProvider) {
    this.provider = provider;
  }

  public get invested(): boolean {
    return this.provider
      .getAllSecurities()
      .reduce((acc, security) => acc || security.invested, false);
  }

  public get totalFees(): number {
    throw(new Error('Portfolio.totalFees is not implemented yet'))
  }

  public get totalValue(): number {
    return this.provider
      .getAllSecurities()
      .reduce((acc, security) => acc + security.price * security.quantity, 0) + this.provider.getDefaultBroker().cash;
  }

  public get totalProfit(): number {
    throw(new Error('Portfolio.totalProfit is not implemented yet'))
  }

  public get totalUnrealizedProfit(): number {
    throw(new Error('Portfolio.totalUnrealizedProfit is not implemented yet'))
  }

  // .UnsettledCash           # Sum of all currencies in account (only unsettled cash)
  // .TotalHoldingsValue      # Absolute sum portfolio items
  // .MarginRemaining         # Remaining margin on the account
  // .TotalMarginUsed         # Sum of margin used across all securities
}
