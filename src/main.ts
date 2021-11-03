
import { getCommmitActionListFrom } from "./action_parser";
import { getLogsMetadata } from "./log_parser";
import { getPrettyLog } from "./pretty_parser";
import { writeFileSync } from "fs";
import config from '../config.json';
import { pipe } from "ramda";


const title = process.argv[2] ?? 'untitled';


pipe(
  () => getLogsMetadata('../test.txt'),
  getCommmitActionListFrom,
  getPrettyLog(title),
  (prettyLog: string) => writeFileSync(`${config.saveTo}/md_test`, prettyLog)
)();














