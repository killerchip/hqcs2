import 'reflect-metadata';

import { CharacterSheetDto, NewCharacterSheetDto } from './dto.types';

import { config } from '~config/config';
import { AppTestHelper } from '~testHelpers/AppTestHelper';

/** Typical Unit test for a class, that uses different dependencies, in test environment we can mock them.
 * */
describe('CharacterSheetsGateway', () => {
  let appTestHelper: AppTestHelper;

  beforeEach(async () => {
    appTestHelper = new AppTestHelper();
    await appTestHelper.charSheetsGateway?.loadInitialData();
  });

  afterEach(() => {
    appTestHelper.reset();
  });

  it('on clean init stores a set of mock data', () => {
    expect(appTestHelper.charSheetsGateway.charSheets).toStrictEqual(
      appTestHelper.factoryDefaultsSheets,
    );
  });

  it('updates character sheet and saves the whole list', () => {
    // Setup test data
    const charSheet = appTestHelper.charSheetsGateway.charSheets[0];
    const newCharSheet = { ...charSheet, name: 'new name' };

    // Test
    appTestHelper.charSheetsGateway.setItem(newCharSheet as CharacterSheetDto);

    // Assert
    expect(appTestHelper.charSheetsGateway.charSheets[0]).toBe(newCharSheet);
    expect(appTestHelper.mockAsyncStorage.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify({ list: appTestHelper.charSheetsGateway.charSheets }),
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
    await appTestHelper.charSheetsGateway.setItem(newCharSheet);

    // Create assert data
    const createdCharSheet = appTestHelper.charSheetsGateway.charSheets[2];
    const createdCharSheetId = createdCharSheet?.id;

    // Assert
    expect(createdCharSheetId).toBeDefined();
    expect(appTestHelper.charSheetsGateway.charSheets[2]).toBe(
      createdCharSheet,
    );
    expect(appTestHelper.mockAsyncStorage.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify({ list: appTestHelper.charSheetsGateway.charSheets }),
    );
  });

  it('allows deleting a character sheet', async () => {
    // Test data
    const firstCharSheetId = appTestHelper.charSheetsGateway.charSheets[0].id;

    // Test
    await appTestHelper.charSheetsGateway.deleteItem(firstCharSheetId);

    // Assert
    expect(appTestHelper.charSheetsGateway.charSheets.length).toBe(1);
    expect(appTestHelper.mockAsyncStorage.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify({ list: [appTestHelper.charSheetsGateway.charSheets[0]] }),
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
    appTestHelper.mockAsyncStorage!.getItem = jest
      .fn()
      .mockReturnValueOnce(
        new Promise<string>((resolve) =>
          resolve(JSON.stringify({ list: dbCharSheets })),
        ),
      );

    // Test
    await appTestHelper.charSheetsGateway.loadInitialData();

    // Assert
    expect(appTestHelper.charSheetsGateway.charSheets).toStrictEqual(
      dbCharSheets,
    );
  });
});
