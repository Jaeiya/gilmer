import { color } from "./colors";
import { state } from "./state";


type CLIArgs = [
  nodePath: string,
  appPath: string,
  title: string,
  flag: string,
]


const [,,title,flag] = process.argv as CLIArgs;
const c = color;


export function handleCLIArgs() {
  if (title && title.includes('-')) {
    console.log(c.r('\n\nError:'), c.y('Invalid Title'));
    console.log(c.g('\nNOTE:', c.d('Flags must be typed after the Title\n\n')));
    process.exit(1);
  }
  state.title = title ?? state.title;
  state.verbose = !!flag && (flag == '-v' || flag == '-verbose');
}



