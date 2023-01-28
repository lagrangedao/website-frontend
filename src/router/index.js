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
const personalCenter = () =>
    import ("@/views/dashboard/personalCenter/index");

const routes = [{
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: home,
        children: [{
            path: '/dashboard',
            component: dashboard,
            children: [{
                    path: '/dashboard',
                    redirect: '/dashboard/main'
                },
                {
                    path: '/dashboard/main',
                    name: 'main',
                    component: main
                },
                {
                    path: '/dashboard/dataset',
                    name: 'datasets',
                    component: datasets
                },
                {
                    path: '/dashboard/datasets/:name/:tabs',
                    name: 'datasetDetail',
                    component: datasetDetail
                },
                {
                    path: '/dashboard/models',
                    name: 'models',
                    component: models
                },
                {
                    path: '/dashboard/models/:name/:tabs',
                    name: 'modelsDetail',
                    component: modelsDetail
                },
                {
                    path: '/dashboard/create_dataset',
                    name: 'datasetsCreate',
                    component: datasetsCreate
                },
                {
                    path: '/dashboard/spaces',
                    name: 'spaces',
                    component: spaces
                },
                {
                    path: '/dashboard/personal_center',
                    name: 'personalCenter',
                    component: personalCenter,
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
                }
            ]
        }, ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router