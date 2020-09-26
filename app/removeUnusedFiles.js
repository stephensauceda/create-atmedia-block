const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const unlink = promisify(fs.unlink)

const filesToRemove = ['.editorconfig', '.eslintrc.json']

module.exports = function removeUnusedFiles(blockDir, errorCallback) {
  return new Promise(async resolve => {
    await Promise.all(
      filesToRemove.map(file => unlink(join(blockDir, file)))
    ).catch(errorCallback)
    resolve(true)
  })
}
