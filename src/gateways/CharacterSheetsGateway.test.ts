import 'reflect-metadata';
import { Container } from 'inversify';

import { CharacterSheetDto, NewCharacterSheetDto } from './dto.types';

import { config } from '~config/config';
import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { Injectables } from '~config/ioc/injectables';
import {
  AsyncStorage,
  CharSheetsGateway,
} from '~gateways/CharacterSheetsGateway';
import { getFakeUuid } from '~testHelpers/fakeUuid';

/** Typical Unit test for a class, that uses different dependencies, in test environment we can mock them.
 * */
describe('CharacterSheetsGateway', () => {
  // We need a container to inject dependencies
  let container: Container | null = null;

  // Mock instances that will be used in tests
  // We need to have access to them directly as many will be used as 'private' fields
  let fakeAsyncStorage: AsyncStorage | null = null;
  let factoryDefaultsSheets: ReturnType<
    typeof getFactoryDefaultCharacterSheets
  >;

  // The class(es) we are testing
  let charSheetsGateway: CharSheetsGateway | null = null;

  beforeEach(async () => {
    // We build a container with default mock dependencies
    container = getTestIOC();

    // We create our test suite special mocks/spies here
    fakeAsyncStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Then we bind our special mocks/spies to the container
    // Need to unbind the 'default' ones first
    container?.unbind(Injectables.AsyncStorage);
    container
      .bind<AsyncStorage>(Injectables.AsyncStorage)
      .toConstantValue(fakeAsyncStorage);

    // Now we get the instance(s) of the class(es) we are testing
    charSheetsGateway = container.get(CharSheetsGateway);
    factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);

    // And now we prepare the class for testing
    await charSheetsGateway?.loadInitialData();
  });

  afterEach(() => {
    // Don't forget to reset what you need after each test
    resetFactoryDefaults();
  });

  it('on clean init stores a set of mock data', () => {
    expect(charSheetsGateway?.charSheets).toStrictEqual(factoryDefaultsSheets);
  });

  it('updates character sheet and saves the whole list', () => {
    // Setup test data
    const charSheet = charSheetsGateway!.charSheets[0];
    const newCharSheet = { ...charSheet, name: 'new name' };

    // Test
    charSheetsGateway!.setItem(newCharSheet as CharacterSheetDto);

    // Assert
    expect(charSheetsGateway!.charSheets[0]).toBe(newCharSheet);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(charSheetsGateway!.charSheets),
    );
  });

  it('allows creating a new character sheet', async () => {
    // Create test data;
    const newCharSheet: NewCharacterSheetDto = {
      name: 'new name',
      class: 'new class',
      move: 1,
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
    };

    // Test
    await charSheetsGateway?.setItem(newCharSheet);

    // Create assert data
    const createdCharSheet = charSheetsGateway?.charSheets[2];
    const createdCharSheetId = createdCharSheet?.id;

    // Assert
    expect(createdCharSheetId).toBeDefined();
    expect(charSheetsGateway!.charSheets[2]).toBe(createdCharSheet);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(charSheetsGateway!.charSheets),
    );
  });

  it('allows deleting a character sheet', async () => {
    // Test data
    const firstCharSheetId = charSheetsGateway!.charSheets[0].id;

    // Test
    await charSheetsGateway!.deleteItem(firstCharSheetId);

    // Assert
    expect(charSheetsGateway!.charSheets.length).toBe(1);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify([charSheetsGateway!.charSheets[0]]),
    );
  });

  it('loads existing data from storage', async () => {
    // Test data
    const dbCharSheets: CharacterSheetDto[] = [
      {
        id: '1',
        name: 'name',
        class: 'class',
        move: 1,
        attack: 2,
        defense: 3,
        bodyPoints: 4,
        mindPoints: 5,
      },
    ];

    // Setup test-specific mocks/spies
    fakeAsyncStorage!.getItem = jest
      .fn()
      .mockReturnValueOnce(
        new Promise<string>((resolve) => resolve(JSON.stringify(dbCharSheets))),
      );

    // Test
    await charSheetsGateway!.loadInitialData();

    // Assert
    expect(charSheetsGateway!.charSheets).toStrictEqual(dbCharSheets);
  });
});
