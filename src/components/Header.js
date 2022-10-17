//----- React Components --------/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//----- BTC Logo ----------/
import helpIcon from '../images/help.svg';

//the topmost bar of the page, showing the title and an overall sentiment
class Header extends Component {
  render() {
    let { mood } = this.props;

    return (
      <div className="Header">
        <ul>
          <li className="font-face-gh">Bitcoin Weekly Sentimenter</li>
          <li className="li--right">
            <card className="card-sentiment">
              <content>Overall Mood</content>
              <footer>
                {mood > 35 ? (mood > 70 ? 'Great' : 'Meh') : 'Bad'}
              </footer>
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
