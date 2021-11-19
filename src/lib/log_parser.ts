
import { color } from './colors';



export type LogMetadata = [
  action  : string,
  subject : string|null,
  message : string,
  body    : string|null,
  date    : string,
  hash    : string,
];



const c = color;


export function getLogsMetadata(rawLog: string) {
  if (!isValidLog(rawLog)) [] as LogMetadata[];
  const logLines = rawLog.split('^@^');
  logLines.pop(); // Last element is always empty
  return logLines.reverse().map(toLogMetadata);
}


function isValidLog(rawLog: string) {
  if (!rawLog.trim()) {
    console.log(`\n${c.r('Error: file is empty')}\n`);
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
  const action = commitMsg.split(' ')[0];
  if (action.includes('(')) return action.split('(')[0];
  return action;
}

function toSubject(commitMsg: string) {
  const action = commitMsg.split(' ')[0];
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




