import 'reflect-metadata';
import { CharacterSheetDto, NewCharacterSheetDto } from './dto.types';

import { config } from '~config/config';
import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { Injectables } from '~config/ioc/injectables';
import { AppTestHelper } from '~testHelpers/AppTestHelper';

describe('CharacterSheetsGateway', () => {
  let appTestHarness: AppTestHelper;
  let setItemSpy: jest.SpyInstance;

  const getBeforeEach = () => async () => {
    appTestHarness = new AppTestHelper();
    appTestHarness.init();
    setItemSpy = jest.spyOn(appTestHarness.asyncStorageFake, 'setItem');

    await appTestHarness.charSheetsGateway?.loadInitialData();
  };

  const getAfterEach = () => () => {
    setItemSpy.mockReset();
    resetFactoryDefaults();
  };

  beforeEach(getBeforeEach());

  afterEach(getAfterEach());

  it('on clean init stores a set of mock data', () => {
    expect(appTestHarness.charSheetsGateway?.charSheets).toStrictEqual(
      getFactoryDefaultCharacterSheets(
        appTestHarness.container.get(Injectables.GetUuid),
      ),
    );
  });

  it('updates character sheet and saves the whole list', () => {
    const charSheet = appTestHarness.charSheetsGateway?.charSheets[0];
    const newCharSheet = { ...charSheet, name: 'new name' };
    appTestHarness.charSheetsGateway?.setItem(
      newCharSheet as CharacterSheetDto,
    );

    expect(appTestHarness.charSheetsGateway?.charSheets[0]).toBe(newCharSheet);
    expect(appTestHarness.asyncStorageFake.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(appTestHarness.charSheetsGateway?.charSheets),
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

    await appTestHarness.charSheetsGateway?.setItem(newCharSheet);

    const createdCharSheet = appTestHarness.charSheetsGateway?.charSheets[2];
    const createdCharSheetId = createdCharSheet?.id;

    expect(createdCharSheetId).toBeDefined();
    expect(appTestHarness.charSheetsGateway?.charSheets[2]).toBe(
      createdCharSheet,
    );
    expect(appTestHarness.asyncStorageFake.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify(appTestHarness.charSheetsGateway?.charSheets),
    );
  });

  it('allows deleting a character sheet', async () => {
    const firstCharSheetId = appTestHarness.charSheetsGateway!.charSheets[0].id;
    appTestHarness.charSheetsGateway?.deleteItem(firstCharSheetId);

    expect(appTestHarness.charSheetsGateway?.charSheets.length).toBe(1);
    expect(appTestHarness.asyncStorageFake.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify([appTestHarness.charSheetsGateway?.charSheets[0]]),
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
    getAfterEach()();
    appTestHarness = new AppTestHelper();
    appTestHarness.init();
    appTestHarness.asyncStorageFake.getItem = jest
      .fn()
      .mockReturnValueOnce(
        new Promise<string>((resolve) => resolve(JSON.stringify(dbCharSheets))),
      );
    await appTestHarness.charSheetsGateway?.loadInitialData();

    expect(appTestHarness.charSheetsGateway?.charSheets).toStrictEqual(
      dbCharSheets,
    );
  });
});
