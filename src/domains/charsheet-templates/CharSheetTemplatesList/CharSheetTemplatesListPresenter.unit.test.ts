import 'reflect-metadata';
import { Container } from 'inversify';

import { getStaticCharSheetTemplatesDto } from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { CharSheetTemplatesListPresenter } from '~domains/charsheet-templates/CharSheetTemplatesList/CharSheetTemplatesListPresenter';
import { CharSheetTemplatesStore } from '~domains/charsheet-templates/CharSheetTemplatesStore';
import { toCharSheetTemplate } from '~domains/data.models';
import { getCharSheetTemplateListItemVM } from '~domains/view.models';

describe('CharSheetTemplatesListPresenter', () => {
  let container: Container;

  beforeEach(() => {
    container = getTestIOC();
    if (container.isBound(CharSheetTemplatesStore)) {
      container.unbind(CharSheetTemplatesStore);
    }
    // @ts-ignore
    container.bind(CharSheetTemplatesStore).toConstantValue({
      templates: getStaticCharSheetTemplatesDto().map(toCharSheetTemplate),
      loadInitialData: jest.fn(),
    });
  });

  it('should be bind in transient mode', () => {
    const presenter1 = container.get(CharSheetTemplatesListPresenter);
    const presenter2 = container.get(CharSheetTemplatesListPresenter);

    expect(presenter1).not.toBe(presenter2);
  });

  it('should return list of CharSheetTemplateListItemVM', () => {
    const presenter = container.get(CharSheetTemplatesListPresenter);
    const list = presenter.list;
    expect(list).toStrictEqual(
      getStaticCharSheetTemplatesDto()
        .map(toCharSheetTemplate)
        .map(getCharSheetTemplateListItemVM),
    );
  });
});
