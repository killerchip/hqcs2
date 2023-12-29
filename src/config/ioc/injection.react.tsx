import { useLocalSearchParams } from 'expo-router';
import { Container, interfaces } from 'inversify';
import { observer } from 'mobx-react-lite';
import {
  createContext,
  FunctionComponent,
  memo,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react';

/**
 * A provider that makes the Inversify container available to the rest of the app.
 */
type InjectionProviderProps = {
  container: Container;
  children: ReactNode;
};

export const InversifyContext = createContext<{ container: Container | null }>({
  container: null,
});

export const InjectionProvider = ({
  children,
  container,
}: InjectionProviderProps) => {
  return (
    <InversifyContext.Provider value={{ container }}>
      {children}
    </InversifyContext.Provider>
  );
};

/**
 * This function will create a context that will be used to inject dependencies into components.
 * It uses the InversifyContext to access the container.
 * It returns a HoC to wrap your Screen or Component with the provider.
 * It returns a hook to access the injected value.
 */
export function createInjectableContext<
  // The type of the injectable that will be served by the provider
  InjectableType,
  // The props of the wrapped component
  ChildrenProps = object,
>() {
  // The Context that will be used to provide the injectable
  const Context = createContext<InjectableType | null>(null);

  return {
    Context,
    // This hook can be used to access the current value of the Provider
    useHook() {
      const injectedValue = useContext(Context);
      if (!injectedValue) {
        throw new Error('Injected value from the provider was not provided');
      }
      return injectedValue;
    },
    // This is the HoC Generator that will wrap the component with the provider
    HoC<II extends InjectableType, CC extends ChildrenProps>(
      injectable: interfaces.ServiceIdentifier<II>,
    ) {
      // Component: The component that will be wrapped
      return (Component: FunctionComponent<PropsWithChildren<CC>>) => {
        // We memoize the component to avoid re-rendering it. Props will be picked up automatically.
        const MemoizedComponent = memo(Component);

        // The newly wrapped component
        return function WrappedComponent(props: PropsWithChildren<CC>) {
          const { container } = useContext(InversifyContext);
          const [injectedValue] = useState<II>(() =>
            container!.get(injectable),
          );

          return (
            <Context.Provider value={injectedValue}>
              <MemoizedComponent {...props} />
            </Context.Provider>
          );
        };
      };
    },
  };
}

// TODO: refactor: these two creator functions can share code

/**
 * Creates a context that will be used to create and Provide a screen presenter.
 * It uses the InversifyContext to access the container.
 * You must provide a factory function that will create the presenter.
 * The factory function can access the current params from the router
 */
export function createScreenPresenterContext<
  // The type of the injectable that will be served by the provider
  InjectableType,
  // The props of the wrapped component
  ChildrenProps = object,
  // The route params that expected to be used by the factory function to create the presenter
  RouteParams = object,
>(
  getInjectable: (params: RouteParams, container: Container) => InjectableType,
) {
  // The Context that will be used to provide the injectable
  const Context = createContext<InjectableType | null>(null);
  // TODO: add an effect to recreate the presenter when the params change
  // TODO: make sure that we don't instantiate unnecessarily

  return {
    Context,
    // This hook can be used to access the current value of the Provider
    useHook() {
      const injectedValue = useContext(Context);
      if (!injectedValue) {
        throw new Error('Injected value from the provider was not provided');
      }
      return injectedValue;
    },
    // This is the HoC Generator that will wrap the component with the provider
    HoC<
      II extends InjectableType,
      CC extends ChildrenProps,
      RP extends RouteParams,
    >() {
      // Component: The component that will be wrapped
      return (Component: FunctionComponent<PropsWithChildren<CC>>) => {
        // We memoize the component to avoid re-rendering it. Props will be picked up automatically.
        const MemoizedComponent = memo(Component);

        // The newly wrapped component
        return observer(function WrappedComponent(
          props: PropsWithChildren<CC>,
        ) {
          const { container } = useContext(InversifyContext);
          const params = useLocalSearchParams() as RP;

          // Here we invoke the provided factory function to create the presenter
          const [injectedValue] = useState<II>(
            () => getInjectable(params, container!) as II,
          );

          return (
            <Context.Provider value={injectedValue}>
              <MemoizedComponent {...props} />
            </Context.Provider>
          );
        });
      };
    },
  };
}
