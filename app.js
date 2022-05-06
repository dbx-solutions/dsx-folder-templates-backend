import express from 'express';
import { createDbxAuth } from './node_modules/dsx-core/src/util/dbx/dbx.js';
import { getAuthTokenFromCode, getAuthUrl } from './node_modules/dsx-core/src/util/auth/auth.js';
import templates from './templates/templates.js';
import { createFromTemplate } from './src/creator.js';

const app = express();
const clientId = '4jadbzm3a71wkfb';
const redirectUri = 'http://localhost:3000/auth';
const dbxAuth = createDbxAuth(clientId);

app.get('/authurl', (req, res) => {
	getAuthUrl(dbxAuth, redirectUri).then((authUrl) => {
		res.json({url: authUrl})
	});
});

app.get('/token', (req, res) => {
	const { code } = req.query;

	getAuthTokenFromCode(dbxAuth, redirectUri, code).then((response) => {
		console.log(response.result.access_token); // store in db
		res.json({message: "done!"})
	})
});

app.get('/template', (req, res) => {
	const template = templates.video_production;
	const { rootName } = req.query;
	createFromTemplate(template, rootName);
});

app.listen(8080);