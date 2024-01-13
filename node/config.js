import fs from 'fs'
import _ from 'lodash'
import {SOUNDIIZ_ERROR_CODES} from './constants.js'
import {questionSync} from './utilities.js'
import {HttpStatusCode} from 'axios'

/**
 * @typedef  {{ [key: string]: string|number }} Config
 * @property {string} soundiizAccessToken - The Soundiiz access token.
 * @property {string} soundiizCookie - The Soundiiz cookie.
 */
let cachedConfig = null
const DEFAULT_CONFIG_PATH = '../config.json'
/**
 * The path to the config file.
 * @type {string}
 */
let configPath = DEFAULT_CONFIG_PATH

/**
 * Sets the path to the config file.
 * @param path {string}
 */
export function setConfigPath(path) {
	configPath = path
}

/**
 * Gets the config from the config file or the cached config if it has already been loaded.
 * @return {Config| {}}
 */

export function getConfig() {
	if (!_.isNil(cachedConfig)) return cachedConfig

	const config = fs.readFileSync(configPath)
	cachedConfig = JSON.parse(config)
	return cachedConfig ?? {}
}

/**
 * Saves the given config to the config file.
 * @param config {Config}
 */
export function saveConfig(config) {
	fs.writeFileSync(configPath, JSON.stringify(config, null, 4))
}


/**
 * Prompts the user to paste a new access token when the old one is expired.
 * @param errorCode {typeof SoundiizErrorCode}
 * @return {Promise<boolean>}A promise that resolves to true if a new access token was pasted.
 */
export async function promptForPasteNewAccessTokenIfNeeded(errorCode) {
	if (errorCode !== SOUNDIIZ_ERROR_CODES.EXPIRED_ACCESS_TOKEN) return Promise.resolve(false)

	const config = await getConfig()
	config.soundiizAccessToken = await questionSync(
		'Your access token has expired. Please paste a new one:')
	await saveConfig(config)
	return Promise.resolve(true)
}

/**
 * Checks if the given response is a 200 for the login page, which means the user needs
 * to paste a new cookie.
 * @param response {AxiosResponse}
 * @return {Promise<boolean>} A promise that resolves to true if a new cookie was pasted.
 *
 */
export async function promptForPasteNewCookieIfNeeded(response) {
	if (response.status !== HttpStatusCode.Ok) return Promise.resolve(false)
	if (!isLoginPage(response.data)) return Promise.resolve(false)

	const config = await getConfig()
	config.soundiizCookie = await questionSync(
		'Your cookie has expired. Please paste a new one:')
	await saveConfig(config)
	return Promise.resolve(true)
}

function isLoginPage(html) {
	if (typeof html !== 'string') return false

	return html.includes('<title>Sign in - Soundiiz</title>') ||
		html.includes('href="https://soundiiz.com/login"')
}

export default {
	getConfig,
	saveConfig
}