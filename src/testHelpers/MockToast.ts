import { IToast } from '~domains/shared/AlertingService/AlertingService';
export class MockToast implements IToast {
  show = jest.fn();
  durations = {
    LONG: 100,
    SHORT: 2000, // must match the real value
  };
}
