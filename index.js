#!/usr/bin/env node

const { promisify } = require('util')
const fs = require('fs')
const { join } = require('path')
const execa = require('execa')
const ora = require('ora')
const chalk = require('chalk')
const shell = require('shelljs')
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

const blockName = process.argv[2]
const spinner = ora({ text: '' })

if (!blockName) {
  spinner.fail(`You must provide a block name.`)
  process.exit(1)
}

const blockDir = join(process.cwd(), blockName)

const filesToRemove = ['.editorconfig', '.eslintrc.json']

function runCGB(errorCallback) {
  return new Promise(async resolve => {
    await execa('npx', ['create-guten-block', blockName]).catch(errorCallback)
    resolve(true)
  })
}

function removeFile(file) {
  return unlink(`${blockDir}/${file}`).catch(console.error)
}

function removeUnusedFiles(errorCallback) {
  return new Promise(async resolve => {
    await Promise.all(filesToRemove.map(removeFile)).catch(errorCallback)
    resolve(true)
  })
}

function installATMediaDeps(errorCallback) {
  const deps = [
    'babel-eslint',
    'eslint',
    'eslint-config-prettier',
    'eslint-config-airbnb',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'prettier'
  ]

  shell.cd(blockDir)

  return new Promise(async resolve => {
    await execa('npm', ['install', '--save-dev', ...deps, '--silent']).catch(
      errorCallback
    )
    resolve(true)
  })
}

function createESLintConfig(errorCallback) {
  const eslintConfig = {
    extends: ['airbnb', 'prettier', 'prettier/react'],
    parser: 'babel-eslint',
    env: {
      browser: true,
      jest: true
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'no-underscore-dangle': 0,
      'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
      'react/no-danger': 0,
      'react/react-in-jsx-scope': 0,
      'import/extensions': ['off', 'never'],
      'import/no-unresolved': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-named-as-default': 0,
      'import/no-absolute-path': 0,
      'import/no-duplicates': 0,
      'import/no-named-as-default-member': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/destructuring-assignment': ['warn', 'never']
    },
    plugins: ['prettier', 'react-hooks'],
    globals: {
      wp: 'readonly'
    }
  }

  return new Promise(async resolve => {
    shell.cd(blockDir)
    await writeFile(
      '.eslintrc.json',
      JSON.stringify(eslintConfig, null, 2)
    ).catch(errorCallback)
    resolve(true)
  })
}

function createPrettierConfig(errorCallback) {
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

function runLinting(errorCallback) {
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

function exitWithError(error) {
  spinner.fail()
  console.error(error.message)
  process.exit(1)
}

async function run() {
  console.log('\n')
  console.log(
    `${chalk.bgYellowBright.black.bold(
      'Creating a new block called:'
    )}${chalk.bgGreen.black.bold(blockName)}`
  )
  console.log(chalk.dim(`In directory ${blockDir}`))

  console.log('\n')

  spinner.start(
    `Initializing ${chalk.bold(
      blockName
    )} with create-guten-block (this can take a minute)...`
  )
  await runCGB(exitWithError)
  spinner.succeed()

  spinner.start('Removing unused files...')
  await removeUnusedFiles(exitWithError)
  spinner.succeed()

  spinner.start('Creating ESLint config...')
  await createESLintConfig(exitWithError)
  spinner.succeed()

  spinner.start('Creating Prettier config...')
  await createPrettierConfig(exitWithError)
  spinner.succeed()

  spinner.start('Installing ATMedia dependencies...')
  await installATMediaDeps(exitWithError)
  spinner.succeed()

  spinner.start('Running initial linting...')
  await runLinting(exitWithError)
  spinner.succeed()

  spinner.succeed(`We're all done!`)

  console.log('\n')
  console.log(chalk.bgGreenBright.black.bold('To start coding:'))
  console.log(`${chalk.green('cd')} ${chalk.white(blockName)}`)
  console.log(`${chalk.green('npm')} ${chalk.white('start')}`)

  console.log('\n')

  console.log(chalk.bgBlackBright('Commands:'))
  console.log(
    `${chalk.green('npm')} ${chalk.white('start')} - ${chalk.dim(
      'Run Webpack in dev mode with live re-loading'
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

run()
