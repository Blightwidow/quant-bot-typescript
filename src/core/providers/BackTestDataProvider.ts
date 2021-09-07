import {
  Security,
  SecuritySymbol,
  Broker,
  Transaction,
  PortfolioTarget,
} from '../../models';
import { IDataProvider } from './IDataProvider';

class MockBroker extends Broker {
  readonly startingCash: number;

  constructor() {
    super('Mock');
    this.startingCash = this.cash;
  }

  placeOrder(
    symbol: SecuritySymbol,
    quantity: number,
    price?: number,
  ): Transaction {
    this.cash = this.cash - quantity * (price || Math.random() * 100.0);
    return new Transaction(symbol, quantity);
  }
}

export class BackTestDataProvider implements IDataProvider {
  private _timestamp: Date;
  private securities: Record<SecuritySymbol, Security>;
  private transactions: Record<SecuritySymbol, Transaction[]>;
  private targets: Record<SecuritySymbol, PortfolioTarget>;
  private broker: Broker;

  constructor() {
    this.securities = {
      SPY: new Security('SPY', 100.0),
      TSLA: new Security('TSLA', 100.0),
    };
    this.transactions = {
      SPY: [],
      TSLA: [],
    };
    this.targets = {};
    this.broker = new MockBroker();
    this.timestamp = new Date();
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  set timestamp(timestamp: Date) {
    this._timestamp = timestamp;
    this.securities = Object.values(this.securities).reduce(
      (acc, security) => ({
        ...acc,
        [security.symbol]: new Security(
          security.symbol,
          security.price + (Math.random() * 6 - 3),
          security.quantity,
        ),
      }),
      {},
    );
  }

  getSecurity(symbol: SecuritySymbol): Security | undefined {
    return this.securities[symbol];
  }

  getAllSecurities(): Security[] {
    return Object.values(this.securities);
  }

  setSecurity(security: Security): void {
    this.securities[security.symbol] = security;
  }

  getBroker(): Broker {
    return this.broker;
  }

  getDefaultBroker(): Broker {
    return this.broker;
  }

  getTransactions(symbol: SecuritySymbol): Transaction[] {
    return this.transactions[symbol];
  }

  getAllTransactions(): Transaction[] {
    return Object.values(this.transactions).reduce(
      (acc, transactions) => [...acc, ...transactions],
      [],
    );
  }

  addTransaction(transaction: Transaction): void {
    this.transactions[transaction.symbol] = this.transactions[
      transaction.symbol
    ].concat(transaction);
    const security = this.securities[transaction.symbol];
    this.securities[transaction.symbol] = new Security(
      transaction.symbol,
      security.price,
      security.quantity + transaction.quantity,
    );
  }

  getTarget(symbol: SecuritySymbol): PortfolioTarget | undefined {
    return this.targets[symbol];
  }

  getAllTarget(): PortfolioTarget[] {
    return Object.values(this.targets);
  }

  setTarget(target: PortfolioTarget): void {
    this.targets[target.symbol] = target;
  }
}
