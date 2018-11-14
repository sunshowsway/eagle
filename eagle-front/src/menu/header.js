// 菜单 顶栏
export default [
    {path: '/index', title: '首页', icon: 'home'},
    {
        title: '演示页面',
        icon: 'folder-o',
        children: [
            {path: '/spider/overview', title: '页面 1'},
            {path: '/spider/jobs', title: '页面 2'},
            {path: '/spider/page3', title: '页面 3'}
        ]
    }
]
