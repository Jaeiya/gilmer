import { exec, ExecException } from "node:child_process";
import { basename, dirname } from "node:path";
import { CLI } from "./cli";
import { color as c } from "./colors";


type ExecAsyncOptions = {
  /** Whether or not GIT needs to be setup for callback */
  isSetup: boolean;
  /** Callback */
  cb: (err: ExecException|null, out: string) => void;
}


const state = {
  isSetup: false,
  remoteURL: null as string|null,
  formatFlag: '--pretty="format:%h|%ci|%s|%b^@^"'
};


export namespace GIT {

  export const getRemoteURL = () => state.remoteURL;

  export function init() {
    return Promise.resolve()
      .then(execAsync('git log --max-count=1', {isSetup: false, cb: validateGitExists}))
      .then(execAsync('git config --get remote.origin.url', {isSetup: false, cb: setRemoteRepoURL}))
      .then(() => state.isSetup = true);
  }

  export function log(cb: (err: ExecException|null, out: string) => void) {
    return execAsync(
      `git log ${trySinceFlag()} ${tryUntilFlag()} ${state.formatFlag}`,
      { isSetup: true, cb }
    );
  }

}


function execAsync(command: string, options: ExecAsyncOptions) {
  return () => new Promise((rs) => {
    exec(command, (err, out) => {
      if (state.isSetup != options.isSetup) {
        logSetupError();
        process.exit(1);
      }
      options.cb(err, out);
      rs(void(0));
    });
  });
}

function validateGitExists(err: ExecException|null) {
  if (err) {
    console.log(c.r('\n\n ERROR: ') + c.y('Missing GIT Command or Commits') + '\n');
    process.exit(1);
  }
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) return logLocalRepoOnly();
  state.remoteURL = `${dirname(out)}/${basename(out.trim(), '.git')}`;
}

function logLocalRepoOnly() {
  console.log(c.r('\n\n WARNING: ') + c.y('Local Repository Only'));
  console.log(
    c.g('\n    NOTE: ') +
    c.d('Commit hashes will ') +
    c.r('not ') +
    c.d('be ') +
    c.w('clickable\n\n')
  );
}

function logSetupError() {
  console.log(c.r('\n\n ERROR: ') + c.y('Executing GIT actions before GIT.setup() call'));
  console.log(
    c.g('\n    NOTE: ') +
    c.d('Make sure you call ') +
    c.g('GIT.setup() ') +
    c.d('before you use any other GIT methods.\n\n')
  );
}

function trySinceFlag() {
  const dateSince = CLI.Args.getDateSince();
  return dateSince ? `--since="${dateSince}"` : '';
}

function tryUntilFlag() {
  const dateUntil = CLI.Args.getDateUntil();
  return dateUntil ? `--until="${dateUntil}"` : '';
}