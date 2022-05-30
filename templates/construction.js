export default {
	name: 'Construction project',
	root: {
		folder_type: 'simple',
		path: '/Construction/2022/',
	},
	sub_folders: [
		{
			name: 'Plans',
		},
		{
			name: 'Images',
		},
		{
			name: 'Externals',
			tags: ['external'],
			file_request: { title: 'External content' },
		},
		{
			name: 'Finances',
			tags: ['confidential'],
		},
	],
};
