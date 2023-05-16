const zl = require('zip-lib');

const info = require('../package.json');

const filepath = './' + info.name + '-' + info.version + '.lcp';

zl.archiveFolder('./lib', filepath).then(
  function () {
    console.log('done');
  },
  function (err) {
    console.log(err);
  }
);
