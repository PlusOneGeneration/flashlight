var express = require('express');
var app = express();
require('./flashlight/config/application').wrap(app);

app.use(express.static(__dirname + '/public'));

var SocketIO = app.container.get('SocketIO');
var server = require('http').Server(app);
SocketIO.create(server);

require('./flashlight/communication')(app);

var port = app.config.get('port');
server.listen(port, function () {
    console.log('Started: ' + port);
});