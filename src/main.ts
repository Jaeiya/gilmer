#!/usr/bin/env node
import { parseLogsAsActionList } from "./action_parser";
import { getLogsMetadata } from "./log_parser";
import { getPrettyLog } from "./pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { pipe } from "ramda";
import { exec, ExecException } from "child_process";
import chalk from "chalk";
import { dirname, basename } from "path";


const title = process.argv[2] ?? 'untitled';

const yellow = chalk.yellow;
const red = chalk.redBright;
const green = chalk.greenBright;
const white = chalk.white;
const bWhite = chalk.whiteBright;



const config = {
  remoteURL: null as null|string,
};


Promise.resolve()
  .then(execAsync('git log --max-count=1', validateGitCommand))
  .then(execAsync('git config --get remote.origin.url', setRemoteRepoURL))
  .then(tryCreateDocPath)
  .then(execAsync('git log --pretty="format:%h|%ci|%s|%b^@^', writePrettyLogs))
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
    console.log(red('\n\nError: ') + yellow('Missing GIT Command or Commits') + '\n');
    process.exit(1);
  }
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) {
    console.log(red('\n\nWARNING: ') + yellow('Local Respository Only'));
    console.log(
      green('\nNOTE: ') +
      white('Commit hashes will ') +
      red('not ') +
      white('be ') +
      bWhite('clickable\n\n')
    );
    return;
  }
  config.remoteURL = `${dirname(out)}/${basename(out.trim(), '.git')}`;
}

function writePrettyLogs(err: ExecException|null, out: string) {
  if (err) {
    console.log(chalk.yellow('\nError Executing Command:\n'));
    console.log(chalk.red(err.message));
    return;
  }
  pipe(
    () => getLogsMetadata(out),
    parseLogsAsActionList,
    getPrettyLog(title, config.remoteURL),
    (prettyLog: string) => writeFileSync("./docs/md_test.md", prettyLog)
  )();
}

function tryCreateDocPath() {
  if (existsSync('./docs')) return;
  mkdirSync('./docs');
}


















