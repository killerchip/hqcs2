import { MockAsyncStorage } from './MockAsyncStorage';
import { getMockUuid } from './mockUuid';

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
  mockAsyncStorage = this.container.get<MockAsyncStorage>(
    Injectables.AsyncStorage,
  );
  factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getMockUuid);
  // noinspection JSUnusedGlobalSymbols
  characterSheetsListScreenPresenter = this.container.get(
    CharacterSheetsListScreenPresenter,
  );

  reset() {
    resetFactoryDefaults();
  }
}
