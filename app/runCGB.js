const execa = require('execa');

module.exports = function runCGB(blockName, errorCallback) {
  return new Promise(async resolve => {
    await execa('npx', ['create-guten-block', blockName]).catch(errorCallback);
    resolve(true);
  });
};
