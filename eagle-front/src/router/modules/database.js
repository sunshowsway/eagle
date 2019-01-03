import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: true};

export default {
    path: '/database',
    name: 'database',
    meta,
    redirect: {name: 'database-overview'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'overview',
            name: `${pre}overview`,
            component: () => import('@/pages/database/overview'),
            meta: {meta, title: '监控面板'}
        },
        {
            path: 'performance',
            name: `${pre}performance`,
            component: () => import('@/pages/database/performance'),
            meta: {meta, title: '性能报告'}
        },
        {
            path: 'warning',
            name: `${pre}warning`,
            component: () => import('@/pages/database/warning'),
            meta: {meta, title: '告警信息'}
        },
        {
            path: 'performance/:host_and_port',
            name: `${pre}performance`,
            component: () => import('@/pages/database/performance'),
            meta: {meta, title: '性能报告'}
        },
        {
            path: 'warning/:host_and_port',
            name: `${pre}warning`,
            component: () => import('@/pages/database/warning'),
            meta: {meta, title: '告警信息'}
        },
    ])('database-')
}
