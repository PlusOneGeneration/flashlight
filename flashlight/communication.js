module.exports = function (app) {
    var TokenService = app.container.get('TokenService');
    var SocketIO = app.container.get('SocketIO');

    SocketIO.onSocket(function (socket) {

        socket.on('room.create', function (data, next) {
            var room = Math.random(3);
            console.log('Create room', room);
            TokenService.encode({room: room, role: 'master'}, function (err, token) {
                next(err, {room: token});
            });
        });

        socket.on('room.listener', function (data, next) {
            TokenService.decode(data.token, function (err, data) {
                TokenService.encode({room: data.room, role: 'listener'}, function (err, token) {
                    next(err, {room: token});
                });
            });
        });

        socket.on('room.connect', function (data) {
            TokenService.decode(data.token, function (err, data) {
                if (err) return console.error(err);

                var room = data.room;

                console.log('Connect to room', room);
                socket.join(room);
            });
        });

        socket.on('room.signal', function (data) {
            TokenService.decode(data.token, function (err, dataByToken) {
                var room = dataByToken.room;
                SocketIO.emitRoom(room, 'processedSignal', {signal: data.signal});
            });
        });
    });
};