const { join } = require('path')
const chalk = require('chalk')
const ora = require('ora')

const spinner = ora({ text: '' })
const blockName = process.argv[2]

function exitWithError(error) {
  spinner.fail(error.message)
  process.exit(1)
}

if (!blockName) {
  exitWithError(new Error('You must provide a block name.'))
}

const blockDir = join(process.cwd(), blockName)

module.exports = async function run() {
  require('./printStart')(blockName, blockDir)

  spinner.start(
    `Initializing ${chalk.bold(
      blockName
    )} with create-guten-block (this can take a minute)...`
  )
  await require('./runCGB')(blockName, exitWithError)
  spinner.succeed()

  spinner.start('Removing unused files...')
  await require('./removeUnusedFiles')(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Creating ESLint config...')
  await require('./createESLintConfig')(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Creating Prettier config...')
  await require('./createPrettierConfig')(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Installing ATMedia dependencies...')
  await require('./installATMediaDeps')(blockDir, exitWithError)
  spinner.succeed()

  spinner.start('Running initial linting...')
  await require('./runLinting')(blockDir, exitWithError)
  spinner.succeed()

  spinner.succeed(`We're all done!`)

  require('./printEnd')(blockName)
}
