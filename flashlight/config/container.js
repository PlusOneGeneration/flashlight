module.exports = function (container) {
    container.register('TokenService', require('../TokenService'), ['config/TokenService/key']);
    container.register('SocketIO', require('../SocketIO'), ['config']);
};