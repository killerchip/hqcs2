import { inject, injectable } from 'inversify';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { CharacterSheetsStore } from '~domains/character-sheets/CharacterSheetsStore';
import { RoutingService } from '~domains/shared/RoutingService/RoutingService';
import { ROUTES } from '~domains/shared/RoutingService/routes';
import { getCharacterSheetListItemVM } from '~domains/view.models';

@injectable()
export class CharacterSheetsListScreenPresenter {
  loading = false;
  constructor(
    @inject(CharacterSheetsStore) private charSheetsStore: CharacterSheetsStore,
    @inject(RoutingService) private routingService: RoutingService,
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

  goToCharSheetPage(id: string) {
    this.routingService.push({
      pathname: ROUTES.CHARACTER_SHEET,
      params: { id },
    });
  }
}
