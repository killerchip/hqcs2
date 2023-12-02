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

  async load() {
    this.loading = true;
    await this.charSheetsStore.load();
    runInAction(() => {
      this.loading = false;
    });
  }

  get viewModel() {
    return this.charSheetsStore.list;
  }
}
