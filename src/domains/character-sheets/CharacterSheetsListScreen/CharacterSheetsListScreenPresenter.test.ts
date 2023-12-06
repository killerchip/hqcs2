import 'reflect-metadata';
import { Container } from 'inversify';
import { when } from 'mobx';

import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreen/CharacterSheetsListScreenPresenter';
import { CharacterSheet } from '~domains/data.models';
import { getCharacterSheetListItemVM } from '~domains/view.models';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { MockAsyncStorage } from '~testHelpers/MockAsyncStorage';

// Typical black box test of a screen presenter
describe('CharacterSheetsListScreenPresenter', () => {
  let appTestHelper: AppTestHelper;
  let container: Container;
  let characterSheetsListScreenPresenter: CharacterSheetsListScreenPresenter;
  let mockAsyncStorage: MockAsyncStorage;
  let defaultCharacterSheets: CharacterSheet[];

  beforeEach(() => {
    appTestHelper = new AppTestHelper();
    ({
      container,
      factoryDefaultsSheets: defaultCharacterSheets,
      mockAsyncStorage,
      characterSheetsListScreenPresenter,
    } = appTestHelper);

    // Setup mock AsyncStorage specific to this suite
    mockAsyncStorage.getItem = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve(JSON.stringify({ list: defaultCharacterSheets })),
      );
  });

  afterEach(() => {
    // Cleanup after each test
    appTestHelper.reset();
  });

  it('should be injectable as transient', () => {
    const presenter2 = container.get(CharacterSheetsListScreenPresenter);
    expect(characterSheetsListScreenPresenter).not.toBe(presenter2);
  });

  it('should allow for initial loading of data', async () => {
    await characterSheetsListScreenPresenter.load();
    expect(mockAsyncStorage.getItem).toHaveBeenCalled();
  });

  it('should serve viewModel of the list', async () => {
    await characterSheetsListScreenPresenter.load();
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual(
      defaultCharacterSheets.map(getCharacterSheetListItemVM),
    );
  });

  it('should indicate when list is loading', async () => {
    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    characterSheetsListScreenPresenter.load().then();
    expect(characterSheetsListScreenPresenter.loading).toBe(true);
    await when(() => !characterSheetsListScreenPresenter.loading);
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual(
      defaultCharacterSheets.map(getCharacterSheetListItemVM),
    );
  });

  it('handle loading gracefully even after throwing', async () => {
    mockAsyncStorage.getItem = jest
      .fn()
      .mockRejectedValueOnce(new Error('Storage read error'));

    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    await expect(characterSheetsListScreenPresenter.load()).rejects.toThrow();
    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual([]);
  });
});
