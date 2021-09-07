import { Algorithm } from '../../models';
import { NullReporter } from '../../core/reporters/NullReporter';

const MOCK_SLICE = {
  min: 10.0,
  max: 20.0,
  volume: 10000,
  open: 11.2,
  close: 18.3,
  date: new Date(),
};

describe('Algorithm', () => {
  test('can run without any addition', () => {
    class dummyAlgorithm extends Algorithm {}
    const alogrithm = new dummyAlgorithm(new NullReporter());

    expect(alogrithm.runTick(MOCK_SLICE)).toEqual(undefined);
  });
});
