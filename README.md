
# Getting Started
This project will not be released on NPM, so you must already be familiar with a development environment, in order to build and use this project.
1. Clone this repository to your system
3. Build the project using `./src/tsconfig.json` with your IDE or cmd line of choice
4. Install Gilmer using one or both of the following commands
```bash
# Local
npm i

# Global
npm i -g .
```

## How to Run
```bash
# If installed locally
node . <args>

# If installed globally
gilmer <args>
```
**OR**
```bash
# If project has been compiled using ./tsconfig.json
node ./src/main.js <args>
```

# How to Use
## Filename
The default file name is `GitLog` and all spaces are stripped. This means `My Log` turns into `MyLog`.
```bash
# Error
gilmer Log File

# Success
gilmer "Log File" # output: LogFile.date.md
```
## Flags
There are 2 flags and they **must** come **after** a given file name, but flags can be used interchangeably or at the same time.
```bash
# Error
gilmer -flag

# Success
gilmer mylog -flag
gilmer "My Log" -flag
gilmer "My Log" -flag1 -flag2
gilmer "My Log" -flag2 -flag1
```
## `Verbose` Flag
A log is comprised of a message (commit message) and a body. The body is usually not necessary, which is why it's hidden by default. The `verbose` flag tells gilmer to show that body text along with the commit message.
```bash
gilmer mylog -v
gilmer mylog -verbose
```
## `From` Flag
If this flag is not specified, Gilmer will fetch every log from the first to the last. Gilmer is a lot more practical when used with specific time restraints. You can use any string date format accepted by the JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) constructor.
```bash
gilmer mylog --from="12/12/2020"
gilmer mylog --since="12/12/2020"
```
## `To` Flag
If this flag is not specified, Gilmer will fetch all logs from the `-from` flag up to the latest log. You can use any string date format accepted by the JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) constructor.
```bash
gilmer mylog -to="12/28/21"
gilmer mylog -until="12/28/21"
```
## Using Date Flags
It's best to use the date flags **From** and **To** in tandem with eachother, that way the generated log doesn't overwhelm.
```bash
gilmer mylog -from="12/1/21" -to="12/28/21"
```


## Opinionated by Default
This project was created for my use-case, with only the bare minimum configuration options. Changing anything outside of the file name, verbocity of the logs generated, or the date from which the log is generated, is non-configurable.

The priority configuration for **actions** is located in [sort_actions.ts](https://github.com/Jaeiya/gilmer/blob/22eeb59011582fe6e76a50cf69ed5c117bdbe212/src/lib/sort_actions.ts#L10-L16); it controls the order of actions in the log file.

> I may or may not add more configuration options/flags in the future, but **it is not a priority**.

## Warning
If you plan to commit to this repository, make sure you follow the commit guidelines provided here: [Commit Syntax](/docs/commit_syntax.md). Of course if you plan to clone & modify it for your own use, you're free to do so as per the [LICENSE](/LICENSE).




