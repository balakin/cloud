import { createContext, FC, PropsWithChildren, useContext } from 'react';

const UnitRoutesContext = createContext<unknown>(null);

export function useUnitRoutes<T>(): T {
  return useContext(UnitRoutesContext) as T;
}

export type UnitRoutesProviderProps = PropsWithChildren<{
  routes: unknown;
}>;

export const UnitRoutesProvider: FC<UnitRoutesProviderProps> = ({ routes, children }) => {
  return <UnitRoutesContext.Provider value={routes}>{children}</UnitRoutesContext.Provider>;
};
