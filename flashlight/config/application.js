var Application = require('plus.application');

module.exports = new Application({
    dir: __dirname,
    env: process.env.NODE_ENV || 'dev'
});
