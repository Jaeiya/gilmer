#!/usr/bin/env node
import { parseLogsAsActionList } from "./lib/action_parser";
import { getLogsMetadata } from "./lib/log_parser";
import { getPrettyLog } from "./lib/pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { pipe } from "ramda";
import { ExecException } from "child_process";
import { color as c } from "./lib/colors";
import { toFileNameWithDate } from "./lib/utilities";
import { CLI } from "./lib/cli";
import { GIT } from "./lib/git";



CLI.processArgs();
GIT
  .init()
  .then(tryCreateDocPath)
  .then(GIT.log(writePrettyLogs))
;


function writePrettyLogs(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\nError Executing Command:\n'));
    console.log(c.y(err.message));
    return;
  }
  pipe(
    () => getLogsMetadata(out),
    parseLogsAsActionList,
    getPrettyLog(CLI.Args.getFilename()),
    (prettyLog: string) =>
      writeFileSync(
        `./docs/${toFileNameWithDate(CLI.Args.getFilename())}.md`,
        prettyLog
      )
  )();
}

function tryCreateDocPath() {
  if (existsSync('./docs')) return;
  mkdirSync('./docs');
}


















