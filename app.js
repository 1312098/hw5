var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.listen(port, function () {
   console.log("TreeFinder app is running")
})