import { BaseIOC } from './BaseIOC';
import { Injectables } from './injectables';

import { AsyncStorage } from '~gateways/CharacterSheetsGateway';
import { getMockAsyncStorage } from '~testHelpers/MockAsyncStorage';
import { getMockRouter } from '~testHelpers/MockRouter';
import { getMockUuid } from '~testHelpers/mockUuid';

export const getTestIOC = () => {
  const container = new BaseIOC().buildBaseTemplate();

  container.bind(Injectables.GetUuid).toConstantValue(getMockUuid);
  container
    .bind<AsyncStorage>(Injectables.AsyncStorage)
    .toConstantValue(getMockAsyncStorage());
  container.bind(Injectables.Router).toConstantValue(getMockRouter());

  // Add your binding that should be used during test here.
  return container;
};
