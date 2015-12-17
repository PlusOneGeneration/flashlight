var express = require('express');
var app = express();
require('./flashlight/config/application').wrap(app);

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);


var port = app.config.get('port');

io.on('connection', function (socket) {


    socket.on('signal', function (data) {
        var room = 'need to add room name'; // by token
        console.log(data);
        io.to(room).emit('processedSignal', {signal: data.signal});
    });

    socket.on('connectToRoom', function (data) {
        var room = 'need to add room name'; // by data.token
        socket.join(room);
    });

});

server.listen(port, function () {
    console.log('Started: ' + port);
});

require('./flashlight/room')(app);