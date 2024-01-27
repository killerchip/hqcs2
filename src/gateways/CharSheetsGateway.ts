import { inject, injectable } from 'inversify';

import { CharSheetDto, isNewCharSheetDto, NewCharSheetDto } from './dto.models';

import { config } from '~config/config';
import { getFactoryDefaultCharSheets } from '~config/factoryDefaults';
import { Injectables } from '~config/ioc/injectables';
import { AlertingService } from '~domains/shared/AlertingService/AlertingService';

export type AsyncStorage = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
};

export type ICharSheetsGateway = {
  loadInitialData: () => Promise<CharSheetDto[] | undefined>;
  setList: (charSheets: CharSheetDto[]) => void;
  setItem: (charSheet: NewCharSheetDto | CharSheetDto) => Promise<CharSheetDto>;
  deleteItem: (id: string) => Promise<void>;
};

@injectable()
export class CharSheetsGateway implements ICharSheetsGateway {
  charSheets: CharSheetDto[] = [];
  constructor(
    @inject(Injectables.AsyncStorage) private localStorage: AsyncStorage,
    @inject(Injectables.GetUuid) private getUuid: () => string,
    @inject(AlertingService) private alertingService: AlertingService,
  ) {}

  loadInitialData = async (): Promise<CharSheetDto[]> => {
    const charSheets = await this.load();
    if (!charSheets) {
      this.setList([]);
      await this.save();
    } else {
      this.setList(charSheets);
    }

    return this.charSheets;
  };

  setList = (charSheets: CharSheetDto[]) => {
    this.charSheets = charSheets;
  };

  load = async (): Promise<CharSheetDto[] | null> => {
    const json = await this.localStorage.getItem(
      `${config.storageKey}_charSheets`,
    );
    if (!json) {
      return null;
    }

    return JSON.parse(json).list;
  };

  setItem = async (
    charSheet: NewCharSheetDto | CharSheetDto,
  ): Promise<CharSheetDto> => {
    if (isNewCharSheetDto(charSheet)) {
      const newSheet: CharSheetDto = { ...charSheet, id: this.getUuid() };
      this.charSheets.push(newSheet);
      await this.save();
      return newSheet;
    }

    const index = this.charSheets.findIndex(
      (item) => item.id === (charSheet as CharSheetDto).id,
    );
    if (index === -1) {
      this.charSheets.push(charSheet);
    } else {
      this.charSheets[index] = charSheet;
    }
    await this.save();

    return charSheet as CharSheetDto;
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
