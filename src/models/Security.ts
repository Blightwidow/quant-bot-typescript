import { IDataProvider } from '../core/providers/IDataProvider';
import { Slice } from './Slice';
import { Resolution } from './Time';

export type SecuritySymbol = string;

export enum Exchange {
  NewYork,
}

export class SecurityRepository {
  private provider: IDataProvider;
  private list?: SecuritySymbol[];

  constructor(provider: IDataProvider, list?: SecuritySymbol[]) {
    this.provider = provider;
    this.list = list;
  }

  get(symbol: SecuritySymbol): Security | undefined {
    if (!this.list?.length || this.list?.includes(symbol)) {
      return this.provider.getSecurity(symbol);
    }

    return;
  }

  getAll(): Security[] {
    if (this.list?.length) {
      return this.list
        .map((symbol) => this.provider.getSecurity(symbol))
        .filter<Security>((security): security is Security => !!security);
    }

    return this.provider.getAllSecurities();
  }

  get count(): number {
    if (this.list?.length) {
      return this.list.map((symbol) => this.provider.getSecurity(symbol))
        .length;
    }

    return this.provider.getAllSecurities().length;
  }

  set(security: Security): void {
    this.provider.setSecurity(security);
  }
}

export class SecurityHistory {
  private provider: IDataProvider;

  constructor(provider: IDataProvider) {
    this.provider = provider;
  }

  get(): Slice[] {
    this.provider;
    return [];
  }
}

export class Security {
  readonly symbol: SecuritySymbol;
  readonly resolution: Resolution;
  readonly exchange: Exchange;
  readonly quantity: number;
  readonly price: number;

  // DateTime LocalTime;
  // IFeeModel FeeModel;
  // IFillModel FillModel;
  // ISlippageModel SlippageModel;
  // ISecurityPortfolioModel PortfolioModel;
  // ISecurityMarginModel MarginModel;
  // ISettlementModel SettlementModel;
  // IVolatilityModel VolatilityModel;
  // ISecurityDataFilter DataFilter;

  constructor(symbol: SecuritySymbol, price: number, quantity = 0) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.resolution = Resolution.Daily;
    this.exchange = Exchange.NewYork;
    this.price = price;
  }

  public get hasData(): boolean {
    throw new Error('Security.hasData is not implemented yet');
  }

  public get invested(): boolean {
    return this.quantity > 0;
  }

  public get unrealizedProfit(): number {
    throw new Error('Security.unrealizedProfit is not implemented yet');
  }

  public get totalFees(): number {
    throw new Error('Security.totalFees is not implemented yet');
  }
}

export type SecurityChanges = {
  added: Security[];
  removed: Security[];
};
