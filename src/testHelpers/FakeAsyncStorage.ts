import { AsyncStorage } from '~gateways/CharacterSheetsGateway';

export class FakeAsyncStorage implements AsyncStorage {
  setItem = async (key: string, value: string) => {};

  getItem = async (key: string) => null;
}

export function getAsyncStorageFake() {
  return new FakeAsyncStorage();
}
