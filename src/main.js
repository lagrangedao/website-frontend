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
import echarts from '@/utils/echarts'
import CryptoJS from 'crypto-js'
// edit
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
import Prism from 'prismjs';
// preview
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// Take github theme as an example
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json' //Code block highlighting
hljs.registerLanguage('json', json);
//Preview theme
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
//Editor's theme
VueMarkdownEditor.lang.use('en-US', enUS);
VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App)
app.config.globalProperties.$commonFun = commonFun
app.config.globalProperties.$Web3 = Web3
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$updateTime = "update time: 2022-11-18"
app.config.globalProperties.$CryptoJS = CryptoJS
app.use(ElementPlus, {
        locale: en,
    })
    .use(i18n)
    .use(store)
    .use(router)
    .use(VMdPreview)
    .use(VueMarkdownEditor)
app.mount('#app')