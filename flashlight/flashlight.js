module.exports = function (app, io) {
    var TokenService = require('./TokenService');

    app.get('/api/flashlight', function (req, res) {
        TokenService.encode({room: 'newRoom'}, function (roomToken) {
            res.status(200).json({room: roomToken});
        });
    });
};