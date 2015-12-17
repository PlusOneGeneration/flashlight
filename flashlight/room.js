module.exports = function (app) {
    var TokenService = app.container.get('TokenService');

    app.post('/api/rooms', function (req, res) {
        var room = Math.random(3);

        TokenService.encode({room: room, role: 'master'}, function (err, token) {
            res.status(200).json({room: token});
        });
    });

};