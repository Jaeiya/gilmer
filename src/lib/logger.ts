import chalk from 'chalk';



type ConsoleColor = 'red'|'green'|'greenBright'|'yellow'|'gray'|'yellowBright'|'white';



const state = {
  /** Enable or Disable coloring log lines. */
  colorLogs: true,
  /** Enable or Disable logging. */
  enabled: true,
  /** Set the maximum length that a tag can be. */
  maxTagLength: 11,
  /** Number of lines to space between logs. */
  lineSpacing: 0,
};



export namespace Logger {

  export const enableLogging   = (isEnabled: boolean) => state.enabled   = isEnabled;
  export const enableColors    = (isEnabled: boolean) => state.colorLogs = isEnabled;

  export const setMaxTagLength = (len: number) => {
    if (len <= 0) throw Error('Max Tag Length => Too Small');
    state.maxTagLength = len;
  };

  export const setLineSpacing = (spacing: number) => {
    if (spacing <= 0) throw Error('Line Spacing => Too Small');
    state.lineSpacing = spacing;
  };

  export const console_colors = {
    rd: tryColor('red'),
    gn: tryColor('green'),
    gnb: tryColor('greenBright'),
    yw: tryColor('yellow'),
    ywb: tryColor('yellowBright'),
    gy: tryColor('gray'),
    w: tryColor('white'),
  };

  /** Info Log */
  export const lInfo = (tag: string, ...args: string[]) => log(tag, 'gn', ...args);
  /** Action Log */
  export const lWarn = (tag: string, ...args: string[]) => log(tag, 'yw', ...args);
  /** Warn Log */
  export const lErr = (tag: string, ...args: string[]) => log(tag, 'rd', ...args);
}


const cc = Logger.console_colors;

/** Conditionally colors text using `state.logger` */
function tryColor(color: ConsoleColor) {
  return (str: string) => state.colorLogs ? chalk[color](str) : str;
}

function log(tagName: string, color: keyof typeof cc, ...args: string[]) {
  if (!state.enabled) return;
  const colorFn = cc[color];
  const spacing = state.lineSpacing ? '\n'.repeat(state.lineSpacing) : '';
  console.log(colorFn(toTag(tagName)), ...args, spacing);
}

function toTag(tagName: string) {
  const specialCharLength = 3; // [, ], :
  const tagLength = tagName.length + specialCharLength;
  const offsetLength = state.maxTagLength - tagLength;
  return `${' '.repeat(offsetLength)}[${tagName.toUpperCase()}]:`;
}


