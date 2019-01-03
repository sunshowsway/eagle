import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: false};

export default {
    path: '/doc_helper',
    name: 'doc_helper',
    meta,
    redirect: {name: 'doc_helper-server_conf'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'server_conf',
            name: `${pre}server_conf`,
            component: () => import('@/pages/doc_helper/server_conf'),
            meta: {meta, title: '服务器环境搭建'}
        },

        {
            path: 'others',
            name: `${pre}others`,
            component: () => import('@/pages/doc_helper/others'),
            meta: {meta, title: '其他参数'}
        },

        {
            path: 'proxy_pool',
            name: `${pre}proxy_pool`,
            component: () => import('@/pages/doc_helper/proxy_pool'),
            meta: {meta, title: '爬虫IP代理池'}
        },

        {
            path: 'server_info',
            name: `${pre}server_info`,
            component: () => import('@/pages/doc_helper/server_info'),
            meta: {meta, title: '服务器信息'}
        },

        {
            path: 'eagle_readme',
            name: `${pre}eagle_readme`,
            component: () => import('@/pages/doc_helper/eagle_readme'),
            meta: {meta, title: 'eagle readme'}
        }
    ])('doc_helper-')
}
