#! /usr/bin/env node

const blockName = process.argv[2];
const { spawnSync } = require("child_process");

console.log(`Creating ${blockName}...`);

spawnSync("create-guten-block", [blockName]);

console.log('All done!');