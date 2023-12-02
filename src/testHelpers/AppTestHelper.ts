import { FakeAsyncStorage } from './FakeAsyncStorage';
import { getFakeUuid } from './fakeUuid';

import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { Injectables } from '~config/ioc/injectables';
import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreen/CharacterSheetsListScreenPresenter';
import { CharSheetsGateway } from '~gateways/CharacterSheetsGateway';

export class AppTestHelper {
  container = getTestIOC();
  charSheetsGateway: CharSheetsGateway = this.container.get(CharSheetsGateway);
  fakeAsyncStorage = this.container.get<FakeAsyncStorage>(
    Injectables.AsyncStorage,
  );
  factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);
  characterSheetsListScreenPresenter = this.container.get(
    CharacterSheetsListScreenPresenter,
  );

  reset() {
    resetFactoryDefaults();
  }
}
