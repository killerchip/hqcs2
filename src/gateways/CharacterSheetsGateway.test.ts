import 'reflect-metadata';
import { Container } from 'inversify';

import { CharacterSheetDto, NewCharacterSheetDto } from './dto.types';

import { config } from '~config/config';
import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { BaseIOC } from '~config/ioc/BaseIOC';
import { Injectables } from '~config/ioc/injectables';
import {
  AsyncStorage,
  CharSheetsGateway,
} from '~gateways/CharacterSheetsGateway';
import { getFakeUuid } from '~testHelpers/fakeUuid';

describe('CharacterSheetsGateway', () => {
  let container: Container | null = null;
  let fakeAsyncStorage: AsyncStorage | null = null;

  let charSheetsGateway: CharSheetsGateway | null = null;
  let factoryDefaultsSheets: ReturnType<
    typeof getFactoryDefaultCharacterSheets
  >;

  const getBeforeEach = () => async () => {
    container = new BaseIOC().buildWithMockDependencies();
    fakeAsyncStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    container?.unbind(Injectables.AsyncStorage);
    container
      .bind<AsyncStorage>(Injectables.AsyncStorage)
      .toConstantValue(fakeAsyncStorage);
    charSheetsGateway = container.get(CharSheetsGateway);
    factoryDefaultsSheets = getFactoryDefaultCharacterSheets(getFakeUuid);
    await charSheetsGateway?.loadInitialData();
  };

  const getAfterEach = () => () => {
    resetFactoryDefaults();
  };

  beforeEach(getBeforeEach());

  afterEach(getAfterEach());

  it('on clean init stores a set of mock data', () => {
    expect(charSheetsGateway?.charSheets).toStrictEqual(factoryDefaultsSheets);
  });

  it('updates character sheet and saves the whole list', () => {
    const charSheet = charSheetsGateway!.charSheets[0];
    const newCharSheet = { ...charSheet, name: 'new name' };
    charSheetsGateway!.setItem(newCharSheet as CharacterSheetDto);

    expect(charSheetsGateway!.charSheets[0]).toBe(newCharSheet);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(charSheetsGateway!.charSheets),
    );
  });

  it('allows creating a new character sheet', async () => {
    const newCharSheet: NewCharacterSheetDto = {
      name: 'new name',
      class: 'new class',
      move: 1,
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
    };

    await charSheetsGateway?.setItem(newCharSheet);

    const createdCharSheet = charSheetsGateway?.charSheets[2];
    const createdCharSheetId = createdCharSheet?.id;

    expect(createdCharSheetId).toBeDefined();
    expect(charSheetsGateway!.charSheets[2]).toBe(createdCharSheet);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(charSheetsGateway!.charSheets),
    );
  });

  it('allows deleting a character sheet', async () => {
    const firstCharSheetId = charSheetsGateway!.charSheets[0].id;
    await charSheetsGateway!.deleteItem(firstCharSheetId);

    expect(charSheetsGateway!.charSheets.length).toBe(1);
    expect(fakeAsyncStorage!.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify([charSheetsGateway!.charSheets[0]]),
    );
  });

  it('loads existing data from storage', async () => {
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
    fakeAsyncStorage!.getItem = jest
      .fn()
      .mockReturnValueOnce(
        new Promise<string>((resolve) => resolve(JSON.stringify(dbCharSheets))),
      );
    await charSheetsGateway!.loadInitialData();

    expect(charSheetsGateway!.charSheets).toStrictEqual(dbCharSheets);
  });
});
