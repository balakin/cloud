import { GlobalStyles as GlobalThemeStyles } from '@mui/material';
import { FC } from 'react';

export const GlobalStyles: FC = () => {
  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
        'input::-ms-reveal, input::-ms-clear': {
          display: 'none',
        },
      }}
    />
  );
};
