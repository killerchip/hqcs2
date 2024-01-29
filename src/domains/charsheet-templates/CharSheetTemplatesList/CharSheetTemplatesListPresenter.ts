import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { CharSheetTemplatesStore } from '~domains/charsheet-templates/CharSheetTemplatesStore';
import { getCharSheetTemplateListItemVM } from '~domains/view.models';

@injectable()
export class CharSheetTemplatesListPresenter {
  constructor(
    @inject(CharSheetTemplatesStore)
    private readonly charSheetTemplatesStore: CharSheetTemplatesStore,
  ) {
    makeAutoObservable(this);
  }

  get list() {
    return this.charSheetTemplatesStore.templates.map(
      getCharSheetTemplateListItemVM,
    );
  }
}
