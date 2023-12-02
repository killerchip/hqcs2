import { inject, injectable } from 'inversify';
import { computed, makeObservable, observable, runInAction } from 'mobx';

import { CharacterSheetsStore } from '~domains/character-sheets/CharacterSheetsStore';

@injectable()
export class CharacterSheetsListScreenPresenter {
  @inject(CharacterSheetsStore) private charSheetsStore!: CharacterSheetsStore;

  loading = false;
  constructor() {
    makeObservable(this, {
      viewModel: computed,
      loading: observable,
    });
  }

  get viewModel() {
    return this.charSheetsStore.list;
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