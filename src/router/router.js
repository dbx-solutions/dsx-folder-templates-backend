import express from 'express';
import fs from 'fs';
import { routes } from './routes.js';
import * as config from './config.js';
import templates from '../../templates/templates.js';
import { getAuthTokenFromCode, getAuthUrl, storeAuthToken } from '../auth/auth.js';
import { createStructureFromTemplate } from '../../src/structure/structure.js';
import { listTemplates } from '../../src/template/template.js';
import { listMembers } from '../../node_modules/dsx-core/src/resources/dropbox/team/member/member.js';
import { createDbxAsTeam } from '../../node_modules/dsx-core/src/util/dbx/dbx.js';

const app = express();

export function createRoutes() {
	app.get(routes.authUrl, (req, res) => {
		getAuthUrl()
			.then((authUrl) => {
				res.json({ authUrl: authUrl });
			})
			.catch((error) => console.error(error.message));
	});

	app.get(routes.authToken, (req, res) => {
		const { code } = req.query;

		getAuthTokenFromCode(code)
			.then((authTokenResponse) => {
				storeAuthToken(authTokenResponse.result.access_token);
				res.end();
			})
			.catch((error) => console.error(error.message));
	});

	app.get(routes.templateList, (req, res) => {
		res.json({ templateList: listTemplates() });
	});

	app.get(routes.structureCreate, (req, res) => {
		const { templateName, rootName } = req.query;

		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			createStructureFromTemplate(templates[templateName], rootName, authToken.toString(), config.USER_ID);
		});
	});

	app.get('/members', (req, res) => {
		fs.readFile('token.txt', 'utf8', function (err, authToken) {
			const dbx = createDbxAsTeam(authToken.toString());
			listMembers(dbx).then((members) => {
				console.log(members);
			});
		});
	});
}

export function run() {
	app.listen(process.env.PORT);
}
