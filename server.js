var express = require('express');

var port = 8080;

var app = express();

/*
    Basic routing
*/

// https://api-projects-generalwellbeing.c9users.io/api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search_string', function(req, res) {
    var query = req.params.search_string;
    var offset = req.query.offset;

    res.setHeader('Content-Type', 'application/json');
    

});

app.get('/api/latest/imagesearch/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    

});

app.listen(port, function () {
    console.log('Image Search Abstraction Layer app listening on port ' + port);
});

