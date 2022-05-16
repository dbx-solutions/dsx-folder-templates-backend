import express from 'express';
import { createDbxAuth } from './node_modules/dsx-core/src/util/dbx/dbx.js';
import { getAuthTokenFromCode, getAuthUrl } from './node_modules/dsx-core/src/util/auth/auth.js';
import templates from './templates/templates.js';
import { createFromTemplate } from './src/creator.js';
import fs from 'fs';

const app = express();
const clientId = '4jadbzm3a71wkfb';
const redirectUri = 'http://localhost:3000/auth';
const dbxAuth = createDbxAuth(clientId);

app.get('/authurl', (req, res) => {
	getAuthUrl(dbxAuth, redirectUri)
	.then((authUrl) => {
		res.json({url: authUrl})
	})
	.catch((error) => console.error(error.message));
});

app.get('/token', (req, res) => {
	const { code } = req.query;

	getAuthTokenFromCode(dbxAuth, redirectUri, code)
	.then((response) => {
		const token = response.result.access_token;
		fs.writeFile('token.txt', token, err => {
			if (err) {
				console.error(err);
			}
		});

		res.json({message: "done!"})
	})
	.catch((error) => console.error(error.message));
});

app.get('/template', (req, res) => {
	const { templateName } = req.query;
	const { rootName } = req.query;
	fs.readFile('token.txt', 'utf8', function(err, data) {
		const token = data.toString();
		createFromTemplate(templates[templateName], rootName, token);
	})
});

app.get('/template-list', (req, res) => {
	const availableTemplates = [];
	for (var key in templates) {
		availableTemplates.push({
			label: templates[key].name,
			value: key
		});
	}

	res.json({templates: availableTemplates})
})

app.listen(8080);