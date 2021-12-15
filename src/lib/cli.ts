import { color as c } from "./colors";



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

    if (fileName && fileName.includes('-')) {
      console.log(c.r('\n\n ERROR:'), c.y('Invalid File Name'));
      console.log(c.g('\n  NOTE:'),    c.d('Flags must be typed after the File Name\n\n'));
      process.exit(1);
    }
    state.filename  = fileName ?? state.filename;
    state.verbose   = args.includes('-v') || args.includes('-verbose');
    state.dateSince = getDateArg(args, ['-from', '-since']);
    state.dateUntil = getDateArg(args, ['-to',   '-until']);
  }

}



function getDateArg(args: string[], dateArgs: string[]) {
  const dateArg = args.find(f => !!dateArgs.find(df => f.includes(df)));
  const argValue = (dateArg && getArgValue(dateArg)) || null;
  return (argValue && getValidDate(argValue)) || null;
}

function getArgValue(arg: string) {
  if (!arg.includes('=')) {
    logInvalidFlag(arg);
    process.exit(0);
  }
  return arg.split('=')[1];
}

function getValidDate(date: string) {
  if ((new Date(date)).toString() == 'Invalid Date') {
    logInvalidDate(date);
    process.exit(0);
  }
  return date;
}

function logInvalidFlag(flag: string) {
  console.log(c.r('\n\n   ERROR:'), `${c.y('Malformed Flag')} ${c.r('(')}${c.w(flag)}${c.r(')')}`);
  console.log(
    c.g('\n    NOTE:'),
    c.d(
`Flags are set using an equals sign.
        If a value has spaces, wrap it in quotes.`)
  );
  console.log(c.g('\n EXAMPLE:'), `${c.y('-')}from${c.y(`='`)}Aug 21, 2021${c.y(`'`)}\n\n`);
}

function logInvalidDate(date: string) {
  console.log(c.r('\n\n   ERROR:'), `${c.y('Invalid Date')} ${c.r('(')}${c.w(date)}${c.r(')')} `);
  console.log(
    c.g('\n    NOTE:',
    c.d(
`Make sure you entered the date properly.
        If it contains spaces, wrap it in quotes.`)
  ));
  console.log(c.g('\n EXAMPLE:'), `${c.y('-')}from${c.y(`='`)}Aug 21, 2021${c.y(`'`)}\n\n`);
}



