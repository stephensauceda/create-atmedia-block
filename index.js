#! /usr/bin/env node

const blockName = process.argv[2];
const { spawnSync } = require("child_process");

spawnSync("create-guten-block", [blockName]);
