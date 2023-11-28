import { inject, injectable } from 'inversify';

import {
  CharacterSheetDto,
  isNewCharSheet,
  NewCharacterSheetDto,
} from './dto.types';
import { config } from '../config/config';
import { getFactoryDefaultCharacterSheets } from '../config/factoryDefaults';
import { Injectables } from '../config/ioc/injectables';

export type AsyncStorage = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
};

export type ICharSheetsGateway = {
  loadInitialData: () => Promise<CharacterSheetDto[] | undefined>;
  setList: (charSheets: CharacterSheetDto[]) => void;
  setItem: (charSheet: NewCharacterSheetDto | CharacterSheetDto) => void;
  deleteItem: (id: string) => void;
};

@injectable()
export class CharSheetsGateway {
  @inject(Injectables.AsyncStorage) private localStorage!: AsyncStorage;
  @inject(Injectables.GetUuid) private getUuid!: () => string;

  charSheets: CharacterSheetDto[] = [];

  loadInitialData = async () => {
    const charSheets = await this.load();
    if (!charSheets) {
      this.setList(getFactoryDefaultCharacterSheets(this.getUuid));
      await this.save();
      return;
    }

    this.setList(charSheets);
    return charSheets;
  };

  setList = (charSheets: CharacterSheetDto[]) => {
    this.charSheets = charSheets;
  };

  private save = async () => {
    const json = JSON.stringify(this.charSheets);
    await this.localStorage.setItem(`${config.storageKey}_charSheets`, json);
  };

  load = async (): Promise<CharacterSheetDto[] | null> => {
    const json = await this.localStorage.getItem(
      `${config.storageKey}_charSheets`,
    );
    if (!json) {
      return null;
    }

    return JSON.parse(json);
  };

  setItem = async (charSheet: NewCharacterSheetDto | CharacterSheetDto) => {
    if (isNewCharSheet(charSheet)) {
      this.charSheets.push({ ...charSheet, id: this.getUuid() });
      return this.save();
    }

    const index = this.charSheets.findIndex(
      (item) => item.id === (charSheet as CharacterSheetDto).id,
    );
    if (index === -1) {
      this.charSheets.push(charSheet);
    } else {
      this.charSheets[index] = charSheet;
    }
    await this.save();
  };

  deleteItem = async (id: string) => {
    const index = this.charSheets.findIndex((item) => item.id === id);
    if (index === -1) {
      return;
    }

    this.charSheets.splice(index, 1);
    await this.save();
  };
}
