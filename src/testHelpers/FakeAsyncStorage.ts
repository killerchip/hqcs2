import { AsyncStorage } from '~gateways/CharacterSheetsGateway';

export class FakeAsyncStorage implements AsyncStorage {
  // setItem = (key: string, value: string) => Promise.resolve();
  //
  // getItem = (key: string) => Promise.resolve(null);
  setItem = jest.fn();
  getItem = jest.fn();
}

export function getFakeAsyncStorage() {
  return new FakeAsyncStorage();
}
