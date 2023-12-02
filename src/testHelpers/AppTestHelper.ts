import { FakeAsyncStorage, getFakeAsyncStorage } from './FakeAsyncStorage';
import { getFakeUuid } from './fakeUuid';

import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { BaseIOC } from '~config/ioc/BaseIOC';
import { getTestIOC } from '~config/ioc/TestIOC';
import { Injectables } from '~config/ioc/injectables';
import {
  AsyncStorage,
  CharSheetsGateway,
} from '~gateways/CharacterSheetsGateway';

export class AppTestHelper {
  container = getTestIOC();
  charSheetsGateway: CharSheetsGateway = this.container.get(CharSheetsGateway);
  fakeAsyncStorage = this.container.get<FakeAsyncStorage>(
    Injectables.AsyncStorage,
  );
  factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);

  reset() {
    resetFactoryDefaults();
  }
}
