import {
	AUTOMATION_ENDPOINT, BATCH_ADD_ENDPOINT, SOUNDIIZ_API_BASE_URL,
	SOUNDIIZ_WEBAPI_BASE_URL, SYNCS_ENDPOINT,
	SYNCS_EXEC_ENDPOINT,
	USER_PLATFORMS_ENDPOINT
} from './constants.js'
import readline from 'readline'
import {getConfig} from './config.js'

// All of these endpoint functions should be callable endpoints only

/**
 * @param syncId {number}
 */
export function getSyncEndpoint(syncId) {
	return `${SOUNDIIZ_API_BASE_URL}/${SYNCS_ENDPOINT}/${syncId}`
}
/**
 * @param syncId {number}
 */
export function getSyncExecEndpoint(syncId) {
	return `${getSyncEndpoint(syncId)}/${SYNCS_EXEC_ENDPOINT}`
}

export function getAddBatchEndpoint() {
	return `${SOUNDIIZ_WEBAPI_BASE_URL}/${AUTOMATION_ENDPOINT}/${BATCH_ADD_ENDPOINT}`
}

/**
 *
 * @param platform {keyof SoundiizPlatform}
 */
export function getPlaylistsEndpoint(platform) {
	return `${SOUNDIIZ_API_BASE_URL}/${USER_PLATFORMS_ENDPOINT}/${platform}/playlists`
}

export function getAuthorizationHeader() {
	return `Bearer ${getConfig().soundiizAccessToken}`
}

export function getCookie() {
	return getConfig().soundiizCookie
}

/**
 * @param soundiizError {SoundiizErrorResponse}
 * @return {typeof SoundiizErrorCode}
 */
export function getSoundiizErrorCode(soundiizError) {
	return soundiizError['error_code']
}

/**
 * @param soundiizError {SoundiizErrorResponse}
 * @return {string}
 */
export function getSoundiizErrorMessage(soundiizError) {
	return soundiizError['error_message']
}

/**
 * @return {Promise<unknown>}
 */
export function waitFor1Minute() {
	return new Promise(resolve => setTimeout(resolve, 60000))
}

/**
 * @param question {String} - The question to ask.
 * @param [callback] {(string) => void} - The callback to run after the question is asked.
 * @returns {Promise<string>}
 */
export async function questionSync(question, callback) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	return new Promise(resolve => {
		rl.question(question, async answer => {
			callback && callback(answer)
			rl.close()
			resolve(answer)
		})
	})
}