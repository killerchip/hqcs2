import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { CharSheetTemplate } from '~domains/data.models';
import { CharSheetTemplatesGateway } from '~gateways/CharSheetTemplatesGateway';

@injectable()
export class CharSheetTemplatesStore {
  templates: CharSheetTemplate[] = [];
  constructor(
    @inject(CharSheetTemplatesGateway)
    private readonly charSheetTemplatesGateway: CharSheetTemplatesGateway,
  ) {
    makeAutoObservable(this);
  }

  async loadInitialData(): Promise<void> {
    this.templates = await this.charSheetTemplatesGateway.loadInitialData();
  }
}
