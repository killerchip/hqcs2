import 'reflect-metadata';
import { Container } from 'inversify';
import { when } from 'mobx';

import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreen/CharacterSheetsListScreenPresenter';
import { CharacterSheet } from '~domains/domain.types';
import { AppTestHelper } from '~testHelpers/AppTestHelper';
import { FakeAsyncStorage } from '~testHelpers/FakeAsyncStorage';

// Typical black box test of a screen presenter
describe('CharacterSheetsListScreenPresenter', () => {
  let appTestHelper: AppTestHelper;
  let container: Container;
  let characterSheetsListScreenPresenter: CharacterSheetsListScreenPresenter;
  let fakeAsyncStorage: FakeAsyncStorage;
  let defaultCharacterSheets: CharacterSheet[];

  beforeEach(() => {
    appTestHelper = new AppTestHelper();
    ({
      container,
      factoryDefaultsSheets: defaultCharacterSheets,
      fakeAsyncStorage,
      characterSheetsListScreenPresenter,
    } = appTestHelper);

    // Setup mock AsyncStorage specific to this suite
    fakeAsyncStorage.getItem = jest
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
    expect(fakeAsyncStorage.getItem).toHaveBeenCalled();
  });

  it('should serve viewModel of the list', async () => {
    await characterSheetsListScreenPresenter.load();
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual(
      defaultCharacterSheets,
    );
  });

  it('should indicate when list is loading', async () => {
    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    characterSheetsListScreenPresenter.load().then();
    expect(characterSheetsListScreenPresenter.loading).toBe(true);
    await when(() => !characterSheetsListScreenPresenter.loading);
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual(
      defaultCharacterSheets,
    );
  });

  it('handle loading gracefully even after throwing', async () => {
    fakeAsyncStorage.getItem = jest
      .fn()
      .mockRejectedValueOnce(new Error('Storage read error'));

    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    await expect(characterSheetsListScreenPresenter.load()).rejects.toThrow();
    expect(characterSheetsListScreenPresenter.loading).toBe(false);
    expect(characterSheetsListScreenPresenter.viewModel).toStrictEqual([]);
  });
});
