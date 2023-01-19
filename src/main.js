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
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// 这是预览时引用的
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 引入你所使用的主题 此处以 github 主题为例
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
//预览的主题
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
//编辑器的主题
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

const app = createApp(App)
app.config.globalProperties.$commonFun = commonFun
app.config.globalProperties.$Web3 = Web3
app.config.globalProperties.$updateTime = "update time: 2022-11-18"
app.use(ElementPlus, {
        locale: en,
    })
    .use(i18n)
    .use(store)
    .use(router)
    .use(VMdPreview)
    .use(VueMarkdownEditor)
app.mount('#app')