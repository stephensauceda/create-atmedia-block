const { join } = require('path');
const cpy = require('cpy');

const prettierConfigFile = join(__dirname, '..', 'templates', '_prettierrc.js');
const copyOptions = {
  rename: '.prettierrc.js'
};

module.exports = function createPrettierConfig(blockDir, errorCallback) {
  return new Promise(async resolve => {
    await cpy(prettierConfigFile, blockDir, copyOptions).catch(errorCallback);
    resolve(true);
  });
};
