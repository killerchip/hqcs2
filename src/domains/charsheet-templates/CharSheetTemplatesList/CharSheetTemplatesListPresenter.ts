import { inject, injectable, postConstruct } from 'inversify';
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

  @postConstruct() postConstruct() {
    this.charSheetTemplatesStore.loadInitialData().then();
  }

  get list() {
    return this.charSheetTemplatesStore.templates.map(
      getCharSheetTemplateListItemVM,
    );
  }
}
