import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: false};

const SpiderInProject = {
    template: `<div>Spider {{ $route.params.project_id }}</div>`
};

export default {
    path: '/spider',
    name: 'spider',
    meta,
    redirect: {name: 'spider-overview'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'overview',
            name: `${pre}overview`,
            component: () => import('@/pages/spider/overview'),
            meta: {meta, title: '爬虫总览'}
        },
        {
            path: 'jobs',
            name: `${pre}jobs`,
            component: () => import('@/pages/spider/jobs'),
            meta: {meta, title: '任务列表'}
        },
        {
            path: 'proxy',
            name: `${pre}proxy`,
            component: () => import('@/pages/spider/proxy'),
            meta: {meta, title: 'Proxy 管理'}
        },
        {
            path: 'overview/:project_name',
            name: `${pre}overview`,
            component: () => import('@/pages/spider/overview'),
            meta: {meta, title: '爬虫总览'}
        },
        {
            path: 'jobs/:project_name',
            name: `${pre}jobs`,
            component: () => import('@/pages/spider/jobs'),
            meta: {meta, title: '任务列表'}
        }
    ])('spider-')
}
