<template>
  <section id="dataset" v-loading="loading" :element-loading-text="loadingText">
    <el-alert type="warning" effect="dark" center show-icon v-if="loadingText">
      <div slot="title">
        To use our site, please switch to
        <span @click="changeNetChange(3141)">Filecoin TestNet</span> or
        <span @click="changeNetChange(137)">Polygon Mainnet</span> or
        <span style="text-decoration: underline;" @click="changeNetChange(97)">BSC TestNet</span>.
      </div>
    </el-alert>
    <el-row class="dataset_body">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6" class="left">
        <div class="left_body">
          <div class="width_div">
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
            <li :class="{'is_active':route.params.submenu === 'token'}" @click="settingDetail('token')">Access Tokens</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18" class="right">
        <edit-profile v-if="route.params.submenu === 'profile'"></edit-profile>
        <edit-account v-else-if="route.params.submenu === 'account'"></edit-account>
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
import editToken from './editToken.vue'
import {
  Plus
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Plus, editProfile, editAccount, editToken
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
      if (parseInt(chainId, 16) === 3141 || parseInt(chainId, 16) === 97 || parseInt(chainId, 16) === 137) {
        const lStatus = await system.$commonFun.login()
        if (lStatus) {
          loading.value = false
          listLoad.value = false
        }
        return false
      } else loadingText.value = 'Switch to Filecoin TestNet or BSC TestNet!'
      // system.$commonFun.messageTip('error', 'Switch to Filecoin TestNet!')
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
      ethereum.on('chainChanged', function (accounts) {
        if (!prevType.value) return false
        if (parseInt(accounts, 16) === 3141 || parseInt(accounts, 16) === 97 || parseInt(accounts, 16) === 137) isLogin()
      })
      // 监听metamask网络断开
      ethereum.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        loading.value = true
        loadingText.value = 'Switch to Filecoin TestNet or BSC TestNet!'
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    function changeNetChange (rows) {
      system.$commonFun.changeNet(rows)
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
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
      isLogin, signIn, fn, changeNetChange, momentFilter, settingDetail,
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
    display: flex;
    align-items: stretch;
    padding: 0 0.16rem;
    margin: auto;
    font-size: 14px;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    &.opacity {
      opacity: 0;
    }
    .left {
      position: relative;
      padding: 0.2rem 0;
      background-color: #fbfbfc;
      border: 1px solid #eee;
      border-radius: 0.1rem;
      .left_body {
        padding: 0.15rem 0 0;
        margin: 0 auto;
        border: 0;
        text-align: left;
        color: #000;
        .width_div {
          display: flex;
          align-items: center;
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
          .top_text {
            display: flex;
            align-items: center;
            margin: 0 0 0.2rem;
            color: #fff;
            font-family: "Helvetica-Bold";
            font-size: 0.2rem;
            .icon {
              display: block;
              width: 25px;
              height: 25px;
              margin: -1px 0.07rem 0 0;
              @media screen and (min-width: 1800px) {
                width: 30px;
                height: 30px;
              }
              @media screen and (max-width: 768px) {
                width: 20px;
                height: 20px;
              }
            }
            .icon_interests {
              background: url(../../../assets/images/icons/icon_28_1.png)
                no-repeat left 0px;
              background-size: 100%;
            }
            .icon_organizations {
              background: url(../../../assets/images/icons/icon_35.png)
                no-repeat 2px 0px;
              background-size: auto 100%;
            }
          }
        }
        ul {
          width: 100%;
          border-top: 1px solid #eee;
          li {
            padding: 0.12rem 5%;
            border-bottom: 1px solid #eee;
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
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.35rem 0 0.15rem;
        color: #9ca3b1;
        font-size: 0.19rem;
        .top_text {
          display: flex;
          align-items: center;
          h3 {
            color: #7405ff;
            font-family: "Helvetica-Neue";
            font-size: 0.22rem;
            font-weight: 500;
            line-height: 1.2;
            text-align: left;
          }
          .el-input {
            max-width: 2rem;
            margin: 0 0 0 0.17rem;
            .el-input__inner {
              padding-left: 0.35rem;
              background: url(../../../assets/images/icons/icon_13_1.png)
                no-repeat 0.1rem center;
              background-size: 17px;
              border-radius: 0.1rem;
              border-color: #cfcfcf;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
            }
            .el-input__prefix {
              padding: 0;
              .el-icon {
                svg {
                  width: 0.22rem;
                  height: 0.22rem;
                  color: #9ea5b3;
                }
              }
            }
            ::-webkit-input-placeholder {
              color: #9ca3b1;
            } /* 使用webkit内核的浏览器 */
            :-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本4-18 */
            ::-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本19+ */
            :-ms-input-placeholder {
              color: #9ca3b1;
            }
          }
          .peopleImg {
            width: 0.55rem;
            height: 0.55rem;
            border-radius: 0.65rem;
            border: 2px solid #4784ea;
            cursor: pointer;
          }
          .icon {
            display: block;
            width: 0.25rem;
            height: 0.25rem;
          }
          .icon_cont {
            background: url(../../../assets/images/icons/icon_17.png) no-repeat
              left 0px;
            background-size: auto 100%;
          }
          .icon_info {
            background: url(../../../assets/images/icons/icon_18.png) no-repeat
              left 0px;
            background-size: auto 100%;
          }
          .l {
            margin-left: 0.35rem;
          }
        }
        .el-select {
          float: right;
          .el-input {
            cursor: pointer;
            .el-input__inner {
              width: 195px;
              padding: 0 12px 0 40px !important;
              background-color: #f5f6f8;
              border-color: #e1e1e1;
              font-size: 14px;
              line-height: 1;
              border-radius: 0.09rem;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
            }
            .el-input__prefix {
              color: #9ca3b1;
              .el-icon-select {
                width: 21px;
                height: 21px;
                background: url(../../../assets/images/icons/icon_12.png)
                  no-repeat left center;
                background-size: 100%;
              }
            }
            .el-input__suffix {
              display: none;
            }
            ::-webkit-input-placeholder {
              color: #9ca3b1;
            } /* 使用webkit内核的浏览器 */
            :-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本4-18 */
            ::-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本19+ */
            :-ms-input-placeholder {
              color: #9ca3b1;
            }
          }
        }
      }
      .my_profile {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0.25rem;
        margin: 0 0 0.25rem;
        background-color: #7405ff;
        border-radius: 0.1rem;
        .peopleImg {
          width: 1.1rem;
          height: 1.1rem;
          margin: 0 0.3rem 0 0;
          border-radius: 1.1rem;
          border: 0.08rem solid #6cb9ff;
          cursor: pointer;
        }
        .cont {
          margin: 0.1rem 0 0;
          color: #fff;
          h5 {
            padding: 0.1rem 0;
            font-family: "Helvetica-Neue";
            font-size: 0.2rem;
            font-weight: normal;
            line-height: 1;
            text-align: left;
            span {
              position: relative;
              padding-left: 0.15rem;
              margin-left: 0.4rem;
              font-size: 14px;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
              &::after {
                position: absolute;
                content: "";
                left: 0;
                top: 50%;
                width: 5px;
                height: 5px;
                margin-top: -2px;
                background-color: #fff;
                border-radius: 100%;
              }
            }
          }
          h6 {
            padding: 0.1rem 0;
            font-family: "Helvetica-Neue";
            font-size: 0.18rem;
            font-weight: normal;
            line-height: 1;
            text-align: left;
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
          }
          .media {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            li {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin: 0.1rem 0.25rem 0.1rem 0;
              font-size: 14px;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
              .iconBody {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 25px;
                height: 25px;
                margin: 0 0.07rem 0 0;
                border-radius: 100%;
                @media screen and (min-width: 1800px) {
                  width: 30px;
                  height: 30px;
                }
                svg {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
      .list {
        margin: 0.35rem 0 0;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0;
          font-size: 0.21rem;
          color: #000;
          border-radius: 0.08rem;
          .icon {
            width: 0.23rem;
            height: 0.23rem;
            margin: -1px 0.07rem 0 0;
          }
          .icon_myProfile {
            background: url(../../../assets/images/icons/icon_16.png) no-repeat
              left center;
            background-size: auto 100%;
          }
          .icon_spaces {
            background: url(../../../assets/images/icons/icon_15_1.png)
              no-repeat left center;
            background-size: 100% auto;
          }
          .icon_datasets {
            background: url(../../../assets/images/icons/icon_19.png) no-repeat
              left center;
            background-size: auto 100%;
          }
          .icon_models {
            background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
              left center;
            background-size: auto 100%;
          }
          span {
            margin-left: 0.13rem;
            color: #9ca3b1;
          }
        }
      }
      .list_body {
        padding: 0 0 0.2rem;
        min-height: 80px;
        .el-col {
          margin: 0.16rem 0;
          .box-card {
            padding: 0.15rem 0.2rem;
            background-color: #fff;
            border-color: #e4e4e4;
            border-radius: 0.1rem;
            box-shadow: 5px 7px 9px rgba(0, 0, 0, 0.15);
            * {
              cursor: pointer;
            }
            .el-card__header {
              padding: 0;
              border: 0;
              .card-header {
                display: flex;
                justify-content: flex-end;
                span {
                  height: 0.25rem;
                  padding-left: 0.3rem;
                  background: url(../../../assets/images/icons/icon_9.png)
                    no-repeat left 0px;
                  background-size: 0.2rem;
                  font-size: 14px;
                  color: #000;
                  line-height: 0.25rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 15px;
                  }
                }
              }
            }
            .el-card__body {
              padding: 0;
              .text {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #000;
                line-height: 1;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                .icon {
                  width: 20px;
                  height: 20px;
                  margin: -1px 6px 0 0;
                }
                .icon_text {
                  background: url(../../../assets/images/icons/icon_10.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_time {
                  width: 15px;
                  background: url(../../../assets/images/icons/icon_11.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_up {
                  width: 15px;
                  margin: -1px 3px 0 0;
                  background: url(../../../assets/images/icons/icon_20.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .small {
                  margin-top: 3px;
                  color: #9ca3b1;
                  font-size: 12px;
                  text-align: left;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                }
                .el-row {
                  width: 100%;
                  margin: 0.1rem 0 0.25rem;
                  .el-col {
                    margin: 0.05rem 0;
                    a {
                      display: block;
                      padding-top: 0.05rem;
                      padding-bottom: 0.05rem;
                      margin: 0.03rem auto;
                      background-color: #94c0ff;
                      border-radius: 0.2rem;
                      font-size: 13px;
                      color: #024384;
                      @media screen and (min-width: 1800px) {
                        font-size: 15px;
                      }
                      @media screen and (max-width: 1440px) {
                        font-size: 12px;
                      }
                      &:hover {
                        opacity: 0.9;
                      }
                    }
                    &:nth-child(2n + 2) {
                      a {
                        background-color: #d2e3ff;
                      }
                    }
                  }
                }
                .ellipsis {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-spacing: normal;
                }
              }
              .item {
                justify-content: space-between;
                margin: 0.2rem 0 0;
                .item_body {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
          &:hover {
            .box-card {
              background-color: #7405ff;
              .el-card__header {
                .card-header {
                  span {
                    background: url(../../../assets/images/icons/icon_9_1.png)
                      no-repeat left 0px;
                    background-size: 0.2rem;
                    color: #fff;
                  }
                }
              }
              .el-card__body {
                .text {
                  color: #fff;
                  .icon_text {
                    background: url(../../../assets/images/icons/icon_10_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .icon_time {
                    background: url(../../../assets/images/icons/icon_11_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .icon_up {
                    background: url(../../../assets/images/icons/icon_20_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .small {
                    color: #fff;
                  }
                  .el-row {
                    .el-col {
                      a {
                        background-color: #fff;
                      }
                      &:nth-child(2n + 2) {
                        a {
                          background-color: #d2e3ff;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .list_flex {
        flex-wrap: nowrap;
        overflow: hidden;
      }
      .more_style {
        display: flex;
        justify-content: center;
        img {
          display: flex;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 100%;
          box-shadow: 2px 2px 8px rgba(135, 135, 135, 0.5);
          @media screen and (max-width: 1600px) {
            width: 35px;
            height: 35px;
          }
          @media screen and (max-width: 768px) {
            width: 30px;
            height: 30px;
          }
          &:hover {
            transform: translateY(5px);
          }
        }
      }
      .list_body_spaces {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin: 0.4rem 0 0.3rem;
        text-align: left;
        .el-form-item {
          width: 100%;
          &.flex_form {
            width: 50%;
          }
          .el-form-item__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;
            text-align: left;
            .label {
              display: flex;
              align-items: center;
              width: 100%;
              text-align: left;
              color: #565656;
              @media screen and (min-width: 1800px) {
                font-size: 16px;
              }
              .span {
                margin-left: 0.1rem;
                color: #aaaaaa;
              }
            }
            .flex-row {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              width: 100%;
              .el-select {
                width: 100%;
              }
              .self-end {
                width: 30px;
                text-align: center;
              }
              .img {
                width: 60px;
                height: 60px;
                margin: 0.15rem 0 0;
              }
              small {
                display: block;
                width: 100%;
                font-size: 12px;
                color: #afafaf;
                line-height: 1.5;
                @media screen and (min-width: 1800px) {
                  font-size: 14px;
                }
              }
            }
            .avatar {
              width: 65px;
              height: 65px;
            }
            .remove {
              margin: 0.15rem 0 0 0.15rem;
              cursor: pointer;
            }
            .avatar-uploader-icon {
              padding: 0.15rem 0.2rem;
              background: linear-gradient(180deg, #fefefe, #f0f0f0);
              border-radius: 0.07rem;
              color: #606060;
              font-family: inherit;
              &:hover {
                opacity: 0.95;
                border-color: #c37af9;
              }
            }
            .el-radio-group {
              width: 100%;
              margin: 0.2rem 0 0;
              border-top: 1px solid #eee;
              border-bottom: 1px solid #eee;
              .el-radio {
                width: 100%;
                height: auto;
                margin: 0.2rem 0;
                .el-radio__label {
                  h5,
                  p {
                    text-align: left;
                    font-size: 16px;
                    font-weight: 100;
                    color: #333;
                    line-height: 1.5;
                    word-break: break-word;
                    white-space: normal;
                  }
                  p {
                    font-size: 14px;
                    color: #7e7e7e;
                    line-height: 1.3;
                  }
                }
              }
            }
            .el-button {
              font-family: inherit;
              cursor: pointer;
              @media screen and (min-width: 1800px) {
                font-size: 16px;
              }
              span {
                cursor: pointer;
              }
            }
            .el-input {
              .el-input__inner {
                height: auto;
                padding: 0.03rem 0.1rem;
                border-radius: 0.07rem;
                border-color: #f1f1f1;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                &:hover {
                  border-color: #c37af9;
                }
              }
              .el-input__prefix {
                padding: 0;
                .el-icon {
                  svg {
                    width: 0.22rem;
                    height: 0.22rem;
                    color: #9ea5b3;
                  }
                }
              }
            }
            .icon_media {
              display: inline-block;
              width: 18px;
              height: 18px;
              margin: -1px 0.07rem 0 0;
              @media screen and (min-width: 1800px) {
                width: 23px;
                height: 23px;
              }
            }
            .icon_github {
              background: url(../../../assets/images/icons/media_8.png)
                no-repeat left center;
              background-size: 100%;
            }
            .icon_twitter {
              background: url(../../../assets/images/icons/media_9.png)
                no-repeat left center;
              background-size: 100%;
            }
          }
          .el-form-item__label {
            display: none;
          }
        }
      }
      .el-pagination {
        margin: 0.1rem auto;
        display: flex;
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
