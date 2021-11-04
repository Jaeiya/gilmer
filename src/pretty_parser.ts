/*
  * 1. Map Log Array to MD Layout
  *   a. Organize all Logs under their respective actions (e.g. add, fix, chore, etc...)
  *   b. Entry data should be: [subject, message, commit]
  *     1. Non-null subjects should be grouped together
  * 2. Render Markdown
  *   a. Action should be a header
  *   b. Subject should be bolded
  *     1. Messages should be bullet-pointed
  *   c. Logs without a subject should be bulleted directly under Action header
  * 3. Write markdown to file using MD layout object
  *   a. Use Action Name as header: # Action
  *   b. Log Subjects should be bolded: **subject**
*/


import config from '../config.json';
import { pipe } from "ramda";
import { CommitAction, CommitActionSubject, Log } from "./action_parser";
import { sortActions } from './sort_actions';
import { capitalize, toBlockquote, toMdBullet, toMdCode, toMdURL } from './utilities';




export function getPrettyLog(title: string) {
  return (actions: CommitAction[]) => {
    if (!actions.length) throw Error('Missing actions array!');
    sortActions(actions);
    return appendTitle(title)(actions.reduce(toPrettyLog, ''));
  };
}

function appendTitle(title: string) {
  return (str: string) =>
    `# ${capitalize(title)} (${getDateNow()})\n${str}`
  ;
}

function toPrettyLog(pv: string, action: CommitAction) {
  mapLogs(applyLogMarkdown)(action);
  return toActionString(pv, action);
}

function mapLogs(mapFn: (log: Log) => Log) {
  return (action: CommitAction) => {
    action.subjects.forEach(s => s.logs = s.logs.map(mapFn));
    action.logs = action.logs.map(mapFn);
  };
}

function applyLogMarkdown(log: Log) {
  const {msg, body, date, hash} = log;
  return {
    msg: toMdBullet(msg),
    body: body && toBlockquote(body),
    date: toMdCode(date),
    hash: toMdURL(hash, config.url)
  } as Log;
}

function toActionString(pv: string, action: CommitAction) {
  return pv + pipe(
    appendActionName(action),
    appendLogs(action),
    appendLogsWithSubjects(action),
    appendHorizontalLine,
  )('');
}

function appendActionName(action: CommitAction) {
  return (str: string) => `${str}\n\n## ${capitalize(action.name)}\n`;
}

function appendLogs(action: CommitAction|CommitActionSubject) {
  return (str: string) => action.logs.reduce(toLogStr, str);
}

function toLogStr(pv: string, log: Log) {
  const hash = `(${log.hash})`;
  const date = `${log.date}`;
  const body = `${log.body ? `${log.body}` : ''}`;
  return `${pv}${log.msg} ${hash} ${date}\n${body}\n`;
}

function appendLogsWithSubjects(action: CommitAction) {
  return (str: string) => {
    let layoutStr = str;
    for (const subject of action.subjects) {
      const logStr = appendLogs(subject)('');
      layoutStr += `\n**${subject.name}**\n${logStr}`;
    }
    return layoutStr;
  };
}

function appendHorizontalLine(str: string) {
  return `${str}\n---\n`;
}

function getDateNow() {
  const d = new Date();
  const dateStr = d.toLocaleDateString();
  return `${dateStr}`;
}












