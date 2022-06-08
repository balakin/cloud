import { createContext } from 'react';
import { User } from 'shared/api';

export type ViewerContextValue = {
  viewer: User | null;
  error: unknown;
  isLoading: boolean;
  isError: boolean;
};

export const ViewerContext = createContext<ViewerContextValue | null>(null);
