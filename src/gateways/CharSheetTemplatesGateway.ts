import { injectable } from 'inversify';

import { getStaticCharSheetTemplatesDto } from '~config/factoryDefaults';
import { CharSheetTemplate, toCharSheetTemplate } from '~domains/data.models';

@injectable()
export class CharSheetTemplatesGateway {
  async loadInitialData(): Promise<CharSheetTemplate[]> {
    return getStaticCharSheetTemplatesDto().map(toCharSheetTemplate);
  }
}
