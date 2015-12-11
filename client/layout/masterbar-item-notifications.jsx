/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import MasterbarItem from './masterbar-item';
import Notifications from 'notifications';
import store from 'store';

export default React.createClass( {
	displayName: 'MasterbarItemNotifications',

	propTypes: {
		user: React.PropTypes.object,
		isActive: React.PropTypes.bool,
		className: React.PropTypes.string
	},

	getInitialState() {
		return {
			isShowingPopover: false,
			newNote: 0,
			animationState: 0,
		};
	},

	toggleNotificationsPopover( isShowingPopover ) {
		isShowingPopover = ! this.state.isShowingPopover;

		this.setState( {
			isShowingPopover: ! this.state.isShowingPopover
		}, this.toggleNotesFrame );
	},

	onClick( event ) {
		this.toggleNotificationsPopover();
		event.preventDefault();
		return;
	},

	checkToggleNotes( event, forceToggle ) {
		/*var target = event ? event.target : false;
		var notificationNode = this.getNotificationLinkDomNode();

		// Some clicks should not toggle the notifications frame
		if ( target === notificationNode || target.parentElement === notificationNode ) {
			return;
		}*/

		if ( this.state.showNotes || forceToggle === true ) {
			this.toggleNotesFrame();
		}
	},

	toggleNotesFrame() {
		if ( this.state.isShowingPopover ) {
			this.setNotesIndicator( 0 );
		} else {
			//this.getNotificationLinkDomNode().blur();
			window.focus();
		}
	},

	/*toggleNotesFrame( event ) {
		if ( event ) {
			event.preventDefault();
		}

		this.setState( {
			showNotes: ! this.state.showNotes
		}, function() {
			if ( this.state.showNotes ) {
				this.setNotesIndicator( 0 );
			}

			// focus on main window if we just closed the notes panel
			if ( ! this.state.showNotes ) {
				//this.getNotificationLinkDomNode().blur();
				window.focus();
			}
		}.bind( this ) );
	},*/

	getNotificationLinkDomNode() {
		return this.refs.masterbar.refs.notificationLink.getDOMNode();
	},

	/**
	 * Uses the passed number of unseen notifications
	 * and the locally-stored cache of that value to
	 * determine what state the notifications indicator
	 * should be in: on, off, or animate-to-on
	 *
	 * @param {Number} currentUnseenCount Number of reported unseen notifications
	 */
	setNotesIndicator( currentUnseenCount ) {
		var existingUnseenCount = store.get( 'wpnotes_unseen_count' );
		var newAnimationState = this.state.animationState;

		// Having no record of previously unseen notes is
		// functionally equal to having a record of none
		if ( null === existingUnseenCount ) {
			existingUnseenCount = 0;
		}

		if ( 0 === currentUnseenCount ) {
			// If we don't have new notes at load-time, remove the `-1` "init" status
			newAnimationState = 0;
		} else if ( currentUnseenCount > existingUnseenCount ) {
			// Animate the indicator bubble by swapping CSS classes through the animation state
			// Note that we could have an animation state of `-1` indicating the initial load
			newAnimationState = ( 1 - Math.abs( this.state.animationState ) );
		}

		store.set( 'wpnotes_unseen_count', currentUnseenCount );

		this.setState( {
			newNote: ( currentUnseenCount > 0 ),
			animationState: newAnimationState
		} );
	},

	render() {
		var classes = classNames( this.props.className, {
			'is-active': this.state.isShowingPopover,
			'has-unread': this.props.newNote,
			'is-initial-load': this.props.animationState === -1,
		} );

		return (
			<MasterbarItem url="/notifications" icon="bell" onClick={ this.onClick } isActive={ this.props.isActive } tooltip={ this.translate( 'Manage your notifications', { textOnly: true } ) } className={ classes }>
				{ this.props.children }
				<span className="masterbar__notifications-bubble" key={ 'notification-indicator-animation-state-' + Math.abs( this.props.animationState ) }></span>

				<Notifications
					visible={ this.state.isShowingPopover }
					checkToggle={ this.checkToggleNotes }
					setIndicator={ this.setNotesIndicator } />
			</MasterbarItem>
		);
	}
} );
