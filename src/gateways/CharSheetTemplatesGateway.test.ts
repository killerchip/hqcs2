import 'reflect-metadata';

import { Container } from 'inversify';

import { getStaticCharSheetTemplatesDto } from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import * as modelsModule from '~domains/data.models';
import { toCharSheetTemplate } from '~domains/data.models';
import { CharSheetTemplatesGateway } from '~gateways/CharSheetTemplatesGateway';

describe('CharSheetTemplatesGateway', () => {
  let container: Container;
  let toCharSheetTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    container = getTestIOC();
    toCharSheetTemplateSpy = jest.spyOn(modelsModule, 'toCharSheetTemplate');
  });

  afterEach(() => {
    toCharSheetTemplateSpy.mockRestore();
  });

  it('is injectable in transient scope', () => {
    const instance1 = container.get(CharSheetTemplatesGateway);
    const instance2 = container.get(CharSheetTemplatesGateway);

    expect(instance1).not.toBe(instance2);
  });

  it('loads as initial data the static templates and converts them to model', async () => {
    const expectedData =
      getStaticCharSheetTemplatesDto().map(toCharSheetTemplate);
    toCharSheetTemplateSpy.mockClear(); // need to clear because we just called toCharSheetTemplate

    const charSheetTemplatesGateway = container.get(CharSheetTemplatesGateway);
    const loadedData = await charSheetTemplatesGateway.loadInitialData();
    // loads initial data
    expect(loadedData).toStrictEqual(expectedData);

    // converts DTO data to model
    expect(toCharSheetTemplateSpy).toHaveBeenCalledTimes(
      getStaticCharSheetTemplatesDto().length,
    );
  });
});
