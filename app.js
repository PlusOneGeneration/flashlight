var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

require('./flashlight/flashlight')(app);

app.listen(3000, function () {
  console.log('Server working!');
});
