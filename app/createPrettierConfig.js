const fs = require('fs')
const { promisify } = require('util')
const shell = require('shelljs')
const writeFile = promisify(fs.writeFile)

module.exports = function createPrettierConfig(blockDir, errorCallback) {
  const prettierConfig = {
    singleQuote: true,
    trailingComma: 'none'
  }

  const ignoreConfig = ['package.json', 'dist/**/**.js']

  return new Promise(async resolve => {
    shell.cd(blockDir)
    await writeFile(
      '.prettierrc.json',
      JSON.stringify(prettierConfig, null, 2)
    ).catch(errorCallback)
    await writeFile('.prettierignore', ignoreConfig.join('\n')).catch(
      errorCallback
    )
    resolve(true)
  })
}
