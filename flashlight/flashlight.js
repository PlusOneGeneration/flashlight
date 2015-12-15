module.exports = function (app) {
    var TokenService = require('./TokenService');

    app.get('/api/flashlight', function (req, res) {
        TokenService.encode({room: 'newRoom'}, function (roomToken) {
            //Socket !!!!!!!!!
            res.status(200).json({room: roomToken});
        });
    });
};