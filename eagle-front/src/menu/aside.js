// 菜单 侧边栏
export default [
    // {path: '/index', title: '首页', icon: 'home'},
    {
        title: '服务器管理',
        icon: 'server',
        children: [
            {path: '/server/overview', icon: 'info-circle', title: '服务器列表'},
            {path: '/server/status', icon: 'globe', title: '服务器状态'},
        ]
    },
    {path: '/projects', icon: 'rocket', title: '项目'},
    {
        title: '爬虫管理',
        icon: 'bug',
        children: [
            {path: '/spider/overview', icon: 'info-circle', title: '爬虫总览'},
            {path: '/spider/jobs', icon: 'list', title: '任务列表'},
            {path: '/spider/proxy', icon: 'exchange', title: 'Proxy管理'}
        ]
    },
    {path: '/logging', title: '日志', icon: 'file-text-o'}

]
