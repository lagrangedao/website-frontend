<template>
  <section id="dataset" v-loading="ntfLoad">
    <div class="dataset_head">
      <div class="content">
        <div class="backTo" @click="back">
          <el-icon>
            <ArrowLeft />
          </el-icon>
          <span>Go Back</span>
        </div>
        <div class="name">
          <i class="icon icon_datasets"></i>
          Datasets:
          <b>{{route.params.name}}</b>
          <i class="icon icon_copy" @click="system.$commonFun.copyContent(route.params.name, 'Copied')"></i>
          <el-button-group class="ml-4">
            <el-button @click="likeMethod" v-if="likeOwner">
              <i class="icon icon_like"></i>Unlike</el-button>
            <el-button @click="likeMethod" v-else :disabled="metaAddress?false:true">
              <i class="icon icon_like"></i>Like</el-button>
            <el-button disabled>{{likeValue}}</el-button>
          </el-button-group>
          <div :class="{'logs_style': true, 'is-disabled': !nft.contract_address || nftTokens.length === 0 || !nft.ipfs_uri}" @click="reqNFT" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg t="1687225756039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2674" width="200" height="200">
              <path d="M256 128c-70.58 0-128 57.42-128 128 0 47.274 25.78 88.614 64 110.782l0 354.438C153.78 743.386 128 784.726 128 832c0 70.58 57.42 128 128 128s128-57.42 128-128c0-47.274-25.78-88.614-64-110.782L320 366.782c38.22-22.168 64-63.508 64-110.782C384 185.42 326.58 128 256 128zM256 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 896 256 896zM256 320c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 320 256 320z"
                p-id="2675" fill="#878c93"></path>
              <path d="M830 720.068 830 409.978c0-67.974-20.98-122.004-62.36-160.588-44.222-41.236-108.628-60.776-191.64-58.212L576 64l-192 192 192 192 0-128c53 0 85.34 5.284 104.35 23.008 14.366 13.396 21.65 35.928 21.65 66.97l0 312.392c-37.124 22.434-62 63.178-62 109.628 0 70.58 57.42 128 128 128s128-57.42 128-128C896 783.902 869.324 741.938 830 720.068zM768 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S803.346 896 768 896z"
                p-id="2676" fill="#878c93"></path>
            </svg> Request License
          </div>
          <share-pop></share-pop>
        </div>
      </div>
      <div class="tag content">
        Tasks: &nbsp;
        <router-link to="">
          <i class="icon"></i>
          <span class="a_text">Text Classification</span>
        </router-link>
      </div>
      <div class="tag tag_sub content">
        Sub-Tasks: &nbsp;
        <router-link to="">
          <span class="a_text">language-modeling</span>
        </router-link>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
        <el-tab-pane name="card">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon icon_datasets"></i>
              <span>Dataset card</span>
            </span>
          </template>
          <detail-card @handleValue="handleValue" :likesValue="likesValue" :urlChange="activeName" v-if="activeName === 'card'"></detail-card>
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
              <!-- <i class="icon icon_datasets"></i> -->
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
  </section>
