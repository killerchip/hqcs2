import 'reflect-metadata';
import { Container } from 'inversify';
import { when } from 'mobx';

import {
  getFactoryDefaultCharacterSheets,
  resetFactoryDefaults,
} from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { Injectables } from '~config/ioc/injectables';
import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreenPresenter';
import { CharacterSheet } from '~domains/domain.types';
import { FakeAsyncStorage } from '~testHelpers/FakeAsyncStorage';
import { getFakeUuid } from '~testHelpers/fakeUuid';

describe('CharacterSheetsListScreenPresenter', () => {
  let container: Container;
  let presenter: CharacterSheetsListScreenPresenter;
  let fakeAsyncStorage: FakeAsyncStorage;
  let defaultCharacterSheets: CharacterSheet[];

  beforeEach(() => {
    container = getTestIOC();
    // Setup mock AsyncStorage and spy on it
    fakeAsyncStorage = container.get(Injectables.AsyncStorage);
    defaultCharacterSheets = getFactoryDefaultCharacterSheets(getFakeUuid);
    fakeAsyncStorage.getItem = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve(JSON.stringify({ list: defaultCharacterSheets })),
      );

    presenter = container.get<CharacterSheetsListScreenPresenter>(
      CharacterSheetsListScreenPresenter,
    );
  });

  afterEach(() => {
    // Cleanup after each test
    resetFactoryDefaults();
  });

  it('should be injectable as transient', () => {
    const presenter2 = container.get(CharacterSheetsListScreenPresenter);
    expect(presenter).not.toBe(presenter2);
  });

  it('should allow for initial loading of data', async () => {
    await presenter.load();
    expect(fakeAsyncStorage.getItem).toHaveBeenCalled();
  });

  it('should serve viewModel of the list', async () => {
    await presenter.load();
    expect(presenter.viewModel).toStrictEqual(defaultCharacterSheets);
  });

  it('should indicate when list is loading', async () => {
    expect(presenter.loading).toBe(false);
    presenter.load().then();
    expect(presenter.loading).toBe(true);
    await when(() => !presenter.loading);
    expect(presenter.viewModel).toStrictEqual(defaultCharacterSheets);
  });

  it('handle loading gracefully even after throwing', async () => {
    fakeAsyncStorage.getItem = jest
      .fn()
      .mockRejectedValueOnce(new Error('Storage read error'));

    expect(presenter.loading).toBe(false);
    await expect(presenter.load()).rejects.toThrow();
    expect(presenter.loading).toBe(false);
    expect(presenter.viewModel).toStrictEqual([]);
  });
});
