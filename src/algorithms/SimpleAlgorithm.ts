
import { EqualWeightPortfolio } from '../portfolios/EqualWeightPortfolio';
import { ImmediateExecution } from '../executions/ImmediateExecution';
import { NullAlpha } from '../alphas';
import { ManualSelectionUniverse } from '../universes/ManualSelectionUniverse';
import { Algorithm, IReporter, Resolution } from '../models';
import { IDataProvider } from '../core/providers/IDataProvider';
import { MaximumDrawdownPercentSecurity } from '../risks/MaximumDrawdownPercentSecurity';

export class SimpleAlgorithm extends Algorithm {
  constructor(reporter: IReporter, dataProvider: IDataProvider) {
    super(reporter, dataProvider);
    this.alpha = new NullAlpha();
    this.portfolioManager = new EqualWeightPortfolio(Resolution.Monthly);
    this.execution = new ImmediateExecution();
    this.riskManager = new MaximumDrawdownPercentSecurity();
    this.universe = new ManualSelectionUniverse(['SPY', 'TSLA']);
  }
}
