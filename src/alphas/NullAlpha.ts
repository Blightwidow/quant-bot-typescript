import { IAlpha, Insight } from '../models';

export class NullAlpha implements IAlpha {
  public update(): Insight[] {
    return [];
  }
}
