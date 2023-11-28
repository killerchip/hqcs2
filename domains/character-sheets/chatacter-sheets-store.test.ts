import 'reflect-metadata';
import { CharacterSheetsStore } from './character-sheets-store';
import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '../../gateways/CharacterSheetsGateway';
import { AppTestHarness } from '../../testHelpers/AppTestHarness';

describe('CharacterSheetsStore', () => {
  let appTestHarness: AppTestHarness;

  beforeEach(() => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();
    appTestHarness.container
      .bind<ICharSheetsGateway>(CharSheetsGateway)
      .toConstantValue({
        loadInitialData: jest.fn(),
        setList: jest.fn(),
        setItem: jest.fn(),
        deleteItem: jest.fn(),
      });
  });

  it('should create an instance', () => {
    const store = appTestHarness.container.get(CharacterSheetsStore);
    expect(store).toBeTruthy();
  });
});
