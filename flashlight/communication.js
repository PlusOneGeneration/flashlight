module.exports = function (app) {
    var TokenService = app.container.get('TokenService');
    var SocketIO = app.container.get('SocketIO');

    SocketIO.onSocket(function (socket) {

        socket.on('room.master.create', function (data, next) {
            var room = '' + Math.random(3) + '' + Math.random(3) + '' + Math.random(3);

            //console.log('Create room', room);

            TokenService.encode({room: room, role: 'master'}, function (err, token) {
                next(err, {room: token});
            });
        });

        socket.on('room.listener.create', function (data, next) {
            TokenService.decode(data.token, function (err, data) {
                if (err) return next(err);

                TokenService.encode({room: data.room, role: 'listener'}, function (err, token) {
                    if (err) return next(err);
                    next(null, {room: token});
                });
            });
        });

        socket.on('room.connect', function (data) {
            TokenService.decode(data.token, function (err, model) {
                if (err) return console.error(err);

                //console.log('Connect to room', model.room);
                socket.join(model.room);
            });
        });

        socket.on('room.signal', function (data) {
            TokenService.decode(data.token, function (err, model) {
                if (err) return console.error(err);
                //console.log(data.signal);
                SocketIO.emitRoom(model.room, 'room.signal', {signal: data.signal});
            });
        });
    });
};