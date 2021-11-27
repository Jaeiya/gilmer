
# What is Gilmer?
Gilmer stands for Git Log Markdown-er. If I were to brand it, it would be spelled: `GiLMer`. After watching an amazing [DevOps Video](https://www.youtube.com/watch?v=t9HRzE7_2Xc) from a little-known company called [Butterscotch Shenanigans](https://www.youtube.com/user/BScotchShenani), I decided I needed to up my DevOps game to reduce the amount of time I spent looking through my git logs when writing the changelog for my projects.

Through this process, I also realized how lazy I was about actually writing consistent commit messages...and thus the [commit_syntax](/docs/commit_syntax.md) was born.

Gilmer is designed to display an overview of commit messages (not unlike a changelog), organized by action and context/subject. The order in which the actions appear, is hard-coded and a `./docs` folder is created at the working directory.

If Gilmer is executed with no arguments, then the file will be created like so: `<WorkingDirectory>/docs/GitLog.MM_DD_YYYY.md`.

With a real file, the date placeholders would be replaced by Today's date. For an example of what this looks like in practice, here's **this** repositories [Gilmer Output](/docs/ExampleLog.11_25_2021.md) without any flags.

You might be wondering why I have those horizontal lines after each block. It doesn't look very good in Github markdown, but it works very well with the [Obsidianite](https://github.com/bennyxguo/Obsidian-Obsidianite) theme I have installed for [Obsidian](https://obsidian.md/), which is what I use to write my docs.

When using the date flags, you can get very granular with the timeline of changes. You could even do weekly or monthly logs in order to assess how much work is getting done in a team.



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
Gilmer is a CLI tool **only**. It should be installed globally if you intend to use it for multiple projects. Because this tool is used solely for my projects, I had no need to create a help UI. Now that I'm making this tool public, the following details will have to serve as a surrogate help UI.
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
If this flag is not specified, Gilmer will fetch all logs from the `-from` (if specified) flag up to the latest log. You can use any string date format accepted by the JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) constructor.
```bash
gilmer mylog -to="12/28/21"
gilmer mylog -until="12/28/21"
```

## Using Date Flags
It's best to use the date flags (**From** and **To**) in tandem with each other, that way the generated log doesn't overwhelm.
```bash
gilmer mylog -from="12/1/21" -to="12/28/21"
```


# Opinionated by Default
This project was created for my use-case, with only the bare minimum configuration options. Changing anything outside of the file name, verbosity of the logs generated, or the date from which the log is generated, is non-configurable.

In combination with only certain configurable options, the [commit_syntax](/docs/commit_syntax.md) document outlines the best commit practices for use with Gilmer. Although it's possible to use your own commit syntax, there's no guarantee that the output will be as useful or consistent.

The priority configuration for **actions** is located in [sort_actions.ts](https://github.com/Jaeiya/gilmer/blob/22eeb59011582fe6e76a50cf69ed5c117bdbe212/src/lib/sort_actions.ts#L10-L16); it controls the order of actions in the log file.

> I may or may not add more configuration options/flags in the future, but **it is not a priority**.



# Warning
If you plan to commit to this repository, make sure you follow the commit guidelines provided here: [Commit Syntax](/docs/commit_syntax.md). Of course if you plan to clone & modify it for your own use, you're free to do so as per the [LICENSE](/LICENSE).




