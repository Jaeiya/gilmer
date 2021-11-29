# ExampleLog (11/29/2021)

## Feat
* add Git log parser ([b6ce577](https://github.com/Jaeiya/gilmer/commit/b6ce577)) `10-14-2021`
* add markdown file writer ([87c24d4](https://github.com/Jaeiya/gilmer/commit/87c24d4)) `10-17-2021`
* add commit syntax doc with obsidian config ([aa0797a](https://github.com/Jaeiya/gilmer/commit/aa0797a)) `10-22-2021`
* add `main` entry point ([b64b630](https://github.com/Jaeiya/gilmer/commit/b64b630)) `11-3-2021`
* add action sorting ([18a1ff2](https://github.com/Jaeiya/gilmer/commit/18a1ff2)) `11-4-2021`
* add msg body and custom log format parsing ([fd54263](https://github.com/Jaeiya/gilmer/commit/fd54263)) `11-4-2021`
* add date to each commit ([666eb90](https://github.com/Jaeiya/gilmer/commit/666eb90)) `11-4-2021`
* add CLI support to package and rename project ([0cbd639](https://github.com/Jaeiya/gilmer/commit/0cbd639)) `11-17-2021`
* add git validation, repo URL config, and write to `./docs` ([e05bde2](https://github.com/Jaeiya/gilmer/commit/e05bde2)) `11-18-2021`
* add color object for ANSI color codes ([28e60ad](https://github.com/Jaeiya/gilmer/commit/28e60ad)) `11-18-2021`
* use global state object for configuration ([3033074](https://github.com/Jaeiya/gilmer/commit/3033074)) `11-18-2021`
* use title as file name with appended date ([2f353a0](https://github.com/Jaeiya/gilmer/commit/2f353a0)) `11-24-2021`

**log_parser**
* add subject field to Log Array ([b173408](https://github.com/Jaeiya/gilmer/commit/b173408)) `10-15-2021`
* add log file validation ([da2e0e6](https://github.com/Jaeiya/gilmer/commit/da2e0e6)) `10-18-2021`

**md_writer**
* add title support ([475687c](https://github.com/Jaeiya/gilmer/commit/475687c)) `10-22-2021`
* customize where to save output file in config ([b8bfa5b](https://github.com/Jaeiya/gilmer/commit/b8bfa5b)) `10-22-2021`

**pretty_parser**
* sort actions before parsing ([bbc07a5](https://github.com/Jaeiya/gilmer/commit/bbc07a5)) `11-4-2021`
* add horizontal line after each action ([4d29e7c](https://github.com/Jaeiya/gilmer/commit/4d29e7c)) `11-4-2021`

**sort_actions**
* `findOrder()` defaults to lowest priority ([5fc4563](https://github.com/Jaeiya/gilmer/commit/5fc4563)) `11-4-2021`

**main**
* use custom `git log` command within node process ([c0af5ff](https://github.com/Jaeiya/gilmer/commit/c0af5ff)) `11-4-2021`
* get logs via `--since` flag if `cli.date` is set ([084404c](https://github.com/Jaeiya/gilmer/commit/084404c)) `11-21-2021`

**state**
* add `CLI` handler for title and verbose settings ([eb20c88](https://github.com/Jaeiya/gilmer/commit/eb20c88)) `11-18-2021`
* set default title ([f116909](https://github.com/Jaeiya/gilmer/commit/f116909)) `11-18-2021`

**cli**
* add multi-flag support and cli state object ([9481e78](https://github.com/Jaeiya/gilmer/commit/9481e78)) `11-21-2021`
* add date flag and flag value handling ([02f76e7](https://github.com/Jaeiya/gilmer/commit/02f76e7)) `11-21-2021`
* add `-until` flag to retrieve logs up to `-until` date ([c7374a9](https://github.com/Jaeiya/gilmer/commit/c7374a9)) `11-25-2021`

---

## Chg

**log_parser**
* remove log file validation ([96d4a43](https://github.com/Jaeiya/gilmer/commit/96d4a43)) `10-16-2021`
* export `LogEntry` ([3fe54fe](https://github.com/Jaeiya/gilmer/commit/3fe54fe)) `10-16-2021`
* sort logs from oldest to latest ([590e040](https://github.com/Jaeiya/gilmer/commit/590e040)) `10-24-2021`

**md_writer**
* convert headers to level 2 ([37549c2](https://github.com/Jaeiya/gilmer/commit/37549c2)) `10-22-2021`
* capitalize headers ([b471171](https://github.com/Jaeiya/gilmer/commit/b471171)) `10-22-2021`
* remove time from title ([39ebd37](https://github.com/Jaeiya/gilmer/commit/39ebd37)) `10-22-2021`

**pretty_parser**
* curry `getPrettyLog()` ([21a68d3](https://github.com/Jaeiya/gilmer/commit/21a68d3)) `11-3-2021`
* render date as code and move it ([e4f48f0](https://github.com/Jaeiya/gilmer/commit/e4f48f0)) `11-4-2021`

**settings**
* use custom title-bar color ([d8ab7eb](https://github.com/Jaeiya/gilmer/commit/d8ab7eb)) `11-18-2021`

---

## Fix
* align all console messages to a specific style ([ba183c1](https://github.com/Jaeiya/gilmer/commit/ba183c1)) `11-21-2021`

**log_parser**
* add `isValidLog()` to `_tdd` ([cb0bb28](https://github.com/Jaeiya/gilmer/commit/cb0bb28)) `10-15-2021`
* `isValidLogFile()` missing `less than` logic ([3d76dcd](https://github.com/Jaeiya/gilmer/commit/3d76dcd)) `10-22-2021`
* use color object ([155c283](https://github.com/Jaeiya/gilmer/commit/155c283)) `11-18-2021`
* provide proper error and exit from empty log buffer ([d55d569](https://github.com/Jaeiya/gilmer/commit/d55d569)) `11-21-2021`

**md_writer**
* immediately `return` on an empty `logs` array ([9546636](https://github.com/Jaeiya/gilmer/commit/9546636)) `10-18-2021`
* add space between header and timestamp ([86e4dab](https://github.com/Jaeiya/gilmer/commit/86e4dab)) `10-22-2021`

**main**
* incorrect file path ([85dfdde](https://github.com/Jaeiya/gilmer/commit/85dfdde)) `11-3-2021`
* pretty format missing quote ([b952bc6](https://github.com/Jaeiya/gilmer/commit/b952bc6)) `11-21-2021`

**utilities**
* `toMdURL()` not handling null URL ([bfd5132](https://github.com/Jaeiya/gilmer/commit/bfd5132)) `11-18-2021`

**state**
* use a generic default for `filename` ([a354c2d](https://github.com/Jaeiya/gilmer/commit/a354c2d)) `11-24-2021`

**pretty_parser**
* remove unnecessary `\n` chars from logs ([3bf0e72](https://github.com/Jaeiya/gilmer/commit/3bf0e72)) `11-25-2021`

---

## Docs
* add `README.md` ([94b3263](https://github.com/Jaeiya/gilmer/commit/94b3263)) `11-24-2021`
* add example log ([94dae84](https://github.com/Jaeiya/gilmer/commit/94dae84)) `11-25-2021`

**commitsyntax**
* add `docs` to allowed actions ([a54eeb6](https://github.com/Jaeiya/gilmer/commit/a54eeb6)) `10-24-2021`
* `chg` action needed more clarification ([4139760](https://github.com/Jaeiya/gilmer/commit/4139760)) `10-24-2021`
* Re-structure and clarify further points ([71740c6](https://github.com/Jaeiya/gilmer/commit/71740c6)) `10-26-2021`
* Added clarifications and fixed grammar/emphasis ([ef2aa05](https://github.com/Jaeiya/gilmer/commit/ef2aa05)) `11-3-2021`
* rename file and add work in progress section ([4cc0a8f](https://github.com/Jaeiya/gilmer/commit/4cc0a8f)) `11-24-2021`

**readme**
* clarify how to use Gilmer in its entirety ([4023104](https://github.com/Jaeiya/gilmer/commit/4023104)) `11-25-2021`
* add `-to` flag info and remove deprecated `date` flag ([a609d88](https://github.com/Jaeiya/gilmer/commit/a609d88)) `11-25-2021`
* fix missing file name in command flag examples ([22eeb59](https://github.com/Jaeiya/gilmer/commit/22eeb59)) `11-25-2021`
* use gist for `sort_actions` link ([43362de](https://github.com/Jaeiya/gilmer/commit/43362de)) `11-25-2021`
* demonstrate interchangeability of flags ([fbbedfb](https://github.com/Jaeiya/gilmer/commit/fbbedfb)) `11-26-2021`
* clarify `verbose` flag further ([36b7e29](https://github.com/Jaeiya/gilmer/commit/36b7e29)) `11-26-2021`
* add clarification for `to` flag ([39bd150](https://github.com/Jaeiya/gilmer/commit/39bd150)) `11-26-2021`
* fix punctuation ([7f945a2](https://github.com/Jaeiya/gilmer/commit/7f945a2)) `11-26-2021`
* Add `What is Gilmer` section and minor fixes ([af5a5a0](https://github.com/Jaeiya/gilmer/commit/af5a5a0)) `11-26-2021`
* add extra info to opinionated section ([d6d7d58](https://github.com/Jaeiya/gilmer/commit/d6d7d58)) `11-26-2021`
* fix `commit_syntax` link ([a713008](https://github.com/Jaeiya/gilmer/commit/a713008)) `11-26-2021`
* use Obsidianite theme repository link instead of CSS ([d769ba4](https://github.com/Jaeiya/gilmer/commit/d769ba4)) `11-26-2021`
* clarify `How to Use` with intro text ([677a6da](https://github.com/Jaeiya/gilmer/commit/677a6da)) `11-26-2021`
* fix `overwhelm` being too vague ([358b731](https://github.com/Jaeiya/gilmer/commit/358b731)) `11-26-2021`
* fix `non-configurable` being too vague ([085f1ca](https://github.com/Jaeiya/gilmer/commit/085f1ca)) `11-26-2021`
* don't use filename for Commit Syntax link name ([fa2e668](https://github.com/Jaeiya/gilmer/commit/fa2e668)) `11-26-2021`

---

## Clean
* rename `commit_action_parser` ([8159529](https://github.com/Jaeiya/gilmer/commit/8159529)) `11-3-2021`
* rename `md_writer` to `pretty_parser` ([e99e4aa](https://github.com/Jaeiya/gilmer/commit/e99e4aa)) `11-3-2021`
* enforce white-space rules and remove comments ([7625c6d](https://github.com/Jaeiya/gilmer/commit/7625c6d)) `11-4-2021`
* move code files to `lib` dir ([a7b2a08](https://github.com/Jaeiya/gilmer/commit/a7b2a08)) `11-18-2021`
* rename variables for clarity ([0d65c12](https://github.com/Jaeiya/gilmer/commit/0d65c12)) `11-27-2021`

**md_writer**
* refactor with clearer intent ([c170762](https://github.com/Jaeiya/gilmer/commit/c170762)) `10-26-2021`
* refactor `addLogs()` to `commit_action_parser` ([66d9510](https://github.com/Jaeiya/gilmer/commit/66d9510)) `11-3-2021`
* refactor logic and rename funcs for clarity ([019478c](https://github.com/Jaeiya/gilmer/commit/019478c)) `11-3-2021`

**log_parser**
* define result of parsing as "metadata" ([0138b4c](https://github.com/Jaeiya/gilmer/commit/0138b4c)) `11-2-2021`
* simplify body parsing ([6f5443b](https://github.com/Jaeiya/gilmer/commit/6f5443b)) `11-4-2021`
* remove `toActionNotation()` ([915d64b](https://github.com/Jaeiya/gilmer/commit/915d64b)) `11-4-2021`

**pretty_parser**
* move `capitalize()` in order of use ([8be7a36](https://github.com/Jaeiya/gilmer/commit/8be7a36)) `11-3-2021`
* refactor general purpose functions into utilities ([4d33b3b](https://github.com/Jaeiya/gilmer/commit/4d33b3b)) `11-4-2021`

**sort_actions**
* create `SortPriority` type and align props ([0611a5f](https://github.com/Jaeiya/gilmer/commit/0611a5f)) `11-4-2021`
* rename `findOrder()` to `findPriority()` ([18ebb67](https://github.com/Jaeiya/gilmer/commit/18ebb67)) `11-4-2021`
* explicitly define a `defaultOrder` ([b638f07](https://github.com/Jaeiya/gilmer/commit/b638f07)) `11-26-2021`

**action_parser**
* refactor logic and clarify types ([6b64dfb](https://github.com/Jaeiya/gilmer/commit/6b64dfb)) `11-5-2021`

**main**
* remove deprecated chalk import ([ca97053](https://github.com/Jaeiya/gilmer/commit/ca97053)) `11-18-2021`

---

## Chore
* initialize project files and install deps ([816254d](https://github.com/Jaeiya/gilmer/commit/816254d)) `10-14-2021`
* update deps ([2ca5008](https://github.com/Jaeiya/gilmer/commit/2ca5008)) `10-31-2021`
* update obsidian workspace files ([e75055a](https://github.com/Jaeiya/gilmer/commit/e75055a)) `11-3-2021`
* ignore `bin` directory ([f037c48](https://github.com/Jaeiya/gilmer/commit/f037c48)) `11-17-2021`
* add build-only `tsconfig` for `./src` ([6bd0f1c](https://github.com/Jaeiya/gilmer/commit/6bd0f1c)) `11-18-2021`
* rename project to `gilmer` ([7814a3a](https://github.com/Jaeiya/gilmer/commit/7814a3a)) `11-24-2021`
* add license ([5097f2e](https://github.com/Jaeiya/gilmer/commit/5097f2e)) `11-25-2021`
* remove deprecated obsidian theme ([4eaf51d](https://github.com/Jaeiya/gilmer/commit/4eaf51d)) `11-29-2021`
* push auto-updated settings ([8db785b](https://github.com/Jaeiya/gilmer/commit/8db785b)) `11-29-2021`

---
