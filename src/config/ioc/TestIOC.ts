import { BaseIOC } from './BaseIOC';
import { Injectables } from './injectables';

import { AsyncStorage } from '~gateways/CharSheetsGateway';
import { getMockAsyncStorage } from '~testHelpers/MockAsyncStorage';
import { getMockRouter } from '~testHelpers/MockRouter';
import { MockToast } from '~testHelpers/MockToast';
import { getMockUuid } from '~testHelpers/mockUuid';

export const getTestIOC = () => {
  const container = new BaseIOC().buildBaseTemplate();

  container.bind(Injectables.GetUuid).toConstantValue(getMockUuid);
  container
    .bind<AsyncStorage>(Injectables.AsyncStorage)
    .toConstantValue(getMockAsyncStorage());
  container.bind(Injectables.Router).toConstantValue(getMockRouter());
  container.bind(Injectables.Toast).toConstantValue(new MockToast());

  // Add your binding that should be used during test here.
  return container;
};
