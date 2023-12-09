import { MockAsyncStorage } from './MockAsyncStorage';
import { getMockUuid } from './mockUuid';

import {
  getFactoryDefaultCharSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { Injectables } from '~config/ioc/injectables';
import { CharSheetsListScreenPresenter } from '~domains/charsheets/CharSheetsListScreen/CharSheetsListScreenPresenter';
import { IRouter } from '~domains/shared/RoutingService/RoutingService';
import { CharSheetsGateway } from '~gateways/CharSheetsGateway';

export class AppTestHelper {
  container = getTestIOC();
  charSheetsGateway: CharSheetsGateway = this.container.get(CharSheetsGateway);
  mockAsyncStorage = this.container.get<MockAsyncStorage>(
    Injectables.AsyncStorage,
  );
  mockRouter = this.container.get<IRouter>(Injectables.Router);

  factoryDefaultsSheets = getFactoryDefaultCharSheets(getMockUuid);
  // noinspection JSUnusedGlobalSymbols
  charSheetsListScreenPresenter = this.container.get(
    CharSheetsListScreenPresenter,
  );

  reset() {
    resetFactoryDefaults();
  }
}
