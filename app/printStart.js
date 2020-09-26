const chalk = require('chalk')

module.exports = function printStart(blockName, blockDir) {
  console.log('\n')
  console.log(
    `${chalk.bgYellowBright.black.bold(
      'Creating a new block called:'
    )}${chalk.bgGreen.black.bold(blockName)}`
  )
  console.log(chalk.dim(`In directory ${blockDir}`))

  console.log('\n')
}
