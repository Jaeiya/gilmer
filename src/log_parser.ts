/*
  * 1. Read GIT log from file

  * 2. Map log file to Log Array with commit hash, header, and message
  *   a. Commit hash is first 7 chars
  *   b. Header is in format: "header(subject):"
  *     1. If commit is headerless, then we extract the first word
  *        as the header.
  *     2. Apply special syntax if subject exist: "header/subject"
  *     3. Remove colon
  *   c. Only extract main message; ignore body text.
*/
import { readFileSync } from "fs";


type LogEntry = [hash: string, header: string, message: string];



export function getLogEntries(filePath: string) {
  const logFile = readFileSync(filePath, 'utf-8').trim();
  if (!isValidLog(logFile)) throw Error('Missing dev or stable branch merge text');
  return logFile.split('\n').map(toLogEntry);
}

export const _tddLogParser = {
  isValidLog,
  toLogEntry,
  getCommitFrom,
  getHeaderFrom,
  getMessageFrom,
};

function isValidLog(logFile: string) {
  return logFile.includes("Merge branch 'dev' into stable");
}

function toLogEntry(logLine: string) {
  return [
    getCommitFrom(logLine),
    getHeaderFrom(logLine),
    getMessageFrom(logLine),
  ] as LogEntry;
}

function getHeaderFrom(logLine: string) {
  const header = logLine.split(' ')[1];
  return separateSubjectFrom(header) ?? header.replace(':', '');
}

function separateSubjectFrom(header: string) {
  if (header.includes('(')) {
    const [head, subj] = header.split('(');
    const cleanSubj    = subj.substring(0, subj.length - 2);
    return `${head}/${cleanSubj}`;
  }
  return null;
}

function getCommitFrom(logLine: string) {
  return logLine.substring(0, 7);
}

function getMessageFrom(logLine: string) {
  const header = logLine.split(' ', 2)[1];
  return logLine.split(header, 2)[1].trim();
}




