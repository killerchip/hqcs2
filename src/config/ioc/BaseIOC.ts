import { Container } from 'inversify';

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
    this.container
      .bind(CharSheetsGateway)
      .to(CharSheetsGateway)
      .inSingletonScope();

    // Add your singleton bindings here
    return this.container;
  };
}
