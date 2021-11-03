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




export function getPrettyLog(actions: CommitAction[], title: string) {
  if (!actions.length) throw Error('Missing actions array!');
  return appendTitle(title)(actions.reduce(toPrettyLog, ''));
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
  const {msg, hash} = log;
  return {
    msg: toMdBullet(msg),
    hash: toMdURL(hash)
  } as Log;
}

function toMdBullet(str: string) { return `* ${str}`; }
function toMdURL(str: string)    { return `[${str}](${config.url}/commit/${str})`; }

function toActionString(pv: string, action: CommitAction) {
  return pv + pipe(
    appendActionName(action),
    appendLogs(action),
    appendLogsWithSubjects(action)
  )('');
}

function appendActionName(action: CommitAction) {
  return (str: string) => `${str}\n\n## ${capitalize(action.name)}\n`;
}

function appendLogs(action: CommitAction|CommitActionSubject) {
  return (str: string) =>
    action.logs.reduce(
      (pv, log) => `${pv}${log.msg} (${log.hash})\n`, str
    )
  ;
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

function capitalize(str: string) { return str[0].toUpperCase() + str.substring(1); }

function getDateNow() {
  const d = new Date();
  const dateStr = d.toLocaleDateString();
  return `${dateStr}`;
}












