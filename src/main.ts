#!/usr/bin/env node
import { parseLogsAsActionList } from "./lib/action_parser";
import { getLogsMetadata } from "./lib/log_parser";
import { getPrettyLog } from "./lib/pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { pipe } from "ramda";
import { exec, ExecException } from "child_process";
import { dirname, basename } from "path";
import { color as c } from "./lib/colors";
import { state } from "./lib/state";
import { toFileNameWithDate } from "./lib/utilities";
import { CLI } from "./lib/cli_handler";



CLI.handleArgs();

Promise.resolve()
  .then(execAsync('git log --max-count=1', validateGitCommand))
  .then(execAsync('git config --get remote.origin.url', setRemoteRepoURL))
  .then(tryCreateDocPath)
  .then(execAsync(`git log ${trySinceFlag()} ${tryUntilFlag()} --pretty="format:%h|%ci|%s|%b^@^"`, writePrettyLogs))
;



function execAsync(command: string, callback: (err: ExecException|null, out: string) => void) {
  return () => {
    return new Promise((rs) => {
      exec(command, (err, out) => {
        callback(err, out);
        rs(void(0));
      });
    });
  };
}

function validateGitCommand(err: ExecException|null) {
  if (err) {
    console.log(c.r('\n\n ERROR: ') + c.y('Missing GIT Command or Commits') + '\n');
    process.exit(1);
  }
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\n\n WARNING: ') + c.y('Local Respository Only'));
    console.log(
      c.g('\n    NOTE: ') +
      c.d('Commit hashes will ') +
      c.r('not ') +
      c.d('be ') +
      c.w('clickable\n\n')
    );
    return;
  }
  state.repoURL = `${dirname(out)}/${basename(out.trim(), '.git')}`;
}

function writePrettyLogs(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\nError Executing Command:\n'));
    console.log(c.y(err.message));
    return;
  }
  pipe(
    () => getLogsMetadata(out),
    parseLogsAsActionList,
    getPrettyLog(state.cli.filename),
    (prettyLog: string) =>
      writeFileSync(
        `./docs/${toFileNameWithDate(state.cli.filename)}.md`,
        prettyLog
      )
  )();
}

function tryCreateDocPath() {
  if (existsSync('./docs')) return;
  mkdirSync('./docs');
}

function trySinceFlag() {
  return state.cli.dateSince ? `--since="${state.cli.dateSince}"` : '';
}

function tryUntilFlag() {
  return state.cli.dateUntil ? `--until="${state.cli.dateUntil}"` : '';
}


















