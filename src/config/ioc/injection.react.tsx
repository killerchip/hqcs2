import { Container, interfaces } from 'inversify';
import {
  ComponentType,
  createContext,
  memo,
  PropsWithChildren,
  ReactNode,
  useContext,
} from 'react';

/**
 * A provider that makes the Inversify container available to the rest of the app.
 */
type InjectionProviderProps = {
  container: Container;
  children: ReactNode;
};

const InversifyContext = createContext<{ container: Container | null }>({
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
 * A higher-order component that injects dependencies into the wrapped component.
 */
// An object param where we map props to the injection identifiers.
// E.g. passing { presenter: CharacterSheetsListScreenPresenter } will inject
// the CharacterSheetsListScreenPresenter into the "presenter" prop of the wrapped Component
type Identifiers = Record<string, interfaces.ServiceIdentifier>;

export function withInjections<
  // The injections that are passed in as props
  InjectedProps extends object = object,
  // The child component props
  ChildProps extends object = object,
>(identifiers: Identifiers) {
  return (
    Component: ComponentType<PropsWithChildren<ChildProps & InjectedProps>>,
  ) => {
    return memo((props: PropsWithChildren<ChildProps & InjectedProps>) => {
      const { container } = useContext(InversifyContext);
      if (!container) {
        throw new Error('Could not find container');
      }

      const finalProps: PropsWithChildren<ChildProps & InjectedProps> = {
        ...props,
      };
      for (const [key, value] of Object.entries(identifiers)) {
        finalProps[key as keyof PropsWithChildren<ChildProps & InjectedProps>] =
          container.get(value) as any;
      }

      return <Component {...finalProps} />;
    });
  };
}
