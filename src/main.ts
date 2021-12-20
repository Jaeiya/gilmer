#!/usr/bin/env node
import { gitLogToActionArray } from "./lib/log_parser";
import { createPrettyLog } from "./lib/pretty_parser";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { CLI } from "./lib/cli";
import { GIT } from "./lib/git";
import { ExecException } from "child_process";
import { resolve, sep } from "path";
import { Logger } from "./lib/logger";


const docsPath = './docs';

// Setup Logger
Logger.setMaxTagLength(10);
// Logger.setLineSpacing(1);
const log  = Logger.lInfo;
const logWarn = Logger.lWarn;
const logError = Logger.lErr;
const cc   = Logger.console_colors;

// Add space to beginning
console.log('');

CLI.processArgs();
GIT
  .init()
  .then(printRepoStatus)
  .then(tryCreateDocPath)
  .then(printDocPath)
  .then(GIT.log(checkForLogException))
  .then(printLoadedLogLines)
  .then(gitLogToActionArray)
  .then(createPrettyLog(CLI.Args.getFilename()))
  .then(writePrettyLog)
  .then((path) => {
    log('done', cc.gy(truncatePath(path)), cc.ywb('written'));
    console.log(''); // Add trailing new line
  })
;


function printRepoStatus(status: {hasRemote: boolean, branch: string|null}) {
  log('repo', cc.w(`Found current branch: ${cc.gnb(status.branch!)}`));
  if (!status.hasRemote) {
    logWarn('repo',
      cc.w('Remote origin:'), cc.ywb('not found'),
      cc.w('\nHashes will'), cc.ywb('not'), cc.w('be clickable in the generated log!')
    );
  }
}


function printDocPath(result: {path: string, status: string}) {
  const {path,status} = result;
  const fullPath = truncatePath(path);
  const statusText = status == 'created' ? cc.ywb(status) : cc.gnb(status);
  log('info', cc.gy(`${fullPath}`), statusText);
}


function printLoadedLogLines(gitLog: string) {
  log('info',
    cc.w('Logs:'), cc.gnb(gitLog.split('\n').length.toString()),
    cc.gy('|>'), cc.ywb('processing...')
  );
  return gitLog;
}


function checkForLogException(err: ExecException|null, out: string) {
  if (err) {
    logError('error', cc.yw('Error Executing Command:'), cc.rdb('FATAL'));
    logError('info', cc.ywb(err.message));
    process.exit(1);
  }
  return out;
}


function writePrettyLog(log: string) {
  const filename         = CLI.Args.getFilename();
  const date             = new Date().toLocaleDateString().replace(/\//g, '_');
  const fileNameWithDate = filename.replace(/ /g, '') + `.${date}`;
  const filePath         = resolve(`./docs/${fileNameWithDate}.md`);

  writeFileSync(filePath, log);
  return filePath;
}


function tryCreateDocPath() {
  const path = resolve(docsPath);
  const result = { path, status: '' };
  if (existsSync(path)) result.status = 'already exists';
  else {
    mkdirSync(path);
    result.status = 'created';
  }
  return result;
}


function truncatePath(path: string): string {
  const pathParts = path.split(sep);
  if (pathParts.length == 3)
    return '..' + sep + pathParts.join(sep)
  ;
  pathParts.shift();
  return truncatePath(pathParts.join(sep));
}




















