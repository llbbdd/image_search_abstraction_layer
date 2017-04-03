var express = require('express');

var port = 8080;

var app = express();

/*
    Basic routing
*/

// https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search_string', function(req, res) {
    var query = req.params.search_string;

    res.setHeader('Content-Type', 'application/json');
    
    
});

app.get('/api/latest/imagesearch/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    

});

app.listen(port, function () {
    console.log('Image Search Abstraction Layer app listening on port ' + port);
});

