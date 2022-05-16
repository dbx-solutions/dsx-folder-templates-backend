import { templateKeys } from "./config.js";

export function parseTemplate(rootName, rootPath, subFolders) {
  let paths = [];
  let tags = [];
  let fileRequests = [];

  subFolders.forEach(subFolder => {
    const subFolderPath = rootPath + '/' + subFolder.name;
    const hasSubFolders = templateKeys.subFolders in subFolder;
    const hasTags = templateKeys.tags in subFolder;
    const hasFileRequest = templateKeys.file_requests in subFolder;

    paths.push(subFolderPath);
    if (hasSubFolders) {
      const { subFolderPaths, subFolderTags, subFolderFileRequests } = parseTemplate(rootName, subFolderPath, subFolder.sub_folders);
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
        title: rootName + ' - ' + subFolder.file_request.title,
        destination: subFolderPath
      });
    }
  });

  return { subFolderPaths: paths, subFolderTags: tags, subFolderFileRequests: fileRequests };
}
