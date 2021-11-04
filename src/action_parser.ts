import { LogMetadata } from "./log_parser";




export type Log = {
  msg  : string,
  body : string|null,
  date : string;
  hash : string
};

export type CommitAction = {
  name     : string;
  subjects : CommitActionSubject[];
  logs     : Log[]
}

export type CommitActionSubject = {
  name: string;
  logs: Log[];
}


export function getCommmitActionListFrom(logDataList: LogMetadata[]) {
  return toCommitActionListFrom(logDataList)([]);
}


function toCommitActionListFrom(logDataList: LogMetadata[]) {
  return (actions: CommitAction[]) => {
    for (const logData of logDataList) {
      const [actionName,,msg,body,date,hash] = logData;
      let action = actions.find(a => a.name == actionName);
      if (!action) {
        action = { name: actionName, subjects: [], logs: [] };
        actions.push(action);
      }
      if (tryAddSubjectLogs(logData)(action)) continue;
      action.logs.push({ msg, body, date, hash, });
    }
    return actions;
  };
}


function tryAddSubjectLogs(logData: LogMetadata) {
  return (action: CommitAction) => {
    const [,subjectName, msg, body, date, hash] = logData;
    if (!subjectName) return false;
    let subject = action.subjects.find(s => s.name == subjectName);
    if (!subject) {
      subject = { name: subjectName, logs: [] };
      action.subjects.push(subject);
    }
    subject.logs.push({msg, body, date, hash});
    return true;
  };
}


