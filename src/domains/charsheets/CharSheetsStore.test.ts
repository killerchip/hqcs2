import 'reflect-metadata';

import { CharSheetsStore } from './CharSheetsStore';
import { NewCharSheet } from '../data.models';

import { getFactoryDefaultCharSheets } from '~config/factoryDefaults';
import { CharSheetsGateway } from '~gateways/CharSheetsGateway';
import { CharSheetDto } from '~gateways/dto.models';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { getMockUuid } from '~testHelpers/mockUuid';

// This is a typical example for unit test of a store.
describe('CharSheetsStore', () => {
  let appTestHelper: AppTestHelper;
  let charSheetsStore: CharSheetsStore;
  let factoryDefaultsSheets: CharSheetDto[];
  let mockCharSheetsGateway: CharSheetsGateway;

  beforeEach(async () => {
    appTestHelper = new AppTestHelper();
    factoryDefaultsSheets = getFactoryDefaultCharSheets(getMockUuid);

    // get an instance of private injection, so we can spy on it
    mockCharSheetsGateway = appTestHelper.container.get(CharSheetsGateway);
    mockCharSheetsGateway.loadInitialData = jest
      .fn()
      .mockReturnValue(Promise.resolve(factoryDefaultsSheets));
    mockCharSheetsGateway.deleteItem = jest
      .fn()
      .mockReturnValue(Promise.resolve());

    // unbind the normal gateway and bind the spied gateway
    appTestHelper.container.unbind(CharSheetsGateway);
    appTestHelper.container
      .bind(CharSheetsGateway)
      .toConstantValue(mockCharSheetsGateway);

    // ask for a new instance of the store to test
    charSheetsStore = appTestHelper.container.get(CharSheetsStore);
    await charSheetsStore.load();
  });

  afterEach(() => {
    // Cleanup after each test
    appTestHelper.reset();
  });

  it('should create an instance', () => {
    // Assert directly the prepared class
    expect(charSheetsStore).toBeTruthy();
  });

  it('loads initial data from gateway and stores the result', async () => {
    // Assert directly the prepared class
    expect(mockCharSheetsGateway.loadInitialData).toHaveBeenCalledTimes(1);
    expect(charSheetsStore!.list).toStrictEqual(factoryDefaultsSheets);
  });

  it('loads initial data and stores empty array if not found', async () => {
    appTestHelper.reset();

    // repeat the before each but with custom loadInitialData Mock
    appTestHelper = new AppTestHelper();
    factoryDefaultsSheets = getFactoryDefaultCharSheets(getMockUuid);

    // get an instance of private injection, so we can spy on it
    mockCharSheetsGateway = appTestHelper.container.get(CharSheetsGateway);
    mockCharSheetsGateway.loadInitialData = jest
      .fn()
      .mockReturnValue(Promise.resolve(null));

    // unbind the normal gateway and bind the spied gateway
    appTestHelper.container.unbind(CharSheetsGateway);
    appTestHelper.container
      .bind(CharSheetsGateway)
      .toConstantValue(mockCharSheetsGateway);

    // ask for a new instance of the store to test
    charSheetsStore = appTestHelper.container.get(CharSheetsStore);
    await charSheetsStore.load();

    expect(mockCharSheetsGateway?.loadInitialData).toHaveBeenCalled();
    expect(charSheetsStore!.list).toStrictEqual([]);
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

  it('throws an error if item to update is not found', async () => {
    // Test data
    const newItem = { ...charSheetsStore!.list[1], name: 'Gimli' };
    newItem.id = getMockUuid();

    // Test and assert
    await expect(charSheetsStore!.updateItem(newItem)).rejects.toThrow();
  });

  it('creates and stores a new item', async () => {
    // Test Data
    const newCharSheet: NewCharSheet = {
      name: 'new name',
      class: 'new class',
      move: 1,
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
    };
    const itemToCreate = { ...newCharSheet, id: getMockUuid() };

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

  it('leaves the list as is if item to delete is not found', async () => {
    // Test data
    const idToDelete = getMockUuid();

    // Test
    await charSheetsStore!.deleteItem(idToDelete);

    // Assert
    expect(mockCharSheetsGateway?.deleteItem).toHaveBeenCalledWith(idToDelete);
    expect(charSheetsStore!.list.length).toBe(2);
  });
});
