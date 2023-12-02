import { BaseIOC } from './BaseIOC';
import { Injectables } from './injectables';

import { AsyncStorage } from '~gateways/CharacterSheetsGateway';
import {
  FakeAsyncStorage,
  getFakeAsyncStorage,
} from '~testHelpers/FakeAsyncStorage';
import { getFakeUuid } from '~testHelpers/fakeUuid';

export const getTestIOC = () => {
  const container = new BaseIOC().buildBaseTemplate();

  container.bind(Injectables.GetUuid).toConstantValue(getFakeUuid);
  container
    .bind<AsyncStorage>(Injectables.AsyncStorage)
    .toConstantValue(getFakeAsyncStorage());

  // Add your binding that should be used during test here.
  return container;
};
