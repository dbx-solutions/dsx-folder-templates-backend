export default {
	name: 'Construction project',
	root: {
		folder_type: 'simple',
		path: '/Construction projects/2022/',
	},
	sub_folders: [
		{
			name: 'Planning',
		},
		{
			name: 'Contracts',
		},
		{
			name: 'Onsite images',
		},
		{
			name: 'Design',
		},
		{
			name: 'Quality',
		},
		{
			name: 'Health and safety',
		},
		{
			name: 'Completion stage',
		},
		{
			name: 'Tenders',
			tags: ['external'],
			file_request: { title: 'External content' },
		},
		{
			name: 'Finance',
			tags: ['confidential'],
		},
	],
};
