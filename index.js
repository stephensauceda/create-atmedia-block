#!/usr/bin/env node

const blockName = process.argv[2]
const { promisify } = require('util')
const { spawnSync } = require('child_process')
const fs = require('fs')
const unlink = promisify(fs.unlink)

const filesToRemove = ['.editorconfig', '.eslintignore', '.eslintrc.json']

function removeFile(file) {
  return unlink(`${process.cwd()}/${blockName}/${file}`)
    .then(() => console.log(`Removed unused filed: ${file}`))
    .catch(console.error)
}

console.log(`Creating ${blockName}...`)

spawnSync('npx', ['create-guten-block', blockName], { stdio: 'inherit' })

Promise.all(filesToRemove.map(removeFile)).then(() => {
  console.log('All done!')
})
