/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import noop from 'lodash/noop';
import identity from 'lodash/identity';

/**
 * Internal Dependencies
 **/
import { localize } from 'i18n-calypso';
import Gridicon from 'components/gridicon';
import {
	PLAN_FREE,
	PLAN_PREMIUM,
	PLAN_BUSINESS
} from 'lib/plans/constants';
import currencyFormatter, { findCurrency } from 'lib/currency-formatter';

function currencyFormatOptions( defaults, showDecimal = true ) {
	const options = { code: defaults.code };
	const space = defaults.spaceBetweenAmountAndSymbol ? '\u00a0' : '';

	options.format = `<sup class="plan-features__header-currency-symbol">%s</sup>${ space }%v`;

	if ( ! defaults.symbolOnLeft && showDecimal ) {
		options.format = `%v</sup>${ space }<sup class="plan-features__header-currency-symbol">%s</sup>`;
	} else if ( ! defaults.symbolOnLeft ) {
		options.format = `%v${ space }<sup class="plan-features__header-currency-symbol">%s</sup>`;
	} else if ( defaults.symbolOnLeft && showDecimal ) {
		options.format = `<sup class="plan-features__header-currency-symbol">%s</sup>${ space }%v</sup>`;
	}

	if ( showDecimal ) {
		options.decimal = `<sup class="plan-features__header-cents">${ defaults.decimalSeparator }`; //open sup is closed by format string
	} else {
		options.precision = 0;
	}
	return options;
}

export class PlanFeaturesHeader extends Component {

	getPrice( rawPrice, code ) {
		const defaults = findCurrency( code );
		const priceHTML = currencyFormatter( rawPrice, currencyFormatOptions( defaults, rawPrice !== 0 ) );
		/*eslint-disable react/no-danger*/
		return (
			<h4 className="plan-features__header-price" dangerouslySetInnerHTML={ { __html: priceHTML } } />
		);
		/*eslint-enable react/no-danger*/
	}

	render() {
		const { billingTimeFrame, currencyCode, current, planType, popular, rawPrice, title, translate } = this.props;
		return (
			<header className="plan-features__header" onClick={ this.props.onClick } >
				{
					popular &&
						<div className="plan-features__header-banner">
							{ translate( 'Our most popular plan' ) }
						</div>
				}
				<div className="plan-features__header-figure" >
					{ this.getFigure( planType ) }
					{ current && <Gridicon icon="checkmark-circle" className="plan-features__header-checkmark" /> }
				</div>
				<div className="plan-features__header-text">
					<h4 className="plan-features__header-title">{ title }</h4>
					{ this.getPrice( rawPrice, currencyCode ) }
					<p className="plan-features__header-timeframe">
						{ billingTimeFrame }
					</p>
				</div>
			</header>
		);
	}

	getFigure( planType ) {
		switch ( planType ) {
			case PLAN_FREE:
				return this.getFreePlanSvg();
			case PLAN_PREMIUM:
				return this.getPremiumPlanSvg();
			case PLAN_BUSINESS:
				return this.getBusinessPlanSvg();
			default:
				return null;
		}
	}

	getFreePlanSvg() {
		/*eslint-disable react/no-danger*/
		return (
			<svg viewBox="0 0 200 200" dangerouslySetInnerHTML={ { __html: `
				<path fill="#D3DEE6" d="M133.4,7.6v98.3h-0.2c-9.1,0-16.5-7.4-16.5-16.5v0.2c0,9.1-7.4,16.5-16.5,16.5h-0.3
					c-9.1,0-16.5-7.4-16.5-16.5v-0.2c0,9.1-7.6,16.5-16.7,16.5V7.6C29.2,21.2,2.4,57.1,2.4,99.3c0,53.9,43.7,97.6,97.6,97.6
					c53.9,0,97.6-43.7,97.6-97.6C197.6,57.1,170.8,21.2,133.4,7.6z"/>
				<circle fill="none" cx="100" cy="99.3" r="97.6"/>
				<polygon fill="#FFFFFF" points="133,105.9 133.2,105.9 133.2,105.9 "/>
				<rect x="66.8" y="105.9" fill="#FFFFFF" width="0" height="0.2"/>
				<polygon fill="#91AEC2" points="99.8,105.9 100.2,105.9 100.2,105.9 "/>
				<polygon fill="#485567" points="88.5,144.9 88.5,144.9 88.5,144.9 "/>
				<polygon fill="#FFFFFF" points="133.4,105.9 100,73.2 66.6,105.9 100,165.7 "/>
				<path fill="#485567" d="M100.1,133.6H100c-6.3,0-11.6,5.1-11.6,11.4l11.6,20.7l11.6-20.7C111.6,138.7,106.4,133.6,100.1,133.6z"/>
				<path fill="#91AEC2" d="M100,1.7c-5.7,0-11.3,0.5-16.7,1.4v86.2v0.2c0,9.1,7.4,16.5,16.5,16.5h0.3c9.1,0,16.5-7.4,16.5-16.5v-0.2
					V3.2C111.3,2.2,105.7,1.7,100,1.7z"/>
				<path fill="#B1C6D4" d="M83.3,89.4V3.2c-5.7,1-11.3,2.5-16.7,4.4v98.3C75.8,105.9,83.3,98.5,83.3,89.4z"/>
				<path fill="#485567" d="M116.7,89.4c0,9.1,7.4,16.5,16.5,16.5h0.2V7.6c-5.4-1.9-10.9-3.4-16.7-4.4V89.4z"/>
			` } } ></svg>
		);
		/*eslint-enable react/no-danger*/
	}

