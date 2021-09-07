import { IAlgorithm } from "./Algorithm";
import { PortfolioTarget } from "./Portfolio";
import { SecurityChanges } from "./Security";

export interface IRiskManager {
  manageRisk: (algorithm: IAlgorithm, targets: PortfolioTarget[]) => PortfolioTarget[];
  onSecurityChange?: (changes: SecurityChanges) => void;
}
