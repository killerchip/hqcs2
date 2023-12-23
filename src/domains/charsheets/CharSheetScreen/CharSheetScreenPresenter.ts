import { inject, injectable, postConstruct } from 'inversify';
import { action, computed, makeObservable } from 'mobx';

import { Injectables } from '~config/ioc/injectables';
import { CharSheetsStore } from '~domains/charsheets/CharSheetsStore';
import { CharSheet } from '~domains/data.models';

@injectable()
export class CharSheetScreenPresenter {
  constructor(
    @inject(CharSheetsStore) public charSheetsStore: CharSheetsStore,
    @inject(Injectables.CharSheetScreenPresenterFactoryArgs)
    public charSheetId: CharSheet['id'],
  ) {
    makeObservable(this, {
      hydrated: computed,
      charSheet: computed,
      load: action,
    });
  }

  get hydrated() {
    return this.charSheetsStore.hydrated;
  }

  get charSheet(): CharSheet | undefined {
    return this.charSheetsStore.list.find((i) => i.id === this.charSheetId);
  }

  @postConstruct() init() {
    if (!this.charSheetsStore.loading && !this.charSheetsStore.hydrated) {
      this.load().then();
    }
  }

  load() {
    return this.charSheetsStore.load();
  }
}

export type CharSheetScreenPresenterFactory = (
  charSheetId: CharSheet['id'],
) => CharSheetScreenPresenter;
