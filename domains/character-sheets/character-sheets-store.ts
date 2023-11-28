import { inject, injectable } from 'inversify';
import { action, makeObservable, runInAction } from 'mobx';

import {
  CharSheetsGateway,
  ICharSheetsGateway,
} from '../../gateways/CharacterSheetsGateway';
import {
  CharacterSheet,
  isNewCharSheet,
  NewCharacterSheet,
} from '../domain.types';

@injectable()
export class CharacterSheetsStore {
  @inject(CharSheetsGateway) private charSheetsGateway!: ICharSheetsGateway;

  list: CharacterSheet[] = [];

  constructor() {
    makeObservable(this, {
      load: action,
      updateItem: action,
    });
  }

  async load() {
    const list = await this.charSheetsGateway.loadInitialData();
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
      // TODO: throw error and handle it
      return;
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
