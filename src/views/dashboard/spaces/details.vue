<template>
  <section id="space" v-loading="forkLoad" element-loading-text="Please wait...">
    <div class="space_head">
      <div class="content">
        <div class="backTo" @click="back">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          <span>Go Back</span>
        </div>
        <div class="name">
          <i class="icon icon_spaces"></i>
          Space:
          <b>{{route.params.name}}</b>
          <i class="icon icon_copy" @click="system.$commonFun.copyContent(route.params.name, 'Copied')"></i>
          <el-button-group class="ml-4">
            <el-button @click="likeMethod" v-if="likeOwner">
              <i class="icon icon_like"></i>Unlike</el-button>
            <el-button @click="likeMethod" v-else :disabled="metaAddress?false:true">
              <i class="icon icon_like"></i>Like</el-button>
            <el-button disabled>{{likeValue}}</el-button>
          </el-button-group>
          <div class="status" v-if="parentValue">{{parentValue}}</div>
          <el-button-group class="ml-4" v-if="metaAddress === route.params.wallet_address && expireTime <=5 && expireTime >= 0">
            <el-button type="warning" plain disabled>
              <el-icon>
                <WarningFilled />
              </el-icon>
              &nbsp;Expires in {{expireTime}} days</el-button>
            <el-button type="warning" plain @click="renewFun">Renew</el-button>
          </el-button-group>
          <el-button-group class="ml-4" v-if="metaAddress === route.params.wallet_address && expireTime < 0">
            <el-button type="warning" plain @click="renewFun">Restart</el-button>
          </el-button-group>
          <div :class="{'logs_style': true, 'is-disabled': !nft.contract_address || nftTokens.length === 0 }" @click="reqNFT" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg t="1687225756039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2674" width="200" height="200">
              <path d="M256 128c-70.58 0-128 57.42-128 128 0 47.274 25.78 88.614 64 110.782l0 354.438C153.78 743.386 128 784.726 128 832c0 70.58 57.42 128 128 128s128-57.42 128-128c0-47.274-25.78-88.614-64-110.782L320 366.782c38.22-22.168 64-63.508 64-110.782C384 185.42 326.58 128 256 128zM256 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 896 256 896zM256 320c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 320 256 320z"
                p-id="2675" fill="#878c93"></path>
              <path d="M830 720.068 830 409.978c0-67.974-20.98-122.004-62.36-160.588-44.222-41.236-108.628-60.776-191.64-58.212L576 64l-192 192 192 192 0-128c53 0 85.34 5.284 104.35 23.008 14.366 13.396 21.65 35.928 21.65 66.97l0 312.392c-37.124 22.434-62 63.178-62 109.628 0 70.58 57.42 128 128 128s128-57.42 128-128C896 783.902 869.324 741.938 830 720.068zM768 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S803.346 896 768 896z"
                p-id="2676" fill="#878c93"></path>
            </svg> Request License
          </div>
          <div class="logs_style" v-if="logsValue" @click="drawer = true">
            <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
              <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
            </svg> Logs
          </div>
          <div class="logs_style">
            <svg t="1690181902015" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2037" width="200" height="200">
              <path d="M992.627337 593.536l-42.304 0 0-529.536-661.376 0c-16.64 0-26.112 18.944-15.872 32 42.496 54.464 124.288 159.36 124.672 160l360.576 0 0 337.536-42.24 0c-26.176 0-40.832 30.08-24.704 50.688l138.24 177.28c12.544 16.128 36.928 16.128 49.536 0l138.304-177.28c15.936-20.608 1.216-50.688-24.832-50.688zM626.355337 768l-360.576 0 0-337.536 42.24 0c26.176 0 40.832-30.08 24.704-50.688l-138.24-177.28c-12.544-16.128-36.928-16.128-49.536 0l-138.304 177.28c-16 20.608-1.28 50.688 24.768 50.688l42.304 0 0 529.536 661.44 0c16.64 0 26.112-18.944 15.872-32-42.496-54.464-124.288-159.36-124.672-160z"
                fill="#878c93" p-id="2038"></path>
            </svg> Reboot
          </div>
          <div class="logs_style" @click="forkOperate" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg> Fork
          </div>
          <share-pop></share-pop>
        </div>
        <div class="remain" v-if="expireTime>=0">
          <el-icon>
            <Timer />
          </el-icon>Remaining Time： {{expireTime === 0 ? '&lt; 1' : expireTime}} Day
        </div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
        <el-tab-pane name="card">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon icon_spaces"></i>
              <span>Space card</span>
            </span>
          </template>
          <detail-card @handleValue="handleValue" :likesValue="likesValue" :urlChange="activeName"></detail-card>
        </el-tab-pane>
        <el-tab-pane name="app">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon icon_spaces"></i>
              <span>App</span>
            </span>
          </template>
          <detail-app @handleValue="handleValue" :likesValue="likesValue" :urlChange="activeName" v-if="activeName === 'app'"></detail-app>
        </el-tab-pane>
        <el-tab-pane name="files">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Files and versions</span>
            </span>
          </template>
          <detail-files @handleValue="handleValue" :likesValue="likesValue" v-if="activeName === 'files'"></detail-files>
        </el-tab-pane>
        <el-tab-pane name="community">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Community</span>
              <!-- <b>3</b> -->
            </span>
          </template>
          <detail-community @handleValue="handleValue" :likesValue="likesValue" v-if="activeName === 'community'"></detail-community>
        </el-tab-pane>
        <el-tab-pane name="settings" v-if="metaAddress === route.params.wallet_address">
          <template #label>
            <span class="custom-tabs-label">
              <!-- <i class="icon icon_spaces"></i> -->
              <el-icon class="icon">
                <Setting />
              </el-icon>
              <span>Settings</span>
            </span>
          </template>
          <detail-setting @handleValue="handleValue" :likesValue="likesValue" v-if="activeName === 'settings'"></detail-setting>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-drawer v-model="drawer" :with-header="false" :direction="direction" :size="'70% '" :destroy-on-close="true" custom-class="drawer_style">
      <template #default>
        <div class="close" @click="drawer=false">
          <el-icon>
            <CloseBold />
          </el-icon>
        </div>
        <el-tabs v-model="drawerName" class="demo-tabs" @tab-click="drawerClick">
          <el-tab-pane label="Logs" name="Logs">
            <div class="logBody">
              {{logsCont.data.job}}
              <br /> {{logsCont.data.task}}
            </div>
          </el-tab-pane>
          <el-tab-pane label="Build" name="Build" v-if="false">
            <div class="uploadBody">
              <div class="top_title">
                <div class="left">
                  <i class="icon"></i>
                  Computing provider
                </div>
              </div>
              <ul>
                <li v-for="n in 20" :key="n">
                  <div class="type">name</div>
                  <div>= db.Column(db.String)</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>

    <div class="note" v-if="noteShow && !forkLoad && !spaceHardDia && !(allData.files.length>0 && allData.task !== null)">
      <div class="close" @click="noteShow=false">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="box">
        <div class="title">Space 101</div>
        <ul>
          <li :class="{'strikeout': allData.files.length>0}">Upload Docker file</li>
          <li :class="{'strikeout': allData.task !== null}">Choose the hardware you want</li>
          <li>Done!</li>
        </ul>
      </div>
    </div>

    <el-dialog v-model="spaceHardDia" title="" :width="bodyWidth" :show-close="true" :close-on-click-modal="false">
      <space-hardware @handleHard="handleHard" :listdata="allData.space" :taskdata="allData.task"></space-hardware>
    </el-dialog>

  </section>
