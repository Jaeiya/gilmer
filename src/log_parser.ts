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
import chalk from 'chalk';



export type LogMetadata = [
  action  : string,
  subject : string|null,
  message : string,
  body    : string|null,
  date    : string,
  hash    : string,
];



export function getLogsMetadata(rawLog: string) {
  if (!isValidLog(rawLog)) [] as LogMetadata[];
  const logLines = rawLog.split('^@^');
  logLines.pop(); // Last element is always empty
  return logLines.reverse().map(toLogMetadata);
}

// export const _tddLogParser = {
//   toLogMetadata,
//   getCommitFrom,
//   getMessageFrom,
// };


function isValidLog(rawLog: string) {
  if (!rawLog.trim()) {
    console.log(`\n${chalk.red('Error: file is empty')}\n`);
    return false;
  }
  return true;
}

function toLogMetadata(logLine: string) {
  const commitParts = logLine.trim().split('|');
  const [hash, isoDate, commitMsg, body] = commitParts;

  return [
    toAction(commitMsg).replace(':', '').toLowerCase(),
    toSubject(commitMsg),
    toMsgText(commitMsg),
    body || null,
    new Date(isoDate).toLocaleDateString().replace(/\//g, '-'),
    hash
  ] as LogMetadata;
}

function toAction(commitMsg: string) {
  const action = toActionNotation(commitMsg);
  if (action.includes('(')) return action.split('(')[0];
  return action;
}

function toSubject(commitMsg: string) {
  const action = toActionNotation(commitMsg);
  if (action.includes('):')) {
    return action.split('(')[1].replace('):', '');
  }
  return null;
}

function toMsgText(commitMsg: string) {
  if (commitMsg.includes(':')) {
    return commitMsg.split(':', 2)[1].trim();
  }
  return commitMsg;
}

function toActionNotation(msg: string) {
  return msg.split(' ')[0];
}




