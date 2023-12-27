import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from 'vue-router'
import writer from '@/utils/router'
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
const termsOfService = () =>
    import ("@/views/dashboard/company/index");
const paymentHistory = () =>
    import ("@/components/paymentHistory");
const pricing = () =>
    import ("@/views/dashboard/pricing/index");
const Infrastructure = () =>
    import ("@/views/dashboard/Infrastructure/index");
const services = () =>
    import ("@/views/dashboard/services/index");

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
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/dataset',
                name: 'datasets',
                component: datasets,
                meta: {
                    keepAlive: true,
                    title: 'Datasets - '
                }
            },
            {
                path: '/datasets/:wallet_address/:name/:tabs',
                name: 'datasetDetail',
                component: datasetDetail,
                meta: {
                    keepAlive: true,
                    title: 'Datasets at '
                }
            },
            // {
            //     path: '/models',
            //     name: 'models',
            //     component: models,
            //     meta: {
            //         keepAlive: true,
            //         title: 'Models - '
            //     }
            // },
            // {
            //     path: '/models/:wallet_address/:name/:tabs',
            //     name: 'modelsDetail',
            //     component: modelsDetail,
            //     meta: {
            //         keepAlive: true,
            //         title: 'Models at '
            //     }
            // },
            {
                path: '/create_dataset',
                name: 'datasetsCreate',
                component: datasetsCreate,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/spaces',
                name: 'spaces',
                component: spaces,
                meta: {
                    keepAlive: true,
                    title: 'Spaces - '
                }
            },
            {
                path: '/spaces/:wallet_address/:name/:tabs',
                name: 'spaceDetail',
                component: spaceDetail,
                meta: {
                    keepAlive: true,
                    title: 'Spaces at '
                }
            },
            {
                path: '/create_space',
                name: 'spaceCreate',
                component: spaceCreate,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/personal_center',
                name: 'personalCenter',
                component: personalCenter,
                meta: {
                    keepAlive: true,
                    title: 'Settings - '
                },
                // beforeEnter: (to, from, next) => {
                //   if (!localStorage.getItem('metaAddressLag')) {
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
                    keepAlive: true,
                    title: 'Settings - '
                }
            },
            {
                path: '/create_organizations',
                name: 'organizationsCreate',
                component: organizationsCreate,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/personal_center/organizations/:submenu',
                name: 'organizationsSettings',
                component: organizationsSettings,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/terms_of_service',
                name: 'termsOfService',
                component: termsOfService,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/privacy',
                name: 'privacy',
                component: termsOfService,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/content_guidelines',
                name: 'contentGuidelines',
                component: termsOfService,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/code_of_conduct',
                name: 'codeOfConduct',
                component: termsOfService,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/payment_history',
                name: 'paymentHistory',
                component: paymentHistory,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/pricing',
                name: 'pricing',
                component: pricing,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            }, {
                path: '/Infrastructure',
                name: 'Infrastructure',
                component: Infrastructure,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
        ]
    },
    {
        path: '/services',
        name: 'services',
        component: services,
        meta: {
            keepAlive: true,
            title: ''
        }
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

router.beforeEach((to, from, next) => {
    writer(to);
    next();
})

export default router