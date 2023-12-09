import { inject, injectable } from 'inversify';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { CharacterSheetsStore } from '~domains/character-sheets/CharacterSheetsStore';
import { getCharacterSheetListItemVM } from '~domains/view.models';

@injectable()
export class CharacterSheetsListScreenPresenter {
  loading = false;
  constructor(
    @inject(CharacterSheetsStore) private charSheetsStore: CharacterSheetsStore,
  ) {
    makeObservable(this, {
      charSheetList: computed,
      loading: observable,
      load: action,
    });
  }

  get charSheetList() {
    return this.charSheetsStore.list.map(getCharacterSheetListItemVM);
  }

  async load() {
    try {
      this.loading = true;
      await this.charSheetsStore.load();
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
