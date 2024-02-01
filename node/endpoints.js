export const SOUNDIIZ_BASE_URL = 'https://soundiiz.com'
export const SOUNDIIZ_API_BASE_URL = `${SOUNDIIZ_BASE_URL}/v1/api`
export const SOUNDIIZ_WEBAPI_BASE_URL = `${SOUNDIIZ_BASE_URL}/v1/webapi`
export const SYNCS_ENDPOINT = 'scheduledtasks'
export const SYNCS_EXEC_ENDPOINT = 'exec'
export const AUTOMATION_ENDPOINT = 'automation'
export const BATCH_ADD_ENDPOINT = 'batch/add'
export const PLATFORMS_ENDPOINT = 'platforms'
export const USER_PLATFORMS_ENDPOINT = `users/me/${PLATFORMS_ENDPOINT}}`
export const PLAYLISTS_ENDPOINT = 'playlists'

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
	return `${SOUNDIIZ_API_BASE_URL}/${USER_PLATFORMS_ENDPOINT}/${platform}/${PLAYLISTS_ENDPOINT}`
}

export function getPlaylistEndpoint(platform, playlistId) {
	return `${SOUNDIIZ_API_BASE_URL}/${PLATFORMS_ENDPOINT}/${platform}/${PLAYLISTS_ENDPOINT}/${playlistId}` +
		'?tracks=true&sdzwl=true' // not sure what the sdzwl query param does, but the UI uses it
}