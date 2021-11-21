#!/usr/bin/env node
import { parseLogsAsActionList } from "./lib/action_parser";
import { getLogsMetadata } from "./lib/log_parser";
import { getPrettyLog } from "./lib/pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { pipe } from "ramda";
import { exec, ExecException } from "child_process";
import { dirname, basename } from "path";
import { color } from "./lib/colors";
import { state } from "./lib/state";
import { handleCLIArgs } from "./lib/cli_handler";



const c = color;

handleCLIArgs();

Promise.resolve()
  .then(execAsync('git log --max-count=1', validateGitCommand))
  .then(execAsync('git config --get remote.origin.url', setRemoteRepoURL))
  .then(tryCreateDocPath)
  .then(execAsync(`git log ${trySinceFlag()} --pretty="format:%h|%ci|%s|%b^@^"`, writePrettyLogs))
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
    console.log(c.r('\n\nError: ') + c.y('Missing GIT Command or Commits') + '\n');
    process.exit(1);
  }
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\n\nWARNING: ') + c.y('Local Respository Only'));
    console.log(
      c.g('\nNOTE: ') +
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
    console.log(c.y('\nError Executing Command:\n'));
    console.log(c.r(err.message));
    return;
  }
  pipe(
    () => getLogsMetadata(out),
    parseLogsAsActionList,
    getPrettyLog(state.cli.title),
    (prettyLog: string) => writeFileSync("./docs/md_test.md", prettyLog)
  )();
}

function tryCreateDocPath() {
  if (existsSync('./docs')) return;
  mkdirSync('./docs');
}

function trySinceFlag() {
  return state.cli.date ? `--since="${state.cli.date}"` : '';
}


















