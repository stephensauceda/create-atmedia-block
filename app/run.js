const { join } = require('path')
const chalk = require('chalk')
const ora = require('ora')

const runCGB = require('./runCGB')
const removeUnusedFiles = require('./removeUnusedFiles')
const createESLintConfig = require('./createESLintConfig')
const createPrettierConfig = require('./createPrettierConfig')
const installATMediaDeps = require('./installATMediaDeps')
const runLinting = require('./runLinting')
const printStart = require('./printStart')
const printEnd = require('./printEnd')

const spinner = ora({ text: '' })
const blockName = process.argv[2]

if (!blockName) {
  spinner.fail(`You must provide a block name.`)
  process.exit(1)
}

const blockDir = join(process.cwd(), blockName)

function exitWithError(error) {
  spinner.fail()
  console.error(error.message)
  process.exit(1)
}

module.exports = async function run() {
  printStart(blockName, blockDir)

  spinner.start(
    `Initializing ${chalk.bold(
      blockName
    )} with create-guten-block (this can take a minute)...`
  )
  await runCGB(blockName, exitWithError)
  spinner.succeed()

  spinner.start('Removing unused files...')
  await removeUnusedFiles(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Creating ESLint config...')
  await createESLintConfig(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Creating Prettier config...')
  await createPrettierConfig(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Installing ATMedia dependencies...')
  await installATMediaDeps(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Running initial linting...')
  await runLinting(blockDir, exitWithError)
  spinner.succeed()

  spinner.succeed(`We're all done!`)

  printEnd(blockName)
}
