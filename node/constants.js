/**
 * @typedef {{ [key: string]: string }} SoundiizPlatform
 */
export const PLATFORM = {
	APPLE_MUSIC: 'applemusicapp',
	TIDAL: 'tidal',
	SOUNDCLOUD: 'soundcloud',
	// Below are unused for now, just want to document them for the future
	SPOTIFY: 'spotify',
	YOUTUBE: 'youtube',
}

/**
 * @typedef  {{ [key: string]: string }} SoundiizBatchMethod
 */
export const SOUNDIIZ_BATCH_METHOD = {
	SIMPLE: 'simple'
}

/**
 * @typedef {{ [key: string]: number }} SoundiizErrorCode
 */
export const SOUNDIIZ_ERROR_CODES = {
	AUTOMATION_ISSUE_ERROR_CODE: 603,
	EXPIRED_ACCESS_TOKEN: 206,
}

export const SOUNDIIZ_BASE_URL = 'https://soundiiz.com'
export const SOUNDIIZ_API_BASE_URL = `${SOUNDIIZ_BASE_URL}/v1/api`
export const SOUNDIIZ_WEBAPI_BASE_URL = `${SOUNDIIZ_BASE_URL}/v1/webapi`
export const SYNCS_ENDPOINT = 'scheduledtasks'
export const SYNCS_EXEC_ENDPOINT = 'exec'
export const AUTOMATION_ENDPOINT = 'automation'
export const BATCH_ADD_ENDPOINT = 'batch/add'
export const USER_PLATFORMS_ENDPOINT = 'users/me/platforms'