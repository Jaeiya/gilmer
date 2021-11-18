#!/usr/bin/env node
import { parseLogsAsActionList } from "./action_parser";
import { getLogsMetadata } from "./log_parser";
import { getPrettyLog } from "./pretty_parser";
import { writeFileSync } from "fs";
import config from '../config.json';
import { pipe } from "ramda";
import { exec } from "child_process";
import chalk from "chalk";


const title = process.argv[2] ?? 'untitled';

//git log --pretty="format:%h|%s|%b^@^"
exec('git log --pretty="format:%h|%s|%b^@^', (err, stdout) => {
  if (err) {
    console.log(chalk.yellow('\nError Executing Command:\n'));
    console.log(chalk.red(err.message));
    return;
  }
  pipe(
    () => getLogsMetadata(stdout),
    getPrettyLog(title),
    (prettyLog: string) => writeFileSync(`${config.saveTo}/md_test.md`, prettyLog)
    parseLogsAsActionList,
  )();
});














