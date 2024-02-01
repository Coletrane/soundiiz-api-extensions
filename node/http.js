import axios, {HttpStatusCode} from 'axios'
import {getSoundiizErrorCode, getSoundiizErrorMessage} from './utilities.js'
import {
	promptForPasteNewAccessTokenIfNeeded, promptForPasteNewCookieIfNeeded
} from './config.js'
import _ from 'lodash'

/**
 * GETs the given endpoint
 * @param endpoint {string}
 * @param config {AxiosRequestConfig}
 * @return {Promise<AxiosResponse<SoundiizPlaylistResponse | SoundiizErrorResponse>>}
 */
export async function get(endpoint, config) {
	console.log(`GET: ${endpoint}`)
	/**
	 * Add types to this as new calls to this method are added
	 * @type {AxiosResponse<SoundiizPlaylistResponse | SoundiizErrorResponse>}
	 */
	return executeRequest(() => axios.get(endpoint, config))
}

/**
 * POSTs to the given endpoint
 * @param endpoint {string}
 * @param data {Object}
 * @param config {AxiosRequestConfig}
 * @return {Promise<AxiosResponse<SoundiizBatchTransferResponse | SoundiizSyncSuccessResponse |
 * SoundiizErrorResponse>>}
 */
export async function post(endpoint, data, config) {
	console.log(`POST: ${endpoint}`)
	/**
	 * @type {AxiosResponse<SoundiizBatchTransferResponse | SoundiizSyncSuccessResponse |
	 * SoundiizErrorResponse>}
	 */
	return executeRequest(() => axios.post(endpoint, data, config))
}

/**
 * @param requestFunction {function(): Promise<AxiosResponse<* | SoundiizErrorResponse>>}
 */
async function executeRequest(requestFunction) {
	try {
		const response = await requestFunction()
		const shouldRetry = await handleResponse(response)
		if (!shouldRetry) return Promise.resolve(response)

		// if there was an error re-try the request once in case the user pasted
		// a new cookie or access token
		return await requestFunction()
	} catch (err) {
		await errorHandler(err)
		throw err
	}
}

/**
 * General handler for all Soundiiz API calls.
 * @param response {AxiosResponse<*>}
 * @return {Promise<boolean>} A promise that resolves to true if the request should be retried.
 */
async function handleResponse(response) {
	const newCookiePasted = await promptForPasteNewCookieIfNeeded(response)

	// FIXME: new cookie being pasted isn't leading to retried request
	if (response.status === HttpStatusCode.Ok &&
		_.isNil(response?.data?.error)) return Promise.resolve(newCookiePasted)

	/**
	 * @type {SoundiizErrorResponse}
	 */
	const soundiizError = response?.data
	return await errorHandler(soundiizError)
}

/**
 * General error handler for Soundiiz API calls
 * @param soundiizError {SoundiizErrorResponse}
 * @return {Promise<boolean>} A promise that resolves to true if the request should be retried.
 */
async function errorHandler(soundiizError) {
	console.error(getSoundiizErrorMessage(soundiizError))
	const errorCode = getSoundiizErrorCode(soundiizError)
	await promptForPasteNewAccessTokenIfNeeded(errorCode)
}