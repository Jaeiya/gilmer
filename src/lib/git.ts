import { exec, ExecException } from "node:child_process";
import { basename, dirname } from "node:path";
import { CLI } from "./cli";
import { color as c } from "./colors";


type ExecAsyncOptions = {
  /** Whether or not GIT needs to be setup for callback */
  isSetup: boolean;
  /** Callback */
  cb: (err: ExecException|null, out: string) => any;
}


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
        logSetupError();
        process.exit(1);
      }
      // setTimeout(() => rs(options.cb(err, out)), 1000);
      rs(options.cb(err, out))
    });
  });
}

function validateGitExists(err: ExecException|null, out: string) {
  if (err) {
    console.log(c.r('\n\n ERROR: ') + c.y('Missing GIT Command or Commits') + '\n');
    process.exit(1);
  }
  state.currentBranch = out.trim();
}

function setRemoteRepoURL(err: ExecException|null, out: string) {
  if (err) return;
  state.remoteURL = `${dirname(out)}/${basename(out.trim(), '.git')}`;
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