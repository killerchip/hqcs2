import 'reflect-metadata';
import { Container } from 'inversify';

import { CharacterSheetsStore } from './character-sheets-store';
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
  let container: Container | null = null;
  let mockCharSheetsGateway: ICharSheetsGateway | null = null;
  let charSheetsStore: CharacterSheetsStore | null = null;
  let factoryDefaultsSheets: ReturnType<
    typeof getFactoryDefaultCharacterSheets
  >;

  beforeEach(async () => {
    container = new BaseIOC().container;
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
    container
      .bind<ICharSheetsGateway>(CharSheetsGateway)
      .toConstantValue(mockCharSheetsGateway);

    factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);
    charSheetsStore = container.get(CharacterSheetsStore);
    await charSheetsStore?.load();
  });

  afterEach(() => {
    (mockCharSheetsGateway?.loadInitialData as jest.Mock).mockClear();
    resetFactoryDefaults();
  });

  it('should create an instance', () => {
    expect(charSheetsStore).toBeTruthy();
  });

  it('loads initial data from gateway and stores the result', async () => {
    expect(mockCharSheetsGateway?.loadInitialData).toHaveBeenCalled();
    expect(charSheetsStore!.list).toStrictEqual(factoryDefaultsSheets);
  });

  it('updates an item', async () => {
    const newItem = { ...charSheetsStore!.list[1], name: 'Gimli' };
    mockCharSheetsGateway!.setItem = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve({ ...newItem }));

    await charSheetsStore!.updateItem(newItem);
    expect(mockCharSheetsGateway?.setItem).toHaveBeenCalledWith(newItem);
    expect(charSheetsStore!.list[1]).toStrictEqual(newItem);
  });

  it('creates and stores a new item', async () => {
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
    mockCharSheetsGateway!.setItem = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(itemToCreate));

    await charSheetsStore!.updateItem(newCharSheet);
    expect(mockCharSheetsGateway?.setItem).toHaveBeenCalledWith(newCharSheet);
    expect(charSheetsStore!.list[2]).toStrictEqual(itemToCreate);
  });

  it('deletes an item', async () => {
    const idToDelete = charSheetsStore!.list[1].id;
    await charSheetsStore!.deleteItem(idToDelete);
    expect(mockCharSheetsGateway?.deleteItem).toHaveBeenCalledWith(idToDelete);
    expect(charSheetsStore!.list.length).toBe(1);
    const deletedItem = charSheetsStore!.list.find(
      (item) => item.id === idToDelete,
    );
    expect(deletedItem).toBeUndefined();
  });

  it('throws an error if item to update is not found', async () => {
    const newItem = { ...charSheetsStore!.list[1], name: 'Gimli' };
    newItem.id = getFakeUuid();
    await expect(charSheetsStore!.updateItem(newItem)).rejects.toThrow();
  });
});
