import { IRiskManager, PortfolioTarget } from '../models';

export class NullRiskManager implements IRiskManager {
  public manageRisk(): PortfolioTarget[] {
    return [];
  }
}
