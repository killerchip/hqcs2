import { injectable } from 'inversify';

import { getStaticCharSheetTemplates } from '~config/factoryDefaults';
import { CharSheetTemplateDto } from '~gateways/dto.models';

@injectable()
export class CharSheetTemplatesGateway {
  constructor() {}
  async loadInitialData(): Promise<CharSheetTemplateDto[]> {
    return getStaticCharSheetTemplates();
  }
}
