const { join } = require('path')
const cpy = require('cpy')

const eslintTemplateFile = join(__dirname, '..', 'templates', '_eslintrc.js')
const copyOptions = {
  rename: '.eslintrc.js'
}

module.exports = function createESLintConfig(blockDir, errorCallback) {
  return new Promise(async resolve => {
    await cpy(eslintTemplateFile, blockDir, copyOptions).catch(errorCallback)
    resolve(true)
  })
}
