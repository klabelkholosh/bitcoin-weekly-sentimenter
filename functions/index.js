const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const Sentiment = require('sentiment');
const Twitter = require('twitter');
const R = require("request");
const app = express();
const port = process.env.PORT || 5000;
const sentiment = new Sentiment();
const cors = require("cors");
const cat = process.env.TWITTER_CONSUMER_KEY+ ":"+process.env.TWITTER_CONSUMER_SECRET;
const credentials = new Buffer(cat).toString('base64');
const url = 'https://api.twitter.com/oauth2/token';
var bearertoken = "";

app.use(cors({ origin: true })); // sort out the CORS, man
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//little function used for calculating sentiment.
function calcSentiment(twitChunk){
	let sentCalc = JSON.parse(twitChunk.body).statuses.reduce((add, el) => add + Number(sentiment.analyze(el.text).score),0);
	return sentCalc;
}

//ok, so someone wants to search for Tweets! Let's do this...
app.get('/twitterSearch', (req, res) => {

	console.log('Welcome to twitSearch API');

	//let's get the user's search parameters and flesh them out a bit..
	let twitQ = JSON.parse(req.param("content")).q;
	let twitDate = JSON.parse(req.param("content")).until;
	let twitResType = JSON.parse(req.param("content")).result_type;
	let twitLang = JSON.parse(req.param("content")).lang;
	let twitIncEnt = JSON.parse(req.param("content")).include_entities;
	let twitCount = JSON.parse(req.param("content")).count;

	//request a bearer token from Twitter oauth2 API
	R({ url: url,
	    method:'POST',
	    headers: {
	        "Authorization": "Basic " + credentials,
	        "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	    },
	    body: "grant_type=client_credentials"

	}, function(err, resp, body) {

		//the bearer token...
	    bearertoken = JSON.parse(body).access_token;

	    console.log("Begin Twitter API consummation...");

	    //Twitter client object, used for searches and stuffs
	     var client = new Twitter({
		  consumer_key: process.env.TWITTER_CONSUMER_KEY,
		  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		  bearer_token: bearertoken
		});

	   	console.log('Getting tweets at ' + twitDate + '...');
	    			
	    //search Twitter and get some tweets!
		client.get('search/tweets', { q: twitQ, until: twitDate, result_type: twitResType, lang: twitLang, include_entities: twitIncEnt, count: twitCount }, function(error, tweets, response) {
			let latestTweets = JSON.stringify(response);

			//calculate the sentiment on these tweets.
			let sentTot = calcSentiment(response);

			//send back an object of both latestTweets for printing, plus the final sentiment score
			res.send({
				latestTweets,
				sentTot
			});

		  	if(error) throw error;
		  	console.log("Twitter search done.");
		});
		
	});
});

//if we ever need to do the most --basic-- of checks on Express' availability....
app.get('/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

//basic test for sentiment functionality
app.get('/sentiment/:sentString', (req, res) => {
	let sentText = JSON.stringify(sentiment.analyze(req.params.sentString));
	res.send({ sentiment: sentText });
})

app.listen(port, () => console.log(`Listening on port ${port}`));

//hook up to Firebase cloud functions..
const api = functions.https.onRequest(app);

module.exports = {
  api
}