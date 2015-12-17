module.exports = function (container) {
    container.register('TokenService', require('../TokenService'), ['config/TokenService/key']);
};