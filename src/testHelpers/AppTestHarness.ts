import { getAsyncStorageFake } from './AsyncStorageFake';
import { getFakeUuid } from './fakeUuid';

import { BaseIOC } from '~config/ioc/BaseIOC';
import { Injectables } from '~config/ioc/injectables';
import { CharSheetsGateway } from '~gateways/CharacterSheetsGateway';

export class AppTestHarness {
  container = new BaseIOC().buildBaseTemplate();
  charSheetsGateway: CharSheetsGateway | null = null;
  asyncStorageFake = getAsyncStorageFake();

  // 1. set up the app
  init() {
    this.container
      .bind(Injectables.AsyncStorage)
      .toConstantValue(this.asyncStorageFake);

    this.container
      .bind(Injectables.GetUuid)
      .toConstantValue(() => getFakeUuid());

    this.charSheetsGateway = this.container.get(CharSheetsGateway);
  }
}
