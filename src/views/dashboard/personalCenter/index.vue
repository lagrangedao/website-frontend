<template>
  <section id="dataset" v-loading="loading" :element-loading-text="loadingText">
    <network-alert v-if="loadingText"></network-alert>
    <el-row class="dataset_body">
      <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6" class="left">
        <div class="left_body">
          <div v-loading="false" class="logo_sidebar">
            <img :src="listdata.user.avatar || accessAvatar || peopleUrl" alt="">
          </div>
          <div class="personal">
            <div class="title">
              {{ listdata.user.full_name || '-'}}
            </div>
            <div class="desc" style="margin-bottom:0.1rem">Decentralized data science without borders</div>
            <div class="desc">Balance: {{info.balance||'-'}} {{info.unit}}</div>
            <el-button type="" text bg @click="editProfile">Settings</el-button>
          </div>
          <div class="personal">
            <div class="top_text">
              <i class="icon icon_interests"></i>
              Research interests
            </div>
            <div class="desc">None yet</div>
          </div>
          <div class="personal">
            <div class="top_text">
              <i class="icon icon_organizations"></i>
              Organizations
            </div>
            <div class="desc">None yet</div>
          </div>
          <div class="media">
            <a v-if="listdata.user.homepage" :href="listdata.user.homepage" target="_blank" class="homepage"></a>
            <a v-if="listdata.user.twitter_username" :href="'https://twitter.com/'+listdata.user.twitter_username" target="_blank" class="twitter"></a>
            <a v-if="listdata.user.github_username" :href="'https://github.com/'+listdata.user.github_username" target="_blank" class="github"></a>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="18" :xl="18" class="right">
        <div class="top">
          <div class="top_text">
            <!-- <h3>Hello {{info.address}}, <br />Welcome to Filecoin TestNet! </h3> -->
          </div>
          <div class="top_text">
            <el-input v-model="searchValue" class="w-50 m-2" placeholder="search ..." />
            <el-badge is-dot class="item l">
              <i class="icon icon_cont"></i>
            </el-badge>
            <el-badge class="item l">
              <i class="icon icon_info"></i>
            </el-badge>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <i class="icon icon_spaces"></i>
            Spaces
            <span>{{spacesIndex}}</span>
          </div>
        </div>
        <el-row :gutter="32" :class="{'list_body_spaces':true,'list_flex':!listdata.spacesIsShow}" v-loading="listLoad">
          <el-col v-if="!listdata.spacesIsShow" :xs="24" :sm="24" :md="spacesIndex>1?12:24" :lg="spacesIndex>1?12:24" :xl="spacesIndex>1?12:24" v-for="list in listdata.spaces.slice(0,2)" :key="list" @click="detailFun(list, 'space')">
            <el-card class="box-card">
              <template #header>
                <div class="card-warn" v-if="list.expireTime <= 7 && list.expireTime > 0">
                  <el-popover placement="right-start" :width="200" trigger="hover" :content="`This Space will expire in ${list.expireTime} days, please click to the details page to renew`">
                    <template #reference>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
                <div class="card-warn" v-else-if="list.expiration_date && list.expireTime < 0">
                  <p class="expir">Expired</p>
                </div>
                <div class="card-header">
                  <span>1</span>
                </div>
                <h1>{{list.name}}</h1>
              </template>
            </el-card>
          </el-col>
          <el-col v-if="listdata.spacesIsShow" :xs="24" :sm="24" :md="spacesIndex>1?12:24" :lg="spacesIndex>1?12:24" :xl="spacesIndex>1?12:24" v-for="list in listdata.spaces" :key="list" @click="detailFun(list, 'space')">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>1</span>
                </div>
                <h1>{{list.name}}</h1>
              </template>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style" v-if="listdata.spaces.length>2">
          <img v-if="!listdata.spacesIsShow" @click="listdata.spacesIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img v-else @click="listdata.spacesIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>
        <div class="top">
          <div class="list">
            <div class="title">
              <i class="icon icon_datasets"></i>
              Datasets
              <span>{{dataSetIndex}}</span>
            </div>
          </div>
          <el-select v-model="value" class="m-2" placeholder="Sort: most Downloads">
            <template #prefix>
              <i class="el-icon-select"></i>
            </template>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-row :gutter="32" :class="{'list_body':true,'list_flex':!listdata.datasetsIsShow}" v-loading="listLoad">
          <el-col v-show="!listdata.datasetsIsShow" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.datasets.slice(0,3)" :key="l" @click="detailFun(list, 'dataset')">
            <el-card class="box-card">
              <template #header>
                <!-- <div class="card-header">
                                    <span>27</span>
                                </div> -->
              </template>
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.name}}</p>
              </div>
              <div class="text">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item">
                <div class="item_body">
                  <i class="icon icon_time"></i>
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
          <el-col v-show="listdata.datasetsIsShow" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.datasets" :key="l" @click="detailFun(list, 'dataset')">
            <el-card class="box-card">
              <template #header>
              </template>
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.name}}</p>
              </div>
              <div class="text">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item">
                <div class="item_body">
                  <i class="icon icon_time"></i>
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style" v-if="listdata.datasets.length>3 || (bodyWidth&&listdata.datasets.length>1)">
          <img v-if="!listdata.datasetsIsShow" @click="listdata.datasetsIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img v-else @click="listdata.datasetsIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>
        <div class="top">
          <div class="list">
            <div class="title">
              <i class="icon icon_models"></i>
              Models
              <span>{{modelsIndex}}</span>
            </div>
          </div>
        </div>
        <el-row :gutter="32" :class="{'list_body':true,'list_flex':!listdata.modelsIsShow}" v-loading="listLoad">
          <el-col v-show="!listdata.modelsIsShow" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.models.slice(0,3)" :key="l">
            <el-card class="box-card">
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.name}}</p>
              </div>
              <div class="text">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item">
                <div class="item_body">
                  <i class="icon icon_time"></i>
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
          <el-col v-show="listdata.modelsIsShow" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.models" :key="l">
            <el-card class="box-card">
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.name}}</p>
              </div>
              <div class="text">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item">
                <div class="item_body">
                  <i class="icon icon_time"></i>
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style" v-if="listdata.models.length>3">
          <img v-if="!listdata.modelsIsShow" @click="listdata.modelsIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img v-else @click="listdata.modelsIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>
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
import networkAlert from '@/components/networkAlert.vue'
import {
  Warning
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    networkAlert, Warning
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const info = reactive({
      address: '',
      balance: '',
      unit: ''
    })
    const options = ref([
      {
        value: 'Option1',
        label: 'Most Downloads',
      },
      {
        value: 'Option2',
        label: 'Alphabetical',
      },
      {
        value: 'Option3',
        label: 'Recently Updated',
      },
      {
        value: 'Option4',
        label: 'Most Likes',
      }
    ])
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const peopleUrl = require("@/assets/images/dashboard/people_default.png")
    const loading = ref(true)
    const loadingText = ref('')
    const prevType = ref(true)
    const dataSetIndex = ref(0)
    const modelsIndex = ref(0)
    const spacesIndex = ref(0)
    const listdata = reactive({
      datasets: [],
      models: [],
      spaces: [],
      user: {},
      datasetsIsShow: false,
      modelsIsShow: false,
      spacesIsShow: false
    })
    const listLoad = ref(false)
    const bodyWidth = ref(document.body.clientWidth < 768)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function isLogin () {
      loadingText.value = ''
      system.$commonFun.Init(async addr => {
        info.address = addr
        system.$commonFun.web3Init.eth.getBalance(addr).then((balance) => {
          // console.log(balance)
          const myBalance = balance
          const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
          info.balance = Number(balanceAll).toFixed(4)
        })
        const chainId = await system.$commonFun.web3Init.eth.net.getId()
        info.unit = await system.$commonFun.getUnit(chainId)
        // await system.$commonFun.timeout(500)
        if (lagLogin.value) getdataList()
        else await signIn()
      })
    }
    async function signIn () {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      if (parseInt(chainId, 16) === 3141 || parseInt(chainId, 16) === 97 || parseInt(chainId, 16) === 137 || parseInt(chainId, 16) === 11155111) {
        const lStatus = await system.$commonFun.login()
        if (lStatus) getdataList()
        // else window.location.reload()
        return false
      } else loadingText.value = system.$NetworkPrompt
      // system.$commonFun.messageTip('error', 'Switch to Filecoin TestNet!')
      store.dispatch('setNavLogin', false)
    }
    async function getdataList () {
      loading.value = false
      listLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}profile`, 'get')
      if (listRes && listRes.status === 'success') {
        listdata.datasets = listRes.data.dataset || []
        listdata.models = listRes.data.model || []
        listdata.spaces = listRes.data.space || []
        listdata.user = listRes.data.user || {}
        dataSetIndex.value = listRes.data.dataset.length
        modelsIndex.value = listRes.data.model.length
        spacesIndex.value = listRes.data.space.length
        store.dispatch('setAccessAvatar', listRes.data.user.avatar)
        store.dispatch('setAccessName', listRes.data.user.full_name)
        let spaceList = []
        let datasetList = []
        listdata.spaces.forEach(space => {
          if (space.expiration_date) {
            const current = Math.floor(Date.now() / 1000)
            const currentTime = (space.expiration_date - current) / 86400
            space.expireTime = Math.floor(currentTime)
          } else space.expireTime = -1
          spaceList.push(space.name)
        })
        listdata.datasets.forEach(space => datasetList.push(space.name))
        store.dispatch('setAccessSpace', JSON.stringify(spaceList))
        store.dispatch('setAccessDataset', JSON.stringify(datasetList))
      } else {
        listdata.datasets = []
        listdata.models = []
        listdata.spaces = []
        listdata.user = {}
        dataSetIndex.value = 0
        modelsIndex.value = 0
        spacesIndex.value = 0
        system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
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
        if (parseInt(accounts, 16) === 3141 || parseInt(accounts, 16) === 97 || parseInt(accounts, 16) === 137 || parseInt(accounts, 16) === 11155111) isLogin()
      })
      // 监听metamask网络断开
      ethereum.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        loading.value = true
        loadingText.value = system.$NetworkPrompt
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    function hiddAddress (val) {
      if (val) return `${val.substring(0, 5)}...${val.substring(val.length - 5)}`
      else return '-'
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    function detailFun (row, type) {
      if (type === 'dataset') router.push({ name: 'datasetDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
      else if (type === 'space') router.push({ name: 'spaceDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
      else if (type === 'model') router.push({ name: 'modelsDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
    }
    function editProfile (row, index) {
      // console.log(row, index)
      router.push({ name: 'personalCenterProfile', params: { menu: 'profile' } })
    }
    onMounted(() => {
      window.onresize = () => {
        return (() => {
          bodyWidth.value = document.body.clientWidth < 768
        })()
      }
    })
    onActivated(() => {
      fn()
      if (navLogin.value || !!metaAddress.value) isLogin()
      else router.push({ name: 'main' })
    })
    onDeactivated(() => {
      listdata.datasetsIsShow = false
      listdata.modelsIsShow = false
      listdata.spacesIsShow = false
      listdata.datasets = []
      listdata.models = []
      listdata.spaces = []
      listdata.user = {}
      dataSetIndex.value = 0
      modelsIndex.value = 0
      spacesIndex.value = 0
    })
    watch(navLogin, (newValue, oldValue) => {
      if (navLogin.value) isLogin()
    })
    watch(() => bodyWidth, (val) => {
      bodyWidth.value = val
    })
    return {
      metaAddress,
      navLogin, lagLogin, searchValue, value,
      info,
      options,
      currentPage1,
      small,
      background,
      logoUrl,
      peopleUrl,
      system,
      loading,
      loadingText,
      prevType,
      dataSetIndex,
      modelsIndex,
      spacesIndex,
      listdata,
      listLoad,
      accessAvatar,
      bodyWidth,
      isLogin, signIn, getdataList, fn, momentFilter, detailFun, editProfile, hiddAddress
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  position: relative;
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
      padding: 0;
      background-color: #7405ff;
      .left_body {
        width: 90%;
        max-width: 280px;
        padding: 0.25rem 0;
        margin: 0 auto;
        border: 0;
        text-align: left;
        color: #fff;
        .logo_sidebar {
          position: relative;
          display: block;
          width: 100px;
          height: 100px;
          margin: 0.55rem 0 0;
          background-color: #fff;
          border: 0.07rem solid #fff;
          border-radius: 50%;
          overflow: hidden;
          @media screen and (min-width: 1800px) {
            width: 120px;
            height: 120px;
            border: 0.1rem solid #fff;
          }
          @media screen and (max-width: 768px) {
            width: 80px;
            height: 80px;
          }
          @media screen and (max-width: 600px) {
            width: 60px;
            height: 60px;
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .el-loading-mask {
          background-color: #fff;
          .el-loading-spinner {
            top: 50%;
          }
        }
        .personal {
          margin: 0.2rem 0 0.45rem;
          .title {
            font-family: "Helvetica-Bold";
            font-size: 0.28rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            word-spacing: normal;
            @media screen and (min-width: 1800px) {
              font-size: 0.33rem;
            }
          }
          .desc {
            margin: 0.05rem 0 0.2rem;
            font-size: 15px;
            @media screen and (min-width: 1800px) {
              font-size: 17px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 14px;
            }
            @media screen and (max-width: 768px) {
              font-size: 13px;
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
            font-size: 0.18rem;
            font-weight: bold;
            @media screen and (min-width: 1800px) {
              font-size: 0.2rem;
            }
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
        .media {
          display: flex;
          align-items: center;
          a {
            display: block;
            width: 25px;
            height: 25px;
            margin: 0 0.1rem 0 0;
            &.homepage {
              background: url(../../../assets/images/icons/media_10.png)
                no-repeat;
              background-size: 100%;
            }
            &.twitter {
              background: url(../../../assets/images/icons/media_2.png)
                no-repeat;
              background-size: 100%;
            }
            &.github {
              background: url(../../../assets/images/icons/media_3.png)
                no-repeat;
              background-size: 100%;
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
        margin: 0.15rem 0 0;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0;
          font-size: 0.195rem;
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
                margin-bottom: 0.1rem;
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
                .icon_wallet {
                  background: url(../../../assets/images/icons/icon_48.png)
                    no-repeat left -1px;
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
                  .icon_wallet {
                    background: url(../../../assets/images/icons/icon_48_1.png)
                      no-repeat left -1px;
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
        padding: 0.16rem 0;
        min-height: 80px;
        .el-col {
          margin: 0.16rem 0;
          .box-card {
            background-color: #fff;
            box-shadow: none;
            border: 0;
            border-radius: 0;
            .el-card__header {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 1.85rem;
              padding: 0;
              border: 0;
              border-radius: 0.1rem;
              font-size: 0.338rem;
              color: #fff;
              cursor: pointer;
              .card-warn {
                position: absolute;
                left: 0.33rem;
                top: 0.1rem;
                display: flex;
                align-items: center;
                @media screen and (max-width: 768px) {
                  left: 0.2rem;
                }
                i {
                  font-size: 0.25rem;
                  color: #e6a23c;
                }
                .expir {
                  font-size: 14px;
                  color: #e6a23c;
                }
              }
              .card-header {
                position: absolute;
                right: 0.33rem;
                top: 0.1rem;
                display: flex;
                align-items: center;
                @media screen and (max-width: 768px) {
                  right: 0.2rem;
                }
                span {
                  height: 0.25rem;
                  padding-left: 0.3rem;
                  background: url(../../../assets/images/icons/icon_9_1.png)
                    no-repeat left 0px;
                  background-size: 0.2rem;
                  font-size: 14px;
                  color: #fff;
                  line-height: 0.25rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 15px;
                  }
                }
              }
              h1 {
                // text-shadow: 3px 3px rgba(0, 0, 0, 0.2);
                // text-transform: capitalize;
                cursor: pointer;
                font-size: 0.3rem;
                letter-spacing: 1px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-word;
              }
            }
            .el-card__body {
              padding: 0.1rem 0;
              cursor: pointer;
              .text {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #000;
                line-height: 1;
                cursor: pointer;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                .text_left {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .icon {
                  width: 0.25rem;
                  height: 0.25rem;
                  margin: -1px 0.17rem 0 0;
                  border-radius: 0.04rem;
                }
                span {
                  color: #9ca3b1;
                  font-size: 12px;
                  cursor: pointer;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                }
                .small {
                  color: #000;
                }
              }
            }
          }
          &:hover {
            .box-card {
              .el-card__header {
                opacity: 0.8;
              }
            }
          }
          &:nth-child(9n + 1) {
            .box-card {
              .el-card__header {
                background: #7405ff
                  url(../../../assets/images/dashboard/spaces/space_b_08.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_01.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 2) {
            .box-card {
              .el-card__header {
                background: #024ec6
                  url(../../../assets/images/dashboard/spaces/space_b_02.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_02.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 3) {
            .box-card {
              .el-card__header {
                background: #447dff
                  url(../../../assets/images/dashboard/spaces/space_b_03.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_03.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 4) {
            .box-card {
              .el-card__header {
                background: #0050ff
                  url(../../../assets/images/dashboard/spaces/space_b_04.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_04.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 5) {
            .box-card {
              .el-card__header {
                background: #0e5ccc
                  url(../../../assets/images/dashboard/spaces/space_b_05.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_05.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 6) {
            .box-card {
              .el-card__header {
                background: #024ec6
                  url(../../../assets/images/dashboard/spaces/space_b_06.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_06.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 7) {
            .box-card {
              .el-card__header {
                background: #024ec6
                  url(../../../assets/images/dashboard/spaces/space_b_07.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_07.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 8) {
            .box-card {
              .el-card__header {
                background: #0234a6
                  url(../../../assets/images/dashboard/spaces/space_b_08.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_08.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 9) {
            .box-card {
              .el-card__header {
                background: #002b77
                  url(../../../assets/images/dashboard/spaces/space_b_09.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_09.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
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
        width: 1px;
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
