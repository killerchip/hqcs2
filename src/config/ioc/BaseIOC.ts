import { Container } from 'inversify';

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

    return this.container;
  };
}
