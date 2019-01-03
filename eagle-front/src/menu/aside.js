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
            {path: '/spider/jobs', icon: 'list', title: '任务队列'},
            {path: '/spider/proxy', icon: 'exchange', title: 'Proxy管理'},
            {path: '/spider/cookies', icon: 'vcard', title: 'Cookie池管理'},
        ]
    },
    {
        title: '数据库监控',
        icon: 'database',
        children: [
            {path: '/database/overview', icon: 'tachometer', title: '监控面板'},
            {path: '/database/performance', icon: 'line-chart', title: '性能报告'},
            {path: '/database/warning', icon: 'warning', title: '告警信息'},
        ]
    },
    {path: '/logging', icon: 'file-code-o', title: '日志'},
    {path: '/settings', icon: 'cog', title: '配置'},
    {path: '/collection_directory', icon: 'sitemap', title: '采集目录'},
    {path: '/ad_manager', icon: 'filter', title: '广告过滤'},

    {
        title: '帮助文档',
        icon: 'question-circle',
        children: [
            {path: '/doc_helper/server_conf', icon: 'file', title: '爬虫服务器环境搭建.md'},
            {path: '/doc_helper/others', icon: 'file', title: '其他配置.md'},
            {path: '/doc_helper/proxy_pool', icon: 'file', title: '爬虫IP代理池.md'},
            {path: '/doc_helper/server_info', icon: 'file', title: '服务器信息.md'},
            {path: '/doc_helper/eagle_readme', icon: 'file', title: 'eagle_readme.md'},
        ]
    },
]
