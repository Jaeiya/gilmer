
import { pipe } from "ramda";
import { CLI } from "./cli";
import { GIT } from "./git";
import { CommitAction, Log } from "./log_parser";
import { capitalize, toBlockquote, toMdBullet, toMdCode, toMdURL } from './utilities';


export function createPrettyLog(title: string) {
  return (actions: CommitAction[]) => {
    if (!actions.length) throw Error('Missing actions array!');
    return appendTitle(title)(actions.reduce(toPrettyLog, ''));
  };
}


function appendTitle(title: string) {
  const dateStr = new Date().toLocaleDateString();
  return (str: string) =>
    `# ${capitalize(title)} (${dateStr})\n${str}`
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
    hash: toMdURL(hash, GIT.getRemoteURL())
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
  return (str: string) => `${str}\n## ${capitalize(action.name)}\n`;
}

function appendLogs(action: CommitAction) {
  return (str: string) => action.logs.reduce(toLogStr, str);
}

function toLogStr(pv: string, log: Log) {
  const hash = `(${log.hash})`;
  const date = `${log.date}`;
  const body = (CLI.Args.getVerbose() && log.body) ? `${log.body}\n` : '';
  return `${pv}${log.msg} ${hash} ${date}\n${body}`;
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







