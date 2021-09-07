import { IReporter } from '../../models';

export class NullReporter implements IReporter {
  reportInsight(): void {
    // Do nothing
  }

  reportTarget(): void {
    // Do nothing
  }

  reportRiskAdjustedTarget(): void {
    // Do nothing
  }

  reportTransaction(): void {
    // Do nothing
  }
}
