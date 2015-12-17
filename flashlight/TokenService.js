var TokenService = function () {
    var jwt = require('jsonwebtoken');
    var secretKey = 'roomOnFlashlight';

    this.encode = function (data, next) {
        jwt.sign(data, secretKey, {algorithm: 'HS512'}, next);
    };

    this.decode = function (token, next) {
        jwt.verify(token, secretKey, next);
    };

};
module.exports = new TokenService;
