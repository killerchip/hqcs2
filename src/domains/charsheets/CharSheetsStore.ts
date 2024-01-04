import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import {
  CharSheet,
  isNewCharSheet,
  NewCharSheet,
  toCharSheet,
} from '../data.models';

import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '~gateways/CharSheetsGateway';

@injectable()
export class CharSheetsStore {
  list: CharSheet[] = [];
  hydrated = false;
  loading = false;

  constructor(
    @inject(CharSheetsGateway) private charSheetsGateway: ICharSheetsGateway,
  ) {
    makeObservable(this, {
      list: observable,
      load: action,
      updateItem: action,
      hydrated: observable,
      loading: observable,
    });
  }

  async load() {
    this.loading = true;
    try {
      const listDto = await this.charSheetsGateway.loadInitialData();
      const list = listDto?.map(toCharSheet);
      runInAction(() => {
        this.list = list ?? [];
        this.hydrated = true;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateItem(sheet: CharSheet | NewCharSheet) {
    if (isNewCharSheet(sheet)) {
      const createdSheet = await this.charSheetsGateway.setItem(sheet);

      this.list.push(createdSheet);
      return;
    }

    const itemIndex = this.list.findIndex(
      (i) => i.id === (sheet as CharSheet).id,
    );

    if (itemIndex === -1) {
      throw new Error('Char sheet for update not found');
    }

    this.list[itemIndex] = await this.charSheetsGateway.setItem(sheet);
  }

  async deleteItem(id: CharSheet['id']) {
    await this.charSheetsGateway.deleteItem(id);
    const index = this.list.findIndex((i) => i.id === id);
    if (index > -1) {
      this.list.splice(index, 1);
    }
  }
}
