import spider from './modules/spider';
import server from './modules/server';

import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: false};

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
];
