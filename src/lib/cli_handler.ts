import { color } from "./colors";
import { state } from "./state";



const [,,fileName,...flags] = process.argv;
const c = color;


export function handleCLIArgs() {
  if (fileName && fileName.includes('-')) {
    console.log(c.r('\n\n ERROR:'), c.y('Invalid File Name'));
    console.log(c.g('\n  NOTE:', c.d('Flags must be typed after the File Name\n\n')));
    process.exit(1);
  }
  state.cli.filename = fileName ?? state.cli.filename;
  state.cli.verbose = flags.includes('-v') || flags.includes('-verbose');
  state.cli.date = getDateFlag(flags);
}


function getDateFlag(flags: string[]) {
  const dateFlag =
    flags.find(v =>
      v.includes('-from') ||
      v.includes('-since') ||
      v.includes('-date')
    )
  ;
  const date = (dateFlag && getFlagValue(dateFlag)) || null;
  return (date && validateDate(date)) || null;
}

function getFlagValue(flag: string) {
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



