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

