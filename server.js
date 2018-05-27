require('dotenv').config();
const express = require('express');
const Sentiment = require('sentiment');
const Twitter = require('twitter');
const R = require("request");
const app = express();
const port = process.env.PORT || 5000;
const sentiment = new Sentiment();
const cors = require("cors");

var cat = process.env.TWITTER_CONSUMER_KEY+ ":"+process.env.TWITTER_CONSUMER_SECRET;
var credentials = new Buffer(cat).toString('base64');
var url = 'https://api.twitter.com/oauth2/token';
var bearertoken = "";

//little function used for calculating sentiment.
function calcSentiment(twitChunk){
	let sentCalc = JSON.parse(twitChunk.body).statuses.reduce((add, el) => add + Number(sentiment.analyze(el.text).score),0);
	return sentCalc;
}

app.use(cors()); // sort out the CORS, man

//ok, so someone wants to search for Tweets! Let's do this...
app.get('/api/twitterSearch/:sentString', (req, res) => {

	//let's get the user's search parameters and flesh them out a bit..
	let twitQ = JSON.parse(req.params.sentString).q;
	let twitDate = JSON.parse(req.params.sentString).until;
	let twitResType = JSON.parse(req.params.sentString).result_type;

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
		client.get('search/tweets', {q: twitQ, until: twitDate, result_type: twitResType}, function(error, tweets, response) {
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
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.get('/api/sentiment/:sentString', (req, res) => {
	let sentText = JSON.stringify(sentiment.analyze(req.params.sentString));
	res.send({ sentiment: sentText });
})

app.listen(port, () => console.log(`Listening on port ${port}`));