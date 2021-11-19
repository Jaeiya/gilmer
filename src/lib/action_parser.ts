
import { LogMetadata } from "./log_parser";



export type Log = {
  msg  : string,
  body : string|null,
  date : string;
  hash : string
};

export type CommitAction = {
  name     : string;
  contexts : ActionContext[];
  logs     : Log[]
}

export type ActionContext = CommitAction;



export function parseLogsAsActionList(logDataList: LogMetadata[]) {
  const actions: CommitAction[] = [];
  for (const logData of logDataList) {
    const [,,msg,body,date,hash] = logData;
    const action = findOrCreateAction(logData)(actions);
    action.logs.push({ msg, body, date, hash });
  }
  return actions;
}

function findOrCreateAction(logData: LogMetadata) {
  return (actions: CommitAction[]|ActionContext[]) => {
    const [actionName,contextName] = logData;
    const action = tryCreateAction(actionName)(actions);
    const contextAction = contextName && tryCreateAction(contextName)(action.contexts);
    return contextAction || action;
  };
}

/** If CommitAction or ActionContext doesn't exist, create it. */
function tryCreateAction(name: string) {
  return (actions: CommitAction[]|ActionContext[]) => {
    let action = actions.find(a => a.name == name);
    if (action) return action;
    action = { name, contexts: [], logs: [] };
    actions.push(action);
    return action;
  };
}


