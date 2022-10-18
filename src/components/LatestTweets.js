//----- React Components ---------/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//container class for the latest tweets list
class LatestTweets extends Component {
  render() {
    let { tweetList } = this.props;

    return (
      <div className="LatestTweets">
        <ul>
          <li>Latest Tweets</li>
          <li className="tweetcontainer">
            <div>
              <TweetList tweetList={tweetList} />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

//prop types
LatestTweets.propTypes = {
  tweetList: PropTypes.array.isRequired,
};

//default props
LatestTweets.defaultProps = {
  tweetList: [],
};

//list showing latest tweets for most recent Twitter API call
class TweetList extends Component {
  renderItem = (index, key) => {
    return (
      <div key={key} className="TweetList-reactList">
        {this.props.tweetList[index].text} -{' '}
        <b>@{this.props.tweetList[index].user.screen_name}</b>
      </div>
    );
  };

  render() {
    let { tweetList } = this.props;

    return (
      <div className="TweetList">
        <div className="TweetList-reactListContainer">
          {tweetList.map((el, idx) => {
            return (
              <div className="tweetDiv" key={idx}>
                <ul>
                  <li>
                    {' '}
                    <a
                      href={`https://twitter.com/intent/user?user_id=${el.user.id_str}`}
                      target="_blank"
                    >
                      {' '}
                      <img
                        className="avatar_twit"
                        src={el.user.profile_image_url}
                      />
                    </a>
                  </li>
                  <li>
                    <b>
                      {' '}
                      <a
                        href={`https://twitter.com/intent/user?user_id=${el.user.id_str}`}
                        target="_blank"
                      >
                        {' '}
                        @{el.user.screen_name}
                      </a>
                    </b>
                  </li>
                  <li>
                    <a
                      href={`https://twitter.com/web/status/${el.id_str}`}
                      target="_blank"
                    >
                      {el.text}
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

//prop types
TweetList.propTypes = {
  tweetList: PropTypes.array.isRequired,
};

//default props
TweetList.defaultProps = {
  tweetList: [],
};

export default LatestTweets;
