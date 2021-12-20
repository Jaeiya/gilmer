import { exec, ExecException } from "node:child_process";
import { basename, dirname } from "node:path";
import { CLI } from "./cli";
import { Logger } from "./logger";




type ExecAsyncOptions = {
  /** Whether or not GIT needs to be setup for callback */
  isSetup: boolean;
  /** Callback */
  cb: (err: ExecException|null, out: string) => any;
}



const cc = Logger.console_colors;
const logError = Logger.lErr;
const logWarn = Logger.lWarn;

const state = {
  isSetup: false,
  remoteURL: null as string|null,
  currentBranch: null as string|null,
  formatFlag: '--pretty="format:%h|%ci|%s|%b^@^"'
};


export namespace GIT {

  export const getRemoteURL = () => state.remoteURL;

  export function init() {
    return Promise.resolve()
      .then(execAsync('git branch --show-current', {isSetup: false, cb: validateGitExists}))
      .then(execAsync('git config --get remote.origin.url', {isSetup: false, cb: setRemoteRepoURL}))
      .then(() => {
        state.isSetup = true;
        return {
          hasRemote: !!state.remoteURL,
          branch: state.currentBranch,
        };
      });
  }

  export function log(cb: (err: ExecException|null, out: string) => string) {
    return execAsync(
      `git log ${trySinceFlag()} ${tryUntilFlag()} ${state.formatFlag}`,
      { isSetup: true, cb }
    );
  }

}


function execAsync(command: string, options: ExecAsyncOptions) {
  return (): Promise<any> => new Promise((rs) => {
    exec(command, (err, out) => {
      if (state.isSetup != options.isSetup) {
        logInitError();
        process.exit(1);
      }
      rs(options.cb(err, out));
    });
  });
}

function validateGitExists(err: ExecException|null, out: string) {
  if (err) {
    logError('error', cc.yw('Missing GIT Command or Commits:'), cc.rdb('FATAL'));
    process.exit(1);
  }
  state.currentBranch = out.trim();
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) return;
  state.remoteURL = `${dirname(out)}/${basename(out.trim(), '.git')}`;
}

function logInitError() {
  logError('error', cc.yw('Executing GIT actions before GIT.init() call:'), cc.rdb('FATAL'));
  logWarn('info', cc.w(`Make sure you call ${cc.gn('GIT.init()')} before you use any other GIT functions`));
}

function trySinceFlag() {
  const dateSince = CLI.Args.getDateSince();
  return dateSince ? `--since="${dateSince}"` : '';
}

function tryUntilFlag() {
  const dateUntil = CLI.Args.getDateUntil();
  return dateUntil ? `--until="${dateUntil}"` : '';
}