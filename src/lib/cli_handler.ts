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
}



