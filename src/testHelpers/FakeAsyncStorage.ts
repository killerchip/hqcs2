import { AsyncStorage } from '~gateways/CharacterSheetsGateway';

export class FakeAsyncStorage implements AsyncStorage {
  setItem = jest.fn();
  getItem = jest.fn();
}

export function getFakeAsyncStorage() {
  return new FakeAsyncStorage();
}
