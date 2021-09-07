import {
  PortfolioTarget,
  Resolution,
  Security,
  SecuritySymbol,
  Slice,
  Transaction,
} from '../../models';
import { Broker } from '../../models/Broker';

export interface IDataProvider {
  timestamp: Date;
  getAllSecurities: () => Security[];
  getSecurity: (symbol: SecuritySymbol) => Security | undefined;
  setSecurity: (security: Security) => void;
  getBroker: (name: string) => Broker;
  getDefaultBroker: () => Broker;
  getTransactions: (symbol: SecuritySymbol) => Transaction[];
  getAllTransactions: () => Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getTarget: (symbol: SecuritySymbol) => PortfolioTarget | undefined;
  getAllTarget: () => PortfolioTarget[];
  setTarget: (target: PortfolioTarget) => void;
}
