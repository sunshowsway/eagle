import layoutHeaderAside from '@/layout/header-aside'

const meta = {requiresAuth: true};

export default {
    path: '/server',
    name: 'server',
    meta,
    redirect: {name: 'server-overview'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'overview',
            name: `${pre}overview`,
            component: () => import('@/pages/server/overview'),
            meta: {meta, title: '服务器列表'}
        },
        {
            path: 'status',
            name: `${pre}status`,
            component: () => import('@/pages/server/status'),
            meta: {meta, title: '服务器状态'}
        }
    ])('server-')
}
