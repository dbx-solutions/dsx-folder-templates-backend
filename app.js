import express from 'express';
import { listMembers } from './node_modules/dsx-core/src/resources/dropbox/team/member/member.js';
import { createDbxAuth, createDbxAsTeam, createDbxAsUser } from './node_modules/dsx-core/src/util/dbx/dbx.js';
import { getAuthTokenFromCode, getAuthUrl } from './node_modules/dsx-core/src/util/auth/auth.js';
import templates from './templates/templates.js';
import { createFolder, createFolderBatch } from './node_modules/dsx-core/src/resources/dropbox/user/folder/folder.js';
import { createTagBatch } from './node_modules/dsx-core/src/resources/dropbox/user/tag/tag.js';
import { createFileRequestBatch } from './node_modules/dsx-core/src/resources/dropbox/user/fileRequest/fileRequest.js';


const app = express();
const token = 'sl.BHCN9zXPhRRO0WA2Y1CHQYy69CcxE47q2GCDHZvcrOGA75Hpoa3W94NYhsdyzOeIsXfmUqxmntQ4SbxB0WIhZ-LXZvOwGwOC3skk1xQjZT1-rreMwSYrnRfjCygqNwBrJGxFWWtfu49SLK5UXTI';

const clientId = '4jadbzm3a71wkfb';
const redirectUri = 'http://localhost:3000/auth';
const dbxAuth = createDbxAuth(clientId);

app.get('/main', (req, res) => {
  res.json({message: "DSX folder templates"})
});

app.get('/login', (req, res) => {
	getAuthUrl(dbxAuth, redirectUri).then((authUrl) => {
		res.json({url: authUrl})
	});
});

app.get('/token', (req, res) => {
	const { code } = req.query;

	getAuthTokenFromCode(dbxAuth, redirectUri, code).then((response) => {
		console.log(response.result.access_token);
		res.json({message: "done!"})
	})
});

app.get('/members', (req, res) => {
	const dbx = createDbxAsTeam(token);
	listMembers(dbx).then((result) => {
		console.log(result)
	})
});

app.get('/template', (req, res) => {
	const userId = 'dbmid:AAC-CvicHJKg7ND_MGrDqgxm1rBa0lmWV28'
	const dbx = createDbxAsUser(token, userId);
	const template = templates.video_production;

	const rootName = 'Project Hummus';
	const rootPath = template.root.path + rootName;
	const {subFolderPaths, subFolderTags, subFolderFileRequests} = prepareSubFolders(rootPath, template.sub_folders);

	createFolder(dbx, rootPath, false)
	.then(() => {
		createFolderBatch(dbx, subFolderPaths, false)
		.then(() => {
			createTagBatch(dbx, subFolderTags)
		})
		.then(() => {
			createFileRequestBatch(dbx, subFolderFileRequests)
		})
	})
});

function prepareSubFolders(rootPath, subFolders) {
	let paths = [];
	let tags = [];
	let fileRequests = [];

	subFolders.forEach(subFolder => {
		const subFolderPath = rootPath + '/' + subFolder.name;
		const hasSubFolders = 'sub_folders' in subFolder;
		const hasTags = 'tags' in subFolder;
		const hasFileRequest = 'file_request' in subFolder;

		paths.push(subFolderPath);
		if (hasSubFolders) {
			const { subFolderPaths, subFolderTags, subFolderFileRequests } = prepareSubFolders(subFolderPath, subFolder.sub_folders);
			paths.push.apply(paths, subFolderPaths);
			tags.push.apply(tags, subFolderTags);
			fileRequests.push.apply(fileRequests, subFolderFileRequests);
		}

		if (hasTags) {
			subFolder.tags.forEach(tagName => {
				tags.push({
					path: subFolderPath,
					tag_text: tagName
				});
			})
		}

		if (hasFileRequest) {
			fileRequests.push({
				title: subFolder.file_request.title,
				destination: subFolderPath
			});
		}
	});

	return { subFolderPaths: paths, subFolderTags: tags, subFolderFileRequests: fileRequests };
}

app.listen(8080);