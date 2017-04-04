var express = require('express');
var request = require('request');

var port = 8080;
var apiKey = "4999273-5208c8f575b06301185d523f6";
var resultsPerPage = 10;
var requiredFields = ["webformatURL", "tags", "pageURL"];

var app = express();

/*
    Basic routing
*/

app.get('/api/imagesearch/:search_string', function(req, res) {
    var query = req.params.search_string;
    var offset = req.query.offset;

    var results = getResults(query, offset, function(results){
        res.setHeader('Content-Type', 'application/json');
        res.send(stripProperties(results, requiredFields));
    });
});

app.get('/api/latest/imagesearch/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    

});

app.listen(port, function () {
    console.log('Image Search Abstraction Layer app listening on port ' + port);
});


function getResults(query, offset, callback){
    var url = "https://pixabay.com/api/?key=" + apiKey + "&q=" + query + "&page=" + offset + "&per_page=" + resultsPerPage;

    request({url: url, json: true}, function(err, res, json) {
        if (err) {
            throw err;
        }
        
        callback(json);
    });
}

function stripProperties(data, requiredFields){
    var hits = data.hits;
    
    for (var searchHits in hits) {
        var keyArray = Object.keys(hits[searchHits]);
        
        for(var key in keyArray) {
            if(requiredFields.indexOf(keyArray[key]) == -1){
                delete hits[searchHits][keyArray[key]];
            }
        }
    }
    
    return hits;
}