//----- React Components --------/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//----- BTC Logo ----------/
import helpIcon from '../images/help.svg';

//the topmost bar of the page, showing the title and an overall sentiment
class Header extends Component {
  render() {
    let { mood } = this.props;
    let moodObj =
      mood > 35
        ? mood > 70
          ? { desc: 'Great', class: 'mood-great' }
          : { desc: 'Meh', class: 'mood-meh' }
        : { desc: 'Bad', class: 'mood-bad' };

    return (
      <div className="Header">
        <ul>
          <li className="font-face-gh">Bitcoin Weekly Sentimenter</li>
          <li className="li--right">
            <card className="card-sentiment">
              <content>Overall Mood</content>
              <footer className={moodObj.class}>{moodObj.desc}</footer>
            </card>
          </li>
        </ul>
      </div>
    );
  }
}

//prop types
Header.propTypes = {
  mood: PropTypes.number.isRequired,
};

//default props
Header.defaultProps = {
  mood: 50,
};

export default Header;
