import { color } from "./colors";
import { state } from "./state";



const [,,title,...flags] = process.argv;
const c = color;


export function handleCLIArgs() {
  if (title && title.includes('-')) {
    console.log(c.r('\n\nError:'), c.y('Invalid Title'));
    console.log(c.g('\nNOTE:', c.d('Flags must be typed after the Title\n\n')));
    process.exit(1);
  }
  state.cli.title = title ?? state.cli.title;
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
    console.log(c.r('\n\nError:'), `${c.y('Malformed Flag')} ${c.r('(')}${c.w(flag)}${c.r(')')} `);
    console.log(
      c.g('\nNOTE:',
      c.d('Set Flags using an equal sign. If the value has spaces, wrap it in quotes.')
    ));
    console.log(c.g('\nExample:'), c.w('-from=\'Aug 21, 2021\'\n\n'));
    process.exit(0);
  }
  return flag.split('=')[1];
}

function validateDate(date: string) {
  if ((new Date(date)).toString() == 'Invalid Date') {
    console.log(c.r('\n\nError:'), `${c.y('Invalid Date')} ${c.r('(')}${c.w(date)}${c.r(')')} `);
    console.log(
      c.g('\nNOTE:',
      c.d('Make sure you entered the date properly. If it contains spaces, wrap it in quotes.')
    ));
    console.log(c.g('\nExample:'), c.w('-from=\'Aug 21, 2021\'\n\n'));
    process.exit(0);
  }
  return date;
}



