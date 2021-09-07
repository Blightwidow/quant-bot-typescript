import { format } from 'date-fns';

import { logger } from '../core/logger';
import { IAlpha } from './Alpha';
import { IExecution, TransactionRepository } from './Execution';
import { IPortfolioManager, Portfolio, TargetRepository } from './Portfolio';
import { IReporter } from '../core/reporters/IReporter';
import { IRiskManager } from './RiskManager';
import { IUniverse } from './Universe';
import { Security, SecurityHistory, SecurityRepository, SecuritySymbol } from './Security';
import { Broker } from './Broker';
import { IDataProvider } from '../core/providers/IDataProvider';

export interface IAlgorithm {
  timestamp: Date;
  securities: SecurityRepository;
  activeSecurities: SecurityRepository;
  targets: TargetRepository;
  portfolio: Portfolio;
  transactions: TransactionRepository;
  broker: Broker;
  runTick: () => void;
  makeOrder: (symbol: SecuritySymbol, quantity: number) => void;
  onEnd: () => void;
}

export interface AlgorithmConstructor {
  new (reporter: IReporter, dataProvider: IDataProvider): Algorithm;
}
export abstract class Algorithm implements IAlgorithm {
  protected alpha?: IAlpha;
  protected execution?: IExecution;
  protected portfolioManager?: IPortfolioManager;
  protected riskManager?: IRiskManager;
  protected universe?: IUniverse;
  protected reporter: IReporter;

  private _activeSecurities: SecurityRepository;
  readonly securities: SecurityRepository;
  readonly targets: TargetRepository;
  readonly transactions: TransactionRepository;
  readonly portfolio: Portfolio;
  readonly history: SecurityHistory;
  readonly broker: Broker;
  private dataProvider: IDataProvider;

  private runCount = 0;

  constructor(reporter: IReporter, dataProvider: IDataProvider) {
    this.reporter = reporter;
    this.broker = dataProvider.getDefaultBroker();
    this.dataProvider = dataProvider;
    this.securities = new SecurityRepository(dataProvider);
    this._activeSecurities = new SecurityRepository(dataProvider);
    this.targets = new TargetRepository(dataProvider);
    this.transactions = new TransactionRepository(dataProvider);
    this.portfolio = new Portfolio(dataProvider);
    this.history = new SecurityHistory(dataProvider);
  }

  public get activeSecurities(): SecurityRepository {
    return this._activeSecurities;
  }

  public get timestamp(): Date {
    return this.dataProvider.timestamp;
  }

  public runTick(): void {
    logger.info(`Running algorithm for ${format(this.timestamp, 'do MMMM yyyy')}`);

    const newUniverse =
      this.runCount === 0
        ? this.universe?.createUniverse(this)
        : this.universe?.updateUniverse?.(this);

    if (newUniverse) {
      this.updateSecurities(newUniverse);
    }

    const insights = this.alpha?.update(this) || [];
    for (const insight of insights) {
      this.reporter.reportInsight(insight, this.timestamp);
    }

    const nextTargets = this.portfolioManager?.update(this, insights) || [];
    for (const target of nextTargets) {
      this.reporter.reportTarget(target, this.timestamp);
    }
    nextTargets.map((target) => this.targets.set(target));

    const riskAdjustedTargets =
      this.riskManager?.manageRisk(this, this.targets.getAll()) || [];
    for (const target of riskAdjustedTargets) {
      this.reporter.reportRiskAdjustedTarget(target, this.timestamp);
    }
    riskAdjustedTargets.map((target) => this.targets.set(target));

    this.execution?.execute(this, this.targets.getAll()) || [];
  }

  public makeOrder(symbol: SecuritySymbol, quantity: number): void {
    if (!Number.isInteger(quantity)) {
      throw new Error(
        'PortfolioTarget.quantity must be an integer, factional shares are not supported yet',
      );
    }

    const security = this.securities.get(symbol)
    const transaction = this.broker.placeOrder(symbol, quantity, security?.price);
    this.transactions.add(transaction);
    this.reporter.reportTransaction(transaction, this.timestamp);
  }

  public onEnd(): void {
    this.reporter.onEnd?.();
  }

  private updateSecurities(nextSecurities: Security[]): void {
    const changes = {
      added: nextSecurities.filter(
        (nextSecurity) => !this.securities.get(nextSecurity.symbol),
      ),
      removed: this.securities
        .getAll()
        .filter(
          (security) =>
            !nextSecurities.some(
              (nextSecurity) => nextSecurity.symbol === security.symbol,
            ),
        ),
    };

    this._activeSecurities = new SecurityRepository(
      this.dataProvider,
      nextSecurities.map((security) => security.symbol),
    );

    this.alpha?.onSecurityChange?.(changes);
    this.portfolioManager?.onSecurityChange?.(changes);
    this.riskManager?.onSecurityChange?.(changes);
  }
}
