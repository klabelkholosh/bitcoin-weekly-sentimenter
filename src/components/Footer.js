//----- React Components --------/
import React, { Component } from 'react';

//the bottommost bar of the page
class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <ul>
          <li>
            <b>btc:</b> 3MwiuGiSptRcYDob6idqWsUaJvSdgcDq2E
          </li>
          <li className="li--right">
            <a href="https://bdesign-01.web.app/" target="_blank">
              Made by BDesign
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Footer;
