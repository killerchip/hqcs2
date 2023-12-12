import 'reflect-metadata';
import { Container } from 'inversify';

import { CharSheetsStore } from './CharSheetsStore';
import { NewCharSheet } from '../data.models';

import { getFactoryDefaultCharSheets } from '~config/factoryDefaults';
import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '~gateways/CharSheetsGateway';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { getMockUuid } from '~testHelpers/mockUuid';

// This is a typical example for unit test of a store.
describe('CharSheetsStore', () => {
  let appTestHelper: AppTestHelper;
  let container: Container;

  // Mocks/Spies
  let mockCharSheetsGateway: ICharSheetsGateway;
  let factoryDefaultsSheets: ReturnType<typeof getFactoryDefaultCharSheets>;

  // The class under test
  let charSheetsStore: CharSheetsStore;

  const setup = async (mockGw: ICharSheetsGateway) => {
    appTestHelper = new AppTestHelper();
    ({ container, factoryDefaultsSheets } = appTestHelper);

    // Create mocks/spies dependencies
    mockCharSheetsGateway = mockGw;

    // Bind mocks/spies to container
    container?.unbind(CharSheetsGateway);
    container
      .bind<ICharSheetsGateway>(CharSheetsGateway)
      .toConstantValue(mockCharSheetsGateway);

    // Create instance of class under test with mock/spies above
    charSheetsStore = container.get(CharSheetsStore);

    // Prepare the instance for testing
    await charSheetsStore?.load();
  };

  beforeEach(async () => {
    // Setup base container
    await setup({
      loadInitialData: jest
        .fn()
        .mockReturnValue(
          Promise.resolve(getFactoryDefaultCharSheets(getMockUuid)),
        ),
      setList: jest.fn(),
      setItem: jest.fn(),
      deleteItem: jest.fn(),
    });
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
    expect(mockCharSheetsGateway?.loadInitialData).toHaveBeenCalled();
    expect(charSheetsStore!.list).toStrictEqual(factoryDefaultsSheets);
  });

  it('loads initial data and stores empty array if not found', async () => {
    appTestHelper.reset();

    await setup({
      loadInitialData: jest.fn().mockReturnValue(Promise.resolve(null)),
      setList: jest.fn(),
      setItem: jest.fn(),
      deleteItem: jest.fn(),
    });

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
});
