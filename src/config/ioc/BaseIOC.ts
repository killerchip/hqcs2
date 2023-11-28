// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Crypto from 'expo-crypto';
import { Container } from 'inversify';

import { Injectables } from '~config/ioc/injectables';
import { CharSheetsGateway } from '~gateways/CharacterSheetsGateway';
import { FakeAsyncStorage } from '~testHelpers/FakeAsyncStorage';
import { getFakeUuid } from '~testHelpers/fakeUuid';

export class BaseIOC {
  container;

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Transient',
    });
  }

  buildBaseTemplate = () => {
    this.container
      .bind(CharSheetsGateway)
      .to(CharSheetsGateway)
      .inSingletonScope();

    // Add your singleton bindings here
    return this.container;
  };

  // buildWithRealDependencies = () => {
  //   this.buildBaseTemplate();
  //   this.container.bind(Injectables.GetUuid).toConstantValue(Crypto.randomUUID);
  //   this.container.bind(Injectables.AsyncStorage).toConstantValue(AsyncStorage);
  //
  //   // Add your binding that can be replaced during tests here.
  //   return this.container;
  // };

  buildWithMockDependencies = () => {
    this.buildBaseTemplate();
    this.container.bind(Injectables.GetUuid).toConstantValue(getFakeUuid);
    this.container
      .bind(Injectables.AsyncStorage)
      .toConstantValue(FakeAsyncStorage);
    // Add your binding that should be used during test here.
    return this.container;
  };
}
