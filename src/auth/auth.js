import fs from 'fs';
import { createDbxAuth } from '../../node_modules/dsx-core/src/util/dbx/dbx.js';
import {
	issueAuthTokenFromCode,
	issueAuthUrl,
} from '../../node_modules/dsx-core/src/util/auth/auth.js';
import * as config from './config.js';

const dbxAuth = createDbxAuth(config.CLIENT_ID);

export function getAuthUrl() {
	return issueAuthUrl(dbxAuth, config.REDIRECT_URI);
}

export function getAuthTokenFromCode(code) {
	return issueAuthTokenFromCode(dbxAuth, config.REDIRECT_URI, code);
}

export function storeAuthToken(authToken) {
	fs.writeFile('token.txt', authToken, (err) => {
		if (err) {
			console.error(err);
		}
	});
}
