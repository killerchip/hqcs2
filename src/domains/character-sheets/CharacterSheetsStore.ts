import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import {
  CharacterSheet,
  isNewCharSheet,
  NewCharacterSheet,
  toCharacterSheet,
} from '../data.models';

import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '~gateways/CharacterSheetsGateway';

@injectable()
export class CharacterSheetsStore {
  list: CharacterSheet[] = [];

  constructor(
    @inject(CharSheetsGateway) private charSheetsGateway: ICharSheetsGateway,
  ) {
    makeObservable(this, {
      list: observable,
      load: action,
      updateItem: action,
    });
  }

  async load() {
    const listDto = await this.charSheetsGateway.loadInitialData();
    const list = listDto?.map(toCharacterSheet);
    runInAction(() => {
      this.list = list ?? [];
    });
  }

  async updateItem(sheet: CharacterSheet | NewCharacterSheet) {
    if (isNewCharSheet(sheet)) {
      const createdSheet = await this.charSheetsGateway.setItem(sheet);

      this.list.push(createdSheet);
      return;
    }

    const itemIndex = this.list.findIndex(
      (i) => i.id === (sheet as CharacterSheet).id,
    );

    if (itemIndex === -1) {
      throw new Error('Character sheet for update not found');
    }

    this.list[itemIndex] = await this.charSheetsGateway.setItem(sheet);
  }

  async deleteItem(id: CharacterSheet['id']) {
    await this.charSheetsGateway.deleteItem(id);
    const index = this.list.findIndex((i) => i.id === id);
    if (index > -1) {
      this.list.splice(index, 1);
    }
  }
}
