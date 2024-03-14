<template>
  <section id="space">
    <div id="spaceBody">
      <el-row class="space_body flex-row" v-loading="listLoad">
        <div class="app-tabs" v-if="listdata.jobResult && listdata.jobResult.length>0 && listdata.space.status === 'Running'">
          <iframe v-if="listdata.cpList.job_result_uri" :src="`${listdata.cpList.job_result_uri}#space_id=${listdata.space.task_uuid}`" title="Space app" class="space_iframe"></iframe>
          <div v-else>
            <el-alert :closable="false" title="Result Uri is Null, this result is not available." type="warning" />
          </div>
        </div>
        <div class="deployment" v-if="listdata.space.status === 'Deploying'">
          <div class="title">Deployment machine</div>
          <el-table :data="listdata.jobs_status" border style="width: 100%">
            <el-table-column prop="bidder_id" label="CP Node ID" min-width="140">
              <template #default="scope">
                <div class=" flex-row">{{ system.$commonFun.hiddAddress(scope.row.bidder_id) }}
                  <i class="icon icon_copy" @click="system.$commonFun.copyContent(scope.row.bidder_id, 'Copied')"></i>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="status" label="Status" /> -->
            <el-table-column prop="job_textUri" label="Quick Look" min-width="140">
              <template #default="scope">
                <a v-if="scope.row.job_textUri" :href="scope.row.job_textUri" target="_blank">{{scope.row.job_textUri}}</a>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="build_log" label="Deploy Log" min-width="120" align="center">
              <template #default="scope">
                <div class="log_style" :class="{'is-disabled': !scope.row.build_log}" @click="logMethod(scope.row)">
                  <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
                  </svg>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="deployment" v-else-if="listdata.space.status === 'Assigning to provider'">
          <div>
            <p class="m">The server is awaiting the CP to initiate the task.</p>
            <p v-if="metaAddress && metaAddress === route.params.wallet_address">If your waiting time is prolonged, you might consider
              <el-button plain @click="hardRedeploy">Redeploy</el-button>
              <br /> The tokens you paid will be refunded shortly. You can view and request a refund in
              <router-link :to="{name:'paymentHistory', query: {type: 'user'}}">User Payment History</router-link>.</p>
          </div>
        </div>
        <div class="deployment" v-else-if="listdata.space.status === 'Waiting for transaction'">
          <div>
            <p class="m">Your space is currently in the 'Waiting for transaction' state. Transaction processing might take some time. </p>
          </div>
        </div>
        <div class="deployment" v-else-if="listdata.space.status && (listdata.space.status.toLowerCase() === 'failed' || listdata.space.status === 'Stopped')">
          <!-- <div>
            <p class="m">All deployments has been not available before the space expires.</p>
            <p v-if="metaAddress && metaAddress === route.params.wallet_address">
              The Remaining tokens will be refunded shortly. You can view and request a refund in
              <router-link :to="{name:'paymentHistory', query: {type: 'user'}}">User Payment History</router-link>
              please
              <el-button plain @click="hardRedeploy">Redeploy</el-button> it.</p>
          </div> -->
          <div class="deploy-cont">
            <p v-if="listdata.cpList.error_msg" class="pre font" v-html="listdata.cpList.error_msg"></p>
            <p v-else-if="listdata.task.error_msg" class="pre font" v-html="listdata.task.error_msg"></p>

            <div class="log-all">
              <div class="flex-row log-title">
                <div class="flex-row">
                  <div class="flex-row log">
                    <p class="text-base font-semibold">Container logs:</p>
                  </div>
                </div>
              </div>
              <div class="box-card mianscroll font-14">
                <p class="pre" v-if="listdata.cpList.error_log_container">{{listdata.cpList.error_log_container}}</p>
                <p class="pre" v-else-if="listdata.cpList.error_log_build">{{ listdata.cpList.error_log_build }}</p>
                <p class="pre" v-else>No logs</p>
              </div>
            </div>
          </div>
        </div>
        <div class="deployment" v-else-if="listdata.space.status && listdata.space.status.toLowerCase() === 'closed'">
          <div>
            <p class="m">The space owner has closed the running space.</p>
          </div>
        </div>
        <div class="deployment" v-else-if="listdata.space.status === 'Expired'">
          <div>
            <p v-if="metaAddress && metaAddress === route.params.wallet_address">
              All deployments have expired, You can
              <el-button plain @click="hardRedeploy">Redeploy</el-button> it.</p>
            <p v-else>All deployments have expired.</p>
          </div>
        </div>
      </el-row>
    </div>

    <el-drawer v-model="drawer" :with-header="false" :direction="direction" :size="'70%'" :destroy-on-close="true" custom-class="drawer_style app" :before-close="handleClose">
      <template #default>
        <div class="log_app">
          <div class="logBody" style="height:100%" v-loading="logsLoad">
            <div class="flex-row log-title">
              <div class="flex-row">
                <div class="flex-row log">
                  <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
                  </svg>
                  <p class="text-base font-semibold">Logs</p>
                </div>
                <h4 class="font-16 weight-6" :class="{'is-active': logsType === 'build'}" @click="logsMethod(1, 'build')">build</h4>
                <h4 class="font-16 weight-6" :class="{'is-active': logsType !== 'build'}" @click="logsMethod(2, 'container')">container</h4>
              </div>
              <div class="flex-row clear">
                <div class="close-btn flex-row">
                  <el-checkbox v-model="checkedLock" label="Lock scroll" size="small" />
                </div>
                <div class="close-btn flex-row" @click="clearWebsocket()">
                  <svg class="text-sm" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 12 12">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.25H8.25V3H1.5V2.25ZM1.5 4.5H8.25V5.25H1.5V4.5ZM1.5 6.75H6V7.5H1.5V6.75ZM8.60889 8.10352L7.75293 7.24756L8.2479 6.75258L9.10386 7.60854L9.95996 6.75244L10.4549 7.24742L9.59884 8.10352L10.455 8.95968L9.96003 9.45466L9.10386 8.59849L8.24784 9.45451L7.75286 8.95954L8.60889 8.10352Z"
                      fill="currentColor"></path>
                  </svg>
                  &nbsp;Clear
                </div>
                <div class="close-btn flex-row" @click="upWebsocket(j)">
                  <el-icon>
                    <ArrowUp />
                  </el-icon>
                </div>
                <div class="close-btn flex-row" @click="drawer=false">
                  <el-icon>
                    <Close />
                  </el-icon>
                </div>
              </div>
            </div>
            <el-card class="box-card deployscroll font-14" v-show="logsType === 'build'">
              <p v-for="build in logsCont.buildLog" :key="build">{{build}}</p>
            </el-card>
            <el-card class="box-card deployscroll-container font-14" v-show="logsType !== 'build'">
              <p v-for="container in logsCont.containerLog" :key="container">{{container}}</p>
            </el-card>
          </div>
        </div>
      </template>
    </el-drawer>
  </section>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  onActivated,
  onDeactivated,
  watch,
  ref,
  reactive,
  getCurrentInstance,
  toRefs,
  nextTick
} from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  EditPen, Edit, Close, ArrowUp
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Spaces',
  components: {
    EditPen,
    Edit,
    Close,
    ArrowUp
  },
  props: {
    urlChange: { type: String, default: 'app' },
    likesValue: { type: Boolean, default: false },
    listValue: { type: Object, default: {} },
    cpList: { type: Object, default: {} },
    jobResult: { type: Array, default: [] }
  },
  setup (props, context) {
    const store = useStore()
    const lagLogin = computed(() => {
      return String(store.state.lagLogin) === 'true'
    })
    const metaAddress = computed(() => (store.state.metaAddress))
    const listLoad = ref(true)
    const listdata = reactive({
      jobResult: [],
      jobs_status: [],
      space: {},
      task: {},
      cpList: {}
    })
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const statusCode = reactive({
      code: -1000,
      reload: false
    })
    const logsCont = reactive({
      buildLog: [],
      containerLog: [],
      wsUrl: {}
    })
    const drawer = ref(false)
    const direction = ref('btt')
    const logsLoad = ref(false)
    const logsType = ref('build')
    const errorLogsType = ref('build')
    const checkedLock = ref(false)
    const listCont = reactive({
      data: {}
    })

    function handleClick (tab, event) {
      router.push({
        name: 'spaceDetail',
        params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name }
      })
    }

    async function init (type) {
      if (route.params.tabs !== 'app') return
      listLoad.value = type ? true : false
      if (type) listdata.jobResult = []
      let code = -1
      if (props.listValue && props.listValue.status === 'success') {
        code = props.listValue.data.space && props.listValue.data.space.status_code ? props.listValue.data.space.status_code : -1
        statusCode.reload = Number(code) > 1 && Number(code) < 6 ? true : false
        if (type) {
          statusCode.code = code
          listdata.jobResult = props.jobResult
          listdata.cpList = props.cpList
          if (props.listValue.data.space && props.listValue.data.space.status === 'Deploying' && props.listValue.data.job) listdata.jobs_status = await jobStatusList(props.listValue.data.job)
          listdata.space = props.listValue.data.space
          listdata.task = props.listValue.data.task
        }
      }
      context.emit('handleValue', false)
      listLoad.value = false
    }

    async function jobStatusList (list) {
      let arr = list || []
      let arrJob = []
      for (let j = 0; j < arr.length; j++) {
        try {
          if (arr[j].job_real_uri) arr[j].job_textUri = arr[j].job_real_uri
          else if (arr[j].job_result_uri) {
            const response = await fetch(arr[j].job_result_uri)
            const textUri = await new Promise(async (resolve, reject) => {
              resolve(response.text())
            })
            arr[j].job_textUri = textUri ? JSON.parse(textUri).job_result_uri : ''
          } else arr[j].job_textUri = ''
        } catch (err) {
          console.log('err', err)
          arr[j].job_textUri = ''
        }
        if (arr[j].job_result_uri) arrJob.push(arr[j])
      }
      return arrJob
    }

    function hardRedeploy () {
      context.emit('hardRedeploy', true)
    }

    async function logsMethod (type, name) {
      logsType.value = name
      await websocketclose()
      if (type === 1) {
        logsCont.buildLog = []
        if (logsCont.wsUrl && logsCont.wsUrl.build_log) await WebSocketFun(logsCont.wsUrl.build_log, 1)
      } else {
        logsCont.containerLog = []
        if (logsCont.wsUrl && logsCont.wsUrl.container_log) await WebSocketFun(logsCont.wsUrl.container_log, 2)
      }
    }
    async function logMethod (row) {
      if (!row || !row.build_log) return
      drawer.value = true
      logsType.value = 'build'
      logsCont.wsUrl = row
      // logsLoad.value = true
      WebSocketFun(logsCont.wsUrl.build_log, 1)
    }
    const WebSocketFun = (url, index, n) => {
      if (typeof (WebSocket) === "undefined") {
        alert("Your browser does not support sockets")
      } else {
        try {
          ws = new WebSocket(url)
          ws.onopen = () => {
            console.log("ws connection successful")
          }
          ws.onmessage = (event) => {
            // console.log('ws data:', event.data)
            if (event.data) {
              if (event.data === 'ping' && ws) ws.send('pong')
              else if (index === 1) logsCont.buildLog.push(event.data)
              else if (index === 2) logsCont.containerLog.push(event.data)
              nextTick(() => {
                let scrollEl = document.querySelectorAll('.deployscroll')
                let scrollContainerEl = document.querySelectorAll('.deployscroll-container')
                if (checkedLock.value) return
                scrollEl.forEach(async el => {
                  // await system.$commonFun.timeout(1000)
                  el.scrollTo({ top: el.scrollHeight, behavior: 'instant' })
                })
                scrollContainerEl.forEach(async el => {
                  // await system.$commonFun.timeout(1000)
                  el.scrollTo({ top: el.scrollHeight, behavior: 'instant' })
                })
              })
            }
          }
          ws.onerror = (err) => {
            // console.log("Websocket connection error", err)
            if (index === 1) logsCont.buildLog = ["Websocket connection error"]
            else if (index === 2) logsCont.containerLog = ["Websocket connection error"]
          }
          ws.onclose = () => {
            console.log("ws connection closed")
          }
        } catch (err) {
          if (index === 1) logsCont.buildLog = [{ err }]
          else if (index === 2) logsCont.containerLog = [{ err }]
        }
      }
    }
    function clearWebsocket (index) {
      if (logsType.value === 'build') logsCont.buildLog = []
      else logsCont.containerLog = []
    }
    function upWebsocket () {
      const name = logsType.value === 'build' ? 'deployscroll' : 'deployscroll-container'
      nextTick(() => {
        checkedLock.value = true
        let scrollEl = document.querySelectorAll('.' + name)
        scrollEl.forEach(async el => {
          el.scrollTo({ top: 0, behavior: 'instant' })
        })
      })
    }
    function handleClose () {
      drawer.value = false
      checkedLock.value = false
      logsCont.buildLog = []
      logsCont.containerLog = []
      logsCont.wsUrl = {}
      websocketclose()
    }
    let ws = null
    const websocketclose = async () => {
      try {
        if (ws) ws.close()
        ws = null
        console.log("closed")
      } catch (err) {
        ws = null
      }
    }
    onActivated(() => {
    })
    onMounted(() => {
      window.scrollTo(0, 0)
      // init(1)
    })
    onDeactivated(() => {
    })
    watch(route, (to, from) => {
      listdata.space = {}
      listdata.task = {}
      if (to.name !== 'spaceDetail') return
      if (to.params.tabs === 'app') {
        window.scrollTo(0, 0)
        // init(1)
      }
    })
    watch(() => props.likesValue, () => {
      init(1)
    })
    watch(() => props.listValue, () => {
      init(1)
    })
    watch(() => props.jobResult, () => {
      listdata.jobResult = props.jobResult
    })
    watch(() => props.cpList, () => {
      listdata.cpList = props.cpList
    })
    return {
      metaAddress,
      lagLogin,
      listLoad,
      listdata,
      bodyWidth,
      system,
      route,
      router,
      logsCont,
      checkedLock,
      drawer, direction, logsLoad, logsType, clearWebsocket, upWebsocket,
      init, handleClick, hardRedeploy, logMethod, errorLogsType,
      handleClose, logsMethod
    }
  }
})
</script>

