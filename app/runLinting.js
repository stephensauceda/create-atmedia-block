const execa = require('execa')
const shell = require('shelljs')

module.exports = function runLinting(blockDir, errorCallback) {
  return new Promise(async resolve => {
    shell.cd(blockDir)
    await execa('npx', [
      'eslint',
      '--quiet',
      '--fix',
      '--rule',
      'react/prop-types: 0',
      'src/**/**.js'
    ]).catch(errorCallback)
    resolve(true)
  })
}
