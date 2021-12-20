import chalk from 'chalk';



type ConsoleColor =
  'red'|'redBright'|
  'green'|'greenBright'|
  'yellow'|'yellowBright'|
  'gray'|
  'white'|'whiteBright';



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

  export const enableLogging = (isEnabled: boolean) => state.enabled   = isEnabled;
  export const enableColors  = (isEnabled: boolean) => state.colorLogs = isEnabled;

  export const setMaxTagLength = (len: number) => {
    if (len <= 0) throw Error('Max Tag Length => Too Small');
    state.maxTagLength = len;
  };

  export const setLineSpacing = (spacing: number) => {
    if (spacing <= 0) throw Error('Line Spacing => Too Small');
    state.lineSpacing = spacing;
  };

  export const console_colors = {
    rd  : tryColor('red'),
    rdb : tryColor('redBright'),
    gn  : tryColor('green'),
    gnb : tryColor('greenBright'),
    yw  : tryColor('yellow'),
    ywb : tryColor('yellowBright'),
    gy  : tryColor('gray'),
    w   : tryColor('white'),
    wb  : tryColor('whiteBright'),
  };

  /** Info Log */
  export const lInfo = (tag: string, ...args: string[]) => log(tag, 'gn', ...args);
  /** Warn Log */
  export const lWarn = (tag: string, ...args: string[]) => log(tag, 'yw', ...args);
  /** Error Log */
  export const lErr = (tag: string, ...args: string[]) => log(tag, 'rd', ...args);
}


const cc = Logger.console_colors;

/** Conditionally colors text using `state.colorLogs` */
function tryColor(color: ConsoleColor) {
  return (str: string) => state.colorLogs ? chalk[color](str) : str;
}


function log(tagName: string, color: keyof typeof cc, ...text: string[]) {
  if (!state.enabled) return;
  const colorFn = cc[color];
  const msg = toTag(tagName) + indentNewLines(text.join(' ')).trim();
  console.log(colorFn(msg), spaceLines());
}


function toTag(tagName: string) {
  const specialCharLength = 3; // [, ], :
  const tagLength         = tagName.length + specialCharLength;
  const offsetLength      = state.maxTagLength - tagLength;

  return `${' '.repeat(offsetLength)}[${tagName.toUpperCase()}]: `;
}


function indentNewLines(str: string, padding = 1) {
  return (
    str.split('\n').map(indentLine).join(`\n${' '.repeat(padding)}`)
  );
}


function indentLine(str: string) {
  return `${' '.repeat(state.maxTagLength)}${str}`;
}


function spaceLines() {
  return state.lineSpacing ? '\n'.repeat(state.lineSpacing) : '';
}


