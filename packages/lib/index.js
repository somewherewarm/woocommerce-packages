/**
 * External dependencies.
 */
import { find } from 'lodash';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { getIdsFromQuery } from '@woocommerce/navigation';

/**
 * Exports.
 */
export function getRequestByIdString( path, handleData = identity ) {
	return function ( queryString = '' ) {
		const pathString = path;
		const idList     = getIdsFromQuery( queryString );
		if ( idList.length < 1 ) {
			return Promise.resolve( [] );
		}
		const payload = {
			include: idList.join( ',' ),
			per_page: idList.length,
		};
		return apiFetch( {
			path: addQueryArgs( pathString, payload ),
		} ).then( ( data ) => data.map( handleData ) );
	};
}

/**
 * Takes a chart name returns the configuration for that chart from and array
 * of charts. If the chart is not found it will return the first chart.
 *
 * @param {string} chartName - the name of the chart to get configuration for
 * @param {Array} charts - list of charts for a particular report
 * @return {Object} - chart configuration object
 */
export function getSelectedChart( chartName, charts = [] ) {
	const chart = find( charts, { key: chartName } );
	if ( chart ) {
		return chart;
	}

	return charts[ 0 ];
}

