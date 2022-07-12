import { SvgIconTypeMap } from '@mui/material';
import { blue, green, grey, orange, red } from '@mui/material/colors';
// eslint-disable-next-line
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Dropbox, Folder, Git, Github, Nodejs } from 'mdi-material-ui';

type Pair = {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  regex: RegExp;
  color: string;
};

const folders: Array<Pair> = [
  { icon: Dropbox, regex: /^(?:Dropbox|\.dropbox\.cache)$/, color: blue[400] },
  { icon: Nodejs, regex: /^node_modules$/, color: green[400] },
  { icon: Git, regex: /\.git$/, color: red[400] },
  { icon: Github, regex: /\.github$/, color: grey[600] },
  { icon: Folder, regex: /.*/i, color: orange[200] },
];

export function getIcon(name: string) {
  for (const pair of folders) {
    if (name.match(pair.regex)) {
      return pair;
    }
  }

  return folders[folders.length - 1];
}
