var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 3000;
server.listen(port, function () {
    console.log('Started: ' + port);
});

io.on('connection', function (socket) {
    socket.on('hello', function (data) {
        console.log('Hello!', data);
        socket.emit('xxx', {message: 'hello to you too'})
    });

});

require('./flashlight/flashlight')(app, io);