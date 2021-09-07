import { IAlpha, Insight, InsightDirection } from '../models';

export class SimpleAlpha implements IAlpha {
  public update(): Insight[] {
    const insights = [
      {
        symbol: "AAPL",
        direction: InsightDirection.Up,
        confidence: 0,
      },
    ];

    return insights;
  }
}
