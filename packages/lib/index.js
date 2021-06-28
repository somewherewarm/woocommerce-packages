/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { getIdsFromQuery } from '@woocommerce/navigation';

/**
 * Exports.
 */
export default function getRequestByIdString( path, handleData = identity ) {
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
