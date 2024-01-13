import {questionSync} from './utilities.js'
import SoundiizApi from './soundiiz-api.js'

async function main() {
	let answer = null
	do {
		answer = await questionSync(
			'What would you like to do?\n' +
			'1. Batch transfer playlists\n' +
			'2. Run a collection of syncs for playlists\n')
	} while (answer !== '1' && answer !== '2')

	// TODO: add config or something to populate the parameters here
	if (answer === '1') {
		await SoundiizApi.batchTransfer()
	} else if (answer === '2') {
		await SoundiizApi.runSyncs()
	}
}

await main()