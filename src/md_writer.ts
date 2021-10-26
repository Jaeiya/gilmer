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


type ActionLog  = [message: string, commit: string];

type ActionSubject = {
  name: string;
  logs: ActionLog[];
 }

interface Action {
  name: string;
  subjects: ActionSubject[];
  logs: ActionLog[]
}


export function writeLogs(logs: LogEntry[], title: string) {
  if (!logs.length) return;
  return pipe(
    addLogs(logs),
    mapLogs(renderCommitAsURL),
    mapLogs(renderMsgWithBullet),
    buildLayoutStr(title),
    saveLayout,
  )([] as Action[]);
}


function addLogs(logs: LogEntry[]) {
  return (actions: Action[]) => {
    for (const log of logs) {
      const [header,,message,commit] = log;
      let action = actions.find(a => a.name == header);
      if (!action) {
        action = createAction(header);
        actions.push(action);
      }
      if (isAddingSubjectLogs(log)(action)) continue;
      action.logs.push([message, commit]);
    }
    return actions;
  };
}

function isAddingSubjectLogs(log: LogEntry) {
  return (action: Action) => {
    const [,subject, message, commit] = log;
    if (!subject) return false;

    const actionLog   = [message, commit] as ActionLog;
    let actionSubject = action.subjects.find(s => s.name == subject);

    if (!actionSubject) {
      actionSubject = createSubject(subject);
      action.subjects.push(actionSubject);
    }
    actionSubject.logs.push(actionLog);
    return true;
  };
}

function createAction(name: string) {
  return {
    name,
    subjects: [],
    logs: []
  } as Action;
}

function createSubject(name: string) {
  return {
    name,
    logs: []
  } as ActionSubject;
}

function mapLogs(mapFn: (log: ActionLog) => ActionLog) {
  return (actions: Action[]) => {
    for (const action of actions) {
      action.subjects.forEach(s => s.logs = s.logs.map(mapFn));
      action.logs = action.logs.map(mapFn);
    }
    return actions;
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
  return (actions: Action[]) => {
    const toLayoutStr = (pv: string, action: Action) =>
       pv + pipe(
        appendHeader(action),
        appendLogs(action),
        appendLogsWithSubjects(action)
      )('')
    ;
    return appendTitle(title)(actions.reduce(toLayoutStr, ''));
  };
}

function appendTitle(title: string) {
  return (str: string) =>
    `# ${capitalize(title)} (${getDateNow()})\n${str}`
  ;
}

function appendHeader(action: Action) {
  const actionHeader = capitalize(action.name);
  return (str: string) => `${str}\n\n## ${actionHeader}\n`;
}

function appendLogsWithSubjects(action: Action) {
  return (str: string) => {
    let layoutStr = str;
    for (const subject of action.subjects) {
      const logStr = appendLogs(subject)('');
      layoutStr += `\n**${subject.name}**\n${logStr}`;
    }
    return layoutStr;
  };
}


function appendLogs(action: Action|ActionSubject) {
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










