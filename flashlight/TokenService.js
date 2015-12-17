var TokenService = function (key) {
    var jwt = require('jsonwebtoken');
    var secretKey = key;

    this.encode = function (data, next) {
        jwt.sign(data, secretKey, {algorithm: 'HS512'}, function (token) {
            next(null, token);
        });
    };

    this.decode = function (token, next) {
        jwt.verify(token, secretKey, next);
    };

};

module.exports = TokenService;
