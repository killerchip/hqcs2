import { BaseIOC } from './BaseIOC';
import { Injectables } from './injectables';

import { FakeAsyncStorage } from '~testHelpers/FakeAsyncStorage';
import { getFakeUuid } from '~testHelpers/fakeUuid';

export const getTestIOC = () => {
  const container = new BaseIOC().buildBaseTemplate();

  container.bind(Injectables.GetUuid).toConstantValue(getFakeUuid);
  container
    .bind(Injectables.AsyncStorage)
    .toConstantValue(new FakeAsyncStorage());

  // Add your binding that should be used during test here.
  return container;
};
