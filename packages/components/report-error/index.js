/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import PropTypes from 'prop-types';
import { EmptyContent } from '@woocommerce/components';
import { getAdminLink } from '@woocommerce/settings';

/**
 * Component to render when there is an error in a report component due to data
 * not being loaded or being invalid.
 */
class ReportError extends Component {
	render() {
		const { className, isError, isEmpty } = this.props;
		let title, actionLabel, actionURL, actionCallback;

		if ( isError ) {
			title = __(
				'There was an error getting your stats. Please try again.',
				'woocommerce-product-bundles'
			);
			actionLabel = __( 'Reload', 'woocommerce-product-bundles' );
			actionCallback = () => {
				window.location.reload();
			};
		} else if ( isEmpty ) {
			title = __(
				'No results could be found for this date range.',
				'woocommerce-product-bundles'
			);
			actionLabel = __( 'View Orders', 'woocommerce-product-bundles' );
			actionURL   = getAdminLink( 'edit.php?post_type=shop_order' );
		}
		return (
			<EmptyContent
				className={ className }
				title={ title }
				actionLabel={ actionLabel }
				actionURL={ actionURL }
				actionCallback={ actionCallback }
			/>
		);
	}
}

ReportError.propTypes = {

	/**
	 * Additional class name to style the component.
	 */
	className: PropTypes.string,

	/**
	 * Boolean representing whether there was an error.
	 */
	isError: PropTypes.bool,

	/**
	 * Boolean representing whether the issue is that there is no data.
	 */
	isEmpty: PropTypes.bool,
};

ReportError.defaultProps = {
	className: '',
};

export default ReportError;
