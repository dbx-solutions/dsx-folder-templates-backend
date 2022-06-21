export default {
	name: 'Video production',
	root: {
		folder_type: 'simple',
		path: '/Media projects/2022/',
	},
	sub_folders: [
		{
			name: 'Images',
		},
		{
			name: 'Clips',
			sub_folders: [
				{
					name: 'Raw',
				},
				{
					name: 'Edited',
					sub_folders: [
						{
							name: 'External',
							tags: ['external'],
							file_request: { title: 'Edited external clips' },
						},
					],
					tags: ['edited'],
				},
			],
		},
	],
};