	getPremiumPlanSvg() {
		/*eslint-disable react/no-danger*/
		return (
			<svg viewBox="0 0 124 127.1" enableBackground="new 0 0 124 127.1" dangerouslySetInnerHTML={ { __html: `
				<circle fill="#D3DEE6" cx="62" cy="63.1" r="62"/>
				<g>
					<defs>
						<circle id="SVGID_3_" cx="62" cy="63.1" r="62"/>
					</defs>
					<clipPath id="SVGID_4_">
						<use xlink:href="#SVGID_3_"  overflow="visible"/>
					</clipPath>
					<g clip-path="url(#SVGID_4_)">
						<path fill="#FFFFFF" d="M61.9,67.3H41l13.7,24.7c0-4,3.2-7.2,7.2-7.2h0.1c4,0,7.2,3.2,7.2,7.2L62,105.3l21-37.9H62.1H61.9z"/>
						<polygon fill="#485567" points="54.7,92.1 62,105.3 54.7,92.1 		"/>
						<polygon fill="#485567" points="54.7,92.1 62,105.3 69.3,92.1 		"/>
						<rect x="83" y="67.3" fill="#FFFFFF" width="0.1" height="0"/>
						<rect x="40.9" y="67.3" fill="#FFFFFF" width="0" height="0.1"/>
						<path fill="#FFFFFF" d="M62.1,67.3H83c-5.8,0-10.5-4.7-10.5-10.5C72.6,62.6,67.9,67.3,62.1,67.3z"/>
						<rect x="72.6" y="56.9" fill="#FFFFFF" width="0" height="20.9"/>
						<rect x="41" y="67.3" fill="#FFFFFF" width="20.9" height="0"/>
						<path fill="#91AEC2" d="M51.4,53.8v3.1c0,5.8,4.7,10.5,10.5,10.5h0.2c5.8,0,10.5-4.7,10.5-10.5v-3.1H51.4L51.4,53.8z"/>
						<rect x="61.9" y="67.3" fill="#91AEC2" width="0.2" height="0"/>
						<rect x="54.7" y="92.1" fill="#485567" width="0" height="0"/>
						<path fill="#485567" d="M69.3,92.1c0-4-3.2-7.2-7.2-7.2h-0.1c-4,0-7.2,3.2-7.2,7.2l0,0H69.3z"/>
						<polygon fill="#FFFFFF" points="51.4,-4.6 51.4,49.4 51.4,53.8 51.4,53.8 51.4,-4.6 		"/>
						<path fill="#FFFFFF" d="M41,67.3h20.9c-5.8,0-10.5-4.7-10.5-10.5C51.4,62.6,46.7,67.3,41,67.3z"/>
						<rect x="51.4" y="-4.6" fill="#91AEC2" width="21.1" height="58.3"/>
						<rect x="40.8" y="-4.6" fill="#B1C6D4" width="0.1" height="71.9"/>
						<path fill="#B1C6D4" d="M40.9,49.4V-4.6h0v71.9H41c5.8,0,10.5-4.7,10.5-10.5v-3.1v-4.4H40.9z"/>
						<rect x="40.9" y="-4.6" fill="#B1C6D4" width="10.6" height="53.9"/>
						<polygon fill="#485567" points="83.1,49.4 83.1,49.4 83.1,67.3 83.2,67.3 83.2,-4.6 83.1,-4.6 		"/>
						<path fill="#485567" d="M72.6,49.4V-4.6h0v58.3v3.1c0,5.8,4.7,10.5,10.5,10.5h0.1V49.4H72.6z"/>
						<rect x="83.1" y="-4.6" fill="#485567" width="0" height="53.9"/>
						<rect x="72.6" y="-4.6" fill="#485567" width="10.6" height="53.9"/>
					</g>
				</g>
				<circle fill="#D3DEE6" cx="62" cy="63" r="62"/>
				<g>
					<defs>
						<circle id="SVGID_1_" cx="62" cy="63" r="62"/>
					</defs>
					<clipPath id="SVGID_5_">
						<use xlink:href="#SVGID_1_"  overflow="visible"/>
					</clipPath>
					<g clip-path="url(#SVGID_5_)">
						<path fill="none" d="M85.2,70.9c0-9.4-5.6-17.4-13.5-21.1V37.8H52.4v12.1c-8,3.7-13.5,11.7-13.5,21.1c0,4.9,1.5,9.4,4.1,13.1h0
							c15.4,22.4,15.4,22.4,17,24.8H64c1.6-2.4,1.6-2.4,17-24.8h0C83.6,80.3,85.2,75.8,85.2,70.9z"/>
						<path fill="#FFFFFF" d="M57.4,74.8c0-2.5,2-4.6,4.6-4.6V37.8h-9.6v12.1c-8,3.7-13.5,11.7-13.5,21.1c0,4.9,1.5,9.4,4.1,13.1h0
							c15.4,22.4,15.4,22.4,17,24.8h0.3V79.1C58.6,78.4,57.4,76.7,57.4,74.8z"/>
						<path fill="#B1C6D4" d="M85.2,70.9c0-9.4-5.6-17.4-13.5-21.1V37.8H62v32.5c2.5,0,4.6,2,4.6,4.6c0,1.9-1.2,3.5-2.9,4.2v29.8H64
							c1.6-2.4,1.6-2.4,17-24.8h0C83.6,80.3,85.2,75.8,85.2,70.9z"/>
						<polygon fill="#D3DEE6" points="60.3,108.9 60.3,109.9 63.7,109.9 63.7,108.9 62,108.9 		"/>
						<path fill="#485567" d="M77.7,33H46.2c-3.2,0-5.8,2.6-5.8,5.8V39c0,3.2,2.6,5.8,5.8,5.8h31.5c3.2,0,5.8-2.6,5.8-5.8v-0.1
							C83.6,35.6,81,33,77.7,33z"/>
						<path fill="#546170" d="M62,33H46.2c-3.2,0-5.8,2.6-5.8,5.8V39c0,3.2,2.6,5.8,5.8,5.8H62V33z"/>
						<polygon fill="#D3DEE6" points="62.1,85 62.1,84.6 62.1,84.8 		"/>
						<polygon fill="#D3DEE6" points="62,85 62.1,84.8 62,84.6 		"/>
						<path fill="#546170" d="M39.8-4.6C41.1,4,43,12.5,45.5,21l5,19.1H62V-4.6H39.8z"/>
						<path fill="#485567" d="M62,40.1h11.5l5-19.1c2.5-8.4,4.4-17,5.7-25.6H62V40.1z"/>
						<rect x="62" y="-4.6" fill="#485567" width="0" height="44.7"/>
					</g>
				</g>
				<circle fill="#D3DEE6" cx="62" cy="63" r="62"/>
				<g>
					<defs>
						<circle id="SVGID_2_" cx="62" cy="63" r="62"/>
					</defs>
					<clipPath id="SVGID_6_">
						<use xlink:href="#SVGID_2_"  overflow="visible"/>
					</clipPath>
					<g clip-path="url(#SVGID_6_)">
						<g>
							<path fill="none" d="M85.3-2c-0.1,0.7-0.1,1.4-0.2,2.1C85.2-0.6,85.3-1.3,85.3-2z"/>
							<path fill="none" d="M43,35.2c-0.6-4.8-1.2-10-1.9-15.5C41.7,25.2,42.4,30.3,43,35.2z"/>
							<path fill="none" d="M84.8,3.5c0,0.1,0,0.1,0,0.2C84.7,3.7,84.8,3.6,84.8,3.5z"/>
							<path fill="none" d="M83.1,18.5c0,0.1,0,0.1,0,0.2C83.1,18.6,83.1,18.5,83.1,18.5z"/>
							<path fill="none" d="M81.1,35.1C81.1,35.1,81.1,35.1,81.1,35.1c0.2-1.7,0.4-3.3,0.6-4.9c0.1-1.1,0.3-2.2,0.4-3.3
								c0-0.4,0.1-0.8,0.1-1.1c-0.4,3.4-0.8,6.7-1.2,9.9C81.1,35.5,81.1,35.3,81.1,35.1z"/>
							<path fill="#B1C6D4" d="M57.5,94.4h-1.9v3.8L60,109c0.4,0.9,1.2,1.4,2.1,1.4v-16H57.5z"/>
							<polygon fill="#546170" points="68.5,94.4 71.2,94.4 68.5,94.4 			"/>
							<path fill="#546170" d="M40.5,14c-0.4-3.8-0.9-7.8-1.3-12C39.6,6.2,40,10.2,40.5,14z"/>
							<polygon fill="#546170" points="57.5,94.4 62,94.4 62,94.4 62,94.4 			"/>
							<path fill="#485567" d="M72.3,89.7C72.3,89.8,72.3,89.8,72.3,89.7c0.1-0.4,0.2-0.9,0.3-1.5l0,0C72.5,88.8,72.4,89.3,72.3,89.7z"
								/>
							<path fill="#485567" d="M72.7,87.7C72.7,87.7,72.7,87.7,72.7,87.7c0.1-0.6,0.3-1.2,0.4-1.9c0,0,0,0.1,0,0.1
								C73,86.5,72.9,87.1,72.7,87.7z"/>
							<path fill="#485567" d="M73.2,85.7c0,0,0-0.1,0-0.1C73.2,85.6,73.2,85.6,73.2,85.7L73.2,85.7z"/>
							<path fill="#485567" d="M76.1,70C76.1,70,76.1,70,76.1,70c0.1-0.7,0.3-1.6,0.4-2.4c0,0.2-0.1,0.3-0.1,0.5
								C76.3,68.7,76.2,69.4,76.1,70z"/>
							<path fill="#485567" d="M75.4,73.7C75.4,73.7,75.4,73.7,75.4,73.7c-0.2,1-0.3,1.9-0.5,2.7c0,0,0,0.1,0,0.1c0.3-1.4,0.5-3,0.8-4.6
								c0,0.2-0.1,0.5-0.1,0.7C75.6,73,75.5,73.3,75.4,73.7z"/>
							<path fill="#485567" d="M73.3,84.9c0,0.1,0,0.1,0,0.2c0.1-0.4,0.2-0.9,0.3-1.3c0,0,0,0,0,0C73.5,84.1,73.4,84.5,73.3,84.9z"/>
							<path fill="#485567" d="M74.5,78.9C74.5,78.9,74.5,79,74.5,78.9c0.1-0.7,0.3-1.5,0.4-2.4c0,0,0,0.1,0,0.1
								C74.8,77.4,74.6,78.2,74.5,78.9z"/>
							<path fill="#485567" d="M74,81.2C74,81.2,74,81.3,74,81.2c0.1-0.6,0.2-1.3,0.4-2c0,0,0,0,0,0.1C74.3,79.9,74.2,80.6,74,81.2z"/>
							<path fill="#485567" d="M73.6,83.4c0,0,0,0.1,0,0.1c0.1-0.6,0.2-1.2,0.4-1.9l0,0C73.9,82.2,73.7,82.8,73.6,83.4z"/>
							<path fill="#485567" d="M71.9,91.4C71.9,91.4,71.9,91.5,71.9,91.4c0.1-0.4,0.2-0.8,0.3-1.3c0,0,0,0,0,0
								C72.1,90.6,72,91,71.9,91.4z"/>
							<path fill="#485567" d="M71.3,93.8L71.3,93.8c0.1-0.4,0.3-1.2,0.5-2.1c0,0,0,0,0,0C71.6,92.6,71.5,93.3,71.3,93.8z"/>
							<path fill="#485567" d="M83.9,11.7c0-0.2,0-0.3,0.1-0.5c0,0.2,0,0.4-0.1,0.6C83.9,11.8,83.9,11.8,83.9,11.7z"/>
							<path fill="#485567" d="M71.3,94.1c0,0,0-0.1,0-0.1l0,0C71.3,94,71.3,94.1,71.3,94.1z"/>
							<path fill="#485567" d="M85.1,0.4c0-0.1,0-0.2,0-0.2c0.1-0.7,0.1-1.4,0.2-2.1c0-0.1,0-0.3,0-0.4C85.3-1.5,85.2-0.5,85.1,0.4z"/>
							<path fill="#485567" d="M84.8,3.3c0,0.1,0,0.1,0,0.2c0.1-1.1,0.2-2.3,0.4-3.4c0,0.1,0,0.2,0,0.2C85,1.4,84.9,2.4,84.8,3.3z"/>
							<path fill="#485567" d="M80.9,36.6c-0.7,5.2-1.3,10-1.9,14.4c0,0.1,0,0.1,0,0.2c0,0,0,0.1,0,0.1c-0.9,6.1-1.7,11.4-2.5,16.1
								c0,0,0,0,0,0.1c1.4-8.3,2.9-18.8,4.6-31.8c0,0.1,0,0.3-0.1,0.4C81,36.3,81,36.5,80.9,36.6z"/>
							<path fill="#485567" d="M82.4,24.7c-0.5,4.2-1,8.2-1.5,12c0-0.2,0-0.4,0.1-0.6c0-0.1,0-0.3,0.1-0.4c0.4-3.1,0.8-6.4,1.2-9.9
								c0-0.3,0.1-0.5,0.1-0.8C82.4,24.9,82.4,24.8,82.4,24.7z"/>
							<path fill="#485567" d="M84.6,4.7c0-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0-0.2C84.7,3.8,84.7,4.2,84.6,4.7z"/>
							<path fill="#485567" d="M83.9,11.3c0,0.2,0,0.3-0.1,0.5c0,0.1,0,0.1,0,0.2c-0.2,2.1-0.5,4.2-0.7,6.3c0,0.1,0,0.2,0,0.3
								c0.5-4.7,1.1-9.6,1.6-14.7c0,0.3-0.1,0.6-0.1,0.9C84.4,6.9,84.2,9.1,83.9,11.3z"/>
							<path fill="#485567" d="M83.1,18.7c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2c0-0.1,0-0.2,0-0.3C83.1,18.3,83.1,18.5,83.1,18.7z"/>
							<path fill="#485567" d="M82.4,24.7c0,0.1,0,0.3,0,0.4c0,0.3-0.1,0.5-0.1,0.8c0.3-2.3,0.6-4.7,0.8-7.2c0,0,0,0.1,0,0.1
								C82.9,20.8,82.6,22.7,82.4,24.7z"/>
							<path fill="#485567" d="M73.1,85.9c-0.1,0.6-0.3,1.2-0.4,1.8C72.9,87.1,73,86.5,73.1,85.9z"/>
							<polygon fill="#485567" points="68.5,94.4 71.2,94.4 71.2,94.4 71.2,94.4 68.5,94.4 			"/>
							<path fill="#485567" d="M72.6,88.3c-0.1,0.5-0.2,1-0.3,1.5C72.4,89.3,72.5,88.8,72.6,88.3z"/>
							<path fill="#485567" d="M71.2,94.4c0,0,0-0.1,0-0.1C71.2,94.3,71.2,94.3,71.2,94.4C71.2,94.3,71.2,94.4,71.2,94.4z"/>
							<path fill="#485567" d="M71.2,94.1L71.2,94.1c0-0.1,0-0.1,0-0.2C71.3,94,71.3,94.1,71.2,94.1z"/>
							<path fill="#485567" d="M72.2,90.1c-0.1,0.5-0.2,0.9-0.3,1.3C72,91,72.1,90.6,72.2,90.1z"/>
							<path fill="#485567" d="M73.3,84.9c0.1-0.4,0.2-0.7,0.2-1.1C73.5,84.1,73.4,84.5,73.3,84.9z"/>
							<path fill="#485567" d="M79,51c0.6-4.4,1.3-9.2,1.9-14.4c0,0.2,0,0.3-0.1,0.5C80.2,42.2,79.6,46.8,79,51z"/>
							<path fill="#485567" d="M71.3,93.8c0.1-0.4,0.3-1.2,0.5-2.1c-0.1,0.4-0.2,0.8-0.3,1.1C71.5,93.2,71.4,93.5,71.3,93.8z"/>
							<path fill="#485567" d="M83.1,18.7c-0.2,2-0.5,4-0.7,5.9C82.6,22.7,82.9,20.8,83.1,18.7z"/>
							<path fill="#485567" d="M83.9,11.9c-0.2,2.1-0.5,4.2-0.7,6.3C83.4,16.1,83.6,14,83.9,11.9z"/>
							<path fill="#485567" d="M84.6,4.7c-0.2,2.2-0.5,4.5-0.7,6.6C84.2,9.1,84.4,6.9,84.6,4.7z"/>
							<path fill="#485567" d="M85.1,0.4c-0.1,1-0.2,2-0.3,3C84.9,2.4,85,1.4,85.1,0.4z"/>
							<path fill="#485567" d="M78.9,51.3c-0.9,6.1-1.7,11.4-2.5,16.1C77.3,62.7,78.1,57.4,78.9,51.3z"/>
							<path fill="#485567" d="M74.4,79.3c-0.1,0.7-0.3,1.3-0.4,2C74.2,80.6,74.3,79.9,74.4,79.3z"/>
							<path fill="#485567" d="M74.9,76.6c-0.1,0.8-0.3,1.6-0.4,2.3C74.6,78.2,74.8,77.4,74.9,76.6z"/>
							<path fill="#485567" d="M76.4,68.1c-0.1,0.6-0.2,1.3-0.3,1.9C76.2,69.4,76.3,68.7,76.4,68.1z"/>
							<path fill="#485567" d="M75.4,73.8c-0.2,0.9-0.3,1.8-0.5,2.7C75.1,75.6,75.3,74.7,75.4,73.8z"/>
							<path fill="#485567" d="M74,81.6c-0.1,0.6-0.2,1.2-0.3,1.8C73.7,82.8,73.9,82.2,74,81.6z"/>
							<path fill="#91AEC2" d="M62,110.4c0.9,0,1.7-0.5,2.1-1.4l4.4-10.8v-3.8l-6.5,0V110.4z"/>
							<polygon fill="#91AEC2" points="65.1,94.4 62,94.4 62,94.4 68.5,94.4 68.5,94.4 			"/>
							<polygon fill="#91AEC2" points="65.1,94.4 68.5,94.4 68.5,94.4 68.1,94.4 			"/>
							<path fill="#FFFFFF" d="M52.9,94.4c0,0-0.9-3.1-2.3-10.4C52,91.2,52.9,94.4,52.9,94.4h2.6l0,0H52.9z"/>
							<path fill="#FFFFFF" d="M50.6,83.9c-0.7-3.6-1.6-8.3-2.6-14.2C49,75.6,49.9,80.3,50.6,83.9z"/>
							<path fill="#FFFFFF" d="M45.9,56.5c-0.4-2.5-0.7-5.1-1.1-7.9C45.2,51.4,45.5,54,45.9,56.5z"/>
							<path fill="#FFFFFF" d="M47,63.5c-0.4-2.2-0.7-4.6-1.1-7C46.3,59,46.6,61.3,47,63.5z"/>
							<polygon fill="#FFFFFF" points="55.6,94.4 55.6,94.4 57.5,94.4 			"/>
							<path fill="#FFFFFF" d="M55.6,94.4v-10H62V37.2H43.2c0.5,4,1,7.9,1.5,11.4c0.4,2.8,0.8,5.4,1.1,7.9c0.4,2.5,0.7,4.8,1.1,7
								c0.3,2.2,0.7,4.3,1,6.2c1,5.8,1.9,10.5,2.6,14.2c1.5,7.3,2.3,10.4,2.3,10.4H55.6z"/>
							<polygon fill="#FFFFFF" points="62,84.4 55.6,84.4 55.6,94.4 57.5,94.4 62,94.4 			"/>
							<path fill="#B1C6D4" d="M76,70.1c-0.1,0.6-0.2,1.2-0.3,1.8C75.8,71.3,75.9,70.7,76,70.1z"/>
							<path fill="#B1C6D4" d="M76.5,67.5L76.5,67.5c0,0,0,0.1,0,0.1C76.5,67.6,76.5,67.5,76.5,67.5z"/>
							<path fill="#B1C6D4" d="M74.9,76.5C74.9,76.5,74.9,76.5,74.9,76.5C74.9,76.5,74.9,76.5,74.9,76.5z"/>
							<path fill="#B1C6D4" d="M74.5,79c0,0.1,0,0.1,0,0.2C74.4,79.1,74.5,79.1,74.5,79z"/>
							<path fill="#B1C6D4" d="M71.9,91.5c0,0.1,0,0.1,0,0.2C71.9,91.6,71.9,91.5,71.9,91.5z"/>
							<path fill="#B1C6D4" d="M72.2,90.1c0-0.1,0-0.1,0-0.2c0,0,0-0.1,0-0.1C72.3,89.9,72.2,90,72.2,90.1L72.2,90.1z"/>
							<path fill="#B1C6D4" d="M72.7,87.7c0,0.2-0.1,0.4-0.1,0.5C72.7,88.1,72.7,87.9,72.7,87.7z"/>
							<path fill="#B1C6D4" d="M73.2,85.7C73.2,85.7,73.2,85.7,73.2,85.7C73.2,85.7,73.1,85.7,73.2,85.7C73.1,85.8,73.2,85.7,73.2,85.7z
								"/>
							<path fill="#B1C6D4" d="M71.3,93.8L71.3,93.8c0,0,0,0.1,0,0.2C71.3,93.9,71.3,93.9,71.3,93.8z"/>
							<polygon fill="#B1C6D4" points="71.2,94.4 71.2,94.4 71.2,94.4 			"/>
							<path fill="#B1C6D4" d="M71.2,94.1C71.2,94.2,71.2,94.2,71.2,94.1C71.2,94.2,71.2,94.2,71.2,94.1z"/>
							<path fill="#B1C6D4" d="M73.3,85.1C73.3,85.1,73.3,85.1,73.3,85.1c0,0.1-0.1,0.3-0.1,0.5C73.2,85.4,73.2,85.3,73.3,85.1z"/>
							<path fill="#B1C6D4" d="M74,81.3c0,0.1,0,0.2-0.1,0.3C74,81.5,74,81.4,74,81.3z"/>
							<path fill="#B1C6D4" d="M73.6,83.7c0-0.1,0-0.1,0-0.2C73.6,83.6,73.6,83.6,73.6,83.7C73.6,83.7,73.6,83.7,73.6,83.7z"/>
							<rect x="62" y="37.2" fill="#B1C6D4" width="0" height="47.3"/>
							<polygon fill="#B1C6D4" points="62,94.4 62,94.4 62,94.4 62,84.4 62,84.4 			"/>
							<path fill="#B1C6D4" d="M76.4,68.1c0-0.2,0.1-0.3,0.1-0.5c0,0,0-0.1,0-0.1c0,0,0,0,0-0.1C76.5,67.6,76.4,67.9,76.4,68.1z"/>
							<path fill="#B1C6D4" d="M74,81.6L74,81.6c0-0.1,0-0.2,0.1-0.3c0,0,0,0,0-0.1C74,81.4,74,81.5,74,81.6z"/>
							<path fill="#B1C6D4" d="M74.4,79.3C74.4,79.2,74.4,79.2,74.4,79.3c0-0.1,0-0.2,0-0.3c0,0,0-0.1,0-0.1
								C74.5,79,74.4,79.1,74.4,79.3z"/>
							<path fill="#B1C6D4" d="M74.9,76.6C74.9,76.6,74.9,76.5,74.9,76.6C74.9,76.5,74.9,76.5,74.9,76.6c0-0.1,0-0.2,0-0.2
								C74.9,76.5,74.9,76.5,74.9,76.6z"/>
							<path fill="#B1C6D4" d="M71.3,94L71.3,94c0-0.1,0-0.1,0-0.2l0,0C71.3,93.9,71.3,93.9,71.3,94z"/>
							<path fill="#B1C6D4" d="M75.4,73.8C75.4,73.7,75.4,73.7,75.4,73.8c0.1-0.4,0.1-0.8,0.2-1.2c0-0.2,0.1-0.5,0.1-0.7
								c0.1-0.6,0.2-1.2,0.3-1.8c0,0,0,0,0-0.1C75.8,71.3,75.6,72.6,75.4,73.8z"/>
							<path fill="#B1C6D4" d="M71.9,91.7C71.9,91.7,71.9,91.6,71.9,91.7c0-0.1,0-0.1,0-0.2c0,0,0,0,0,0C71.9,91.5,71.9,91.6,71.9,91.7z
								"/>
							<path fill="#B1C6D4" d="M73.6,83.7C73.6,83.7,73.6,83.7,73.6,83.7c0-0.1,0-0.2,0-0.3c0,0,0-0.1,0-0.1
								C73.6,83.5,73.6,83.6,73.6,83.7z"/>
							<path fill="#B1C6D4" d="M79,51.2c0-0.1,0-0.1,0-0.2C79,51.1,79,51.2,79,51.2C78.9,51.3,79,51.3,79,51.2z"/>
							<path fill="#B1C6D4" d="M73.1,85.9c0,0,0-0.1,0-0.1c0,0,0-0.1,0-0.1l0,0c0,0,0-0.1,0-0.1c0-0.2,0.1-0.4,0.1-0.5
								c0-0.1,0-0.1,0-0.2C73.3,85.2,73.2,85.6,73.1,85.9z"/>
							<path fill="#B1C6D4" d="M72.2,90.1C72.2,90.1,72.2,90.1,72.2,90.1c0-0.1,0.1-0.2,0.1-0.3c0,0,0,0,0-0.1
								C72.3,89.9,72.2,90,72.2,90.1z"/>
							<path fill="#B1C6D4" d="M72.6,88.3L72.6,88.3c0-0.2,0.1-0.4,0.1-0.6c0,0,0,0,0,0C72.7,87.9,72.7,88.1,72.6,88.3z"/>
							<path fill="#B1C6D4" d="M71.3,93.8c0.1-0.3,0.2-0.6,0.3-1.1c0.1-0.3,0.2-0.7,0.3-1.1c0-0.1,0-0.1,0.1-0.2
								c0.1-0.4,0.2-0.8,0.3-1.3c0-0.1,0.1-0.3,0.1-0.4c0.1-0.4,0.2-0.9,0.3-1.5c0-0.2,0.1-0.4,0.1-0.6c0.1-0.6,0.2-1.2,0.4-1.8
								c0.1-0.3,0.1-0.7,0.2-1c0.1-0.4,0.2-0.7,0.2-1.1c0-0.1,0-0.2,0.1-0.4c0.1-0.6,0.2-1.1,0.3-1.8c0-0.1,0-0.3,0.1-0.4
								c0.1-0.6,0.2-1.3,0.4-2c0-0.1,0-0.2,0.1-0.3c0.1-0.7,0.3-1.5,0.4-2.3c0-0.1,0-0.1,0-0.2c0.2-0.9,0.3-1.7,0.5-2.7
								c0.2-1.2,0.4-2.4,0.6-3.7c0.1-0.6,0.2-1.3,0.3-1.9c0-0.2,0.1-0.4,0.1-0.7c0.8-4.7,1.6-10,2.5-16.1c0-0.1,0-0.2,0-0.3
								c0.6-4.3,1.2-8.9,1.9-13.9H62v47.3h6.5v10h2.6l0,0c0,0,0,0,0,0c0,0,0-0.1,0-0.1c0,0,0,0,0-0.1c0,0,0-0.1,0-0.2
								C71.3,93.9,71.3,93.9,71.3,93.8z"/>
							<polygon fill="#B1C6D4" points="62,94.4 65.1,94.4 62,94.4 			"/>
							<polygon fill="#B1C6D4" points="65.1,94.4 68.1,94.4 68.5,94.4 68.5,84.4 62,84.4 62,94.4 			"/>
						</g>
						<path fill="#546170" d="M38.6-3.7c0.2,2,0.4,3.9,0.6,5.8c0.4,4.2,0.9,8.2,1.3,12c0.2,1.9,0.4,3.8,0.6,5.6
							c0.6,5.5,1.3,10.7,1.9,15.5c0.1,0.7,0.2,1.3,0.3,2H62V-3.7H38.6z"/>
						<path fill="#485567" d="M62,37.2h18.8c0-0.2,0-0.3,0.1-0.5c0.5-3.8,1-7.8,1.5-12c0.2-1.9,0.5-3.9,0.7-5.9c0-0.2,0-0.4,0.1-0.6
							c0.2-2,0.5-4.1,0.7-6.3c0-0.2,0-0.4,0.1-0.6c0.2-2.2,0.5-4.4,0.7-6.6c0-0.4,0.1-0.9,0.1-1.3c0.1-1,0.2-2,0.3-3
							c0.1-0.9,0.2-1.9,0.3-2.8c0-0.4,0.1-0.9,0.1-1.3H62V37.2z"/>
					</g>
				</g>
			` } } ></svg>
		);
		/*eslint-enable react/no-danger*/
	}

