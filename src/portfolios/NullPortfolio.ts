import {IPortfolioManager, PortfolioTarget} from '../models'

export class NullPortfolio implements IPortfolioManager {
  public update(): PortfolioTarget[] {
    return []
  }
}
