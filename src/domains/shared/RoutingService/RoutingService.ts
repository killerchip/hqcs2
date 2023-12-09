import { router } from 'expo-router';
import { inject, injectable } from 'inversify';

import { Injectables } from '~config/ioc/injectables';

export type IRouter = {
  push: typeof router.push;
};

@injectable()
export class RoutingService implements IRouter {
  push;
  constructor(@inject(Injectables.Router) private router: IRouter) {
    this.push = this.router.push;
  }
}
