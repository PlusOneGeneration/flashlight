module.exports = function (app) {
    var TokenService = app.container.get('TokenService');
    var SocketIO = app.container.get('SocketIO');

    SocketIO.onSocket(function (socket) {

        socket.on('room.create', function (data, next) {
            var room = Math.random(3);

            TokenService.encode({room: room, role: 'master'}, function (err, token) {
                next(err, {room: token});
            });
        });

        socket.on('room.connect', function (data) {
            var room = 'need to add room name'; // by data.token
            socket.join(room);
        });

        socket.on('room.signal', function (data) {
            var room = 'need to add room name'; // by token
            SocketIO.emitRoom(room, 'processedSignal', {signal: data.signal});
        });


    });
};