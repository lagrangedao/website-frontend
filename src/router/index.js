import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from 'vue-router'
const home = () =>
    import ("@/components/Home");
const dashboard = () =>
    import ("@/views/dashboard/index");
const main = () =>
    import ("@/views/dashboard/main/index");
const datasets = () =>
    import ("@/views/dashboard/datasets/index");
const datasetDetail = () =>
    import ("@/views/dashboard/datasets/details");
const datasetsCreate = () =>
    import ("@/views/dashboard/datasets/createDataset");
const models = () =>
    import ("@/views/dashboard/models/index");
const modelsDetail = () =>
    import ("@/views/dashboard/models/details");
const spaces = () =>
    import ("@/views/dashboard/spaces/index");
const spaceDetail = () =>
    import ("@/views/dashboard/spaces/details");
const spaceCreate = () =>
    import ("@/views/dashboard/spaces/createSpace");
const organizationsCreate = () =>
    import ("@/views/dashboard/organizations/createOrganizations");
const organizationsSettings = () =>
    import ("@/views/dashboard/organizations/setting");
const personalCenter = () =>
    import ("@/views/dashboard/personalCenter/index");
const personalCenterProfile = () =>
    import ("@/views/dashboard/personalCenter/setting");
const personalCenterBilling = () =>
    import ("@/views/dashboard/personalCenter/editBilling");

const routes = [{
        path: '/',
        redirect: '/main'
    },
    {
        path: '/',
        component: home,
        children: [{
                path: '/main',
                name: 'main',
                component: main,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/dataset',
                name: 'datasets',
                component: datasets,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/datasets/:name/:tabs',
                name: 'datasetDetail',
                component: datasetDetail,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/models',
                name: 'models',
                component: models,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/models/:name/:tabs',
                name: 'modelsDetail',
                component: modelsDetail,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/create_dataset',
                name: 'datasetsCreate',
                component: datasetsCreate,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/spaces',
                name: 'spaces',
                component: spaces,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/spaces/:name/:tabs',
                name: 'spaceDetail',
                component: spaceDetail,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/create_space',
                name: 'spaceCreate',
                component: spaceCreate,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/personal_center',
                name: 'personalCenter',
                component: personalCenter,
                meta: {
                    keepAlive: true
                },
                // beforeEnter: (to, from, next) => {
                //   if (!sessionStorage.getItem('metaAddressLag')) {
                //     next({
                //       path: '/dashboard',
                //       query: { redirect: to.fullPath }
                //     })
                //   } else {
                //     next()
                //   }
                // }
            },
            {
                path: '/personal_center/setting/:menu',
                name: 'personalCenterProfile',
                component: personalCenterProfile,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/personal_center/billing',
                name: 'personalCenterBilling',
                component: personalCenterBilling,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/create_organizations',
                name: 'organizationsCreate',
                component: organizationsCreate,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: '/personal_center/organizations/:menu',
                name: 'organizationsSettings',
                component: organizationsSettings,
                meta: {
                    keepAlive: true
                }
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    // hash：createWebHashHistory，
    // history：createWebHistory
    history: createWebHistory(process.env.BASE_URL),
    // history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router