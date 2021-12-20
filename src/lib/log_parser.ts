
import { map, pipe, reverse } from 'ramda';
import { color as c } from './colors';



export type LogMetadata = [
  action  : string,
  subject : string|null,
  message : string,
  body    : string|null,
  date    : string,
  hash    : string,
];


export type Log = {
  msg  : string,
  body : string|null,
  date : string;
  hash : string
};

export type CommitAction = {
  name     : string;
  contexts : CommitAction[];
  logs     : Log[]
}

type CommitMsgParts = [actionContext: string, text: string];
type SortPriority = [name: string, priority: number];



const actionOrder: SortPriority[] = [
  ['feat'  , 1],
  ['chg'   , 2],
  ['fix'   , 3],
  ['docs'  , 4],
  ['chore' , 10]
];



export function gitLogToActionArray(gitLog: string) {
  validateLog(gitLog);
  const logLines = gitLog.split('^@^');
  logLines.pop(); // Last element is always empty
  return pipe(
    reverse, // We want oldest => latest logs
    map(toLogMetadata),
    toActionArray,
    sortActions,
  )(logLines);
}

function validateLog(rawLog: string) {
  if (!rawLog.trim()) {
    console.log(`\n ${c.r('ERROR:')} ${c.y('No Logs Found')}\n`);
    console.log(
`  ${c.g('NOTE:')} Make sure you've made at least one commit.
        If you've set a ${c.w('-from')} date, make sure it predates current changes.\n\n`
    );
    process.exit(0);
  }
}

function toLogMetadata(logLine: string) {
  const commitParts = logLine.trim().split('|');
  const [hash, isoDate, commitMsg, body] = commitParts;
  const [actionContext,] = commitMsg.split(' ') as CommitMsgParts;

  return [
    getAction(actionContext),
    getContext(actionContext),
    getMsgText(commitMsg),
    body || null,
    toLocaleDateStr(isoDate),
    hash
  ] as LogMetadata;
}

function getAction(actionContext: string) {
  const action =
    actionContext.includes('(')
      ? actionContext.split('(')[0]
      : actionContext
  ;
  return action.replace(':', '').toLowerCase();
}

function getContext(actionContext: string) {
  const subject =
    actionContext.includes('):')
      ? actionContext.split('(')[1].replace('):', '')
      : null
  ;
  return subject;
}

function getMsgText(commitMsg: string) {
  if (commitMsg.includes(':')) {
    return commitMsg.split(':', 2)[1].trim();
  }
  return commitMsg;
}

function toLocaleDateStr(isoDate: string) {
  return new Date(isoDate).toLocaleDateString().replace(/\//g, '-');
}

function toActionArray(logs: LogMetadata[]) {
  const actions: CommitAction[] = [];
  for (const commit of logs) {
    const [actionName,contextName,msg,body,date,hash] = commit;
    const log = { msg, body, date, hash };
    const action = tryCreateAction(actionName, actions);
    if (contextName) {
      const contextAction = tryCreateAction(contextName, action.contexts);
      contextAction.logs.push(log);
      continue;
    }
    action.logs.push(log);
  }
  return actions;
}

function tryCreateAction(name: string, actions: CommitAction[]) {
  let action = actions.find(a => a.name == name);
  if (action) return action;
  action = { name, contexts: [], logs: [] };
  actions.push(action);
  return action;
}

function sortActions(actions: CommitAction[]) {
  actions.sort((a, b) => {
    const [,aPriority] = findPriority(a.name);
    const [,bPriority] = findPriority(b.name);
    return aPriority - bPriority;
  });
  return actions;
}

function findPriority(name: string) {
  const defaultOrder: SortPriority = ['', actionOrder.length + 1];
  return actionOrder.find(v => v[0] == name) ?? defaultOrder;
}




