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
import { writeFileSync } from "fs";
import { LogEntry } from "./log_parser";
import config from '../config.json';
import {  pipe } from "ramda";
import smap from 'source-map-support';
smap.install();


type ActionName = string;
type ActionLog  = [message: string, commit: string];
type LogObj     = { logs: ActionLog[] };

type ActionSubject = { [key: string]: LogObj }

interface Action {
  subjects: ActionSubject;
  logs: ActionLog[]
}

type LogLayout = { [key: ActionName]: Action }



export function writeLogs(logs: LogEntry[], title: string) {
  if (!logs.length) return;
  return pipe(
    addLogs(logs),
    mapLogs(renderCommitAsURL),
    mapLogs(renderMsgWithBullet),
    buildLayoutStr(title),
    saveLayout,
  )({} as LogLayout);
}


function addLogs(logs: LogEntry[]) {
  return (layout: LogLayout) => {
    for (const log of logs) {
      const [header,,message,commit] = log;
      layout[header] = layout[header] ?? { subjects: {}, logs: []} as Action;
      if (isAddingSubjectLogs(log)(layout)) continue;
      layout[header].logs.push([message, commit]);
    }
    return layout;
  };
}

function isAddingSubjectLogs(log: LogEntry) {
  return (layout: LogLayout) => {
    const [header, subject, message, commit] = log;
    if (!subject) return false;

    const actionLog = [message, commit] as ActionLog;
    const item      = layout[header];

    if (!item.subjects[subject])
      item.subjects[subject] = { logs: [] }
    ;
    item.subjects[subject].logs.push(actionLog);
    return true;
  };
}

function mapLogs(mapFn: (log: ActionLog) => ActionLog) {
  return (layout: LogLayout) => {
    for (const key in layout) {
      const item = layout[key];
      for (const key in item.subjects) {
        item.subjects[key].logs = item.subjects[key].logs.map(mapFn);
      }
      item.logs = item.logs.map(mapFn);
    }
    return layout;
  };
}

function renderCommitAsURL(log: ActionLog) {
  const [message, commit] = log;
  return [message, `[${commit}](${config.url}/commit/${commit})`] as ActionLog;
}

function renderMsgWithBullet(log: ActionLog) {
  const [message, commit] = log;
  return [`* ${message}`, commit] as ActionLog;
}

function buildLayoutStr(title: string) {
  return (layout: LogLayout) => {
    const toLayoutStr = (pv: string, key: string) =>
       pv + pipe(
        appendHeader(key),
        appendLogs(layout[key]),
        appendLogsWithSubjects(layout[key])
      )('')
    ;
    return appendTitle(title)(Object.keys(layout).reduce(toLayoutStr, ''));
  };
}

function appendTitle(title: string) {
  return (str: string) =>
    `# ${capitalize(title)} (${getDateNow()})\n${str}`
  ;
}

function appendHeader(actionName: string) {
  const capitalizedAction = capitalize(actionName);
  return (str: string) => `${str}\n\n## ${capitalizedAction}\n`;
}

function appendLogsWithSubjects(action: Action) {
  return (str: string) => {
    let layoutStr = str;
    for (const subject in action.subjects) {
      const logStr = appendLogs(action.subjects[subject])('');
      layoutStr += `\n**${subject}**\n${logStr}`;
    }
    return layoutStr;
  };
}

function appendLogs(action: Action|LogObj) {
  return (str: string) =>
    action.logs.reduce(
      (pv, log) => `${pv}${log[0]} (${log[1]})\n`, str
    )
  ;
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

function getDateNow() {
  const d = new Date();
  const dateStr = d.toLocaleDateString();
  return `${dateStr}`;
}

function saveLayout(layoutStr: string) {
  writeFileSync(`${config.saveTo}/md_test.md`, layoutStr);
}










