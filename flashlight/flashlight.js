module.exports = function (app) {
    var TokenService = require('./TokenService');

    app.get('/api/flashlight', function (req, res) {
        TokenService.encode({room: 'newRoom'}, function (roomToken) {
            res.status(200).json({room: roomToken});
        });
    });

    app.get('/api/rooms/:roomToken', function (req, res, next) {
        TokenService.decode(req.params.roomToken, function (err, data) {
            if (err) return next(err);
            res.status(200).json({message: 'I\'m listen to you'});
        });
    });
};