import 'reflect-metadata';
import { Container } from 'inversify';

import { getStaticCharSheetTemplatesDto } from '~config/factoryDefaults';
import { getTestIOC } from '~config/ioc/TestIOC';
import { CharSheetTemplatesStore } from '~domains/charsheet-templates/CharSheetTemplatesStore';
import { toCharSheetTemplate } from '~domains/data.models';
import { CharSheetTemplatesGateway } from '~gateways/CharSheetTemplatesGateway';

describe('CharSheetTemplatesStore', () => {
  let container: Container;
  let gatewayMock: jest.Mocked<CharSheetTemplatesGateway>;

  beforeEach(() => {
    container = getTestIOC();

    // we mock dependencies of the class under test
    gatewayMock = {
      loadInitialData: jest.fn(async () =>
        getStaticCharSheetTemplatesDto().map(toCharSheetTemplate),
      ),
    };

    // here we bind to our mock dependency
    if (container.isBound(CharSheetTemplatesGateway)) {
      container.unbind(CharSheetTemplatesGateway);
    }
    container.bind(CharSheetTemplatesGateway).toConstantValue(gatewayMock);
  });

  it('should be bind in Singleton scope', () => {
    const store1 = container.get(CharSheetTemplatesStore);
    const store2 = container.get(CharSheetTemplatesStore);

    expect(store1).toBe(store2);
  });

  it('should start with an empty list of templates', () => {
    const store = container.get(CharSheetTemplatesStore);

    expect(store.templates).toEqual([]);
  });

  it('allow for loading the initial data from the gateway', async () => {
    const loadedData =
      getStaticCharSheetTemplatesDto().map(toCharSheetTemplate);

    const store = container.get(CharSheetTemplatesStore);
    await store.loadInitialData();

    expect(store.templates).toEqual(loadedData);
  });
});
