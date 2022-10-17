//----- React Components ---------/
import React, { Component } from 'react';

//----- My Components ------/
import Header from './components/Header';
import WeekChart from './components/WeekChart';
import LatestTweets from './components/LatestTweets';
import Footer from './components/Footer';
import BTCLoader from './components/BTCLoader';

class App extends Component {
  state = {
    tweetsLatest: '',
    sentiment: [
      { day: 1, sentTot: 0 },
      { day: 2, sentTot: 0 },
      { day: 3, sentTot: 0 },
      { day: 4, sentTot: 0 },
      { day: 5, sentTot: 0 },
      { day: 6, sentTot: 0 },
      { day: 7, sentTot: 0 },
    ],
    sentWeekPercent: 0,
    posNegPieArr: [],
    errStatus: 'loading',
  };

  //create array of JSON objects representing each day of the week to get Twitter details
  createTwitParamArray() {
    let retArr = [];
    for (let i = 0; i < 7; i++) {
      let rightNow = new Date();
      let day = new Date(rightNow.setDate(rightNow.getDate() - i))
        .toISOString()
        .slice(0, 10);
      retArr.push({
        q: 'bitcoin',
        until: day,
        result_type: 'mixed',
        lang: 'en',
        include_entities: 'false',
        count: '100',
      });
    }
    return retArr;
  }

  componentDidMount() {
    //get the array, ready for passing through!
    const twitParamsArr = this.createTwitParamArray();
    console.log('twitParamsArr:', twitParamsArr);
    //send the array, setting the state once the api call returns an array of tweets/sentiment total
    //day 7 is actually today, 6 yesterday, etc.
    this.callApi(twitParamsArr)
      .then((res) => {
        console.log('res is:', res);
        this.setState({
          tweetsLatest: JSON.parse(JSON.parse(res[0].latestTweets).body),
          sentiment: [
            { day: 1, sentTot: res[6].sentTot },
            { day: 2, sentTot: res[5].sentTot },
            { day: 3, sentTot: res[4].sentTot },
            { day: 4, sentTot: res[3].sentTot },
            { day: 5, sentTot: res[2].sentTot },
            { day: 6, sentTot: res[1].sentTot },
            { day: 7, sentTot: res[0].sentTot },
          ],
          posNegPieArr: [
            {
              type: 'pos',
              numberDays: res.filter((el) => el.sentTot > 0).length,
            },
            {
              type: 'neg',
              numberDays: res.filter((el) => el.sentTot <= 0).length,
            },
          ],
          sentWeekPercent: Math.round(
            (res.filter((el) => el.sentTot > 0).length /
              (res.filter((el) => el.sentTot > 0).length +
                res.filter((el) => el.sentTot <= 0).length)) *
              100
          ),
        });
      })
      .catch((err) => {
        console.log('ERROR! was.. ', err);
        this.setState({
          errStatus: 'failed',
        });
      });
  }

  //api call that takes the array of JSON objects, fetches from our Node server API Twitter endpoint and returns an array of tweets/sentiment total
  callApi = async (params) => {
    let response = await params.map(async (el) => {
      const response = await fetch(
        window.encodeURI(
          `https://us-central1-bitcoin-bkend.cloudfunctions.net/twitterSearch/`
        ),
        {
          method: 'POST',
          body: JSON.stringify(el),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.json();
    });

    return Promise.all(response);
  };

  render() {
    let { tweetsLatest, errStatus, sentiment, posNegPieArr, sentWeekPercent } =
      this.state;

    return (
      <div className="App">
        <div className="container">
          {tweetsLatest !== '' && <Header mood={sentWeekPercent} />}
          {tweetsLatest !== '' && (
            <WeekChart
              sentiment={sentiment}
              posNegPieArr={posNegPieArr}
              sentWeekPercent={sentWeekPercent}
            />
          )}
          {tweetsLatest !== '' ? (
            <LatestTweets tweetList={tweetsLatest.statuses} />
          ) : (
            <BTCLoader status={errStatus} />
          )}
          {tweetsLatest !== '' && <Footer />}
        </div>
      </div>
    );
  }
}

export default App;
