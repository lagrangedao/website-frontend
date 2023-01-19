import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import Web3 from 'web3'
import commonFun from '@/utils/common'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' //样式文件

const app = createApp(App)
app.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})
app.config.globalProperties.$commonFun = commonFun
app.config.globalProperties.$Web3 = Web3
app.config.globalProperties.$updateTime = "update time: 2022-11-18"
app.use(ElementPlus, {
        locale: en,
    })
    .use(i18n)
    .use(store)
    .use(router)
app.mount('#app')