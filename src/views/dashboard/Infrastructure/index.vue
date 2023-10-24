<template>
  <section id="rpc-container">
    <header>
      <div class="area-content flex-row">
        <div class="top_text">
          <div class="title flex-row">
            <h2>RPC</h2>
            <div class="top_input flex-row">
              <el-input v-model="searchValue" clearable @change="searchChange()" class="search_name w-50 m-2" placeholder="Chain name or chain id" />
            </div>
          </div>
          <p>This list show all your configured chains and all the RPC endpoints that thirdweb supports.</p>
        </div>
        <div class="top_button">
          <div class="add-network flex-row" @click="dataShow = true">
            <i class="icon icon_setting"></i> Add Network</div>
        </div>
      </div>
    </header>
    <el-row class="rpc-body" justify="space-between">
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" class="rpc-left" v-loading="rpcLoad">
        <el-row class="rpc-list" :gutter="32" v-if="chainsData.length > 0">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="chain in chainsData" :key="chain">
            <el-card class="box-card">
              <div class="grid-content">
                <div class="flex-row head">
                  <img :src="chain.icon" width="37" height="37" :alt="`${chain.chain}`"> {{chain.chain}}
                </div>
                <ul class="flex-row">
                  <li class="wide">
                    <div class="tit">RPC URL</div>
                    <div class="border flex-row">
                      <span>{{chain.url}}</span>
                      <i class="icon icon_copy" @click="system.$commonFun.copyContent(chain.url, 'Copied')"></i>
                    </div>
                  </li>
                  <li>
                    <div class="tit">Chain ID</div>
                    <div class="desc">{{chain.chain_id}}</div>
                  </li>
                  <li>
                    <div class="tit">Native Token</div>
                    <div class="desc">{{chain.currency}}</div>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-empty :image-size="200" v-else />
        <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="rpc-right">
        <div class="content" v-for="d in describeData" :key="d">
          <div class="title">{{d.title}}</div>
          <div class="sub_title color">{{d.subTitle}}</div>
          <div class="sub_title">{{d.desc}}</div>
        </div>
      </el-col>
    </el-row>

    <add-network v-if="dataShow" @handleChange="handleChange" :dataShow="dataShow"></add-network>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onUnmounted, onActivated, onBeforeUnmount, watch, ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  Setting
} from '@element-plus/icons-vue'
import addNetwork from '@/components/addNetwork.vue'
import qs from 'qs'
export default defineComponent({
  name: 'Spaces',
  components: {
    Setting, addNetwork
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const rpcLoad = ref(false)
    const pagin = reactive({
      pageSize: 12,
      pageNo: 1,
      total: 0
    })
    const searchValue = ref('')
    const describeData = ref([
      {
        title: 'RPC Usage Guide',
        subTitle: ' - Generate API key',
        desc: 'To utilize the RPC service, you first need to generate an API-key.'
      },
      {
        title: 'Upgrade Account ',
        subTitle: '- Free User Limitations ',
        desc: 'Description: Free users can enjoy up to 25 requests/s.'
      }
    ])
    const chainsData = ref([
      {
        icon: require("@/assets/images/icons/rpc-01.png"),
        chain: 'Ethereum Mainnet',
        chain_id: 1,
        net: '',
        currency: "ETH",
        url: 'ethereum.rpc.thirdweb.com'
      },
    ])
    const small = ref(false)
    const background = ref(false)
    const dataShow = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function init () {
      rpcLoad.value = true
      chainsData.value = []
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const params = {
        page_size: pagin.pageSize,
        page_no: page * pagin.pageSize,
        chain: searchValue.value
      }
      const rpcRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}chains?${qs.stringify(params)}`, 'get')
      if (rpcRes && String(rpcRes.code) === '0') {
        chainsData.value = rpcRes.data.list || []
        pagin.total = rpcRes.data.total || 0
      } else if (rpcRes.msg) system.$commonFun.messageTip('error', rpcRes.msg)
      rpcLoad.value = false
    }
    async function addData (params) {
      clear()
      dataShow.value = false
      init()
    }
    async function searchChange (val) {
      pagin.pageNo = 1
      init()
    }
    function handleChange (val, refresh) {
      if (refresh) {
        addData()
      } else dataShow.value = val
    }
    function handleSizeChange (val) { }
    async function handleCurrentChange (currentPage) {
      // console.log('handleCurrentChange:', currentPage)
      pagin.pageNo = currentPage
      init()
    }
    async function clear () {
      searchValue.value = ''
      pagin.pageNo = 1
      pagin.total = 0
    }
    onActivated(() => {
      clear()
      init()
    })
    return {
      metaAddress,
      rpcLoad,
      pagin,
      small,
      background,
      searchValue,
      describeData,
      chainsData,
      dataShow,
      system,
      route,
      router,
      searchChange, handleChange, handleSizeChange, handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
#rpc-container {
  width: 100%;
  font-size: 18px;
  header {
    background-color: #fbfbfc;
    border-bottom: 1px solid #f1f1f1;
    overflow: hidden;
    :deep(.area-content) {
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 0.16rem;
      margin: 0.8rem auto 0.1rem;
      color: #9ca3b1;
      font-size: 0.19rem;
      @media screen and (min-width: 1280px) {
        max-width: 1280px;
      }
      @media screen and (min-width: 1536px) {
        max-width: 1536px;
      }
      .top_text {
        h2 {
          display: block;
          padding: 0;
          font-family: "Helvetica-Bold";
          font-size: 0.4383rem;
          color: #000;
          text-align: left;
          @media screen and (max-width: 441px) {
            font-size: 0.34rem;
          }
        }
        p {
          margin: 0.15rem 0;
          font-size: 0.16rem;
          color: #878c93;
          line-height: 1;
        }
      }
      .top_button {
        font-size: 14px;
        line-height: 1;
        color: #9ca3b1;
        @media screen and (min-width: 1800px) {
          font-size: 15px;
        }
        @media screen and (max-width: 600px) {
          display: flex;
          align-items: center;
          width: 100%;
          margin: 0.1rem 0;
        }
        a {
          margin: 0 0.07rem;
          text-decoration: underline;
          color: inherit;
          &:hover {
            opacity: 0.7;
          }
        }
        .add-network {
          padding: 0.1rem 0.18rem 0.1rem 0.2rem;
          margin: 0 0.1rem 0 0;
          background-color: #7405ff;
          font-size: 0.183rem;
          color: #fff;
          border: 1px solid #7405ff;
          border-radius: 0.09rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          &:hover {
            background-color: transparent;
            color: #7405ff;
            .icon_setting {
              background: url(../../../assets/images/icons/icon_setting_1.png)
                no-repeat left center;
              background-size: 15px;
            }
          }
          .icon {
            width: 19px;
            height: 18px;
            margin: 0 0.12rem 0 0;
          }
          .icon_setting {
            background: url(../../../assets/images/icons/icon_setting.png)
              no-repeat left center;
            background-size: 15px;
          }
        }
      }
      .top_input {
        justify-content: space-between;
        width: 100%;
        margin: 0 0 0 0.25rem;
        .search_name {
          max-width: 3.4rem;
          margin: 0;
          .el-input__inner {
            padding: 0 0 0 0.5rem;
            background: url(../../../assets/images/icons/icon_13_1.png)
              no-repeat 0.17rem center;
            background-size: auto calc(100% - 12px);
            font-size: 14px;
            border-radius: 0.5rem;
            border-color: #e2e2e3;
            color: #878c93;
            @media screen and (max-width: 600px) {
              font-size: 13px;
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
      }
    }
  }
  :deep(.rpc-body) {
    align-items: stretch;
    padding: 0;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding: 0 0.16rem;
    }
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .rpc-left {
      position: relative;
      padding: 0.4rem 0.3rem 0.4rem 0;
      @media screen and (max-width: 992px) {
        padding: 0.4rem 0 0.1rem;
      }
      &::before {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f4f4f4;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
      .rpc-list {
        .box-card {
          margin: 0.16rem 0;
          border-color: #dfdfdf;
          border-radius: 0.15rem;
          box-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.1);
          color: #7a7a7a;
          cursor: pointer;
          .el-card__body {
            padding: 0.25rem;
            .grid-content {
              .head {
                font-size: 0.162rem;
                font-weight: 600;
                img {
                  margin-right: 0.14rem;
                  border-radius: 37px;
                }
              }
              ul {
                width: 100%;
                padding: 0.15rem 0 0;
                flex-wrap: wrap;
                li {
                  width: 50%;
                  padding: 0;
                  font-size: 13.7px;
                  font-weight: 600;
                  line-height: 1.9;
                  color: #606060;
                  &.wide {
                    width: 100%;
                  }
                  .border {
                    justify-content: space-between;
                    flex-wrap: wrap;
                    padding: 0.08rem 0.15rem;
                    margin: 0 0 0.15rem;
                    border: 2px solid #dfdfdf;
                    border-radius: 0.05rem;
                    line-height: 1;
                    span {
                      width: calc(100% - 0.12rem - 16px);
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      -webkit-line-clamp: 1;
                    }
                    .icon {
                      width: 16px;
                      height: 15px;
                      margin: 0 0 0 0.12rem;
                      cursor: pointer;
                    }
                    .icon_copy {
                      background: url(../../../assets/images/icons/icon_52.png)
                        no-repeat left center;
                      background-size: 15px;
                    }
                  }
                  .tit {
                    font-size: 13.7px;
                    font-weight: 500;
                    color: #b2b2b2;
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
    }
    .rpc-right {
      position: relative;
      padding: 0 0.25rem 0.35rem;
      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f4f4f4;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
      .content {
        padding: 0.5rem 0 0;
        .title {
          padding: 0 0 0.15rem;
          font-size: 0.2rem;
          color: #000000;
          line-height: 1.1;
          text-transform: capitalize;
          @media screen and (max-width: 1600px) {
            font-size: 18px;
          }
          @media screen and (max-width: 441px) {
            font-size: 16px;
          }
        }
        .sub_title {
          font-size: 0.16rem;
          color: #878c93;
          line-height: 1.6;
          &.color {
            font-weight: 500;
            color: #c27af8;
            text-transform: capitalize;
          }
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 441px) {
            font-size: 14px;
          }
        }
      }
    }
  }
  :deep(.doi_body) {
    width: 570px;
    border-radius: 0.23rem;
    text-align: left;
    color: #000;
    word-break: break-word;
    @media screen and (max-width: 600px) {
      width: 94%;
    }
    .el-dialog__header {
      padding: 0.45rem 0.6rem 0.2rem;
      font-size: 0.2rem;
      .el-dialog__headerbtn {
        right: 0.3rem;
        font-size: 0.28rem;
        font-weight: 600;
        color: #000;
        cursor: pointer;
        i,
        svg,
        path {
          color: inherit;
          cursor: inherit;
        }
      }
    }

    .el-dialog__body {
      padding: 0 0.6rem;
      .el-form {
        justify-content: space-between;
        flex-wrap: wrap;
        .el-form-item {
          width: 100%;
          margin: 0 0 0.15rem;
          font-weight: 500;
          &.item-half {
            width: 48%;
          }
          &.is-error {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  border-color: #f56c6c;
                }
              }
            }
          }
          .el-form-item__label {
            margin: 0 0 0.1rem;
            font-size: 13.7px;
            color: #000;
            line-height: 1.1;
            @media screen and (max-width: 768px) {
              font-size: 13px;
            }
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
          }
          .el-form-item__content {
            word-break: break-word;
            .flex-row {
              width: 100%;
            }
            .el-input {
              .el-input__inner {
                border-color: #e1e1e1;
                border-radius: 6px;
              }
            }
            .el-upload-list--picture-card {
              .el-upload-list__item {
                width: 34px;
                height: 34px;
                margin: 0 0.15rem 0 0;
                border: 0;
                border-radius: 0;
                .el-upload-list__item-preview {
                  display: none;
                }
                .el-upload-list__item-delete {
                  margin: auto;
                  cursor: pointer;
                }
              }
            }
            .el-upload {
              background-color: transparent;
              border: 0;
              width: auto;
              height: auto;
              .el-button {
                background: linear-gradient(180deg, #fefefe, #f0f0f0);
                font-family: inherit;
                font-size: inherit;
                line-height: 1;
                color: #000;
                border-radius: 0.07rem;
              }
            }
            .info-tip {
              color: #afafaf;
              svg {
                width: 22px;
                height: 22px;
                margin-right: 0.1rem;
                font-size: 18px;
                color: inherit;
              }
              p {
                line-height: 1.5;
              }
            }
            .el-radio {
              &.is-checked {
                .el-radio__inner {
                  border-color: #7405ff;
                  background: #7405ff;
                }
              }
              .el-radio__inner {
                border-color: #9b9b9b;
              }
              .el-radio__label {
                color: #000 !important;
              }
            }
          }
        }
        .el-form-item.is-required:not(.is-no-asterisk)
          > .el-form-item__label-wrap
          > .el-form-item__label:before,
        .el-form-item.is-required:not(.is-no-asterisk)
          > .el-form-item__label:before {
          display: none;
        }
      }
    }

    .el-dialog__footer {
      padding: 0 0.6rem 0.5rem;
      text-align: left;
      .dialog-footer {
        justify-content: center;
      }
      .el-button {
        width: 60%;
        max-width: 204px;
        height: auto;
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