	getBusinessPlanSvg() {
		/*eslint-disable react/no-danger*/
		return (
			<svg viewBox="0 0 124 127.1" enableBackground="new 0 0 124 127.1" dangerouslySetInnerHTML={ { __html: `
				<circle fill="#D3DEE6" cx="62" cy="63.1" r="62"/>
				<g>
					<defs>
						<circle id="SVGID_3_" cx="62" cy="63.1" r="62"/>
					</defs>
					<clipPath id="SVGID_2_">
						<use xlink:href="#SVGID_3_"  overflow="visible"/>
					</clipPath>
					<g clip-path="url(#SVGID_2_)">
						<path fill="#FFFFFF" d="M61.9,67.3H41l13.7,24.7c0-4,3.2-7.2,7.2-7.2h0.1c4,0,7.2,3.2,7.2,7.2L62,105.3l21-37.9H62.1H61.9z"/>
						<polygon fill="#485567" points="54.7,92.1 62,105.3 54.7,92.1 		"/>
						<polygon fill="#485567" points="54.7,92.1 62,105.3 69.3,92.1 		"/>
						<rect x="83" y="67.3" fill="#FFFFFF" width="0.1" height="0"/>
						<rect x="40.9" y="67.3" fill="#FFFFFF" width="0" height="0.1"/>
						<path fill="#FFFFFF" d="M62.1,67.3H83c-5.8,0-10.5-4.7-10.5-10.5C72.6,62.6,67.9,67.3,62.1,67.3z"/>
						<rect x="72.6" y="56.9" fill="#FFFFFF" width="0" height="20.9"/>
						<rect x="41" y="67.3" fill="#FFFFFF" width="20.9" height="0"/>
						<path fill="#91AEC2" d="M51.4,53.8v3.1c0,5.8,4.7,10.5,10.5,10.5h0.2c5.8,0,10.5-4.7,10.5-10.5v-3.1H51.4L51.4,53.8z"/>
						<rect x="61.9" y="67.3" fill="#91AEC2" width="0.2" height="0"/>
						<rect x="54.7" y="92.1" fill="#485567" width="0" height="0"/>
						<path fill="#485567" d="M69.3,92.1c0-4-3.2-7.2-7.2-7.2h-0.1c-4,0-7.2,3.2-7.2,7.2l0,0H69.3z"/>
						<polygon fill="#FFFFFF" points="51.4,-4.6 51.4,49.4 51.4,53.8 51.4,53.8 51.4,-4.6 		"/>
						<path fill="#FFFFFF" d="M41,67.3h20.9c-5.8,0-10.5-4.7-10.5-10.5C51.4,62.6,46.7,67.3,41,67.3z"/>
						<rect x="51.4" y="-4.6" fill="#91AEC2" width="21.1" height="58.3"/>
						<rect x="40.8" y="-4.6" fill="#B1C6D4" width="0.1" height="71.9"/>
						<path fill="#B1C6D4" d="M40.9,49.4V-4.6h0v71.9H41c5.8,0,10.5-4.7,10.5-10.5v-3.1v-4.4H40.9z"/>
						<rect x="40.9" y="-4.6" fill="#B1C6D4" width="10.6" height="53.9"/>
						<polygon fill="#485567" points="83.1,49.4 83.1,49.4 83.1,67.3 83.2,67.3 83.2,-4.6 83.1,-4.6 		"/>
						<path fill="#485567" d="M72.6,49.4V-4.6h0v58.3v3.1c0,5.8,4.7,10.5,10.5,10.5h0.1V49.4H72.6z"/>
						<rect x="83.1" y="-4.6" fill="#485567" width="0" height="53.9"/>
						<rect x="72.6" y="-4.6" fill="#485567" width="10.6" height="53.9"/>
					</g>
				</g>
				<circle fill="#D3DEE6" cx="62" cy="63" r="62"/>
				<g>
					<defs>
						<circle id="SVGID_1_" cx="62" cy="63" r="62"/>
					</defs>
					<clipPath id="SVGID_4_">
						<use xlink:href="#SVGID_1_"  overflow="visible"/>
					</clipPath>
					<g clip-path="url(#SVGID_4_)">
						<path fill="none" d="M85.2,70.9c0-9.4-5.6-17.4-13.5-21.1V37.8H52.4v12.1c-8,3.7-13.5,11.7-13.5,21.1c0,4.9,1.5,9.4,4.1,13.1h0
							c15.4,22.4,15.4,22.4,17,24.8H64c1.6-2.4,1.6-2.4,17-24.8h0C83.6,80.3,85.2,75.8,85.2,70.9z"/>
						<path fill="#FFFFFF" d="M57.4,74.8c0-2.5,2-4.6,4.6-4.6V37.8h-9.6v12.1c-8,3.7-13.5,11.7-13.5,21.1c0,4.9,1.5,9.4,4.1,13.1h0
							c15.4,22.4,15.4,22.4,17,24.8h0.3V79.1C58.6,78.4,57.4,76.7,57.4,74.8z"/>
						<path fill="#B1C6D4" d="M85.2,70.9c0-9.4-5.6-17.4-13.5-21.1V37.8H62v32.5c2.5,0,4.6,2,4.6,4.6c0,1.9-1.2,3.5-2.9,4.2v29.8H64
							c1.6-2.4,1.6-2.4,17-24.8h0C83.6,80.3,85.2,75.8,85.2,70.9z"/>
						<polygon fill="#D3DEE6" points="60.3,108.9 60.3,109.9 63.7,109.9 63.7,108.9 62,108.9 		"/>
						<path fill="#485567" d="M77.7,33H46.2c-3.2,0-5.8,2.6-5.8,5.8V39c0,3.2,2.6,5.8,5.8,5.8h31.5c3.2,0,5.8-2.6,5.8-5.8v-0.1
							C83.6,35.6,81,33,77.7,33z"/>
						<path fill="#546170" d="M62,33H46.2c-3.2,0-5.8,2.6-5.8,5.8V39c0,3.2,2.6,5.8,5.8,5.8H62V33z"/>
						<polygon fill="#D3DEE6" points="62.1,85 62.1,84.6 62.1,84.8 		"/>
						<polygon fill="#D3DEE6" points="62,85 62.1,84.8 62,84.6 		"/>
						<path fill="#546170" d="M39.8-4.6C41.1,4,43,12.5,45.5,21l5,19.1H62V-4.6H39.8z"/>
						<path fill="#485567" d="M62,40.1h11.5l5-19.1c2.5-8.4,4.4-17,5.7-25.6H62V40.1z"/>
						<rect x="62" y="-4.6" fill="#485567" width="0" height="44.7"/>
					</g>
				</g>
			` } } ></svg>
		);
		/*eslint-enable react/no-danger*/
	}
}

PlanFeaturesHeader.propTypes = {
	billingTimeFrame: PropTypes.string.isRequired,
	current: PropTypes.bool,
	onClick: PropTypes.func,
	planType: React.PropTypes.oneOf( [ PLAN_FREE, PLAN_PREMIUM, PLAN_BUSINESS ] ).isRequired,
	popular: PropTypes.bool,
	rawPrice: PropTypes.number.isRequired,
	currencyCode: PropTypes.string,
	title: PropTypes.string.isRequired,
	translate: PropTypes.func
};

PlanFeaturesHeader.defaultProps = {
	currencyCode: 'USD',
	current: false,
	onClick: noop,
	popular: false,
	translate: identity
};

export default localize( PlanFeaturesHeader );
