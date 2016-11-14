var Twit = require('twit');
var fs = require('fs');
var request = require('request');

//load knots.json
var knots = fs.readFileSync('./corpora/knots.json');
knots = JSON.parse(knots).knots;
console.log(knots);

function getRandom(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

console.log(getRandom(knots));


// don't tweet, just testing
//return;

// load .env
require('dotenv').config();

var config = {
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
};

var T = new Twit(config);

function tweet() {
    // make request to wordnik to get a random word
    var url = 'http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=1&api_key=' + process.env.wordnik_key;
    
    request(url, gotWord);
    
    String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
    
    function gotWord(err, response, body) {
        // tweet message
        var msg = JSON.parse(body)[0].word.toUpperCase + ' ' + getRandom(knots);
        
        T.post('statuses/update', { status: msg }, function(err, data, res) {
            console.log(data.text);
        });
    };
    
//    // tweet message
//    var msg = 'I can tie a ' + getRandom(knots) + ' knot!';
//    //    var msg = 'This is a random number: ' + Math.random() * 1000
//    
//    T.post('statuses/update', { status: msg }, function(err, data, res) {
//        console.log(data.text);
//    });
}

setInterval(tweet, 1000 * 60 * 5);
tweet();


