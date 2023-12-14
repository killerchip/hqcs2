import { inject, injectable } from 'inversify';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { CharSheetsStore } from '~domains/charsheets/CharSheetsStore';
import { AlertingService } from '~domains/shared/AlertingService/AlertingService';
import { RoutingService } from '~domains/shared/RoutingService/RoutingService';
import { ROUTES } from '~domains/shared/RoutingService/routes';
import { getCharSheetListItemVM } from '~domains/view.models';

@injectable()
export class CharSheetsListScreenPresenter {
  loading = false;
  constructor(
    @inject(CharSheetsStore) private charSheetsStore: CharSheetsStore,
    @inject(RoutingService) private routingService: RoutingService,
    @inject(AlertingService) private alertingService: AlertingService,
  ) {
    makeObservable(this, {
      charSheetList: computed,
      loading: observable,
      load: action,
    });
  }

  get charSheetList() {
    return this.charSheetsStore.list.map(getCharSheetListItemVM);
  }

  async load() {
    try {
      this.loading = true;
      await this.charSheetsStore.load();
    } catch {
      this.alertingService.alert(
        'Error loading character sheets',
        'Error',
        'error',
      );
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
