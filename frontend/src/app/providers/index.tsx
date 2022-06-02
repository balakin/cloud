import { compose } from 'shared/lib/compose';
import { withThemeConfig } from './theme';

export const withProviders = compose(withThemeConfig);
