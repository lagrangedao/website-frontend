<template>
  <section id="dataset" v-loading="loading" :element-loading-text="loadingText">
    <el-row class="dataset_body container-landing flex-row">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6" class="left">
        <div class="left_body">
          <div class="width_div flex-row">
            <div v-loading="false" class="logo_sidebar" @click="settingDetail('organizations', 1)">
              <img :src="peopleUrl" alt="">
            </div>
            <div class="personal">
              <div class="title">
                Organizations name
              </div>
              <div class="desc">Non-Profit</div>
            </div>
          </div>
        </div>
        <div class="left_body">
          <ul>
            <li :class="{'is_active':route.params.submenu === 'profile'}" @click="settingDetail('profile')">Profile</li>
            <li :class="{'is_active':route.params.submenu === 'account'}" @click="settingDetail('account')">Account</li>
            <li :class="{'is_active':route.params.submenu === 'members'}" @click="settingDetail('members')">Members</li>
            <li :class="{'is_active':route.params.submenu === 'billing'}" @click="settingDetail('billing')">Billing</li>
            <li :class="{'is_active':route.params.submenu === 'token'}" @click="settingDetail('token')">Access Tokens</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18" class="right">
        <edit-profile v-if="route.params.submenu === 'profile'"></edit-profile>
        <edit-account v-else-if="route.params.submenu === 'account'"></edit-account>
        <edit-members v-else-if="route.params.submenu === 'members'"></edit-members>
        <edit-billing v-else-if="route.params.submenu === 'billing'"></edit-billing>
        <edit-token v-else-if="route.params.submenu === 'token'"></edit-token>
      </el-col>
    </el-row>
  </section>
