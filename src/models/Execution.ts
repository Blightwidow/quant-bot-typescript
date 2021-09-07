import { IDataProvider } from '../core/providers/IDataProvider';
import { IAlgorithm } from './Algorithm';
import { PortfolioTarget } from './Portfolio';
import { SecuritySymbol } from './Security';

export interface IExecution {
  execute: (algorithm: IAlgorithm, targets: PortfolioTarget[]) => void;
}

export class Transaction {
  readonly symbol: SecuritySymbol;
  readonly quantity: number;
  price?: number;

  constructor(symbol: SecuritySymbol, quantity: number) {
    this.symbol = symbol;
    this.quantity = quantity;
  }

  public get isOpen(): boolean {
    return !!this.price;
  }
}

export class TransactionRepository {
  private provider: IDataProvider;

  constructor(provider: IDataProvider) {
    this.provider = provider;
  }

  get(symbol: SecuritySymbol): Transaction[] {
    return this.provider.getTransactions(symbol);
  }

  getAll(): Transaction[] {
    return this.provider.getAllTransactions();
  }

  add(transaction: Transaction): void {
    this.provider.addTransaction(transaction);
  }
}
