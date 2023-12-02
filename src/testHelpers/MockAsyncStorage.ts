import { AsyncStorage } from '~gateways/CharacterSheetsGateway';

export class MockAsyncStorage implements AsyncStorage {
  setItem = jest.fn();
  getItem = jest.fn();
}

export function getMockAsyncStorage() {
  return new MockAsyncStorage();
}
