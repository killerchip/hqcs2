import { IRouter } from '~domains/shared/RoutingService/RoutingService';

export class MockRouter implements IRouter {
  push = jest.fn();
}

export function getMockRouter() {
  return new MockRouter();
}
