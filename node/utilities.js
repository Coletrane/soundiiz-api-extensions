import readline from 'readline'
import {getConfig} from './config.js'

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