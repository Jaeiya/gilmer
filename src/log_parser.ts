/*
  * 1. Read GIT log from file

  * 2. Map log file to Log Array with commit hash, header, subject, and message
  *   a. Commit hash is first 7 chars
  *   b. Action notation: "action(subject):" or "action:"
  *     1. If commit is not using Action notation, then extract first
  * .      word as the header.
  *     2. If subject does not exist, then set null
  *     3. Remove colon and toLowerCase() the action
  *   c. Only extract main message; ignore body text.
*/
import { readFileSync } from "fs";
import { pipe, toLower } from 'ramda';
import chalk from 'chalk';



export type LogEntry = [header: string, subject: string|null, message: string, commit: string];



const l = console.log;


export function getLogEntries(filePath: string) {
  const logFile = readFileSync(filePath, 'utf-8').trim();
  if (!isValidLogFile(logFile)) return [];
  return logFile.split('\n').map(toLogEntry);
}

export const _tddLogParser = {
  toLogEntry,
  getCommitFrom,
  getHeaderFrom,
  getMessageFrom,
};


function isValidLogFile(logFile: string) {
  const file = logFile.trim();
  if (!file) {
    l(`\n${chalk.red('Error: file is empty')}\n`);
    return false;
  }
  if (file.split(' ')[0].length > 7) {
    l(`\n${chalk.red('Error: invalid log file')}`);
    l(`\n${chalk.yellow("NOTE:")} Make sure you're creating the log with ${chalk.green('git log --oneline')}\n\n`);
    return false;
  }
  return true;
}

function toLogEntry(logLine: string) {
  return [
    getHeaderFrom(logLine),
    getSubjectFrom(logLine),
    getMessageFrom(logLine),
    getCommitFrom(logLine),
  ] as LogEntry;
}

function getHeaderFrom(logLine: string) {
  return pipe(
    getAction,
    stripColon,
    toLower
  )(logLine);
}

function getAction(logLine: string) {
  const action = getActionNotation(logLine);
  if (action.includes('(')) return action.split('(')[0];
  return action;
}

function getSubjectFrom(logLine: string) {
  const action = getActionNotation(logLine);
  if (action.includes('(')) {
    return action.split('(')[1].replace('):', '');
  }
  return null;
}

function getActionNotation(logLine: string) {
  return logLine.split(' ')[1];
}

function stripColon(str: string) {
  return str.replace(':', '');
}

function getCommitFrom(logLine: string) {
  return logLine.substring(0, 7);
}

function getMessageFrom(logLine: string) {
  const header = logLine.split(' ', 2)[1];
  return logLine.split(header, 2)[1].trim();
}




