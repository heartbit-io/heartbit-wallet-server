const lnurl = require('lnurl');

import logger from '../util/logger';

async function onLUDFail(lud: any): Promise<boolean> {
	lud.on('withdrawRequest:action:failed', (event: any) => {
		logger.error(event);
		console.log(event);
	});

	return true;
}

export {onLUDFail};
