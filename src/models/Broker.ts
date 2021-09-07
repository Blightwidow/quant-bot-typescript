import { Transaction } from "./Execution";
import { SecuritySymbol } from "./Security";

export abstract class Broker {
  readonly name: string;
  cash: number; // Sum of all currencies in account (only settled cash)

  constructor(name: string) {
    this.name = name;
    this.cash = 10000;
  }

  abstract placeOrder(symbol: SecuritySymbol, quantity: number, price?: number): Transaction
}
