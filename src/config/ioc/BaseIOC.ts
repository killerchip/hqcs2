import { Container, interfaces } from 'inversify';

import { Injectables } from '~config/ioc/injectables';
import { CharSheetTemplatesStore } from '~domains/charsheet-templates/CharSheetTemplatesStore';
import { CharSheetScreenPresenter } from '~domains/charsheets/CharSheetScreen/CharSheetScreenPresenter';
import { CharSheetsStore } from '~domains/charsheets/CharSheetsStore';
import { CharSheet } from '~domains/data.models';
import { AlertingService } from '~domains/shared/AlertingService/AlertingService';
import { RoutingService } from '~domains/shared/RoutingService/RoutingService';
import { CharSheetsGateway } from '~gateways/CharSheetsGateway';

export class BaseIOC {
  container;

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Transient',
    });
  }

  buildBaseTemplate = () => {
    // Here we bind classes and services in Singleton scope.
    this.container.bind(CharSheetsGateway).toSelf().inSingletonScope();
    this.container.bind(RoutingService).toSelf().inSingletonScope();
    this.container.bind(AlertingService).toSelf().inSingletonScope();
    this.container.bind(CharSheetsStore).toSelf().inSingletonScope();
    this.container.bind(CharSheetTemplatesStore).toSelf().inSingletonScope();

    bindFactory<CharSheetScreenPresenter, CharSheet['id']>({
      container: this.container,
      injectable: CharSheetScreenPresenter,
      factoryIdentifier: Injectables.CharSheetScreenPresenterFactory,
      argumentsIdentifier: Injectables.CharSheetScreenPresenterFactoryArgs,
    });

    return this.container;
  };
}

function bindFactory<T, A>({
  container,
  injectable,
  factoryIdentifier,
  argumentsIdentifier,
}: {
  container: Container;
  injectable: interfaces.ServiceIdentifier<T>;
  factoryIdentifier: symbol;
  argumentsIdentifier: symbol;
}) {
  container
    .bind<interfaces.Factory<T>>(factoryIdentifier)
    .toFactory<T, [A]>((context: interfaces.Context) => {
      return (args: A) => {
        context.container.bind(argumentsIdentifier).toDynamicValue(() => args);
        const result = context.container.get<T>(injectable);
        context.container.unbind(argumentsIdentifier);

        return result;
      };
    });
}
