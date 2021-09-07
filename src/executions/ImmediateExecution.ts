import { IAlgorithm, IExecution, PortfolioTarget } from '../models';

export class ImmediateExecution implements IExecution {
  public execute(algorithm: IAlgorithm, targets: PortfolioTarget[]): void {
    for (const target of targets) {
      const transactions = algorithm.transactions.get(target.symbol) || [];
      const openQuantity = transactions.reduce(
        (sum, order) => (order.isOpen ? sum + order.quantity : sum),
        0,
      );
      const currentHolding =
        (algorithm.securities.get(target.symbol)?.quantity || 0) + openQuantity;

      const delta = target.quantity - currentHolding;

      if (delta !== 0) {
        algorithm.makeOrder(target.symbol, delta);
      }
    }
  }
}
