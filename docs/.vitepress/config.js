export default {
	title: '组件库',
  description: '组件库',
	base: "/",
  themeConfig: {
    sidebar: {
			'/': [
				{ text: '快速开始', link: '/' },
				{
					text: '工具',
					children: [
						{ text: 'Esign', link: '/components/esign/' },
						{ text: 'Canvas', link: '/components/canvas/' },
						{ text: 'Video', link: '/components/video/' },
					]
				},
			]
		},
		demoblock: {
			'/': {
				'hide-text': '隐藏代码',
				'show-text': '显示代码',
				'copy-button-text': '复制代码片段',
				'copy-success-text': '复制成功'
			}
		},

  },
	markdown: {
		config: (md) => {
			const { demoBlockPlugin } = require('vitepress-theme-demoblock');
			md.use(demoBlockPlugin);
		},
	},
}
