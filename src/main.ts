#!/usr/bin/env node
import { gitLogToActionArray } from "./lib/log_parser";
import { createPrettyLog } from "./lib/pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { color as c } from "./lib/colors";
import { CLI } from "./lib/cli";
import { GIT } from "./lib/git";
import { ExecException } from "child_process";



CLI.processArgs();

GIT
  .init()
  .then(tryCreateDocPath)
  .then(GIT.log(checkForLogException))
  .then(gitLogToActionArray)
  .then(createPrettyLog(CLI.Args.getFilename()))
  .then(writePrettyLog)
;


function checkForLogException(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\nError Executing Command:\n'));
    console.log(c.y(err.message));
    process.exit(1);
  }
  return out;
}


function writePrettyLog(log: string) {
  writeFileSync(
    `./docs/${toFileNameWithDate(CLI.Args.getFilename())}.md`,
    log
  );
}

function tryCreateDocPath() {
  if (existsSync('./docs')) return;
  mkdirSync('./docs');
}


















