import 'reflect-metadata';
import { when } from 'mobx';

import { Injectables } from '~config/ioc/injectables';
import {
  CharSheetScreenPresenter,
  CharSheetScreenPresenterFactory,
} from '~domains/charsheets/CharSheetScreen/CharSheetScreenPresenter';
import { CharSheetsStore } from '~domains/charsheets/CharSheetsStore';
import { getCharSheetFormVM } from '~domains/view.models';
import { AppTestHelper } from '~testHelpers/AppTestHelper';

const charSheetStoreLoadSpy = jest.spyOn(CharSheetsStore.prototype, 'load');
describe('CharSheetScreenPresenter', () => {
  let appTestHelper: AppTestHelper;
  let charSheetScreenPresenter: CharSheetScreenPresenter;

  beforeEach(() => {
    appTestHelper = new AppTestHelper();
    charSheetScreenPresenter =
      appTestHelper.container.get<CharSheetScreenPresenterFactory>(
        Injectables.CharSheetScreenPresenterFactory,
      )(appTestHelper.factoryDefaultsSheets[0].id);
  });

  afterEach(() => {
    charSheetStoreLoadSpy.mockClear();
    appTestHelper.reset();
  });

  it('is injectable as transient', () => {
    const presenter2 =
      appTestHelper.container.get<CharSheetScreenPresenterFactory>(
        Injectables.CharSheetScreenPresenterFactory,
      )('id2');

    expect(charSheetScreenPresenter).not.toBe(presenter2);
  });

  it('is initiated with a charSheetId', () => {
    expect(charSheetScreenPresenter.charSheetId).toBe(
      appTestHelper.factoryDefaultsSheets[0].id,
    );
  });

  it('serves the corresponding charSheet VM', async () => {
    await when(() => charSheetScreenPresenter.hydrated);
    expect(charSheetScreenPresenter.viewData).toStrictEqual(
      getCharSheetFormVM(charSheetScreenPresenter.charSheet!),
    );
  });

  it('serves undefined if charSheet is not found', async () => {
    const presenter =
      appTestHelper.container.get<CharSheetScreenPresenterFactory>(
        Injectables.CharSheetScreenPresenterFactory,
      )('id2');
    await when(() => presenter.hydrated);
    expect(presenter.viewData).toBeUndefined();
  });

  it('auto-triggers load if CharSheetStore not initialised', async () => {
    await when(() => charSheetScreenPresenter.hydrated);
    expect(charSheetScreenPresenter.charSheet).toStrictEqual(
      appTestHelper.factoryDefaultsSheets[0],
    );
    expect(charSheetStoreLoadSpy).toHaveBeenCalledTimes(1);
  });

  it('does not auto-trigger load if CharSheetStore is loading or is hydrated', async () => {
    charSheetStoreLoadSpy.mockClear();
    const store = appTestHelper.container.get(CharSheetsStore);
    await store.load();

    expect(store.hydrated).toBe(true);
    expect(store.loading).toBe(false);

    const presenter =
      appTestHelper.container.get<CharSheetScreenPresenterFactory>(
        Injectables.CharSheetScreenPresenterFactory,
      )(appTestHelper.factoryDefaultsSheets[0].id);

    await when(() => presenter.hydrated);
    expect(charSheetStoreLoadSpy).toHaveBeenCalledTimes(1);
  });
});
