import { Logger } from "./logger";



const cc = Logger.console_colors;
const log = Logger.lInfo;
const logError = Logger.lErr;
const logWarn  = Logger.lWarn;


export namespace CLI {

  const state = {
    filename  : 'Git Log',
    verbose   : false as boolean,
    dateSince : null  as string|null,
    dateUntil : null  as string|null,
  };

  export namespace Args {
    /** The filename to use when a log is saved. */
    export const getFilename  = () => state.filename;
    /** Boolean to decide if the body of a commit message is visible */
    export const getVerbose   = () => state.verbose;
    /** Date String that will be used to lookup logs **since** */
    export const getDateSince = () => state.dateSince;
    /** Date String that will be used to lookup logs **until** */
    export const getDateUntil = () => state.dateUntil;
  }

  export function processArgs() {
    const [,,fileName,...args] = process.argv;

    validateArgOrder(fileName);
    validateFileName(fileName);

    state.filename  = fileName ?? state.filename;
    state.verbose   = args.includes('-v') || args.includes('-verbose');
    state.dateSince = getDateArg(args, ['-from', '-since']);
    state.dateUntil = getDateArg(args, ['-to',   '-until']);
  }
}


function validateArgOrder(filename: string|undefined) {
  if (filename && filename[0] == '-') {
    logError('error', cc.ywb('Invalid Argument Order'));
    logWarn('info', cc.w('Flags must be typed'), cc.ywb('after'), cc.w('the'), cc.yw('file name'));
    log('usage', cc.w('gilmer <filename> [<args>]'));
    process.exit(1);
  }
}

function validateFileName(filename: string|undefined) {
  if (filename && !filename.match(/^[a-zA-Z0-9 ]+$/g)) {
    logError('error', cc.ywb('Invalid File Name'));
    logWarn('info',
      cc.w('File names can only contain:'),
      cc.yw('spaces, a-z, A-Z, and 0-9')
    );
    process.exit(1);
  }
}


function getDateArg(args: string[], dateArgs: string[]) {
  if (!args.length) return null;
  const dateArg = args.find(f => !!dateArgs.find(df => f.includes(df)));
  const argValue = (dateArg && getArgValue(dateArg)) || null;
  return (argValue && getValidDate(dateArg!.split('=')[0], argValue)) || null;
}

function getArgValue(arg: string) {
  if (!arg.includes('=')) {
    logInvalidArg(arg);
    process.exit(0);
  }
  return arg.split('=')[1];
}

function getValidDate(dateArg: string, date: string) {
  if ((new Date(date)).toString() == 'Invalid Date') {
    logInvalidDate(dateArg, date);
    process.exit(0);
  }
  return date;
}

function logInvalidArg(arg: string) {
  logError('error', cc.yw('Malformed Argument'), cc.rd(`(${cc.wb(arg)})`));
  logWarn('info',
    cc.w('Args are assigned a value using an equals sign.'),
    cc.w('\nIf a value has spaces, wrap it in quotes.')
  );
  log('usage', cc.w(`gilmer <filename> ${arg}=<value>`));
}

function logInvalidDate(dateArg: string, date: string) {
  logError('error', cc.yw('Invalid Date'), cc.rd(`(${cc.wb(date)})`));
  logWarn('info',
    cc.w('Make sure you entered a date compatible with the JavaScript Date Object.'),
    cc.w('\nIf it contains spaces, wrap it in quotes.')
  );
  log('usage', cc.w(`gilmer <filename> [-${dateArg}=<value> or -${dateArg}='<value>']`));
}