</template>
<script>
import detailCard from './detailCard.vue'
import detailFiles from './detailFiles.vue'
import detailCommunity from './detailCommunity.vue'
import detailSetting from './detailSetting.vue'
import sharePop from '@/components/share.vue'
import { defineComponent, computed, onMounted, onUnmounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  Setting, Share, ArrowLeft
} from '@element-plus/icons-vue'
const DATA_NFT_ABI = require('@/utils/abi/DataNFT.json')
export default defineComponent({
  name: 'Datasets',
  components: {
    detailFiles,
    detailCard,
    detailCommunity,
    detailSetting,
    Setting, Share, sharePop, ArrowLeft
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const accessDataset = computed(() => (store.state.accessDataset ? JSON.parse(store.state.accessDataset) : []))
    const searchValue = ref('')
    const value = ref('')
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const filedata = ref([])
    const total = ref(0)
    const bodyWidth = ref(document.body.clientWidth < 992)
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
    const nft = reactive({
      contract_address: null,
      chain_id: null,
      ipfs_uri: ''
    })
    const nftTokens = ref([])
    const ntfLoad = ref(false)
    const likeValue = ref(0)
    const likeOwner = ref(false)
    const likesValue = ref(false)

    function handleClick (tab, event) {
      router.push({ name: 'datasetDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    function detailFun (row, index) {
      console.log(row, index)
    }
    function back () {
      router.push({ path: '/dataset' })
    }
    async function requestDetail () {
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        nft.contract_address = listRes.data.nft.contract_address
        nft.chain_id = listRes.data.nft.chain_id
        likeValue.value = listRes.data.dataset.likes || 0
        ntfLoad.value = false
        nftTokens.value = listRes.data.nft.tokens || []
        if (listRes.data.nft.tokens && listRes.data.nft.tokens.length > 0) nft.ipfs_uri = listRes.data.nft.tokens[0].cid && listRes.data.nft.tokens[0].cid !== 'undefined' && store.state.gateway ? `${store.state.gateway}/ipfs/${listRes.data.nft.tokens[0].cid}` : ''
      } else if (listRes.message) system.$commonFun.messageTip(listRes.status, listRes.message)
    }
    const handleValue = async (value, type) => {
      if (type) requestDetail()
    }
    async function reqNFT () {
      if (!nft.contract_address || nftTokens.value.length === 0 || !nft.ipfs_uri) return
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      if (getID.toString() !== nft.chain_id) {
        const { name } = await system.$commonFun.getUnit(Number(nft.chain_id))
        await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
        return
      }
      ntfLoad.value = true
      const nft_contract = new system.$commonFun.web3Init.eth.Contract(DATA_NFT_ABI, nft.contract_address)
      // const ipfs_uri = await nft_contract.methods.tokenURI(1).call()
      let nftParams = new FormData()
      nftParams.append('chain_id', nft.chain_id)
      nftParams.append('wallet_address', route.params.wallet_address)
      nftParams.append('dataset_name', route.params.name)
      nftParams.append('ipfs_url', nft.ipfs_uri)
      const nftRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/license/request`, 'post', nftParams)
      if (nftRes && nftRes.status === 'success') system.$commonFun.messageTip('success', nftRes.message ? nftRes.message : 'Submitted license request!')
      else system.$commonFun.messageTip('error', nftRes.message ? nftRes.message : 'Failed!')
      await system.$commonFun.timeout(500)
      ntfLoad.value = false
    }
    async function likeMethod () {
      ntfLoad.value = true
      if (likeOwner.value) {
        const unlikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}/unlike`, 'post', {})
      } else {
        const likeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}/like`, 'post', {})
      }
      likesValue.value = !likesValue.value
      requestDetail()
      likesData()
    }
    const likesData = async () => {
      ntfLoad.value = true
      const getLikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}/like`, 'get')
      if (getLikeRes) likeOwner.value = getLikeRes.data.liked
    }
    onActivated(() => {
      activeName.value = route.params.tabs || 'card'
      window.scrollTo(0, 0)
      settingOneself.value = accessDataset.value.some(ele => ele === route.params.name)
      requestDetail()
      if (metaAddress.value) likesData()
      else if (activeName.value === 'settings') router.push({ name: 'datasetDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: 'card' } })
    })
    return {
      settingOneself,
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
      tableData,
      nft,
      ntfLoad,
      likeValue, likesValue, likeOwner, nftTokens,
      handleCurrentChange, handleSizeChange, detailFun, handleClick, back,
      handleValue, reqNFT, likeMethod
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .dataset_head {
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
        .icon_datasets {
          background: url(../../../assets/images/icons/icon_19.png) no-repeat
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
          .icon_datasets {
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
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
