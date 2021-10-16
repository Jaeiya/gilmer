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


export type LogEntry = [header: string, subject: string|null, message: string, commit: string];


export function getLogEntries(filePath: string) {
  const logFile = readFileSync(filePath, 'utf-8').trim();
  return logFile.split('\n').map(toLogEntry);
}

export const _tddLogParser = {
  toLogEntry,
  getCommitFrom,
  getHeaderFrom,
  getMessageFrom,
};

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




