import { parse, eachDayOfInterval } from 'date-fns';

import { AlgorithmConstructor, IAlgorithm } from '../models';
import { BackTestDataProvider } from './providers/BackTestDataProvider';
import { IDataProvider } from './providers/IDataProvider';
import { ConsoleReporter } from './reporters/ConsoleReporter';

export class BackTest {
  private startDate: Date;
  private endDate: Date;
  private algorithm: IAlgorithm;
  private dataProvider: IDataProvider;

  constructor(
    startDateString: string,
    endDateString: string,
    algorithmClass: AlgorithmConstructor,
  ) {
    this.startDate = parse(startDateString, 'yyyyMMdd', new Date());
    this.endDate = parse(endDateString, 'yyyyMMdd', new Date());
    const reporter = new ConsoleReporter();
    this.dataProvider = new BackTestDataProvider();
    this.algorithm = new algorithmClass(reporter, this.dataProvider);
  }

  run(): void {
    for (const day of eachDayOfInterval({
      start: this.startDate,
      end: this.endDate,
    })) {
      this.dataProvider.timestamp = day
      this.algorithm.runTick();
    }

    this.algorithm.onEnd?.();
  }
}
