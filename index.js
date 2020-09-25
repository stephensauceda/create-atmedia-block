#! /usr/bin/env node

const blockName = process.argv[2];
const { spawnSync } = require("child_process");
const { unlinkSync } = require("fs");

const filesToRemove = [".editorconfig", ".eslintignore", ".eslintrc.json"];

function removeFile(file) {
  try {
    unlinkSync(`${process.cwd()}/${blockName}/${file}`);
    console.log(`Removed unused filed: ${file}`);
  } catch (err) {
    console.error(err);
  }
}

console.log(`Creating ${blockName}...`);

spawnSync("npx", ["create-guten-block", blockName], { stdio: "inherit" });

filesToRemove.forEach(removeFile);

console.log("All done!");
