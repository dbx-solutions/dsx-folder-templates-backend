import { createDbxAsUser } from '../node_modules/dsx-core/src/util/dbx/dbx.js';import { createFolder, createFolderBatch } from '../node_modules/dsx-core/src/resources/dropbox/user/folder/folder.js';
import { createTagBatch } from '../node_modules/dsx-core/src/resources/dropbox/user/tag/tag.js';
import { createFileRequestBatch } from '../node_modules/dsx-core/src/resources/dropbox/user/fileRequest/fileRequest.js';
import { parserSubFolders } from './parser.js';

export function createFromTemplate(template, rootName) {
  const userId = 'dbmid:AAC-CvicHJKg7ND_MGrDqgxm1rBa0lmWV28'
  const token = 'sl.BHDvvrJrwN8ZYLbewQ00MvxaBxiZpgS7g6G6pVDKF7zlvwd0NtTt4R15HNmjV-z9d2a6SdbDQGsJyJrffA6xvSpSihU52VNkMIg9vuxuiiCgru5rroleK0bxvTDGj1ufcwMWezS163HoObdZolU';
	const dbx = createDbxAsUser(token, userId);

	const rootPath = template.root.path + rootName;
	const {subFolderPaths, subFolderTags, subFolderFileRequests} = parserSubFolders(rootName, rootPath, template.sub_folders);

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
}