</template>
<script>
import detailCard from './detailCard.vue'
import detailApp from './detailApp.vue'
import detailFiles from './detailFiles.vue'
import detailCommunity from './detailCommunity.vue'
import detailSetting from './detailSetting.vue'
import sharePop from '@/components/share.vue'
import spaceHardware from '@/components/spaceHardware.vue'
import { defineComponent, computed, onMounted, onUnmounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  Setting, ArrowLeft, WarningFilled, CloseBold, Close, Timer
} from '@element-plus/icons-vue'
const DATA_NFT_ABI = require('@/utils/abi/DataNFT.json')
export default defineComponent({
  name: 'Spaces',
  components: {
    detailFiles,
    detailCard,
    detailApp,
    detailCommunity,
    detailSetting,
    spaceHardware,
    Setting, sharePop, ArrowLeft, WarningFilled, CloseBold, Close, Timer
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessSpace = computed(() => (store.state.accessSpace ? JSON.parse(store.state.accessSpace) : []))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const filedata = ref([])
    const total = ref(0)
    const bodyWidth = ref(document.body.clientWidth > 1536 ? '1536px' : '90%')
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const activeName = ref('card')
    const tableData = ref([
      {
        sentence1: '"The cat sat on the mat."',
        sentence2: '"The cat did not sit on the mat."',
        idx: '0',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"The cat did not sit on the mat."',
        sentence2: '"The cat sat on the mat."',
        idx: '1',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"When you\'ve got no snow,  it\'s really hard to...',
        sentence2: '"When you\'ve got snow, it\'s really hard to learn a snowy...',
        idx: '2',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya doesn\'t support media...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '3',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya doesn\'t support media...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '4',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya supports Twitch.tv...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '5',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouy supports media apps...',
        sentence2: '"Out of the box, Ouya supports Twitch.tv and XBMC media player."',
        idx: '6',
        label: '1   (not_entailment)'
      }
    ])
    const settingOneself = ref(false)
    const forkLoad = ref(false)
    const parentValue = ref('')
    const likeValue = ref(0)
    const likeOwner = ref(false)
    const likesValue = ref(false)
    const drawer = ref(false)
    const drawerName = ref('Logs')
    const direction = ref('btt')
    const logsValue = ref('')
    const expireTime = ref(NaN)
    const logsCont = reactive({
      data: {}
    })
    const nft = reactive({
      contract_address: null,
      chain_id: null
    })
    const nftTokens = ref([])
    const noteShow = ref(true)
    const allData = reactive({
      space: {},
      task: null,
      files: []
    })
    const spaceHardDia = ref(false)

    function handleClick (tab, event) {
      router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    function NumFormat (value) {
      if (String(value) === '0') return '0'
      else if (!value) return '-'
      var intPartArr = String(value).split('.')
      var intPartFormat = intPartArr[0]
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartArr[1] ? `${intPartFormat}.${intPartArr[1]}` : intPartFormat
    }
    const handleValue = async (dataRes, log, time, nftCont) => {
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      allData.space = dataRes.space || {}
      allData.files = dataRes.files || []
      allData.task = dataRes.task
      if (log) {
        const response = await fetch(log)
        const textUri = await new Promise(async resolve => {
          resolve(response.text())
        })
        logsValue.value = log
        logsCont.data = textUri ? JSON.parse(textUri).data : {}
      } else {
        logsValue.value = ''
      }
      expireTime.value = time === 0 ? 0 : time ? time : NaN
      parentValue.value = numRe.test(dataRes.space.status) ? '' : dataRes.space.status
      likeValue.value = dataRes.space.likes || 0
      if (nftCont) {
        nft.contract_address = nftCont.contract_address
        nft.chain_id = nftCont.chain_id
        nftTokens.value = nftCont.tokens || []
      }
      forkLoad.value = false
    }
    const forkOperate = async () => {
      forkLoad.value = true
      const forkRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/duplicate`, 'post', {})
      if (forkRes && forkRes.status === 'success') {
        system.$commonFun.messageTip('success', forkRes.message ? forkRes.message : 'Fork successfully!')
        router.push({ name: 'spaceDetail', params: { wallet_address: metaAddress.value, name: route.params.name, tabs: 'card' } })
      } else system.$commonFun.messageTip('error', forkRes.message ? forkRes.message : forkRes.error ? forkRes.error : 'Fork failed!')
      init()
    }
    function init () {
      activeName.value = route.params.tabs || 'card'
      forkLoad.value = false
      parentValue.value = ''
      logsValue.value = ''
      expireTime.value = NaN
      logsCont.data = {}
      window.scrollTo(0, 0)
      settingOneself.value = accessSpace.value.some(ele => ele === route.params.name)
      if (metaAddress.value) likesData()
      else if (activeName.value === 'settings') router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: 'card' } })
    }
    function back () {
      router.push({ path: '/spaces' })
    }
    async function renewFun () {
      spaceHardDia.value = true
      // forkLoad.value = true
      // const renewRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/extend`, 'post')
      // if (renewRes && renewRes.status === 'success') {
      //   await system.$commonFun.timeout(500)
      //   window.location.reload()
      // } else system.$commonFun.messageTip('error', 'Request failed!')
      // forkLoad.value = false
    }
    async function reqNFT () {
      if (!nft.contract_address || nftTokens.value.length === 0) return
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      if (getID.toString() !== nft.chain_id) {
        const { name } = await system.$commonFun.getUnit(Number(nft.chain_id))
        await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
        return
      }
      forkLoad.value = true
      const nft_contract = new system.$commonFun.web3Init.eth.Contract(DATA_NFT_ABI, nft.contract_address)
      const ipfs_uri = await nft_contract.methods.tokenURI(1).call()
      let nftParams = new FormData()
      nftParams.append('chain_id', nft.chain_id)
      nftParams.append('wallet_address', route.params.wallet_address)
      nftParams.append('space_name', route.params.name)
      nftParams.append('ipfs_url', ipfs_uri)
      const nftRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/license/request`, 'post', nftParams)
      if (nftRes && nftRes.status === 'success') system.$commonFun.messageTip('success', nftRes.message ? nftRes.message : 'Submitted license request!')
      else system.$commonFun.messageTip('error', nftRes.message ? nftRes.message : 'Failed!')
      await system.$commonFun.timeout(500)
      forkLoad.value = false
    }
    async function likeMethod () {
      forkLoad.value = true
      if (likeOwner.value) {
        const unlikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/unlike`, 'post', {})
      } else {
        const likeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/like`, 'post', {})
      }
      likesValue.value = !likesValue.value
      likesData()
    }
    const likesData = async () => {
      forkLoad.value = true
      const getLikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/like`, 'get')
      if (getLikeRes) likeOwner.value = getLikeRes.data.liked
    }
    const drawerClick = (tab, event) => {
      // console.log(tab, event)
    }
    function handleHard (val, refresh) {
      spaceHardDia.value = val
    }
    onActivated(() => init())
    watch(route, (to, from) => {
      if (to.name !== 'spaceDetail') return
      if (to.params.tabs === 'card') {
        window.scrollTo(0, 0)
        init()
      }
    })
    return {
      accessSpace,
      metaAddress,
      lagLogin,
      searchValue,
      value,
      currentPage1,
      small,
      background,
      listLoad,
      filedata,
      total,
      activeName,
      bodyWidth,
      system,
      route,
      router,
      settingOneself,
      tableData,
      forkLoad,
      nft,
      nftTokens,
      noteShow,
      allData,
      drawerName,
      spaceHardDia,
      parentValue, likeOwner, likeValue, likesValue, drawer, direction, logsValue, expireTime, logsCont, handleValue,
      NumFormat, handleCurrentChange, handleSizeChange, handleClick,
      forkOperate, back, renewFun, reqNFT, likeMethod, drawerClick, handleHard
    }
  }
})
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,600;1,700&display=swap");
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .space_head {
    padding: 0.3rem 0 0;
    background-color: #fbfbfc;
    border-bottom: 1px solid #f1f1f1;
    .content {
      display: flex;
      align-items: stretch;
      flex-wrap: wrap;
      padding: 0 0.16rem;
      margin: 0 auto 0.25rem;
      font-size: 14px;
      @media screen and (min-width: 1280px) {
        max-width: 1280px;
      }
      @media screen and (min-width: 1536px) {
        max-width: 1536px;
      }
      .backTo {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 0 0.25rem;
        font-size: 0.2rem;
        text-align: left;
        cursor: pointer;
        i {
          margin-right: 0.05rem;
          svg {
            cursor: pointer;
          }
        }
        &:hover {
          color: #7405ff;
        }
      }
      .name {
        display: flex;
        align-items: center;
        font-family: "Helvetica-Bold";
        width: 100%;
        font-size: 0.21rem;
        color: #878c93;
        line-height: 1;
        @media screen and (max-width: 992px) {
          flex-wrap: wrap;
        }
        b {
          font-family: "FIRACODE-BOLD";
          padding: 0 0.07rem 0 0.1rem;
          color: #000;
        }
        .icon {
          width: 0.23rem;
          height: 0.23rem;
          margin: -1px 0.07rem 0 0;
        }
        .icon_spaces {
          background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
            left center;
          background-size: auto 100%;
        }
        .icon_copy {
          width: 16px;
          height: 16px;
          background: url(../../../assets/images/icons/icon_36.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: pointer;
          @media screen and (min-width: 1800px) {
            width: 18px;
            height: 18px;
          }
          &:hover {
            opacity: 0.7;
          }
        }
        .icon_like {
          width: 0.16rem;
          height: 0.16rem;
          background: url(../../../assets/images/icons/icon_37.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: inherit;
        }
        .el-button {
          height: 28px;
          padding: 0.05rem 0.1rem;
          margin: 0.1rem 0;
          font-family: inherit;
          font-size: 14px;
          color: #878c93;
          line-height: 1;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            padding: 0 5px;
            font-size: 12px;
          }
          &.el-button--warning {
            border: 1px solid rgba(207, 146, 54, 0.5);
            // border-left-color: rgb(253, 246, 236);
            &:hover {
              color: #fff;
            }
          }
          &.is-disabled {
            &:hover {
              color: inherit;
            }
          }
        }
        .status {
          position: relative;
          padding: 0.05rem 0.1rem 0.05rem 0.22rem;
          margin: 0 0.07rem;
          background-color: #ecfdf5;
          color: #047857;
          border: 1px solid #d1fae5;
          border-radius: 0.05rem;
          font-size: 14px;
          line-height: 1;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            font-size: 12px;
          }
          &::after {
            position: absolute;
            left: 0.1rem;
            top: 50%;
            bottom: 0;
            width: 6px;
            height: 6px;
            margin-top: -3px;
            content: "";
            font-size: 55px;
            background-color: #11b981;
            //#11b981   #7edbbb
            border-radius: 100%;
            animation: spin 1.5s linear alternate infinite;
            @keyframes spin {
              from {
                opacity: 1;
              }
              to {
                opacity: 0.5;
              }
            }
            @-webkit-keyframes spin {
              from {
                opacity: 1;
              }
              to {
                opacity: 0.5;
              }
            }
          }
        }
        .logs_style {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.05rem 0.05rem;
          margin: 0 0 0 0.07rem;
          background-color: transparent;
          color: #878c93;
          border: 1px solid rgba(229, 231, 235, 1);
          border-radius: 0.05rem;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            font-size: 12px;
          }
          &:hover {
            background-color: #f7f7f7;
          }
          &.is-disabled {
            opacity: 0.5;
            cursor: no-drop;
          }
          svg {
            width: 14px;
            height: 14px;
            margin-right: 0.05rem;
            @media screen and (max-width: 1600px) {
              width: 13px;
              height: 13px;
            }
            @media screen and (max-width: 441px) {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
    .tag {
      margin: 0 auto;
      line-height: 0.3rem;
      font-size: 0.18rem;
      a {
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0 0 0 0.1rem;
        background-color: transparent;
        border-radius: 0.05rem;
        font-size: 13px;
        color: #606060;
        border: 2px solid #f1f1f2;
        line-height: 1;
        @media screen and (min-width: 1800px) {
          font-size: 15px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 12px;
        }
        &:hover {
          opacity: 0.9;
        }
        .a_text {
          padding: 0.04rem 0.07rem;
        }
        .icon {
          width: 0.3rem;
          height: 0.26rem;
          margin: 0;
          background: #fef7ef url(../../../assets/images/icons/icon_22.png)
            no-repeat center;
          background-size: 17px;
        }
      }
      .more {
        float: left;
        padding: 5px 8px;
        margin: 3px 0 0 0;
        font-size: 13px;
        color: #9ca3b1;
        display: inline-block;
        border-radius: 0.08rem;
        cursor: pointer;
        @media screen and (min-width: 1800px) {
          font-size: 15px;
        }
        &:hover {
          background-color: #f5f6f8;
        }
      }
    }
    .tag_sub {
      margin: 0.1rem auto 0.4rem;
      a {
        color: #562683;
        background-color: #f3f1ff;
      }
    }
    .remain {
      display: flex;
      align-items: center;
      font-weight: bold;
      i {
        margin-right: 3px;
      }
    }
    :deep(.demo-tabs) {
      display: block;
      flex-wrap: wrap;
      margin: 0 auto;
      .el-tabs__header {
        display: flex;
        align-items: stretch;
        padding: 0 0.16rem;
        margin: 0 auto;
        font-size: 14px;
        @media screen and (min-width: 1280px) {
          max-width: 1280px;
        }
        @media screen and (min-width: 1536px) {
          max-width: 1536px;
        }
      }
      .el-tabs__content {
        border-top: 1px solid #f1f1f1;
        overflow: visible;
      }
      .el-tabs__item {
        height: auto;
        padding: 0.15rem 0;
        line-height: 1;
        font-family: "Helvetica-light";
        font-size: 0.18rem;
        @media screen and (max-width: 1600px) {
          font-size: 16px;
        }
        @media screen and (max-width: 441px) {
          font-size: 14px;
        }
        .custom-tabs-label {
          display: flex;
          align-items: center;
          padding: 0 0.2rem;
          .icon {
            height: 16px;
          }
          .el-icon {
            margin: -1px 0.07rem 0 0;
          }
          .icon_spaces {
            width: 16px;
            margin: -1px 0.07rem 0 0;
            background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
              left center;
            background-size: auto 100%;
          }
          b {
            display: block;
            height: auto;
            padding: 0.03rem;
            margin: 0 0.07rem;
            background-color: #7405ff;
            color: #fff;
            border-radius: 5px;
            line-height: 1;
            font-size: 14px;
          }
        }
        &.is-active {
          font-family: "Helvetica-Neue";
          color: #000;
          font-weight: 600;
          position: relative;
          &::after {
            position: absolute;
            content: "";
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #000;
          }
        }
        &:hover {
          color: #7405ff;
        }
      }
      .el-tabs__active-bar {
        display: none;
        background-color: #000;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }
  .note {
    position: fixed;
    right: -10px;
    top: 1rem;
    width: auto;
    height: auto;
    font-family: "Raleway", sans-serif;
    text-align: left;
    border-radius: 3px;
    overflow: hidden;
    z-index: 99999;
    .close {
      position: absolute;
      top: 30px;
      right: 20px;
      color: #000;
      font-size: 20px;
      cursor: pointer;
      z-index: 99;
      svg,
      path {
        cursor: pointer;
      }
    }
    .box {
      position: relative;
      background-color: #fee16c;
      width: 200px;
      height: auto;
      padding: 0 0 0.15rem;
      margin: 20px 10px;
      border: 2px solid #fee16c;
      .title {
        padding: 0.15rem;
        font-size: 0.18rem;
        font-weight: 700;
        font-style: italic;
        font-stretch: normal;
        text-align: center;
      }
      ul {
        padding: 0 15px 0 30px;
        list-style-type: disc;
        li {
          margin: 0 0 0.1rem;
          font-size: 0.16rem;
          font-weight: 600;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.3;
          list-style: disc;
          &.strikeout {
            text-decoration: line-through;
          }
        }
      }
      &:before {
        content: "";
        position: absolute;
        z-index: -1;
        width: 80%;
        height: 80%;
        left: 11%;
        bottom: 7px;
        background: red;
        transform: skew(14deg) rotate(3deg);
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.8);
      }
      &:after {
        content: "";
        position: absolute;
        z-index: -1;
        width: 80%;
        height: 80%;
        right: 11%;
        bottom: 7px;
        background: red;
        transform: skew(-14deg) rotate(-3deg);
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.8);
      }
    }
  }
}
</style>
<style lang="scss">
.drawer_style {
  background-color: #fafafa;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  .close {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0.18rem;
    top: 0.16rem;
    font-size: 20px;
    cursor: pointer;
    z-index: 9;
    i,
    svg,
    path {
      cursor: pointer;
    }
  }
  .el-drawer__header {
    padding-top: 15px;
    font-size: 16px;
    margin-bottom: 0;
    line-height: 1;
    color: #000;
  }
  .el-drawer__body {
    padding: 0;
    .el-tabs {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #e0e0e0;
      }
      .el-tabs__active-bar {
        background-color: #000;
      }
      .el-tabs__header {
        width: 100%;
        margin: 0;
        background-color: #fff;
        .el-tabs__nav-wrap {
          padding: 0 4%;
          @media screen and (max-width: 768px) {
            padding: 0 2%;
          }
        }
      }
      .el-tabs__content {
        width: 92%;
        height: calc(100% - 1rem - 18px);
        padding: 0.3rem 4%;
        @media screen and (max-width: 768px) {
          width: 96%;
          padding: 0.3rem 2%;
        }
        .el-tab-pane {
          height: 100%;
        }
        .logBody {
          width: 100%;
          height: 100%;
          margin: 0;
          overflow-y: scroll;
        }
        .uploadBody {
          width: 100%;
          height: 100%;
          margin: 0;
          border: 1px solid #dfdee5;
          border-radius: 0.1rem;
          color: #606060;
          overflow: hidden;
          .top_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.12rem 0.25rem;
            font-size: 18px;
            font-weight: normal;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            text-transform: lowercase;
            color: #606060;
            @media screen and (max-width: 1600px) {
              font-size: 16px;
            }
            @media screen and (max-width: 768px) {
              font-size: 15px;
            }
            .left {
              display: flex;
              align-items: center;
              font-size: 16px;
              text-transform: capitalize;
              @media screen and (max-width: 1600px) {
                font-size: 14px;
              }
              @media screen and (max-width: 768px) {
                font-size: 13px;
              }
              .icon {
                width: 20px;
                height: 20px;
                margin: 0 7px 0 0;
                background: url(../../../assets/images/icons/icon_51.png) center;
                background-size: 100%;
              }
            }
            .right {
            }
          }
          ul {
            width: 100%;
            height: calc(100% - 0.24rem - 18px);
            border-top: 1px solid #dfdee5;
            overflow: scroll;
            li {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              background-color: #fafafa;
              font-size: 14px;
              line-height: 1;
              @media screen and (max-width: 1600px) {
                font-size: 13px;
              }
              @media screen and (max-width: 768px) {
                font-size: 12px;
              }
              div {
                padding: 0.1rem 0.25rem;
                color: #878c93;
              }
              .type {
                color: #562683;
                border-right: 1px solid #dddddd;
              }
              &:nth-child(2n + 1) {
                background-color: #f3f1ff;
              }
            }
          }
        }
      }
      .el-tabs__item {
        height: auto;
        padding: 0.18rem 0;
        margin: 0 0.45rem 0 0;
        font-size: 20px;
        line-height: 1;
        text-transform: capitalize;
        @media screen and (max-width: 1600px) {
          font-size: 18px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 16px;
        }
        @media screen and (max-width: 441px) {
          font-size: 14px;
        }
        &.is-active {
          color: #000;
        }
      }
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