</template>
<script>
const ethereum = window.ethereum;
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import editProfile from './editProfile.vue'
import editAccount from './editAccount.vue'
import editMembers from './editMembers.vue'
import editBilling from './editBilling.vue'
import editToken from './editToken.vue'
import {
  Plus
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Plus, editProfile, editAccount, editMembers, editBilling, editToken
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const accessName = computed(() => (store.state.accessName))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const info = reactive({
      address: '',
      balance: ''
    })
    const ruleForm = reactive({
      name: '',
      avatar: '',
      homepage: '',
      github: '',
      twitter: ''
    })
    const fileList = ref([])
    const validateInput = (rule, value, callback) => {
      if (!value) callback()
      if (!isURL(value)) {
        callback(new Error("Please enter the web address"));
      } else {
        callback();
      }
    }
    const rules = reactive({
      name: [
        { required: true, message: 'Please fill in this field', trigger: 'blur' }
      ],
      homepage: [
        { validator: validateInput, trigger: "blur" }
      ]
    })
    const ruleFormRef = ref(null)
    const small = ref(false)
    const background = ref(false)
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const peopleUrl = require("@/assets/images/dashboard/setting.png")
    const loading = ref(true)
    const loadingText = ref('')
    const prevType = ref(true)
    const listLoad = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function isURL (str_url) {
      // var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      //   + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
      //   + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      //   + "|" // 允许IP和DOMAIN（域名）
      //   + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      //   + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      //   + "[a-z]{2,6})" // first level domain- .com or .museum
      //   + "(:[0-9]{1,4})?" // 端口- :80
      //   + "((/?)|" // a slash isn't required if there is no file name
      //   + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      // var re = new RegExp(strRegex);
      var re = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
      return re.test(str_url);
    }
    async function isLogin () {
      loadingText.value = ''
      system.$commonFun.Init(async addr => {
        info.address = addr
        system.$commonFun.web3Init.eth.getBalance(addr).then((balance) => {
          // console.log(balance)
          const myBalance = balance
          const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
          info.balance = Number(balanceAll).toFixed(0)
        })
        // await system.$commonFun.timeout(500)
        if (lagLogin.value) {
          loading.value = false
          listLoad.value = false
        }
        else await signIn()
      })
    }
    async function signIn () {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      const [lStatus, signErr] = await system.$commonFun.login()
      if (lStatus) {
        loading.value = false
        listLoad.value = false
      }
      return false
      store.dispatch('setNavLogin', false)
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      // ethereum.on('accountsChanged', function (account) {
      //   // console.log('account header:', account[0], !(account[0]));  //Once the account is switched, it will be executed here
      //   if (!prevType.value) return false
      //   loading.value = true
      //   store.dispatch('setMetaAddress', account[0])
      //   store.dispatch('setNavLogin', false)
      //   store.dispatch('setLogin', false)
      //   store.dispatch('setAccessToken', '') 
      //   window.location.reload()
      // })
      // networkChanged
      ethereum.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        isLogin()
      })
      // 监听metamask网络断开
      ethereum.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        loading.value = true
        // loadingText.value = system.$NetworkPrompt
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    function settingDetail (row, type) {
      if (type) router.push({ name: 'personalCenterProfile', params: { menu: 'organizations' } })
      else router.push({ name: 'organizationsSettings', params: { submenu: row } })
    }
    onActivated(() => {
      fn()
      if (navLogin.value || !!metaAddress.value) isLogin()
      else router.push({ name: 'main' })
    })
    onMounted(() => { })
    watch(navLogin, (newValue, oldValue) => {
      if (navLogin.value) isLogin()
    })
    return {
      route,
      metaAddress,
      accessAvatar,
      accessName,
      navLogin, lagLogin, searchValue, value,
      info,
      ruleForm,
      ruleFormRef,
      rules,
      small,
      background,
      logoUrl,
      peopleUrl,
      system,
      loading,
      loadingText,
      prevType,
      listLoad,
      fileList,
      isLogin, signIn, fn, settingDetail,
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  position: relative;
  padding: 0.15rem 0 0;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.el-alert) {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2001;
    .el-alert__icon {
      @media screen and (min-width: 1600px) {
        font-size: 20px;
        width: 20px;
      }
    }
    .el-alert__content {
      display: flex;
      align-items: center;
      .el-alert__description {
        @media screen and (min-width: 1600px) {
          font-size: 14px;
          line-height: 1.3;
        }
        @media screen and (min-width: 1680px) {
          font-size: 16px;
          line-height: 1.3;
        }
        @media screen and (min-width: 1800px) {
          font-size: 18px;
          line-height: 1.3;
        }
        span {
          text-decoration: underline;
          cursor: pointer;
        }
        a {
          text-decoration: underline;
          color: #fff;
        }
      }
      .el-icon-close {
        @media screen and (min-width: 1600px) {
          font-size: 16px;
          line-height: 1.3;
        }
        @media screen and (min-width: 1800px) {
          font-size: 18px;
          line-height: 1.3;
        }
      }
    }
  }
  :deep(.dataset_body) {
    align-items: stretch;
    margin: auto;
    font-size: 14px;
    &.opacity {
      opacity: 0;
    }
    .left {
      position: relative;
      padding: 0.2rem 0;
      background-color: #fbfbfc;
      border: 1px solid #e0e1e2;
      border-radius: 0.1rem;
      @media screen and (min-height: 600px) {
        min-height: 480px;
      }
      @media screen and (min-height: 700px) {
        min-height: 610px;
      }
      @media screen and (min-height: 750px) {
        min-height: 580px;
      }
      @media screen and (min-height: 768px) {
        min-height: 600px;
      }
      @media screen and (min-height: 900px) {
        min-height: 700px;
      }
      @media screen and (min-height: 1000px) {
        min-height: 820px;
      }
      @media screen and (min-height: 1100px) {
        min-height: 900px;
      }
      @media screen and (min-height: 1200px) {
        min-height: 1000px;
      }
      @media screen and (max-width: 992px) {
        min-height: auto;
      }
      .left_body {
        padding: 0.15rem 0 0;
        margin: 0 auto;
        border: 0;
        text-align: left;
        color: #000;
        .width_div {
          width: 90%;
          margin: 0 auto;
        }
        .logo_sidebar {
          position: relative;
          display: block;
          width: 45px;
          height: 45px;
          background-color: #fff;
          // border: 0.03rem solid #7405ff;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            cursor: pointer;
          }
        }
        .el-loading-mask {
          background-color: #fff;
          .el-loading-spinner {
            top: 50%;
          }
        }
        .personal {
          margin: 0 0 0 0.1rem;
          .title {
            font-family: "Helvetica-Bold";
            font-size: 0.2rem;
            font-weight: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            word-spacing: normal;
            @media screen and (min-width: 1800px) {
              font-size: 0.24rem;
            }
          }
          .desc {
            font-size: 12px;
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 11px;
            }
          }
          .el-button {
            padding: 0.15rem 0.2rem;
            background: lighten($color: #f0f0f0, $amount: 0);
            border-radius: 0.07rem;
            color: #606060;
            font-family: inherit;
            &:hover {
              opacity: 0.95;
            }
          }
        }
        ul {
          width: 100%;
          border-top: 1px solid #e0e1e2;
          li {
            padding: 0.12rem 5%;
            border-bottom: 1px solid #e0e1e2;
            color: #000;
            font-family: "Helvetica-light";
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              font-size: 16px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 13px;
            }
            &:hover,
            &.is_active {
              background-color: #f5f6f8;
            }
          }
        }
      }
    }
    .right {
      position: relative;
      padding: 0 4% 0.5rem;
      .el-pagination {
        margin: 0.1rem auto;
        justify-content: center;
        .btn-prev {
          i {
            font-size: 14px;
            @media screen and (min-width: 1800px) {
              font-size: 16px;
            }
          }
        }
      }
      &::after {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        bottom: 0;
        width: 0;
        background-color: #c6c6c6;
      }
    }
  }
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 1);
    .el-loading-spinner {
      top: 30%;
    }
  }
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
