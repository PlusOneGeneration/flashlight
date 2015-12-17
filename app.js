var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;

io.on('connection', function (socket) {
    socket.on('signal', function (data) {
        socket.emit('processedSignal', {signal: data.signal});
    });
});

server.listen(port, function () {
    console.log('Started: ' + port);
});

require('./flashlight/room')(app);