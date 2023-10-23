<template>
  <section id="access_token" v-loading="listLoad">
    <div class="list">
      <div class="title flex-row">API Tokens</div>
    </div>

    <div class="token_list flex-row">
      <div class="title flex-row"></div>
      <div class="desc">Unlike user
        <a @click="settingDetail('tokens')">access tokens</a>, an Organization API token can only be used to provide read access to repos, or for billing access to a compute resource.</div>
      <div class="card" v-if="tokenData.token">
        <div class="card_header flex-row">
          Organization API token
          <el-select v-model="value" class="m-2" @change="deleteToken(tokenData.token)" placeholder="Manage" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="card_body">
          <el-input v-model="tokenData.token" :type="tokenShow?'text':'password'" readonly placeholder="Access Tokens">
            <template #append>
              <div class="action flex-row">
                <i class="icon icon_look" @click="tokenShow=!tokenShow"></i>
                <i class="icon icon_copy" @click="system.$commonFun.copyContent(tokenData.token, 'Copied')"></i>
              </div>
              <!-- <el-icon @click="deleteToken(tokenData.token)">
                <Delete />
              </el-icon> -->
            </template>
          </el-input>
        </div>
      </div>
    </div>

  </section>
</template>
<script>
const ethereum = window.ethereum;
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Delete
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Delete
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const tokenData = reactive({
      token: ''
    })
    const listLoad = ref(false)
    const tokenShow = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const value = ref('')

    const options = ref([
      {
        value: 'Delete',
        label: 'Delete',
      }])

    async function getdataList () {
      listLoad.value = true
      tokenData.token = ''
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token`, 'get')
      if (listRes && listRes.status === 'success') {
        if (listRes.data) tokenData.token = listRes.data.token.token
        else tokenData.token = ''
      } else {
        tokenData.token = ''
        system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function createToken () {
      listLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token`, 'post')
      if (listRes && listRes.status === 'success') {
        system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Success!')
        getdataList()
        return
      } else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function deleteToken (tokenName) {
      listLoad.value = true
      let formData = new FormData()
      formData.append('api_token', tokenName)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token/delete`, 'post', formData)
      if (listRes && listRes.status === 'success') system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Delete successfully!')
      else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Delete failed!')
      getdataList()
    }

    function settingDetail (row) {
      router.push({ name: 'personalCenterProfile', params: { menu: row } })
    }
    onMounted(() => {
      getdataList()
    })
    onActivated(() => {
      tokenData.token = ''
    })
    return {
      metaAddress,
      accessAvatar,
      navLogin,
      lagLogin,
      system,
      tokenData,
      listLoad,
      tokenShow,
      value,
      options,
      getdataList, createToken, deleteToken, settingDetail
    }
  }
})
</script>

<style lang="scss" scoped>
#access_token {
  position: relative;
  max-width: 620px;
  padding: 0.15rem 0 0.2rem;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.token_list) {
    flex-wrap: wrap;
    margin: 0 0 0.2rem;
    .title {
      display: block;
      width: 100%;
      padding: 0.35rem 0 0;
      font-size: 0.18rem;
      line-height: 1.5;
      @media screen and (min-width: 1800px) {
        font-size: 0.2rem;
      }
    }
    .desc {
      padding: 0.1rem 0;
      font-size: 0.16rem;
      line-height: 1.5;
      color: #606060;
      @media screen and (min-width: 1800px) {
        font-size: 0.18rem;
      }
      @media screen and (max-width: 441px) {
        font-size: 14px;
      }
      a {
        text-decoration: underline;
      }
    }
    .token_button {
      padding: 0.13rem 0.3rem;
      margin: 0.15rem 0;
      background: linear-gradient(180deg, #fefefe, #f0f0f0);
      border-color: #e1e1e1;
      border-radius: 0.08rem;
      font-size: 0.16rem;
      color: #606060;
      line-height: 1;
      @media screen and (min-width: 1800px) {
        font-size: 0.2rem;
      }
      @media screen and (max-width: 441px) {
        font-size: 14px;
      }
    }
    .card {
      width: calc(100% - 0.5rem);
      padding: 0.25rem;
      margin: 0.2rem 0;
      background-color: #fbfbfc;
      border: 1px solid #ececec;
      border-radius: 0.05rem;
      .card_header {
        justify-content: space-between;
        margin-bottom: 0.25rem;
        font-size: 0.18rem;
        color: #565656;
        @media screen and (min-width: 1800px) {
          font-size: 0.2rem;
        }
        .face {
          width: 0.3rem;
          height: 0.3rem;
          margin-right: 0.05rem;
          background-color: #7405ff;
          border-radius: 0.05rem;
        }
        .el-select {
          width: 100px;
          background: linear-gradient(180deg, #fefefe, #f0f0f0);
          border-color: #e1e1e1;
          border-radius: 0.08rem;
          @media screen and (min-width: 1800px) {
            font-size: 16px;
          }
          .el-input {
            border-color: #ececed;
            .el-input__inner {
              padding: 0.12rem 0.15rem;
              background: linear-gradient(180deg, #fefefe, #f0f0f0);
              border-color: #e1e1e1;
              border-radius: 0.05rem;
              @media screen and (min-width: 1800px) {
                font-size: 16px;
              }
            }
          }
        }
      }
      .card_body {
        .el-input {
          border-color: #ececed;
          .el-input__inner {
            height: auto;
            padding: 0.12rem 0.15rem;
            background-color: #fff !important;
            border-right: 0;
            border-color: inherit;
            line-height: 1;
          }
          .el-input-group__append {
            padding: 0 0.15rem;
            background-color: #fff;
            border-left: 0;
            border-color: inherit;
          }
          .action {
            height: 100%;
          }
          .icon_copy {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url(../../../assets/images/icons/icon_36_1.png)
              no-repeat left center;
            background-size: auto 100%;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              width: 16px;
              height: 16px;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          .icon_look {
            width: 18px;
            height: 18px;
            margin: 0 0.1rem 0 0;
            background: url(../../../assets/images/icons/icon_42.png) no-repeat
              left center;
            background-size: auto 100%;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              width: 20px;
              height: 20px;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          .el-input__suffix {
            right: 0;
            .el-icon {
              font-size: 0.2rem;
              cursor: pointer;
              svg,
              path {
                cursor: pointer;
              }
            }
          }
        }
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
