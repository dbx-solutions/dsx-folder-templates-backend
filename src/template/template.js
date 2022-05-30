import { TEMPLATE_KEYS } from './config.js';
import templates from '../../templates/templates.js';

export function listTemplates() {
	const availableTemplates = [];

	for (var key in templates) {
		availableTemplates.push({
			label: templates[key].name,
			value: key,
		});
	}

	return availableTemplates;
}

export function parseTemplate(rootName, rootPath, subFolders) {
	let paths = [];
	let tags = [];
	let fileRequests = [];

	subFolders.forEach((subFolder) => {
		const subFolderPath = rootPath + '/' + subFolder.name;
		const hasSubFolders = TEMPLATE_KEYS.SUB_FOLDERS in subFolder;
		const hasTags = TEMPLATE_KEYS.TAGS in subFolder;
		const hasFileRequest = TEMPLATE_KEYS.FILE_REQUEST in subFolder;

		paths.push(subFolderPath);
		if (hasSubFolders) {
			const { subFolderPaths, subFolderTags, subFolderFileRequests } =
				parseTemplate(rootName, subFolderPath, subFolder.sub_folders);
			paths.push.apply(paths, subFolderPaths);
			tags.push.apply(tags, subFolderTags);
			fileRequests.push.apply(fileRequests, subFolderFileRequests);
		}

		if (hasTags) {
			subFolder.tags.forEach((tagName) => {
				tags.push({
					path: subFolderPath,
					tag_text: tagName,
				});
			});
		}

		if (hasFileRequest) {
			fileRequests.push({
				title: rootName + ' - ' + subFolder.file_request.title,
				destination: subFolderPath,
			});
		}
	});

	return {
		subFolderPaths: paths,
		subFolderTags: tags,
		subFolderFileRequests: fileRequests,
	};
}
