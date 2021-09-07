import { IAlgorithm, IUniverse, Security, SecuritySymbol } from '../models';

export class ManualSelectionUniverse implements IUniverse {
  private symbols: SecuritySymbol[];

  constructor(symbols: SecuritySymbol[]) {
    this.symbols = symbols;
  }

  public createUniverse(algorithm: IAlgorithm): Security[] {
    return this.symbols
      .map((symbol) => algorithm.securities.get(symbol))
      .filter<Security>((security): security is Security => !!security);
  }
}
