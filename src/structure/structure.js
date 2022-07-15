import { createDbxAsUser } from '../../node_modules/dsx-core/src/util/dbx/dbx.js';
import { parseTemplate } from '../template/template.js';
import {
	createFolder,
	createFolderBatch,
} from '../../node_modules/dsx-core/src/resources/dropbox/user/folder/folder.js';
import { createTagBatch } from '../../node_modules/dsx-core/src/resources/dropbox/user/tag/tag.js';
import { createFileRequestBatch } from '../../node_modules/dsx-core/src/resources/dropbox/user/fileRequest/fileRequest.js';

export function createStructureFromTemplate(template, rootName, token, userId) {
	const dbx = createDbxAsUser(token, userId);
	const rootPath = template.root.path + rootName;
	const { subFolderPaths, subFolderTags, subFolderFileRequests } = parseTemplate(
		rootName,
		rootPath,
		template.sub_folders
	);

	console.log('------------------------------------------------------');
	console.log('Creating root folder ' + rootName);
	createFolder(dbx, rootPath).then(() => {
		console.log('Creating sub folders');
		createFolderBatch(dbx, subFolderPaths)
			.then(() => {
				console.log('Creating file requests');
				createFileRequestBatch(dbx, subFolderFileRequests);
			})
			.then(() => {
				console.log('Creating tags');
				console.log('------------------------------------------------------');
				createTagBatch(dbx, subFolderTags);
			});
	});
}
