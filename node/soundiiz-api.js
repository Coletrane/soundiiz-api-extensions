import {
	getAddBatchEndpoint, getAuthorizationHeader, getCookie,
	getPlaylistsEndpoint, getSoundiizErrorCode, getSoundiizErrorMessage,
	getSyncExecEndpoint, waitFor1Minute
} from './utilities.js'
import {PLATFORM, SOUNDIIZ_BATCH_METHOD, SOUNDIIZ_ERROR_CODES} from './constants.js'
import _ from 'lodash'
import chalk from 'chalk'
import {post, get} from './http.js'
import {setConfigPath} from './config.js'

/**
 *
 * @param syncId
 * @return {Promise<AxiosResponse<SoundiizSyncSuccessResponse | SoundiizErrorResponse>>}
 */
async function requestExecSync(syncId) {
	const endpoint = getSyncExecEndpoint(syncId)
	/**
	 * @type {AxiosRequestConfig}
	 */
	const config = {
		headers: {
			Authorization: getAuthorizationHeader()
		}
	}
	return post(endpoint, {}, config)
}

/**
 * Runs the given syncs sequentially
 * @param syncIds {number[]}
 * @return {Promise<void>} A promise that resolves when all the syncs have been kicked off,
 * NOT when they are complete!
 */
async function runSyncs(syncIds) {
	if (_.isEmpty(syncIds)) return Promise.resolve()

	async function tryToExecSync(syncId) {
		while (true) {
			try {
				const response = await requestExecSync(syncId)
				const soundiizResponse = response?.data
				/**
				 * @type SoundiizSyncSuccessResponse
				 */
				if (soundiizResponse?.data) {
					console.log(chalk.green(`Sync ${syncId} executed successfully!\n`))
					break
				} else if (soundiizResponse?.error) {
					/**
					 * @type {SoundiizErrorResponse}
					 */
					const soundiizError = response?.data
					const retry = await waitAndRetrySync(soundiizError, syncId)
					if (!retry) break
					continue
				}

				break
			} catch (err) {
				const retry = await waitFor1Minute()
				if (!retry) break
			}
		}
	}

	/**
	 * @param soundiizError {SoundiizErrorResponse}
	 * @param syncId {number}
	 * @return {Promise<boolean>} true if the sync should be retried, false otherwise
	 */
	async function waitAndRetrySync(soundiizError, syncId) {
		console.warn(`Sync ${syncId} failed.\n` +
			'Response: \n' +
			JSON.stringify(soundiizError, null, 4))
		const errorCode = getSoundiizErrorCode(soundiizError)
		if (errorCode !== SOUNDIIZ_ERROR_CODES.AUTOMATION_ISSUE_ERROR_CODE)
			return Promise.resolve(false)

		console.log(`${getSoundiizErrorMessage(soundiizError)}.\n` +
			'Waiting for 1 minute before retrying...')
		// Wait for 1 minute
		await waitFor1Minute()
		return Promise.resolve(true)
	}

	for (const syncId of syncIds) {
		await tryToExecSync(syncId)
	}
}

/**
 * Cache of playlists by platform, so we don't have to request Soundiiz for the same playlists
 * over and over
 * @type {{ [key: keyof SoundiizPlatform]: SoundiizPlaylist[]}}
 */
const playlistsByPlatformCache = { }

/**
 * GETs the playlists from the Soundiiz API for the given platform
 * @param platform {keyof SoundiizPlatform} The platform to get playlists for
 * @return {Promise<SoundiizPlaylist[] | SoundiizErrorResponse>}
 * A promise that resolves to the response with the playlists
 */
async function getPlaylists(platform) {
	const endpoint = getPlaylistsEndpoint(platform)
	const response = await get(endpoint, {
		headers: {
			Authorization: getAuthorizationHeader()
		}
	})
	/**
	 * @type {SoundiizPlaylistResponse}
	 */
	const soundiizResponse = response.data
	if (soundiizResponse?.data) {
		return soundiizResponse.data
	} else if (soundiizResponse?.error) {
		console.error(`Error getting playlists from Soundiiz API for ${platform}:`)
	}

	return Promise.resolve([])
}

/**
 * GETs the playlists from the Soundiiz API for {@link PLATFORM.APPLE_MUSIC},
 * {@link PLATFORM.TIDAL}, and {@link PLATFORM.SOUNDCLOUD and updates the cache
 * @return {Promise<void>}
 */
async function getAllPlaylistsAndUpdateCache() {
	if (_.isNil(playlistsByPlatformCache[PLATFORM.APPLE_MUSIC])) {
		console.log('Requesting playlists from Soundiiz API playlists for Apple Music...')
		playlistsByPlatformCache[PLATFORM.APPLE_MUSIC] =
			await getPlaylists(PLATFORM.APPLE_MUSIC)
	}
	if (_.isNil(playlistsByPlatformCache[PLATFORM.TIDAL])) {
		console.log('Requesting playlists from Soundiiz API playlists for Tidal...')
		playlistsByPlatformCache[PLATFORM.TIDAL] =
			await getPlaylists(PLATFORM.TIDAL)
	}
	if (_.isNil(playlistsByPlatformCache[PLATFORM.SOUNDCLOUD])) {
		console.log('Requesting playlists from Soundiiz API playlists for Soundcloud...')
		playlistsByPlatformCache[PLATFORM.SOUNDCLOUD] =
			await getPlaylists(PLATFORM.SOUNDCLOUD)
	}

	return Promise.resolve()
}

/**
 * Creates a batch in Soundiiz with the given playlist ids. This is used because having extra
 * sync slots in Soundiiz costs more money and at the time of writing this, I only have 10 left!
 * Using syncs would be easier than having to update a cookie every time, since the sync
 * endpoint uses an access token, but this works for now.
 * @param sourcePlatform {keyof SoundiizPlatform} The platform to transfer from
 * @param destPlatform {keyof SoundiizPlatform} The platform to transfer to
 * @param playlistIds {string[]} The IDs of the playlists to transfer
 * @return {Promise<SoundiizBatchTransferResponse>} A promise that resolves when the batch
 * transfer is kicked off, NOT when it is complete!
 */
async function batchTransfer(sourcePlatform, destPlatform, playlistIds) {
	await getAllPlaylistsAndUpdateCache()

	const playlists = playlistsByPlatformCache[sourcePlatform]
		.filter(playlist => playlistIds.includes(playlist.id))
	/**
	 * @type {SoundiizBatchTransferPayload}
	 */
	const payload = {
		albums: [],
		artists: [],
		dest: destPlatform,
		method: SOUNDIIZ_BATCH_METHOD.SIMPLE,
		playlists,
		tracks: []
	}
	const endpoint = getAddBatchEndpoint()
	/**
	 * @type {AxiosResponse<SoundiizBatchTransferResponse>}
	 */
	return await post(endpoint, payload, {
		headers: {
			Cookie: getCookie()
		}
	})
}

export default {
	runSyncs,
	batchTransfer,
	setConfigPath
}