import { IAlgorithm } from './Algorithm';
import { Security } from './Security';

export interface IUniverse {
  createUniverse: (algorithm: IAlgorithm) => Security[];
  updateUniverse?: (algorithm: IAlgorithm) => Security[] | undefined;
}
