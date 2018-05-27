//----- React Components --------/
import React, { Component } from 'react';
import PropTypes from "prop-types";

//----- BTC Logo ----------/
import BTCLogo from '../images/bitcoin-spinner.svg';

//the class for the spinning BTC loader that runs while tweets are loading :)
class BTCLoader extends Component {

	//function for setting the component class, depending on current prop status
	setStatusStyle() {
		switch (this.props.status) {
			case "loading":
				return "BTCLoader-loading";
			case "success":
				return "BTCLoader-success";
			case "failed":
				return "BTCLoader-failed";
			default:
				return "BTCLoader-loading";
		}
	}

	render() {
		//initialize loaderShow variable
		let loaderShow = null;
		let { status } = this.props;

		//while loading, show the spinning BTC icon
		if (status === "loading") {
			loaderShow = (
				<img src={BTCLogo} alt={status} />
			);
		//..otherwise, if the call failed, show an error message
		} else if (status === "failed") {
			loaderShow = (
				<div>
					<img src={BTCLogo} alt={status} />
					<div className='BTCLoader-failed--errortext'>
						Oops.. looks like tweets aren't loading right nowzors :(
					</div>
				</div>
			);
		}

		//return the loader plus message
		return (
			<div className={this.setStatusStyle()}>
				{loaderShow}
			</div>
		);
	}
}

//prop types
BTCLoader.propTypes = {
	status: PropTypes.string.isRequired
};

//default props
BTCLoader.defaultProps = {
	status: "loading"
};

export default BTCLoader;
