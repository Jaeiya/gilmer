import { color } from "./colors";



const [,,fileName,...flags] = process.argv;
const c = color;
const cliState = {
  filename: '',
  verbose: false as boolean,
  dateSince: '' as string|null,
  dateUntil: '' as string|null,
};


export namespace CLI {

  export namespace Flags {
    export const getFilename  = () => cliState.filename;
    export const getVerbose   = () => cliState.verbose;
    export const getDateSince = () => cliState.dateSince;
    export const getDateUntil = () => cliState.dateUntil;
  }


  export function handleArgs() {
    if (fileName && fileName.includes('-')) {
      console.log(c.r('\n\n ERROR:'), c.y('Invalid File Name'));
      console.log(c.g('\n  NOTE:', c.d('Flags must be typed after the File Name\n\n')));
      process.exit(1);
    }
    cliState.filename  = fileName ?? cliState.filename;
    cliState.verbose   = flags.includes('-v') || flags.includes('-verbose');
    cliState.dateSince = getDateFlag(flags, ['-from', '-since']);
    cliState.dateUntil = getDateFlag(flags, ['-to',   '-until']);
  }
}


function getDateFlag(flags: string[], dateFlags: string[]) {
  const flagValue = flags.find(flag => !!dateFlags.find(dflag => flag.includes(dflag)));
  const date = (flagValue && parseFlagValue(flagValue)) || null;
  return (date && validateDate(date)) || null;
}

function parseFlagValue(flag: string) {
  if (!flag.includes('=')) {
    console.log(c.r('\n\n   ERROR:'), `${c.y('Malformed Flag')} ${c.r('(')}${c.w(flag)}${c.r(')')}`);
    console.log(
      c.g('\n    NOTE:',
      c.d(
`Flags are set using an equals sign.
          If a value has spaces, wrap it in quotes.`)
    ));
    console.log(c.g('\n EXAMPLE:'), `${c.y('-')}from${c.y(`='`)}Aug 21, 2021${c.y(`'`)}\n\n`);
    process.exit(0);
  }
  return flag.split('=')[1];
}

function validateDate(date: string) {
  if ((new Date(date)).toString() == 'Invalid Date') {
    console.log(c.r('\n\n   ERROR:'), `${c.y('Invalid Date')} ${c.r('(')}${c.w(date)}${c.r(')')} `);
    console.log(
      c.g('\n    NOTE:',
      c.d(
`Make sure you entered the date properly.
          If it contains spaces, wrap it in quotes.`)
    ));
    console.log(c.g('\n EXAMPLE:'), `${c.y('-')}from${c.y(`='`)}Aug 21, 2021${c.y(`'`)}\n\n`);
    process.exit(0);
  }
  return date;
}



