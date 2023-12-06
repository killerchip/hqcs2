import { Container, interfaces } from 'inversify';
import {
  ComponentType,
  createContext,
  memo,
  PropsWithChildren,
  ReactNode,
  useContext,
} from 'react';

type Identifiers = Record<string, interfaces.ServiceIdentifier>;
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

export function withInjections<P = object>(identifiers: Identifiers) {
  return (Component: ComponentType<PropsWithChildren<P>>) => {
    return memo((props: PropsWithChildren<P>) => {
      const { container } = useContext(InversifyContext);
      if (!container) {
        throw new Error('Could not find container');
      }

      const finalProps: PropsWithChildren<P> = { ...props };
      for (const [key, value] of Object.entries(identifiers)) {
        finalProps[key as keyof PropsWithChildren<P>] = container.get(
          value,
        ) as any;
      }

      return <Component {...finalProps} />;
    });
  };
}
