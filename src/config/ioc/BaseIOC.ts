import { Container } from 'inversify';

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
    this.container.bind(CharSheetsGateway).toSelf().inSingletonScope();
    this.container.bind(RoutingService).toSelf().inSingletonScope();

    // Add your singleton bindings here
    return this.container;
  };
}
