import 'reflect-metadata';

import { Container } from 'inversify';

import { getStaticCharSheetTemplates } from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { CharSheetTemplatesGateway } from '~gateways/CharSheetTemplatesGateway';

describe('CharSheetTemplatesGateway', () => {
  let container: Container;

  beforeEach(() => {
    container = getTestIOC();
  });

  it('is injectable in transient scope', () => {
    const instance1 = container.get(CharSheetTemplatesGateway);
    const instance2 = container.get(CharSheetTemplatesGateway);

    expect(instance1).not.toBe(instance2);
  });

  it('loads as initial data the static templates', async () => {
    const charSheetTemplatesGateway = container.get(CharSheetTemplatesGateway);

    const loadedData = await charSheetTemplatesGateway.loadInitialData();
    expect(loadedData).toStrictEqual(getStaticCharSheetTemplates());
  });
});
