import 'reflect-metadata';
import { Container } from 'inversify';
import { when } from 'mobx';

import { CharSheetsListScreenPresenter } from '~domains/charsheets/CharSheetsListScreen/CharSheetsListScreenPresenter';
import { CharSheet } from '~domains/data.models';
import { IRouter } from '~domains/shared/RoutingService/RoutingService';
import { ROUTES } from '~domains/shared/RoutingService/routes';
import { getCharSheetListItemVM } from '~domains/view.models';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { MockAsyncStorage } from '~testHelpers/MockAsyncStorage';

// Typical black box test of a screen presenter
describe('CharSheetsListScreenPresenter', () => {
  let appTestHelper: AppTestHelper;
  let container: Container;
  let charSheetsListScreenPresenter: CharSheetsListScreenPresenter;
  let mockAsyncStorage: MockAsyncStorage;
  let defaultCharSheets: CharSheet[];
  let mockRouter: IRouter;

  beforeEach(() => {
    appTestHelper = new AppTestHelper();
    ({
      container,
      factoryDefaultsSheets: defaultCharSheets,
      mockAsyncStorage,
      charSheetsListScreenPresenter,
      mockRouter,
    } = appTestHelper);

    // Setup mock AsyncStorage specific to this suite
    mockAsyncStorage.getItem = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve(JSON.stringify({ list: defaultCharSheets })),
      );
  });

  afterEach(() => {
    // Cleanup after each test
    appTestHelper.reset();
  });

  it('should be injectable as transient', () => {
    const presenter2 = container.get(CharSheetsListScreenPresenter);
    expect(charSheetsListScreenPresenter).not.toBe(presenter2);
  });

  it('should allow for initial loading of data', async () => {
    await charSheetsListScreenPresenter.load();
    expect(mockAsyncStorage.getItem).toHaveBeenCalled();
  });

  it('should serve viewModel of the list', async () => {
    await charSheetsListScreenPresenter.load();
    expect(charSheetsListScreenPresenter.charSheetList).toStrictEqual(
      defaultCharSheets.map(getCharSheetListItemVM),
    );
  });

  it('should indicate when list is loading', async () => {
    expect(charSheetsListScreenPresenter.loading).toBe(false);
    charSheetsListScreenPresenter.load().then();
    expect(charSheetsListScreenPresenter.loading).toBe(true);
    await when(() => !charSheetsListScreenPresenter.loading);
    expect(charSheetsListScreenPresenter.charSheetList).toStrictEqual(
      defaultCharSheets.map(getCharSheetListItemVM),
    );
  });

  it('handle loading gracefully even after throwing', async () => {
    mockAsyncStorage.getItem = jest
      .fn()
      .mockRejectedValueOnce(new Error('Storage read error'));

    expect(charSheetsListScreenPresenter.loading).toBe(false);
    await expect(charSheetsListScreenPresenter.load()).rejects.toThrow();
    expect(charSheetsListScreenPresenter.loading).toBe(false);
    expect(charSheetsListScreenPresenter.charSheetList).toStrictEqual([]);
  });

  it('allows navigation to specific charsheet page', async () => {
    const randomIndex = Math.floor(Math.random() * defaultCharSheets.length);
    const targetSheetId = defaultCharSheets[randomIndex].id;

    charSheetsListScreenPresenter.goToCharSheetPage(targetSheetId);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: ROUTES.CHARACTER_SHEET,
      params: { id: targetSheetId },
    });
  });
});
