var TokenService = function () {
    var jwt = require('jsonwebtoken');
    var secretKey = 'roomOnFlashlight';

    this.encode = function (data, next) {
        var token = jwt.sign(data, secretKey, { algorithm: 'HS512'});
        next(token);
    };

    this.decode = function (token, next) {
        jwt.verify(token, secretKey, next);
    };

};
module.exports = new TokenService;
