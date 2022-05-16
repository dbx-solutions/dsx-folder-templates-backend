import { parseTemplate } from './parser.js';
import { createFolder, createFolderBatch } from '../../node_modules/dsx-core/src/resources/dropbox/user/folder/folder.js';
import { createTagBatch } from '../../node_modules/dsx-core/src/resources/dropbox/user/tag/tag.js';
import { createFileRequestBatch } from '../../node_modules/dsx-core/src/resources/dropbox/user/fileRequest/fileRequest.js';

export function createFromTemplate(template, rootName, dbx) {
	const rootPath = template.root.path + rootName;
	const { subFolderPaths, subFolderTags, subFolderFileRequests } = parseTemplate(rootName, rootPath, template.sub_folders);

	createFolder(dbx, rootPath)
	.then(() => {
		createFolderBatch(dbx, subFolderPaths)
		.then(() => {
			createTagBatch(dbx, subFolderTags)
		})
		.then(() => {
			createFileRequestBatch(dbx, subFolderFileRequests)
		})
	})
	.catch((error) => console.error(error.message));
}
