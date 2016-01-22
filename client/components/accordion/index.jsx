/**
 * External dependencies
 */
var React = require( 'react' ),
	noop = require( 'lodash/utility/noop' ),
	classNames = require( 'classnames' );

module.exports = React.createClass( {
	displayName: 'Accordion',

	propTypes: {
		initialExpanded: React.PropTypes.bool,
		onToggle: React.PropTypes.func,
		title: React.PropTypes.string.isRequired,
		subtitle: React.PropTypes.string,
		offline: React.PropTypes.bool,
		icon: React.PropTypes.oneOfType( [
			React.PropTypes.string,
			React.PropTypes.element
		] )
	},

	getInitialState: function() {
		return {
			isExpanded: this.props.initialExpanded
		};
	},

	getDefaultProps: function() {
		return {
			onToggle: noop
		};
	},

	toggleExpanded: function() {
		var isExpanded = ! this.state.isExpanded;

		if ( this.props.offline ) {
			return;
		}

		this.setState( {
			isExpanded: isExpanded
		} );

		this.props.onToggle( isExpanded );
	},

	renderIcon: function() {
		if ( ! this.props.icon ) {
			return;
		}

		if ( 'string' === typeof this.props.icon ) {
			return <span className={ classNames( 'accordion__icon', this.props.icon ) } />;
		}

		return <span className="accordion__icon">{ this.props.icon }</span>;
	},

	renderSubtitle: function() {
		if ( this.props.subtitle ) {
			return <span className="accordion__subtitle">{ this.props.subtitle }</span>;
		}
	},

	renderHeader: function() {
		var classes = classNames( 'accordion__header', {
			'has-icon': !! this.props.icon,
			'has-subtitle': !! this.props.subtitle
		} );

		return (
			<header className={ classes }>
				<button type="button" onTouchTap={ this.toggleExpanded } className="accordion__toggle">
					{ this.renderIcon() }
					<span className="accordion__title">{ this.props.title }</span>
					{ this.renderSubtitle() }
					{ this.props.offline && <svg className="gridicon accordion__offline-icon" height={ 24 } width={ 24 } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M12.736 3.184L7.834 12.57l5.106.035-2.592 7.904 7.265-10.502-5.65.083.773-6.906z" /></g></svg> }
				</button>
			</header>
		);
	},

	render: function() {
		var classes = classNames( 'accordion', this.props.className, {
			'is-expanded': this.state.isExpanded,
			'is-offline': this.props.offline
		} );

		return (
			<div className={ classes }>
				{ this.renderHeader() }
				<div ref="content" className="accordion__content">
					<div className="accordion__content-wrap">
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	}
} );
