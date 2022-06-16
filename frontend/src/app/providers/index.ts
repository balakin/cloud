import { compose } from 'shared/lib';
import { withThemeConfig } from './theme';
import { withNotistack } from './with-notistack';
import { withReactQuery } from './with-react-query';
import { withReactRouter } from './with-react-router';
import { withViewer } from './with-viewer';

export const withProviders = compose(withThemeConfig, withNotistack, withReactQuery, withReactRouter, withViewer);
