const execa = require('execa')
const shell = require('shelljs')

module.exports = function installATMediaDeps(blockDir, errorCallback) {
  const deps = [
    'babel-eslint',
    'eslint',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'prettier',
    'eslint-config-atmedia',
    'atmedia-prettier-config'
  ]

  shell.cd(blockDir)

  return new Promise(async resolve => {
    await execa('npm', ['install', '--save-dev', ...deps, '--silent']).catch(
      errorCallback
    )
    resolve(true)
  })
}
