import { IExecution } from '../models';

export class NullExecution implements IExecution {
  public execute(): void {
    // Do nothing
  }
}
