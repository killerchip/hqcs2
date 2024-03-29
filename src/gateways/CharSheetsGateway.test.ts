import 'reflect-metadata';

import { CharSheetDto, NewCharSheetDto } from './dto.models';

import { config } from '~config/config';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { getMockUuid } from '~testHelpers/mockUuid';

/** Typical Unit test for a class, that uses different dependencies, in test environment we can mock them.
 * */
describe('CharSheetsGateway', () => {
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

  it('updates char sheet and saves the whole list', () => {
    // Setup test data
    const charSheet = appTestHelper.charSheetsGateway.charSheets[0];
    const newCharSheet = { ...charSheet, name: 'new name' };

    // Test
    appTestHelper.charSheetsGateway.setItem(newCharSheet as CharSheetDto);

    // Assert
    expect(appTestHelper.charSheetsGateway.charSheets[0]).toBe(newCharSheet);
    expect(appTestHelper.mockAsyncStorage.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify({ list: appTestHelper.charSheetsGateway.charSheets }),
    );
  });

  it('allows creating a new char sheet', async () => {
    // Create test data;
    const newCharSheet: NewCharSheetDto = {
      name: 'new name',
      class: 'new class',
      move: 1,
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
      moveType: 'dice',
      currentBodyPoints: 4,
      weapons: [],
      armors: [],
      gold: 0,
      items: [],
      spells: null,
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

  it('allows deleting a char sheet', async () => {
    // Test data
    const firstCharSheetId = appTestHelper.charSheetsGateway.charSheets[0].id;

    // Test
    await appTestHelper.charSheetsGateway.deleteItem(firstCharSheetId);

    // Assert
    expect(appTestHelper.charSheetsGateway.charSheets.length).toBe(3);
    expect(appTestHelper.mockAsyncStorage.setItem).toHaveBeenCalledWith(
      config.storageKey + '_charSheets',
      JSON.stringify({
        list: [
          appTestHelper.charSheetsGateway.charSheets[0],
          appTestHelper.charSheetsGateway.charSheets[1],
          appTestHelper.charSheetsGateway.charSheets[2],
        ],
      }),
    );
  });

  it('loads existing data from storage', async () => {
    // Test data
    const dbCharSheets: CharSheetDto[] = [
      {
        id: '1',
        name: 'name',
        class: 'class',
        move: 1,
        moveType: 'dice',
        attack: 2,
        defense: 3,
        bodyPoints: 4,
        currentBodyPoints: 4,
        mindPoints: 5,
        weapons: [],
        armors: [],
        gold: 0,
        items: [],
        spells: null,
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

  it('adds a new item if id not found', async () => {
    const newCharSheet: CharSheetDto = {
      name: 'new name',
      class: 'new class',
      move: 1,
      moveType: 'dice',
      attack: 2,
      defense: 3,
      bodyPoints: 4,
      mindPoints: 5,
      id: getMockUuid(),
      currentBodyPoints: 4,
      weapons: [],
      armors: [],
      gold: 0,
      items: [],
      spells: null,
    };

    await appTestHelper.charSheetsGateway.setItem(newCharSheet);
    expect(appTestHelper.charSheetsGateway.charSheets[4]).toStrictEqual(
      newCharSheet,
    );
  });

  it('does nothing if the item to delete not found', async () => {
    await appTestHelper.charSheetsGateway.deleteItem(getMockUuid());
    expect(appTestHelper.charSheetsGateway.charSheets).toStrictEqual(
      appTestHelper.factoryDefaultsSheets,
    );
  });
});
