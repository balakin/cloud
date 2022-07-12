import { SvgIconTypeMap } from '@mui/material';
import { blue, cyan, green, grey, orange, purple, red, yellow } from '@mui/material/colors';
// eslint-disable-next-line
import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Angular,
  Arch,
  Bash,
  CodeJson,
  Cordova,
  DatabaseOutline,
  Docker,
  Eslint,
  FileExcel,
  FileImage,
  FileOutline,
  FilePowerpoint,
  FileWord,
  InformationOutline,
  LanguageCsharp,
  LanguageCss3,
  LanguageHtml5,
  LanguageJava,
  LanguageJavascript,
  LanguageTypescript,
  License,
  MicrosoftWindows,
  Music,
  Text,
  Video,
  Webpack,
} from 'mdi-material-ui';

type Pair = {
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  regex: RegExp;
  color: string;
};

const files: Array<Pair> = [
  { icon: Text, regex: /.txt$/i, color: grey[400] },
  { icon: Angular, regex: /^angular[^.]*\.js$/i, color: red[400] },
  { icon: Arch, regex: /^\.install$/, color: purple[700] },
  { icon: Arch, regex: /^\.SRCINFO$/, color: red[500] },
  { icon: Arch, regex: /^pacman\.conf$/, color: yellow[700] },
  { icon: Arch, regex: /^pamac\.conf$/, color: yellow[300] },
  { icon: Arch, regex: /^PKGBUILD$/, color: cyan[700] },
  { icon: Arch, regex: /yaourtrc$/i, color: yellow[300] },
  { icon: Cordova, regex: /^cordova(?:[^.]*\.|-(?:\d\.)+)js$/i, color: blue[300] },
  { icon: DatabaseOutline, regex: /^METADATA\.pb$/, color: red[500] },
  {
    icon: DatabaseOutline,
    regex: /\.git[/\\](?:.*[/\\])?(?:HEAD|ORIG_HEAD|packed-refs|logs[/\\](?:.+[/\\])?[^/\\]+)$/,
    color: red[500],
  },
  {
    icon: Docker,
    regex: /^(?:Dockerfile(\.\w+$|)|docker-compose)|\.docker(?:file|ignore)$/i,
    color: blue[700],
  },
  { icon: Eslint, regex: /\.eslint(?:cache|ignore)$/i, color: purple[700] },
  { icon: Eslint, regex: /\.eslintrc(?:\.(?:js|json|ya?ml))?$/i, color: purple[300] },
  { icon: LanguageHtml5, regex: /\.html$/i, color: orange[500] },
  { icon: LanguageJavascript, regex: /\.js$/i, color: yellow[600] },
  { icon: LanguageTypescript, regex: /\.js$/i, color: blue[500] },
  { icon: Webpack, regex: /webpack\.config\.|^webpackfile\.js$/i, color: blue[500] },
  { icon: CodeJson, regex: /\.json$/i, color: yellow[600] },
  { icon: InformationOutline, regex: /\.md$/i, color: blue[300] },
  { icon: LanguageCss3, regex: /\.css$/i, color: blue[500] },
  { icon: FileImage, regex: /\.a?png$|\.svgz$/i, color: orange[500] },
  { icon: FileImage, regex: /\.gif$|\.ora$|\.sgi$/i, color: yellow[600] },
  { icon: FileImage, regex: /\.jpe?g$/i, color: green[500] },
  { icon: FileImage, regex: /\.ico$/i, color: blue[500] },
  { icon: FileImage, regex: /\.webp$|\.iff$|\.lbm$|\.liff$|\.nrrd$|\.pcx$|\.bmp$|\.vsdx?$/i, color: blue[700] },
  { icon: LanguageJava, regex: /\.java$/i, color: orange[500] },
  { icon: FilePowerpoint, regex: /\.pps$|\.ppsx$|\.ppt$|\.pptx|\.potm$|\.mpp$/i, color: red[500] },
  { icon: FileWord, regex: /\.doc$|\.docx$|\.docxml$|\.dotm$|\.dotx$/i, color: blue[500] },
  { icon: FileExcel, regex: /\.xls$|\.xlsx$|\.xlsm$|\.xlsb$|\.xlt$/i, color: green[500] },
  { icon: License, regex: /^LICENSE$/, color: yellow[600] },
  { icon: Music, regex: /\.mp3$/, color: purple[500] },
  { icon: LanguageCsharp, regex: /\.cs$/, color: blue[500] },
  { icon: Video, regex: /\.mp4$/, color: blue[500] },
  { icon: MicrosoftWindows, regex: /\.cmd$|\.exe$/, color: blue[500] },
  { icon: Bash, regex: /\.sh$/, color: blue[500] },
  { icon: FileOutline, regex: /.*/i, color: '' },
];

export function getIcon(fileName: string) {
  for (const pair of files) {
    if (fileName.match(pair.regex)) {
      return pair;
    }
  }

  return files[files.length - 1];
}
