import { inject, injectable } from 'inversify';

import {
  CharacterSheetDto,
  isNewCharSheetDto,
  NewCharacterSheetDto,
} from './dto.types';

import { config } from '~config/config';
import { getFactoryDefaultCharacterSheets } from '~config/factoryDefaults';
import { Injectables } from '~config/ioc/injectables';

export type AsyncStorage = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
};

export type ICharSheetsGateway = {
  loadInitialData: () => Promise<CharacterSheetDto[] | undefined>;
  setList: (charSheets: CharacterSheetDto[]) => void;
  setItem: (
    charSheet: NewCharacterSheetDto | CharacterSheetDto,
  ) => Promise<CharacterSheetDto>;
  deleteItem: (id: string) => Promise<void>;
};

@injectable()
export class CharSheetsGateway implements ICharSheetsGateway {
  @inject(Injectables.AsyncStorage) private localStorage!: AsyncStorage;
  @inject(Injectables.GetUuid) private getUuid!: () => string;

  charSheets: CharacterSheetDto[] = [];

  loadInitialData = async (): Promise<CharacterSheetDto[]> => {
    const charSheets = await this.load();
    if (!charSheets) {
      this.setList(getFactoryDefaultCharacterSheets(this.getUuid));
      await this.save();
    } else {
      this.setList(charSheets);
    }

    return this.charSheets;
  };

  setList = (charSheets: CharacterSheetDto[]) => {
    this.charSheets = charSheets;
  };

  load = async (): Promise<CharacterSheetDto[] | null> => {
    const json = await this.localStorage.getItem(
      `${config.storageKey}_charSheets`,
    );
    if (!json) {
      return null;
    }

    return JSON.parse(json).list;
  };

  setItem = async (
    charSheet: NewCharacterSheetDto | CharacterSheetDto,
  ): Promise<CharacterSheetDto> => {
    if (isNewCharSheetDto(charSheet)) {
      const newSheet: CharacterSheetDto = { ...charSheet, id: this.getUuid() };
      this.charSheets.push(newSheet);
      await this.save();
      return newSheet;
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

    return charSheet as CharacterSheetDto;
  };

  deleteItem = async (id: string) => {
    const index = this.charSheets.findIndex((item) => item.id === id);
    if (index === -1) {
      return;
    }

    this.charSheets.splice(index, 1);
    await this.save();
  };

  private save = async () => {
    const json = JSON.stringify({ list: this.charSheets });
    await this.localStorage.setItem(`${config.storageKey}_charSheets`, json);
  };
}
