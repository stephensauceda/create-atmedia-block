const chalk = require('chalk')

module.exports = function printEnd(blockName) {
  console.log('\n')
  console.log(chalk.bgGreenBright.black.bold('To start coding:'))
  console.log(`${chalk.green('cd')} ${chalk.white(blockName)}`)
  console.log(`${chalk.green('npm')} ${chalk.white('start')}`)

  console.log('\n')

  console.log(chalk.bgBlackBright('Commands:'))
  console.log(
    `${chalk.green('npm')} ${chalk.white('start')} - ${chalk.dim(
      'Run Webpack in dev mode with live re-compiling'
    )}`
  )
  console.log(
    `${chalk.green('npm')} ${chalk.white('run build')} - ${chalk.dim(
      'Write a production-ready file to `dist`'
    )}`
  )
  console.log(
    `${chalk.green('npm')} ${chalk.white('run eject')} - ${chalk.dim(
      'Bail out of create-guten-block for advanced config'
    )}`
  )
}
