import { Duration } from 'date-fns';

export class Resolution {
  static Yearly: Duration = { years: 1 };
  static Monthly: Duration = { months: 1 };
  static Weekly: Duration = { weeks: 1 };
  static Daily: Duration = { days: 1 };
  static Minute: Duration = { minutes: 1 };
  static Second: Duration = { seconds: 1 };

  private constructor() {
    // Do nothing
  }
}
