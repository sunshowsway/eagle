import spider from './modules/spider';
import server from './modules/server';
import database from './modules/database';
import doc from './modules/doc'

import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: true};

/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: {name: 'index'},
        component: layoutHeaderAside,
        children: [
            {
                path: 'index',
                name: 'index',
                meta,
                component: () => import('@/pages/server/overview')
            }
        ]
    },
    spider,
    server,
    database,
    doc,
    {
        path: '/logging',
        name: 'logging',
        component: layoutHeaderAside,
        children: [
            {
                path: '/logging',
                name: 'logging',
                meta: {meta, title: '日志'},
                component: () => import('@/pages/logging')
            }
        ]
    },

    {
        path: '/projects',
        name: 'projects',
        component: layoutHeaderAside,
        children: [
            {
                path: '/projects',
                name: 'projects',
                meta: {meta, title: '项目'},
                component: () => import('@/pages/projects')
            }
        ]
    },
    {
        path: '/settings',
        name: 'settings',
        component: layoutHeaderAside,
        children: [
            {
                path: '/settings',
                name: 'settings',
                meta: {meta, title: '配置'},
                component: () => import('@/pages/settings')
            }
        ]
    },
    {
        path: '/collection_directory',
        name: 'collection_directory',
        component: layoutHeaderAside,
        children: [
            {
                path: '/collection_directory',
                name: 'collection_directory',
                meta: {meta, title: '采集目录'},
                component: () => import('@/pages/collection_directory')
            }
        ]
    },
    {
        path: '/ad_manager',
        name: 'ad_manager',
        component: layoutHeaderAside,
        children: [
            {
                path: '/ad_manager',
                name: 'ad_manager',
                meta: {meta, title: '广告过滤'},
                component: () => import('@/pages/ad_manager')
            }
        ]
    },
];

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 页面重定向使用 必须保留
    {
        path: '/redirect/:path*',
        component: {
            beforeCreate() {
                this.$router.replace(JSON.parse(this.$route.params.path))
            },
            render: h => h()
        }
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login')
    }
];

/**
 * 错误页面
 */
const errorPage = [
    // 404
    {
        path: '*',
        name: '404',
        component: () => import('@/pages/error-page-404')
    }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]
