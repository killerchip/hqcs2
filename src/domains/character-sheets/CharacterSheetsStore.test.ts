import 'reflect-metadata';
import { Container } from 'inversify';

import { CharacterSheetsStore } from './CharacterSheetsStore';
import { NewCharacterSheet } from '../domain.types';

import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { BaseIOC } from '~config/ioc/BaseIOC';
import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '~gateways/CharacterSheetsGateway';
import { getFakeUuid } from '~testHelpers/fakeUuid';

// This is a typical example for unit test of a store.
describe('CharacterSheetsStore', () => {
  // Container
  let container: Container | null = null;

  // Mocks/Spies
  let mockCharSheetsGateway: ICharSheetsGateway | null = null;
  let factoryDefaultsSheets: ReturnType<
    typeof getFactoryDefaultCharacterSheets
  >;

  // The class under test
  let charSheetsStore: CharacterSheetsStore | null = null;

  beforeEach(async () => {
    // Setup base container
    container = new BaseIOC().buildWithMockDependencies();

    // Create mocks/spies dependencies
    mockCharSheetsGateway = {
      loadInitialData: jest
        .fn()
        .mockReturnValue(
          Promise.resolve(getFactoryDefaultCharacterSheets(getFakeUuid)),
        ),
      setList: jest.fn(),
      setItem: jest.fn(),
      deleteItem: jest.fn(),
    };

    // Bind mocks/spies to container
    container?.unbind(CharSheetsGateway);
    container
      .bind<ICharSheetsGateway>(CharSheetsGateway)
      .toConstantValue(mockCharSheetsGateway);

    // Prepare some test data
    factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);

    // Create instance of class under test
    charSheetsStore = container.get(CharacterSheetsStore);

    // Prepare the instance for testing
    await charSheetsStore?.load();
  });

  afterEach(() => {
    // Cleanup after each test
    resetFactoryDefaults();
  });

  it('should create an instance', () => {
    // Assert directly the prepared class
    expect(charSheetsStore).toBeTruthy();
  });

  it('loads initial data from gateway and stores the result', async () => {
    // Assert directly the prepared class
    expect(mockCharSheetsGateway?.loadInitialData).toHaveBeenCalled();
    expect(charSheetsStore!.list).toStrictEqual(factoryDefaultsSheets);
  });

  it('updates an item', async () => {
    // Test Data
    const newItem = { ...charSheetsStore!.list[1], name: 'Gimli' };

    // Test-specific spy
    mockCharSheetsGateway!.setItem = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve({ ...newItem }));

    // Test
    await charSheetsStore!.updateItem(newItem);

    // Assert
    expect(mockCharSheetsGateway?.setItem).toHaveBeenCalledWith(newItem);
    expect(charSheetsStore!.list[1]).toStrictEqual(newItem);
  });

  it('creates and stores a new item', async () => {
    // Test Data
    const newCharSheet: NewCharacterSheet = {
      name: 'new name',
      class: 'new class',
      move: 1,
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
    };
    const itemToCreate = { ...newCharSheet, id: getFakeUuid() };

    // Test-specific mock
    mockCharSheetsGateway!.setItem = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(itemToCreate));

    // Test
    await charSheetsStore!.updateItem(newCharSheet);

    // Assert
    expect(mockCharSheetsGateway?.setItem).toHaveBeenCalledWith(newCharSheet);
    expect(charSheetsStore!.list[2]).toStrictEqual(itemToCreate);
  });

  it('deletes an item', async () => {
    // Test data
    const idToDelete = charSheetsStore!.list[1].id;

    // Test
    await charSheetsStore!.deleteItem(idToDelete);

    // Assertion Data
    const deletedItem = charSheetsStore!.list.find(
      (item) => item.id === idToDelete,
    );

    // Assert
    expect(mockCharSheetsGateway?.deleteItem).toHaveBeenCalledWith(idToDelete);
    expect(charSheetsStore!.list.length).toBe(1);
    expect(deletedItem).toBeUndefined();
  });

  it('throws an error if item to update is not found', async () => {
    // Test data
    const newItem = { ...charSheetsStore!.list[1], name: 'Gimli' };
    newItem.id = getFakeUuid();

    // Test and assert
    await expect(charSheetsStore!.updateItem(newItem)).rejects.toThrow();
  });
});
