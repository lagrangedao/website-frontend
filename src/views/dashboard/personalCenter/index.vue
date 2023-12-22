<template>
  <section id="dataset" v-loading="loading" :element-loading-text="loadingText">
    <el-row class="dataset_body container-landing flex-row">
      <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="6" class="left">
        <div class="left_body">
          <div v-loading="false" class="logo_sidebar">
            <img :src="accessAvatar || peopleUrl" alt="">
          </div>
          <div class="personal">
            <div class="title">
              {{ listdata.user.full_name || '-'}}
            </div>
            <!-- <div class="desc flex-row" style="margin-bottom:0.1rem">Decentralized data science without borders</div>
            <div class="desc flex-row">Network: {{info.network||'-'}}</div>
            <div class="desc flex-row">Balance: {{info.balance||'-'}} {{info.unit}}</div> -->
            <div class="desc flex-row">Wallet Address: {{system.$commonFun.hiddAddress(metaAddress)}}
              <el-icon v-if="metaAddress" @click="system.$commonFun.copyContent(metaAddress, 'Copied')">
                <CopyDocument />
              </el-icon>
            </div>
            <div class="flex-row">
              <el-button type="" text bg @click="editProfile('profile')">Edit profile</el-button>
              <el-button type="" text bg @click="editProfile('account')">Settings</el-button>
            </div>
          </div>
          <div class="personal">
            <div class="top_text flex-row">
              <i class="icon icon_interests"></i>
              Research interests
            </div>
            <div class="desc flex-row">None yet</div>
          </div>
          <div class="personal">
            <div class="top_text flex-row">
              <i class="icon icon_organizations"></i>
              Organizations
            </div>
            <div class="desc flex-row">None yet</div>
          </div>
          <!-- <div class="personal">
            <el-button type="" text bg>
              <router-link :to="{name:'paymentHistory', query: {type: 'user'}}">User Payment History</router-link>
            </el-button>
            <br /><br />
            <el-button type="" text bg>
              <router-link :to="{name:'paymentHistory', query: {type: 'provider'}}">Provider Payment History</router-link>
            </el-button>
          </div> -->
          <div class="media flex-row">
            <a v-if="listdata.user.homepage" :href="listdata.user.homepage" target="_blank" class="homepage"></a>
            <a v-if="listdata.user.twitter_username" :href="'https://twitter.com/'+listdata.user.twitter_username" target="_blank" class="twitter"></a>
            <a v-if="listdata.user.github_username" :href="'https://github.com/'+listdata.user.github_username" target="_blank" class="github"></a>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="18" :xl="18" class="right">
        <div class="top flex-row">
          <div class="top_text flex-row">
            <!-- <h3>Hello {{info.address}}, <br />Welcome to Filecoin TestNet! </h3> -->
          </div>
          <div class="top_text flex-row">
            <el-input v-model="searchValue" class="w-50 m-2" placeholder="Search ..." />
            <el-badge v-if="listdata.outgoing_pending_license_requests.length === 0" class="item l el-dropdown-link">
              <i class="icon icon_cont"></i>
            </el-badge>
            <el-dropdown v-else max-height="300" popper-class="message_style" :teleported="true">
              <el-badge :value="listdata.outgoing_pending_license_requests.length" class="item l el-dropdown-link">
                <i class="icon icon_cont"></i>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <div class="drop_title">Pending requests for approval</div>
                  <el-dropdown-item :command="c" v-for="(child, c) in listdata.outgoing_pending_license_requests" :key="c">
                    <div class="drop_body margin">
                      <p>
                        {{c+1}}.
                        <b>{{child.name}}</b>
                      </p>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-badge v-if="listdata.license_requests_notifications.length === 0" class="item l el-dropdown-link">
              <i class="icon icon_info"></i>
            </el-badge>
            <el-dropdown v-else @command="handleCommand" max-height="300" popper-class="message_style" :teleported="true">
              <el-badge :value="listdata.license_requests_notifications.length" class="item l el-dropdown-link">
                <i class="icon icon_info"></i>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="c" v-for="(child, c) in listdata.license_requests_notifications" :key="c">
                    <div class="drop_body">
                      <p>{{ child.recipient_address? system.$commonFun.hiddAddress(child.recipient_address):'Someone else' }} is requesting your {{child.source_type ? (child.source_type):''}} license:
                        <b>{{child.name}}</b>
                      </p>
                      <el-button @click="licenseMetaData(child)" type="primary" size="small">Approve</el-button>
                      <el-button @click="licenseFun(child, 'reject')" type="danger" size="small">Reject</el-button>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="list">
          <div class="title flex-row">
            <i class="icon icon_spaces"></i>
            Spaces
            <span>{{spacesIndex}}</span>
          </div>
        </div>
        <el-row :gutter="32" :class="{'list_body_spaces':true,'list_flex':!listdata.spacesIsShow}" v-loading="listLoad">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list,sIndex) in listdata.spaces" :key="sIndex" @click="detailFun(list, 'space')">
            <el-card class="box-card is-hover" v-show="!listdata.spacesIsShow ? sIndex<9: true">
              <template #header>
                <div class="card-warn flex-row" v-if="list.status === 'Running' && list.activeOrder && list.activeOrder.config && list.activeOrder.config.hardware_type">
                  <!-- v-if="list.expiration_time !== null && ((list.expireTime <=5&&list.expireTimeUnit!=='hours') ||(list.expireTime <=24&&list.expireTimeUnit==='hours'))"
                  <el-popover placement="right-start" :width="200" trigger="hover" :content="list.expireTime <= 0 ? 'This space has expired, please click to the details page to reboot':`This Space will expire in ${list.expireTime
              < 0.1 ? '3': list.expireTime} ${list.expireTimeUnit}, please click to the details page to renew`" popper-style="word-break: break-word; text-align: left;">
                    <template #reference>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </template>
                  </el-popover> -->
                  <span class="run">Running on
                    <strong style="text-transform: uppercase;">{{list.activeOrder.config.hardware_type === 'GPU' ? list.activeOrder.config.hardware : 'CPU'}}</strong>
                  </span>
                </div>
                <div class="card-header flex-row">
                  <span>{{list.likes}}</span>
                </div>
                <h1>{{list.name}}</h1>
              </template>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style flex-row" v-if="listdata.spaces.length>9">
          <img class=" flex-row" v-if="!listdata.spacesIsShow" @click="listdata.spacesIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img class=" flex-row" v-else @click="listdata.spacesIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>

        <div class="top">
          <div class="list">
            <div class="title flex-row">
              <i class="icon icon_datasets"></i>
              Datasets
              <span>{{dataSetIndex}}</span>
            </div>
          </div>
          <!-- <el-select v-model="value" class="m-2" placeholder="Sort: most Downloads">
            <template #prefix>
              <i class="el-icon-select"></i>
            </template>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        </div>
        <el-row :gutter="32" :class="{'list_body':true,'list_flex':!listdata.datasetsIsShow}" v-loading="listLoad">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.datasets" :key="l" @click="detailFun(list, 'dataset')">
            <el-card class="box-card is-hover" v-show="!listdata.datasetsIsShow ? l<3: true">
              <template #header>
                <div class="card-header card-datasets flex-row">
                  <div class="name flex-row">
                    <!-- <div class="img"></div> -->
                    <b>{{list.name}}</b>
                  </div>
                  <span>{{list.likes}}</span>
                </div>
              </template>
              <div class="text flex-row">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.license}}</p>
              </div>
              <div class="text flex-row">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{system.$commonFun.hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item flex-row">
                <div class="item_body flex-row">
                  <i class="icon icon_time"></i>
                  <span class="small">{{system.$commonFun.momentFun(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body flex-row">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style flex-row" v-if="listdata.datasets.length>3 || (bodyWidth&&listdata.datasets.length>1)">
          <img class=" flex-row" v-if="!listdata.datasetsIsShow" @click="listdata.datasetsIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img class=" flex-row" v-else @click="listdata.datasetsIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>

        <div class="top">
          <div class="list">
            <div class="title flex-row">
              <i class="icon icon_license"></i>
              Received Licenses
              <span>{{licenseIndex}}</span>
            </div>
          </div>
        </div>
        <el-row :gutter="32" :class="{'list_body':true,'list_flex':!listdata.licenseIsShow}" v-loading="listLoad">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata.received_licenses" :key="l">
            <el-card :class="{'box-card':true,'is-hover': list.cid&&list.cid !== 'undefined','is-disabled': !(list.cid&&list.cid !== 'undefined')}" v-show="!listdata.licenseIsShow ? l<3: true" @click="detailFun(list, 'licenses')">
              <div class="text flex-row">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.name}}</p>
              </div>
              <div class="text flex-row">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis" v-if="list.type === 'Space License'">{{system.$commonFun.hiddAddress(list.space_owner)}}</p>
                <p class="ellipsis" v-else>{{system.$commonFun.hiddAddress(list.dataset_owner)}}</p>
              </div>
              <div class="text item flex-row">
                <div class="item_body flex-row">
                  <i class="icon icon_type"></i>
                  <span class="small">{{list.type}}</span>
                </div>
              </div>
              <div class="text item flex-row">
                <div class="item_body flex-row">
                  <i class="icon icon_time"></i>
                  <span class="small">{{system.$commonFun.momentFun(list.created_at)}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="more_style flex-row" v-if="listdata.received_licenses.length>3">
          <img class=" flex-row" v-if="!listdata.licenseIsShow" @click="listdata.licenseIsShow = true" src="@/assets/images/icons/icon_38.png" />
          <img class=" flex-row" v-else @click="listdata.licenseIsShow = false" src="@/assets/images/icons/icon_38_1.png" />
        </div>
      </el-col>
    </el-row>

    <data-nft v-if="dataNFTRequest" @handleChange="handleChange" :dataNFTRequest="dataNFTRequest" :createdAt="dataNFTRow.data.created_at" :updatedAt="dataNFTRow.data.updated_at" :contractAddress="dataNFTRow.data.contract_address" :getNftID="dataNFTRow.data.chain_id.toString()"
      :personalCenter="dataNFTRow.data"></data-nft>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Warning, CopyDocument
} from '@element-plus/icons-vue'
import dataNft from '@/components/dataNFT.vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Warning, dataNft, CopyDocument
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('updated')
    const info = reactive({
      address: '',
      balance: '',
      unit: '',
      network: ''
    })
    const options = ref([
      // {
      //   value: 'Option1',
      //   label: 'Most Downloads',
      // },
      {
        value: 'alphabetical',
        label: 'Alphabetical',
      },
      {
        value: 'updated',
        label: 'Recently Updated',
      },
      {
        value: 'likes',
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
    const licenseIndex = ref(0)
    const spacesIndex = ref(0)
    const dataSetIndex = ref(0)
    const listdata = reactive({
      spaces: [],
      datasets: [],
      received_licenses: [],
      license_requests_notifications: [],
      outgoing_pending_license_requests: [],
      user: {},
      spacesIsShow: false,
      datasetsIsShow: false,
      licenseIsShow: false
    })
    const listLoad = ref(false)
    const bodyWidth = ref(document.body.clientWidth < 768)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const dataNFTRequest = ref(false)
    const dataNFTRow = reactive({
      data: {}
    })

    let lastTime = 0
    async function throttle () {
      // Prevent multiple signatures
      let now = new Date().valueOf();
      if (lastTime > 0 && (now - lastTime) <= 2000) return false
      lastTime = now
      return true
    }
    async function isLogin () {
      const time = await throttle()
      if (!time) return false
      loadingText.value = ''
      console.log('isLogin')
      system.$commonFun.Init(async addr => {
        console.log('addr: ', addr, lagLogin.value)
        info.address = addr
        system.$commonFun.web3Init.eth.getBalance(addr).then((balance) => {
          // console.log(balance)
          const myBalance = balance
          const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
          info.balance = Number(balanceAll).toFixed(4)
        })
        const chainId = await system.$commonFun.web3Init.eth.net.getId()
        const { unit, name } = await system.$commonFun.getUnit(chainId)
        info.unit = unit
        info.network = name || chainId
        // await system.$commonFun.timeout(500)
        if (lagLogin.value) getdataList()
        else await signIn()
      })
    }
    async function signSetIn (t) {
      let time = t || 0
      let timer = null
      timer = setInterval(() => {
        if (time > 3) {
          clearInterval(timer)
          if (store.state.accessToken) getdataList()
          else signIn()
        } else time += 1
      }, 1000)
    }
    async function signIn () {
      const chainId = await system.$commonFun.providerInit.request({ method: 'eth_chainId' })
      const [lStatus, signErr] = await system.$commonFun.login()
      if (lStatus) getdataList()
      else if (signErr !== '4001') signSetIn()
      // else window.location.reload()
      return false
      store.dispatch('setNavLogin', false)
    }
    async function getdataList () {
      loading.value = false
      listLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}profile`, 'get')
      if (listRes && listRes.status === 'success') {
        listdata.spaces = listRes.data.space || []
        listdata.datasets = listRes.data.dataset || []
        listdata.received_licenses = listRes.data.received_licenses || []
        listdata.license_requests_notifications = listRes.data.license_requests_notifications || []
        listdata.outgoing_pending_license_requests = listRes.data.outgoing_pending_license_requests || []
        listdata.user = listRes.data.user || {}
        licenseIndex.value = listRes.data.received_licenses.length
        dataSetIndex.value = listRes.data.dataset.length
        spacesIndex.value = listRes.data.space.length
        store.dispatch('setAccessAvatar', listRes.data.user.avatar && store.state.gateway ? `${store.state.gateway}/ipfs/${listRes.data.user.avatar}` : '')
        store.dispatch('setAccessName', listRes.data.user.full_name)
        let spaceList = []
        let datasetList = []
        listdata.spaces.forEach(async space => {
          const current = Math.floor(Date.now() / 1000)
          const expireTime = await system.$commonFun.expireTimeFun(space.expiration_time)
          space.expireTime = expireTime.time || current
          space.expireTimeUnit = expireTime.unit
          spaceList.push(space.name)
        })
        listdata.datasets.forEach(space => datasetList.push(space.name))
        store.dispatch('setAccessSpace', JSON.stringify(spaceList))
        store.dispatch('setAccessDataset', JSON.stringify(datasetList))
      } else {
        listdata.spaces = []
        listdata.datasets = []
        listdata.received_licenses = []
        listdata.license_requests_notifications = []
        listdata.outgoing_pending_license_requests = []
        listdata.user = {}
        licenseIndex.value = 0
        spacesIndex.value = 0
        dataSetIndex.value = 0
        system.$commonFun.messageTip('error', listRes.error ? listRes.error : 'Failed!')
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      // system.$commonFun.providerInit.on('accountsChanged', function (account) {
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
      system.$commonFun.providerInit.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        console.log('personal')
        isLogin()
      })
      // 监听metamask网络断开
      system.$commonFun.providerInit.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        loading.value = true
        // loadingText.value = system.$NetworkPrompt
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    function detailFun (row, type) {
      if (type === 'dataset') router.push({ name: 'datasetDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
      else if (type === 'space') router.push({ name: 'spaceDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'app' } })
      else if (type === 'model') router.push({ name: 'modelsDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
      else if (type === 'licenses') if (row.cid && row.cid !== 'undefined' && store.state.gateway) window.open(`${store.state.gateway}/ipfs/${row.cid}`)
    }
    function editProfile (row) {
      router.push({ name: 'personalCenterProfile', params: { menu: row } })
    }
    const handleCommand = (command) => {
      // console.log(`click on item ${command}`)
    }
    function handleChange (val, refresh) {
      dataNFTRequest.value = val
      if (refresh) licenseFun(dataNFTRow.data, 'approve')
    }
    async function licenseMetaData (row) {
      dataNFTRow.data = row
      dataNFTRequest.value = true
    }
    async function licenseFun (row, type) {
      listLoad.value = true
      const approveRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}${row.source_type === "Space" ? 'spaces' : 'datasets'}/license/${type === 'approve' ? 'approve' : 'reject'}/${row.request_uuid}`, 'post')
      // const approveRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/license/${type === 'approve' ? 'approve' : 'reject'}/${row.request_uuid}`, 'post')
      if (approveRes && approveRes.status === 'success') system.$commonFun.messageTip('success', approveRes.message ? approveRes.message : 'Request successful.')
      else system.$commonFun.messageTip('error', approveRes.message ? approveRes.message : 'Request failed!')
      getdataList()
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
      listdata.spacesIsShow = false
      listdata.datasetsIsShow = false
      listdata.licenseIsShow = false
      listdata.spaces = []
      listdata.datasets = []
      listdata.received_licenses = []
      listdata.license_requests_notifications = []
      listdata.outgoing_pending_license_requests = []
      listdata.user = {}
      licenseIndex.value = 0
      spacesIndex.value = 0
      dataSetIndex.value = 0
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
      licenseIndex,
      spacesIndex,
      dataSetIndex,
      listdata,
      listLoad,
      accessAvatar,
      bodyWidth,
      dataNFTRequest,
      dataNFTRow,
      isLogin, signIn, getdataList, fn, detailFun, editProfile,
      handleCommand, licenseFun, licenseMetaData, handleChange
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  position: relative;
  background: linear-gradient(90deg, #fbfbfc, #fff, #fff, #fff);
  color: #000;
  font-size: 18px;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
  @media screen and (max-width: 768px) {
    background: transparent;
  }
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
      padding: 0;
      background-color: #fbfbfc;
      border-right: 1px solid rgba(229, 231, 235, 0.7);
      @media screen and (max-width: 768px) {
        background: transparent;
        border: 0;
      }
      .left_body {
        width: 90%;
        max-width: 280px;
        padding: 0.25rem 0;
        margin: 0;
        border: 0;
        text-align: left;
        .logo_sidebar {
          position: relative;
          display: block;
          width: 190px;
          height: 190px;
          margin: 0;
          background-color: #fff;
          border: 0.07rem solid #fff;
          border-radius: 50%;
          overflow: hidden;
          @media screen and (max-width: 992px) {
            width: 120px;
            height: 120px;
            border: 0.1rem solid #fff;
          }
          @media screen and (max-width: 600px) {
            width: 100px;
            height: 100px;
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
            font-size: 0.22rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            word-spacing: normal;
            @media screen and (min-width: 1800px) {
              font-size: 0.33rem;
            }
          }
          .desc {
            flex-wrap: wrap;
            margin: 0.1rem 0 0.2rem;
            font-size: 15px;
            @media screen and (min-width: 1800px) {
              font-size: 16px;
            }
            @media screen and (max-width: 1680px) {
              font-size: 14px;
            }
            @media screen and (max-width: 992px) {
              font-size: 13px;
            }
            @media screen and (max-width: 540px) {
              font-size: 12px;
            }
            .el-icon {
              margin: 0 0 0 0.05rem;
              font-size: 16px;
              cursor: pointer;
              svg,
              path {
                cursor: inherit;
              }
              &:hover {
                font-size: 17px;
              }
            }
          }
          .el-button {
            max-width: 100%;
            padding: 0.1rem 0.12rem;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            font-family: inherit;
            border-color: #e1e1e1;
            border-radius: 0.09rem;
            color: #606060;
            text-decoration: none;
            &:hover {
              box-shadow: inset 0 0 0.1rem rgba(0, 0, 0, 0.05);
            }
          }
          .top_text {
            margin: 0 0 0.1rem;
            font-family: "Helvetica-Bold";
            font-size: 0.17rem;
            font-weight: bold;
            @media screen and (min-width: 1800px) {
              font-size: 0.18rem;
            }
            .icon {
              display: block;
              width: 16px;
              height: 16px;
              margin: 0 0.07rem 0 0;
              @media screen and (min-width: 1800px) {
                width: 21px;
                height: 21px;
              }
              @media screen and (max-width: 768px) {
                width: 14px;
                height: 14px;
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
        justify-content: space-between;
        margin: 0.35rem 0 0.15rem;
        color: #9ca3b1;
        font-size: 0.19rem;
        .top_text {
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
            margin: 0 0.18rem;
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
            width: 0.2rem;
            height: 0.2rem;
          }
          .icon_cont {
            background: url(../../../assets/images/icons/icon_17.png) no-repeat
              left 0px;
            background-size: auto 100%;
            cursor: pointer;
          }
          .icon_info {
            background: url(../../../assets/images/icons/icon_18.png) no-repeat
              left 0px;
            background-size: auto 100%;
            cursor: pointer;
          }
          .l {
            margin: 0 0.1rem;
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
            justify-content: space-between;
            width: 100%;
            li {
              justify-content: flex-start;
              margin: 0.1rem 0.25rem 0.1rem 0;
              font-size: 14px;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
              .iconBody {
                justify-content: center;
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
          justify-content: flex-start;
          padding: 0;
          font-size: 0.18rem;
          color: #000;
          border-radius: 0.08rem;
          .icon {
            width: 0.2rem;
            height: 0.2rem;
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
          .icon_license {
            background: url(../../../assets/images/icons/icon_49.png) no-repeat
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
            padding: 0.1rem 0.2rem;
            background-color: #fff;
            border-color: #e4e4e4;
            border-radius: 0.1rem;
            box-shadow: 5px 7px 9px rgba(0, 0, 0, 0.15);
            * {
              cursor: pointer;
            }
            &.is-disabled {
              opacity: 0.7;
              background-color: #eee !important;
              cursor: no-drop;
              * {
                cursor: inherit;
              }
            }
            .el-card__header {
              padding: 0;
              border: 0;
              .card-header {
                justify-content: flex-end;
                span {
                  height: 0.25rem;
                  padding-left: 0.3rem;
                  background: url(../../../assets/images/icons/icon_9.png)
                    no-repeat left 0px;
                  background-size: 0.2rem;
                  font-size: 12px;
                  color: #000;
                  line-height: 0.25rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                }
                &.card-datasets {
                  justify-content: space-between;
                  .name {
                    flex-wrap: wrap;
                    width: 80%;
                    color: #606060;
                    @media screen and (min-width: 441px) {
                    }
                    b {
                      width: calc(100% - 0.6rem);
                      font-weight: normal;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      word-spacing: normal;
                      text-align: left;
                    }
                  }
                  .img {
                    width: 14px;
                    height: 14px;
                    margin: 0 5px 0 0;
                    background: url(../../../assets/images/icons/icon_1_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  span {
                    height: 0.25rem;
                    padding-left: 0.23rem;
                    background: url(../../../assets/images/icons/icon_9.png)
                      no-repeat left 2px;
                    background-size: 0.17rem;
                    font-size: 13px;
                    color: #000;
                    line-height: 0.25rem;
                    @media screen and (min-width: 1800px) {
                      font-size: 15px;
                    }
                  }
                }
              }
            }
            .el-card__body {
              padding: 0;
              .text {
                justify-content: flex-start;
                margin: 0.1rem 0;
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
                .icon_type {
                  width: 15px;
                  background: url(../../../assets/images/icons/icon_50.png)
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
              }
            }
          }
          &:hover {
            .is-hover {
              background-color: #7405ff;
              .el-card__header {
                .card-header {
                  .name {
                    color: #fff;
                  }
                  span {
                    background: url(../../../assets/images/icons/icon_9_1.png)
                      no-repeat left 2px;
                    background-size: 0.17rem;
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
                  .icon_type {
                    background: url(../../../assets/images/icons/icon_50_1.png)
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
        justify-content: center;
        img {
          width: 40px;
          height: 40px;
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
        flex-wrap: wrap;
        .el-col {
          margin: 0;
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
              height: 1.47rem;
              padding: 0;
              border: 0;
              border-radius: 0.1rem;
              font-size: 0.338rem;
              color: #fff;
              cursor: pointer;
              .card-warn {
                position: absolute;
                left: 0.15rem;
                top: 0.1rem;
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
                .run {
                  font-size: 12px;
                  line-height: 0.25rem;
                }
              }
              .card-header {
                position: absolute;
                right: 0.15rem;
                top: 0.1rem;
                @media screen and (max-width: 768px) {
                  right: 0.2rem;
                }
                span {
                  height: 0.25rem;
                  padding-left: 25px;
                  background: url(../../../assets/images/icons/icon_9_1.png)
                    no-repeat left 2px;
                  background-size: 16px;
                  font-size: 12px;
                  color: #fff;
                  line-height: 0.25rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                }
              }
              h1 {
                // text-shadow: 3px 3px rgba(0, 0, 0, 0.2);
                // text-transform: capitalize;
                cursor: pointer;
                font-size: 0.18rem;
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
                justify-content: space-between;
                color: #000;
                line-height: 1;
                cursor: pointer;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
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
      // &::after {
      //   position: absolute;
      //   content: "";
      //   right: 0;
      //   top: 0;
      //   bottom: 0;
      //   width: 1px;
      //   background-color: #c6c6c6;
      // }
    }
  }
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 1);
    .el-loading-spinner {
      top: 30%;
    }
  }
  :deep(.doi_body) {
    width: 40%;
    max-width: 770px;
    min-width: 300px;
    border-radius: 0.13rem;
    text-align: left;
    .el-dialog__header {
      padding: 0.17rem 0.25rem 0.1rem;
      font-size: 17px;
      color: #000;
      @media screen and (max-width: 768px) {
        font-size: 15px;
      }
      @media screen and (min-width: 1800px) {
        font-size: 18px;
      }
    }

    .el-dialog__body {
      padding: 0;

      .tip,
      .tip_black,
      .tip_text {
        padding: 0.1rem 0.25rem 0.2rem;
        background-color: #f3f1ff;
        color: #562683;
        font-size: 14px;
        word-break: break-word;
        line-height: 1.3;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }

      .tip_black,
      .tip_text {
        background-color: transparent;
        color: #000;

        a {
          text-decoration: underline;
        }

        p {
          padding: 0.05rem 0;

          label {
            display: inline-block;
            width: 85px;
          }
          i,
          svg {
            cursor: pointer;
          }
        }
      }

      .el-form {
        padding: 0 0.25rem;

        .el-form-item {
          .el-form-item__content {
            .label {
              color: #000;
              font-size: 15px;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }
            }

            .flex-row {
              width: 100%;
            }

            .el-input {
              .el-input__inner {
                background: linear-gradient(180deg, #fefefe, #f0f0f0);
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 0 0.25rem 0.25rem;
      text-align: left;

      .dialog-footer {
        display: flex;
      }

      .el-button {
        width: auto;
        height: auto;
        padding: 0.07rem 0.15rem;
        margin: 0 0.15rem 0 0;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-family: inherit;
        font-size: 16px;
        line-height: 1;
        color: #000;
        border-radius: 0.07rem;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }

        &:hover {
          opacity: 0.9;

          span {
            cursor: inherit;
          }
        }

        &.is-disabled {
          opacity: 0.5;
          border-color: #e3e6eb;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message_style {
  width: 300px;
  max-height: 300px;
  overflow-y: scroll;
  .drop_title {
    padding: 5px 16px;
  }
  .el-dropdown-menu__item {
    padding: 0 16px;
    white-space: normal;
    .drop_body {
      width: 100%;
      padding: 0.1rem 0;
      word-break: break-word;
      border-bottom: 1px solid #eee;
      &.margin {
        padding: 0.05rem 0;
      }
      p {
        width: 100%;
        margin-bottom: 0.05rem;
        line-height: 1.3;
      }
    }
  }
}
</style>

