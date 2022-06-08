import { compose } from 'shared/lib/compose';
import { withThemeConfig } from './theme';
import { withReactQuery } from './with-react-query';
import { withReactRouter } from './with-react-router';
import { withViewer } from './with-viewer';

export const withProviders = compose(withThemeConfig, withReactQuery, withReactRouter, withViewer);
