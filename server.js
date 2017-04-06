var express = require('express');
var request = require('request');
var mongo = require('mongodb');

var port = 8080;
var apiKey = "4999273-5208c8f575b06301185d523f6";
var resultsPerPage = 10;
var searchResultsRequiredFields = ["webformatURL", "tags", "pageURL"];
var searchTermsRequiredFields = ["query", "when"];
var mongoDatabase = "mongodb://localhost:27017/image_search";
var mongoCollection = "searches";

var app = express();
mongo.MongoClient;

/*
    Basic routing
*/

app.get('/api/imagesearch/:search_string', function(req, res) {
    var query = req.params.search_string;
    var offset = req.query.offset;

    getResults(query, offset, function(results){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    });
});

app.get('/api/latest/imagesearch/', function(req, res) {
    getQueries(function(results){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    });
});

app.listen(port, function () {
    console.log('Image Search Abstraction Layer app listening on port ' + port);
});


function getResults(query, offset, callback){
    var url = "https://pixabay.com/api/?key=" + apiKey + "&q=" + query + "&page=" + offset + "&per_page=" + resultsPerPage;

    request({url: url, json: true}, function(err, res, json) {
        if(err) {
            basicError("Pixabay API error - Can't get results", err);
        }
        
        addQuery(query);
        
        callback(stripProperties(json.hits, searchResultsRequiredFields));
    });
}

function stripProperties(data, searchResultsRequiredFields){
    for (var searchHits in data) {
        var keyArray = Object.keys(data[searchHits]);
        
        for(var key in keyArray) {
            if(searchResultsRequiredFields.indexOf(keyArray[key]) == -1){
                delete data[searchHits][keyArray[key]];
            }
        }
    }
    
    return data;
}

function basicError(message, error){
    console.log(message);
    console.log(error);
}

/*
    Project specific database functions
*/

function addQuery(query){
    databaseAccess(dbAdd, {'query': query, 'when': new Date()}, function(results){});
}

function getQueries(callback){
    databaseAccess(dbFind, null, function(results){
        callback(stripProperties(results.slice(0, 9), searchTermsRequiredFields));
    });
}

/*
    Generic database functions
*/

// databaseAccess use examples:
// find all records
/*databaseAccess(dbFind, null, function(results){
    console.log(results);
});*/
// find record where short = 2cf2370e
/*databaseAccess(dbFind, {"short": "2cf2370e"}, function(results){
    console.log(results);
});*/

function databaseAccess(operationFunction, data, callback){
    mongo.connect(mongoDatabase, function(err, db) {
        if(err){
            basicError("Database error - Can't connect to database", err);
        }
        else{
            operationFunction(db, data, function(resultsArray){
                callback(resultsArray);
            });
        }
        
        db.close();
    });
}

function dbFind(db, data, callback){
    db.collection(mongoCollection).find(data).toArray(function(err, sites) {
        if(err){
            basicError("Database error - Can't get records", err);
        }
        else{
            callback(sites);
        }
    });
}

function dbAdd(db, data, callback){
    db.collection(mongoCollection).insert(data, function(err, data) {
        if(err){
            basicError("Database error - Can't insert site", err);
        }
    });
    
    callback(data);
}