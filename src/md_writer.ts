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
import config from '../config.json';
import {  pipe } from "ramda";
import smap from 'source-map-support';
import { CommitAction, CommitActionSubject, Log } from "./commit_action_parser";
smap.install();




export function writeLogs(actions: CommitAction[], title: string) {
  if (!actions.length) return;
  return pipe(
    mapLogs(renderHashAsURL),
    mapLogs(renderMsgWithBullet),
    buildLayoutStr(title),
    saveLayout,
  )(actions);
}


function mapLogs(mapFn: (log: Log) => Log) {
  return (actions: CommitAction[]) => {
    for (const action of actions) {
      action.subjects.forEach(s => s.logs = s.logs.map(mapFn));
      action.logs = action.logs.map(mapFn);
    }
    return actions;
  };
}

function renderHashAsURL(log: Log) {
  const {msg, hash} = log;
  return {
    msg,
    hash: `[${hash}](${config.url}/commit/${hash})`
  } as Log;
}

function renderMsgWithBullet(log: Log) {
  const {msg, hash} = log;
  return { msg: `* ${msg}`, hash};
}

function buildLayoutStr(title: string) {
  return (actions: CommitAction[]) => {
    const toLayoutStr = (pv: string, action: CommitAction) =>
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

function appendHeader(action: CommitAction) {
  const actionHeader = capitalize(action.name);
  return (str: string) => `${str}\n\n## ${actionHeader}\n`;
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


function appendLogs(action: CommitAction|CommitActionSubject) {
  return (str: string) =>
    action.logs.reduce(
      (pv, log) => `${pv}${log.msg} (${log.hash})\n`, str
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










