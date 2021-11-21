
import { pipe } from "ramda";
import { CommitAction, ActionContext, Log } from "./action_parser";
import { sortActions } from './sort_actions';
import { state } from "./state";
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
    action.contexts.forEach(s => s.logs = s.logs.map(mapFn));
    action.logs = action.logs.map(mapFn);
  };
}

function applyLogMarkdown(log: Log) {
  const {msg, body, date, hash} = log;
  return {
    msg: toMdBullet(msg),
    body: body && toBlockquote(body),
    date: toMdCode(date),
    hash: toMdURL(hash, state.repoURL)
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

function appendLogs(action: CommitAction|ActionContext) {
  return (str: string) => action.logs.reduce(toLogStr, str);
}

function toLogStr(pv: string, log: Log) {
  const hash = `(${log.hash})`;
  const date = `${log.date}`;
  const body = state.cli.verbose
    ? `${log.body ? `${log.body}` : ''}`
    : ''
  ;
  return `${pv}${log.msg} ${hash} ${date}\n${body}\n`;
}

function appendLogsWithSubjects(action: CommitAction) {
  return (str: string) => {
    let layoutStr = str;
    for (const subject of action.contexts) {
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












