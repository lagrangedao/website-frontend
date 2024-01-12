<template>
  <section id="space">
    <div id="spaceBody">
      <el-row class="space_body flex-row" v-loading="listLoad">
        <div class="app-tabs" v-if="listdata.jobResult && listdata.jobResult.length>0 && listdata.space.status === 'Running'">
          <el-tabs>
            <el-tab-pane v-for="(job, j) in listdata.jobResult" :key="j">
              <template #label>
                <div class="custom-tabs-label flex-row">
                  <el-tooltip placement="top">
                    <template #content>
                      <small>
                        CP Status:
                        <br/>
                        <span v-if="job.provider_status">{{ job.provider_status.online ? 'Online' : 'Offline' }}, {{ job.provider_status.status }}</span>
                        <span v-else>-</span>
                      </small>
                    </template>
                    <div :class="{'span-cp':  listdata.task && listdata.task.leading_job_id === job.uuid, 'cp-style flex-row': true}">
                      CP {{ j + 1 }}

                      <svg width="16" height="16" v-if="job.job_result_uri" @click="system.$commonFun.goLink(`${job.job_result_uri}#space_id=${listdata.space.task_uuid}`)" t="1700718365282" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="2324">
                        <path d="M875.333052 552.332591c-17.381879 0-31.476899 14.083763-31.582299 31.472805l0 0.155543c0 0 0 0 0 0.047072l0 220.847897c0 17.896602-14.440897 32.358989-32.264844 32.358989L172.891675 837.214896c-17.815761 0-32.241308-14.45727-32.241308-32.358989L140.650367 254.650771c0-17.894555 14.439874-32.383548 32.241308-32.383548l298.973232 0c17.445324-0.034792 31.535227-14.177907 31.535227-31.652907 0-17.483186-14.104229-31.651884-31.535227-31.651884L168.641885 158.962431c-50.360991 0-91.178629 40.925085-91.178629 91.38943l0 558.753837c0 50.471508 40.820708 91.415013 91.178629 91.415013l647.092791 0c50.357921 0 91.180676-40.943504 91.180676-91.415013L906.915351 583.844282C906.844743 566.42454 892.720048 552.332591 875.333052 552.332591z"
                          fill="#333333" p-id="2325"></path>
                        <path d="M937.013857 335.824535l-206.523657-207.157083-8.005324-6.593162c-4.556783-2.381234-10.184967-3.292999-15.497972-3.292999-18.075681 0-32.732495 14.697747-32.732495 32.803103 0 5.333472 3.105734 13.644765 5.498224 18.213827l141.602042 142.967132L675.756621 312.765353c-221.524303 27.526937-302.548664 144.17668-322.964646 415.066297-0.028653 18.86158 14.633279 33.57877 32.703843 33.57877 14.392802 0 27.443026-12.673647 31.812543-25.645077 20.424168-243.485477 77.827553-337.180416 259.588223-357.409133l144.467299 0.053212L684.120103 516.049223l-5.925966 7.506974c-2.264577 4.474918-3.140527 10.106172-3.140527 15.269775 0 18.081821 14.656815 32.803103 32.708959 32.803103 4.581342 0 12.685927-2.552126 16.746406-4.373611l212.502835-211.896015 9.101285-9.135054L937.013857 335.824535z"
                          fill="#333333" p-id="2326"></path>
                      </svg>
                    </div>
                  </el-tooltip>
                </div>
              </template>
              <iframe v-if="job.job_result_uri" :src="`${job.job_result_uri}#space_id=${listdata.space.task_uuid}`" title="Space app" class="space_iframe"></iframe>
              <div v-else>
                <el-alert :closable="false" title="Result Uri is Null, this result is not available." type="warning" />
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="heading-cp">Your Heading CP</div>
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
        <div class="deployment" v-else-if="listdata.space.status === 'Stopped'">
          <div>
            <p class="m">All deployments has been not available before the space expires.</p>
            <p v-if="metaAddress && metaAddress === route.params.wallet_address">
              The Remaining tokens will be refunded shortly. You can view and request a refund in
              <router-link :to="{name:'paymentHistory', query: {type: 'user'}}">User Payment History</router-link>
              please
              <el-button plain @click="hardRedeploy">Redeploy</el-button> it.</p>
          </div>
        </div>
        <div class="deployment" v-else-if="listdata.space.status && listdata.space.status.toLowerCase() === 'failed'">
          <div>
            <p class="m">All deployments has been not available before the space expires.</p>
            <p v-if="metaAddress && metaAddress === route.params.wallet_address">
              The Remaining tokens will be refunded shortly. You can view and request a refund in
              <router-link :to="{name:'paymentHistory', query: {type: 'user'}}">User Payment History</router-link>
              please
              <el-button plain @click="hardRedeploy">Redeploy</el-button> it.</p>
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
    listValue: { type: Object, default: {} }
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

    async function jobList (list) {
      let arr = list || []
      let arrJob = []
      for (let j = 0; j < arr.length; j++) {
        // 如果status为running才显示
        if (arr[j] && arr[j].status && arr[j].status.toLowerCase() !== "failed") {
          try {
            if (arr[j].job_result_uri) {
              const response = await fetch(arr[j].job_result_uri)
              const textUri = await new Promise(async resolve => {
                resolve(response.text())
              })
              arr[j].job_result_uri = JSON.parse(textUri).job_result_uri
            } else arr[j].job_result_uri = ''
          } catch (err) {
            console.log('err', err)
            arr[j].job_result_uri = ''
          }
          if (arr[j].job_result_uri) arrJob.push(arr[j])
        }
      }
      return arrJob
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
          // console.log('load')
          statusCode.code = code
          listdata.jobResult = await jobList(props.listValue.data.job)
          if (props.listValue.data.space && props.listValue.data.space.status === 'Deploying' && props.listValue.data.job) listdata.jobs_status = await jobStatusList(props.listValue.data.job)
          listdata.space = props.listValue.data.space
          listdata.task = props.listValue.data.task
          // props.listValue.data.job = await system.$commonFun.sortBoole(props.listValue.data.job)
        }
      }
      // const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}?requester=${store.state.metaAddress}`, 'get')
      // if (listRes && listRes.status === 'success') {
      //   code = listRes.data.space && listRes.data.space.status_code ? listRes.data.space.status_code : -1
      //   statusCode.reload = Number(code) > 1 && Number(code) < 6 ? true : false
      //   if (type) {
      //     // console.log('load')
      //     statusCode.code = code
      //     listdata.jobResult = await jobList(listRes.data.job)
      //     if (listRes.data.space.status === 'Deploying' && listRes.data.job) listdata.jobs_status = await jobStatusList(listRes.data.job)
      //     listdata.space = listRes.data.space
      //     // listRes.data.job = await system.$commonFun.sortBoole(listRes.data.job)
      //   }
      // }
      context.emit('handleValue', false)
      listLoad.value = false
      // if (statusCode.reload) {
      //   await system.$commonFun.timeout(1000)
      //   if (Number(code) === Number(statusCode.code)) init()
      //   else init(1)
      // }
    }

    async function jobStatusList (list) {
      let arr = list || []
      let arrJob = []
      for (let j = 0; j < arr.length; j++) {
        try {
          if (arr[j].job_result_uri) {
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
      init, handleClick, hardRedeploy, logMethod, handleClose, logsMethod
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
      margin: 0.2rem auto 0.4rem;

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
        line-height: 2;
        &.m {
          padding-top: 0;
        }
        .el-button {
          height: auto;
          padding: 5px 10px;
        }
        a {
          text-decoration: underline;
          color: inherit;
          &:hover {
            color: #c37af9;
          }
        }
      }
    }
    .app-tabs {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
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
      width: calc(100% - 4px);
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