<style lang="scss" scoped>
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }

  .mark {
    flex-wrap: wrap;
    .left,
    .right {
      width: 50%;
    }
  }

  #spaceBody {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  :deep(.space_body) {
    width: 100%;
    align-items: stretch;
    flex-grow: 1;
    min-height: 80px;
    padding: 0;
    margin: auto;
    font-size: 14px;
    text-align: left;

    .deployment {
      width: 98%;
      max-width: 1536px;
      margin: 0.3rem auto 0.4rem;
      .deploy-cont {
        margin: auto;
        .font {
          font-family: "FIRACODE-LIGHT";
          font-size: 15px;
          color: rgb(107, 114, 128);
        }
      }

      .title {
        margin: 0.1rem 0 0.25rem;
        font-size: 0.2rem;
        font-weight: bold;
        text-transform: capitalize;
      }

      .el-table {
        tr {
          th {
            background-color: #f5f7fa;
          }

          .flex-row {
            .icon_copy {
              width: 14px;
              height: 14px;
              margin: 0 0 0 5px;
              background: url(../../../assets/images/icons/icon_36.png)
                no-repeat left center;
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
          }

          td {
            a {
              text-decoration: underline;
              color: inherit;
            }
            .log_style {
              cursor: pointer;
              &.is-disabled {
                cursor: no-drop;
                opacity: 0.4;
              }
            }
          }
        }
      }

      .info {
        margin-top: 0.5rem;
      }

      p {
        // padding-top: 0.3rem;
        line-height: 1.6;
        &.m {
          padding-top: 0;
        }
        &.pre {
          white-space: pre-line;
          font-family: IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo,
            Monaco, Consolas, Liberation Mono, Courier New, monospace;
          color: rgb(31, 41, 55);
        }
        .el-button {
          height: auto;
          padding: 5px 10px;
          font-family: inherit;
        }
        a {
          text-decoration: underline;
          color: inherit;
          &:hover {
            color: #c37af9;
          }
        }
      }

      .log-all {
        height: 100%;
        padding: 40px 0 20px;
        margin: 0;
        .log-title {
          justify-content: space-between;
          padding: 0 4% 0 0;
          @media screen and (max-width: 768px) {
            padding: 0 2% 0 0;
          }
          .log {
            p {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
            }
          }
          h4 {
            padding: 0.5px 6px;
            margin: 0 12px 0 0;
            font-size: 13px;
            font-weight: 500;
            text-transform: capitalize;
            border-radius: 6px;
            cursor: pointer;
            &.is-active,
            &:hover {
              background-color: rgb(229, 231, 235);
            }
          }
          .clear {
            align-items: stretch;
            font-size: 12px;
            color: #000;
            .close-btn {
              padding: 5px 8px;
              margin: 0 0 0 5px;
            }
            .el-checkbox {
              display: flex;
              height: auto;
              .el-checkbox__inner {
                // background-color: #e5e7eb;
                border-color: #e5e7eb;
              }
              .el-checkbox__label {
                padding-left: 5px;
                line-height: 1.2;
                color: #000;
              }
            }
          }
        }
        .mian {
          position: relative;
        }
        .box-card {
          position: relative;
          max-height: calc(100% - 60px);
          margin: 11px 0 0;
          background-color: transparent;
          background-image: linear-gradient(
            rgb(249, 250, 251),
            rgb(255, 255, 255)
          );
          font-family: IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo,
            Monaco, Consolas, Liberation Mono, Courier New, monospace;
          white-space: nowrap;
          overflow-y: auto;
          box-shadow: none;
          border: 1px solid rgb(243, 244, 246);
          border-radius: 8px;
          padding: 0;
          .pre {
            padding: 16px;
          }
          .el-card__body {
            padding: 0;
          }
        }
      }
    }
    .app-tabs {
      position: relative;
      width: 100%;
      padding: 0;
      margin: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      @media screen and (max-width: 768px) {
        padding-top: 0.35rem;
      }
      .heading-cp {
        position: absolute;
        top: 0;
        right: 16px;
        padding: 0.15rem 0 0.15rem 20px;
        background: url(../../../assets/images/icons/start_job.png) no-repeat
          left center;
        background-size: 13px;
        z-index: 0;
      }
      .el-tabs {
        position: relative;
        width: 100%;
        padding: 0;
        margin: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        .app-button {
          display: none;
          position: absolute;
          top: calc(-0.7rem - 20px);
          left: 0;
          z-index: 99;
        }
        .el-tabs__header {
          max-width: none !important;
          padding: 0 16px !important;
          margin: 0;
        }

        .el-tabs__content {
          flex-grow: 1;
          .el-tab-pane,
          iframe {
            width: 100%;
            height: 100%;
            border: 0;
          }
        }
        .el-tabs__item {
          height: auto;
          .custom-tabs-label {
            padding: 0.15rem 0;
            line-height: 1;
            i {
              margin: 0 5px 0 0;
              font-size: 16px;
              color: #c37af9;
              @media screen and (max-width: 1600px) {
                font-size: 14px;
              }
            }

            .span-cp {
              padding-left: 20px;
              background: url(../../../assets/images/icons/start_job.png)
                no-repeat left 0;
              background-size: 13px;
            }
            .cp-style {
              svg {
                margin: 0 0 0 10px;
              }
            }
          }

          &.is-active,
          &:hover {
            color: #c37af9 !important;
          }
        }
      }
    }

    .space_iframe {
      width: 100%;
      height: 100%;
      border: 0;
      min-height: 315px;
      overflow: auto;
      // @media screen and (min-height: 500px) and (min-width: 769px) {
      //   min-height: 315px;
      // }
      // @media screen and (min-height: 600px) and (min-width: 769px) {
      //   min-height: 415px;
      // }
      // @media screen and (min-height: 680px) and (min-width: 769px) {
      //   min-height: 495px;
      // }
      // @media screen and (min-height: 700px) and (min-width: 769px) {
      //   min-height: 595px;
      // }
      // @media screen and (min-height: 750px) and (min-width: 769px) {
      //   min-height: 565px;
      // }
      // @media screen and (min-height: 768px) and (min-width: 769px) {
      //   min-height: 595px;
      // }
      // @media screen and (min-height: 900px) and (min-width: 769px) {
      //   min-height: 685px;
      // }
      // @media screen and (min-height: 1000px) and (min-width: 769px) {
      //   min-height: 755px;
      // }
      // @media screen and (min-height: 1100px) and (min-width: 769px) {
      //   min-height: 925px;
      // }
      // @media screen and (min-height: 1200px) and (min-width: 769px) {
      //   min-height: 985px;
      // }

      &.space_text {
        padding: 11px;
        background-color: #000;
        font-size: 14px;
        color: #fff;
        box-shadow: inset 0 5px 5px rgba(204, 204, 204, 0.55);
        cursor: text;
        word-break: break-all;
        @media screen and (min-width: 1800px) {
          font-size: 16px;
        }
        @media screen and (max-width: 600px) {
          font-size: 13px;
        }
      }
    }

    .readme_text {
      position: relative;
      padding: 0.5rem 0.3rem 0.3rem 0;
      @media screen and (max-width: 992px) {
        padding: 0.3rem 0;
      }

      .readme_body {
        justify-content: center;
        flex-wrap: wrap;
        min-height: 300px;
        background-color: #fbfbfc;
        border: 1px solid #f1f1f1;
        border-radius: 5px;

        b,
        p {
          display: block;
          width: 100%;
          margin: 0.1rem auto;
          text-align: center;
        }
      }

      &::after {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
    }

    .left {
      position: relative;
      padding: 0.3rem 0;
      background-color: #fff;

      .labelList {
        margin: 0.2rem 0 0.4rem;
        text-align: left;
        position: -webkit-sticky;
        position: sticky;
        top: 0.2rem;
        width: 100%;

        .sticky_element {
          // position: fixed;
          // top: 10px;
          // display: block;
          // max-width: 16.6666666667%;
        }

        .title {
          padding: 0.05rem 0;
          margin: 0 0 0.1rem;
          font-size: 0.2rem;
          color: #000000;
          @media screen and (max-width: 1600px) {
            font-size: 18px;
          }
          @media screen and (max-width: 441px) {
            font-size: 16px;
          }
        }

        .sub_title {
          padding: 0.05rem 0;
          margin: 0.1rem 0 0;
          font-size: 0.18rem;
          color: #000000;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 441px) {
            font-size: 14px;
          }
        }

        ul {
          li {
            a {
              display: block;
              padding: 0.05rem 0.12rem;
              color: #878c93;
              font-size: 0.16rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              line-height: 1.5;
              word-break: break-word;
              @media screen and (max-width: 1600px) {
                font-size: 15px;
              }
              @media screen and (max-width: 441px) {
                font-size: 13px;
              }

              &:hover {
                text-decoration: underline;
              }

              &.disbled {
                color: #cccccc;
              }
            }
          }
        }
      }

      .list {
        margin: 0.2rem 0.16rem 0;

        .title {
          justify-content: space-between;
          padding: 0.1rem 0;
          margin: 0 0 0.1rem;
          font-family: "Helvetica-Neue";
          font-size: 16px;
          color: #000;
          border-radius: 0.08rem;
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }

          .icon {
            width: 0.22rem;
            height: 0.22rem;
            margin: 0 0.13rem 0 0;
          }

          .icon_sizes {
            background: url(../../../assets/images/icons/icon_7.png) no-repeat
              left center;
            background-size: 17px;
          }

          .icon_licenses {
            background: url(../../../assets/images/icons/icon_8.png) no-repeat
              left center;
            background-size: 17px;
          }

          .icon_spaces {
            width: 16px;
            height: 16px;
            margin: 0 5px 0 0;
            background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
              left center;
            background-size: 100%;
          }

          b {
            font-size: 17px;
            color: #000;
            @media screen and (min-width: 1800px) {
              font-size: 18px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 15px;
            }
          }

          small {
            font-size: 14px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.55);
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 12px;
            }
          }

          p {
            overflow: hidden;
            text-overflow: ellipsis;
            word-spacing: normal;
            white-space: nowrap;
            text-align: left;
            line-height: 1;

            .icon {
              display: block;
              float: left;
            }
          }
        }

        .cont {
          padding: 0.25rem 0.06rem;

          .el-row {
            .el-col {
              max-width: max-content;
              width: auto;
              flex: auto;

              a {
                padding: 0;
                margin: 0.03rem auto;
                background-color: transparent;
                border-radius: 0.05rem;
                font-size: 13px;
                color: #606060;
                border: 2px solid #f1f1f2;
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
                  padding: 0.03rem 0.07rem;
                }

                .icon {
                  width: 0.3rem;
                  height: 0.26rem;
                  padding: 0;
                }

                .icon_sizes {
                  background: url(../../../assets/images/icons/icon_7.png)
                    no-repeat left center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }

                .icon_licenses {
                  width: 0.28rem;
                  background: url(../../../assets/images/icons/icon_21.png)
                    no-repeat right center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }

                .icon_01 {
                  background: #fef7ef
                    url(../../../assets/images/icons/icon_22.png) no-repeat
                    center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }

                .icon_02 {
                  background: #f0f3ff
                    url(../../../assets/images/icons/icon_29.png) no-repeat
                    center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
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
          }
        }

        &:nth-child(1) {
          .cont {
            .el-row {
              .el-col {
                a {
                  &:hover {
                    background-color: #eee;
                  }
                }

                // &:nth-child(1) {
                //   a {
                //     .icon {
                //       background: #fef7ef
                //         url(../../../assets/images/icons/icon_22.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(2) {
                //   a {
                //     .icon {
                //       background: #f0f3ff
                //         url(../../../assets/images/icons/icon_23.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(3) {
                //   a {
                //     .icon {
                //       background: #f6f7ff
                //         url(../../../assets/images/icons/icon_24.png) no-repeat
                //         center;
                //       background-size: 18px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(4) {
                //   a {
                //     .icon {
                //       background: #f1f7ff
                //         url(../../../assets/images/icons/icon_25.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(5) {
                //   a {
                //     .icon {
                //       background: #f2f8ff
                //         url(../../../assets/images/icons/icon_26.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(6) {
                //   a {
                //     .icon {
                //       background: #edfdf6
                //         url(../../../assets/images/icons/icon_27.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(7) {
                //   a {
                //     .icon {
                //       background: #fef3f3
                //         url(../../../assets/images/icons/icon_28.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
              }
            }
          }
        }

        &:nth-child(2) {
          .cont {
            .el-row {
              .el-col {
                a {
                  background-color: #f3f1ff;
                  color: #562683;
                  border: 0;
                }
              }
            }
          }
        }

        &:nth-child(3) {
          .cont {
            .el-row {
              .el-col {
                a {
                  background-color: #dfbafa;
                  color: #5b21c6;
                  border: 0;
                }
              }
            }
          }
        }

        &:nth-child(4) {
          .cont {
            .el-row {
              .el-col {
                a {
                  &:hover {
                    background-color: #eee;
                  }
                }
              }
            }
          }
        }
      }

      .list_body {
        padding: 0 0.16rem;

        .el-col {
          margin: 0.05rem 0;
          max-width: 350px;
          @media screen and (max-width: 768px) {
            max-width: none;
          }

          .box-card {
            padding: 0.1rem 0.2rem;
            background-color: #fff;
            border-color: #e4e4e4;
            border-radius: 0.1rem;
            box-shadow: none;

            * {
              cursor: pointer;
            }

            .el-card__header {
              padding: 0;
              border: 0;
            }

            .el-card__body {
              padding: 0.05rem 0 0;

              .text {
                justify-content: flex-start;
                flex-wrap: wrap;
                color: #000;
                line-height: 1;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }

                .icon {
                  width: 20px;
                  height: 20px;
                  margin: 0 6px 0 0;
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
                  margin: 0 3px 0 0;
                  background: url(../../../assets/images/icons/icon_20.png)
                    no-repeat left center;
                  background-size: 100%;
                }

                .icon_image {
                  background: url(../../../assets/images/icons/icon_30.png)
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
                      background-color: #f3f1ff;
                      border-radius: 0.2rem;
                      font-size: 13px;
                      color: #5b21c6;
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
                        background-color: #dfbafa;
                        color: #5b21c6;
                      }
                    }
                  }
                }

                .ellipsis {
                  width: calc(100% - 26px);
                  font-family: "FIRACODE-REGULAR";
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-spacing: normal;
                  text-align: left;
                  line-height: 1.5;
                }
              }

              .item {
                justify-content: space-between;
                margin: 0.2rem 0 0;
              }
            }
          }

          &:hover {
            .box-card {
              background-color: #7405ff;

              .el-card__header {
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

                  .icon_image {
                    background: url(../../../assets/images/icons/icon_30_1.png)
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
                          background-color: #dfbafa;
                          color: #5b21c6;
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
    }

    .left_light,
    .readme_text {
      font-family: "FIRACODE-LIGHT";
    }

    .right {
      position: relative;
      padding: 0.4rem 0.2rem;
      font-family: "FIRACODE-LIGHT";

      .data {
        padding: 0.1rem 0 0;
        margin: 0 0 0.4rem;
        border: 1px solid #f1f1f1;
        border-radius: 0.1rem;
        color: #606060;
        overflow: hidden;

        .top {
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 0.1rem 4%;
          font-size: 0.19rem;

          .top_text {
            flex-wrap: wrap;
            font-size: 0.2rem;
            color: #000000;
            @media screen and (max-width: 1600px) {
              font-size: 18px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 16px;
            }
            @media screen and (max-width: 441px) {
              font-size: 14px;
            }

            b {
              padding: 0.08rem 0.25rem;
              margin: 0 0.17rem 0 0;
              background-color: #7405ff;
              font-size: 0.215rem;
              font-weight: normal;
              line-height: 1;
              color: #fff;
              border-radius: 0.09rem;
            }

            .el-input {
              max-width: 3.45rem;
              margin: 0.1rem 0 0 0;

              .el-input__inner {
                // padding-left: 0.35rem;
                // background: url(../../../assets/images/icons/icon_10_2.png)
                //   no-repeat 0.1rem center;
                // background-size: 17px;
                border-radius: 0.1rem;
                border-color: #cccccc;
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
            }

            .el-button {
              padding: 0.03rem 0.1rem;
              margin: 0 0 0 0.2rem;
              line-height: 1;
              border-radius: 5px;
              font-family: inherit;
            }

            .span {
              width: 100%;
              color: #606060;
              font-size: 16px;
              @media screen and (max-width: 1440px) {
                font-size: 15px;
              }
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
            }
          }

          .el-button {
            width: auto;
            height: auto;
            padding: 0.05rem 0.15rem;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            border-color: #e1e1e1;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.2;
            border-radius: 0.09rem;
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
          }
        }

        .el-table {
          margin: 0.1rem 0 0;

          .el-table__inner-wrapper {
            tr {
              color: #000;

              th,
              td {
                padding: 0.13rem 0;

                .cell {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }

                &:nth-child(3) {
                  text-align: right;
                }
              }

              th {
                padding: 0.18rem 0;
              }
            }
          }
        }
      }

      .text {
        text-align: left;

        p {
          padding: 0.02rem 0;
          font-size: 18px;
          color: #565656;
          line-height: 1.4;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          @media screen and (max-width: 600px) {
            font-size: 12px;
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
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }

      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
    }
  }
}
</style>

