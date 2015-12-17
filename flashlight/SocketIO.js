function SocketIO(config) {

    var io = null;

    this.emitRoom = function (room, event, data) {
        io.to(room).emit(event, data || {});
    };

    this.onSocket = function (handler) {
        io.on('connection', handler);
    };

    this.emit = function (event, data) {
        io.emit(event, data || {});
    };

    this.create = function (server) {
        io = require('socket.io')(server);
        this.setup(io);
        return io;
    };

    this.setup = function (io) {
//redis

        if (config.get('redis.use')) {
            var redis = require('socket.io-redis');
            io.adapter(redis(config.get('redis.connection')));
        }

    };
}

module.exports = SocketIO;