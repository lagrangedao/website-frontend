<template>
  <section id="space" :class="{'space-height': route.params.tabs === 'app'}" v-loading="forkLoad" element-loading-text="Please wait...">
    <div class="space_head" :class="{'space-height flex-row space-flex': route.params.tabs === 'app'}">
      <div class="content flex-row container-landing">
        <div class="name flex-row">
          <div class="back-logo flex-row" @click="back" v-if="route.params.tabs === 'app'">
            <i class="icon logo_lagrange"></i>
            Space
            <el-divider direction="vertical" />
          </div>
          <div class="flex-row" v-else>
            <i class="icon icon_spaces"></i>
            Space: &nbsp;
          </div>
          <b>{{route.params.name}}</b>
          <i class="icon icon_copy" @click="system.$commonFun.copyContent(route.params.name, 'Copied')"></i>
          <el-button-group class="ml-4">
            <el-button @click="likeMethod" v-if="likeOwner">
              <i class="icon icon_like"></i>
            </el-button>
            <el-button @click="likeMethod" v-else :disabled="metaAddress?false:true">
              <i class="icon icon_like unlink"></i>
            </el-button>
            <el-button disabled>{{likeValue}}</el-button>
          </el-button-group>
          <div class="status" :class="{'is-status': (parentValue && parentValue.toLowerCase() === 'failed') || parentValue === 'Stopped', 'animate-spin-slow': parentValue === 'Running'}" v-if="parentValue">
            <svg v-if="parentValue === 'Running'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 15 15">
              <path d="M7.48877 6.75C7.29015 6.75 7.09967 6.82902 6.95923 6.96967C6.81879 7.11032 6.73989 7.30109 6.73989 7.5C6.73989 7.69891 6.81879 7.88968 6.95923 8.03033C7.09967 8.17098 7.29015 8.25 7.48877 8.25C7.68738 8.25 7.87786 8.17098 8.0183 8.03033C8.15874 7.88968 8.23764 7.69891 8.23764 7.5C8.23764 7.30109 8.15874 7.11032 8.0183 6.96967C7.87786 6.82902 7.68738 6.75 7.48877 6.75ZM7.8632 0C11.2331 0 11.3155 2.6775 9.54818 3.5625C8.80679 3.93 8.47728 4.7175 8.335 5.415C8.69446 5.565 9.00899 5.7975 9.24863 6.0975C12.0195 4.5975 15 5.19 15 7.875C15 11.25 12.3265 11.325 11.4428 9.5475C11.0684 8.805 10.2746 8.475 9.57813 8.3325C9.42836 8.6925 9.19621 9 8.89665 9.255C10.3869 12.0225 9.79531 15 7.11433 15C3.74438 15 3.67698 12.315 5.44433 11.43C6.17823 11.0625 6.50774 10.2825 6.65751 9.5925C6.29056 9.4425 5.96855 9.2025 5.72891 8.9025C2.96555 10.3875 0 9.8025 0 7.125C0 3.75 2.666 3.6675 3.54967 5.445C3.92411 6.1875 4.71043 6.51 5.40689 6.6525C5.54918 6.2925 5.78882 5.9775 6.09586 5.7375C4.60559 2.97 5.1972 0 7.8632 0Z"
                fill="currentColor"></path>
            </svg>
            <el-tooltip v-if="parentValue === 'Stopped'" placement="bottom" content="The deployment has ceased before its scheduled expiration due to unforeseen reasons.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Assigning to provider'" placement="bottom" content="Matching the Space with a computing provider.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Waiting for transaction'" placement="bottom" content="Awaiting payment confirmation.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue && parentValue.toLowerCase() === 'failed'" placement="bottom" content="The deployment has encountered an error.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Expired'" placement="bottom" content="The deployment has concluded upon reaching its expiration date.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Created'" placement="bottom" content="The Space has been successfully created.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Deploying'" placement="bottom" content="The Space is currently being deployed to the provider.">{{parentValue}}</el-tooltip>
            <el-tooltip v-else-if="parentValue === 'Running'" placement="bottom" content="The Space has been successfully deployed.">{{parentValue}}</el-tooltip>
            <span v-else>{{parentValue}}</span>
            <span v-if="parentValue === 'Running' && allData.space.activeOrder && allData.space.activeOrder.config && allData.space.activeOrder.config.hardware_type && allData.space.activeOrder.config.hardware_type === 'GPU'">&nbsp;on
              <i>{{allData.space.activeOrder.config.hardware}}</i>
            </span>
          </div>
          <el-button-group class="ml-4" v-if="metaAddress && metaAddress === route.params.wallet_address && ((expireTime.time <=3&&expireTime.unit!=='hours') ||(expireTime.time <=24&&expireTime.unit==='hours')) && (parentValue && parentValue.toLowerCase() !== 'failed') && parentValue !== 'Stopped' && parentValue !== 'Expired'">
            <el-button type="warning" plain disabled v-if="expireTime.time >= 0">
              <el-icon>
                <WarningFilled />
              </el-icon>
              &nbsp;Expires in {{expireTime.time
              < 0.1 ? '3': expireTime.time}} {{expireTime.unit}} </el-button>
                <el-button type="warning" plain disabled v-else>
                  <el-icon>
                    <WarningFilled />
                  </el-icon>
                  &nbsp;Expired</el-button>
          </el-button-group>
          <div class="logs_style flex-row" @click="hardwareOperate('fork')" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg> Fork
          </div>

          <div class="logs_style popDown flex-row" v-if="parentValue && (parentValue === 'Deploying' || parentValue === 'Running')">
            <div class="share_style flex-row" @click="logDrawer('log')">
              <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="space-right flex-row">
          <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
            <el-tab-pane name="app">
              <template #label>
                <span class="custom-tabs-label flex-row">
                  <i class="icon icon_spaces"></i>
                  <span>App</span>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="card">
              <template #label>
                <span class="custom-tabs-label flex-row">
                  <i class="icon icon_spaces"></i>
                  <span>Space card</span>
                </span>
              </template>
            </el-tab-pane>
            <el-tab-pane name="files">
              <template #label>
                <span class="custom-tabs-label flex-row">
                  <i class="icon"></i>
                  <span>Files and versions</span>
                </span>
              </template>
            </el-tab-pane>
            <!-- <el-tab-pane name="community">
              <template #label>
                <span class="custom-tabs-label flex-row">
                  <i class="icon"></i>
                  <span>Community</span>
                  <b>3</b>
                </span>
              </template>
            </el-tab-pane> -->
            <el-tab-pane name="settings" v-if="metaAddress && metaAddress === route.params.wallet_address">
              <template #label>
                <span class="custom-tabs-label flex-row">
                  <!-- <i class="icon icon_spaces"></i> -->
                  <el-icon class="icon">
                    <Setting />
                  </el-icon>
                  <span>Settings</span>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>

          <div class="logs_style popDown flex-row">
            <el-popover :width="190" :visible="visible" trigger="click" placement="bottom-end" popper-class="popper_style">
              <template #reference>
                <div class="share_style flex-row" @click="visible = true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" data-v-ea893728="">
                    <path fill="currentColor" d="M176 416a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224"></path>
                  </svg>
                </div>
              </template>
              <template #default>
                <ul class="demo-rich-conent">
                  <li class="flex-row">
                    <div class="m-width" @click="logDrawer('detail')">
                      Space Detail
                    </div>
                  </li>
                  <li :class="{'flex-row': true, 'is-disabled':parentValue !== 'Running' ||!((expireTime.time <=3&&expireTime.unit!=='hours') ||(expireTime.time <=24&&expireTime.unit==='hours'))}" v-if="metaAddress && metaAddress === route.params.wallet_address">
                    <div class="m-width">
                      <el-tooltip v-if="parentValue !== 'Running' || !((expireTime.time <=3&&expireTime.unit!=='hours') ||(expireTime.time <=24&&expireTime.unit==='hours'))" placement="bottom" content="The space expiration time can be renewed only when it is less than 24 hours">Renew</el-tooltip>
                      <span v-else @click="hardwareOperate('renew')">Renew</span>
                    </div>
                  </li>
                  <li :class="{'flex-row': true, 'is-disabled': !nft.contract_address || nftTokens.length === 0 }" v-if="metaAddress && metaAddress !== route.params.wallet_address">
                    <div class="m-width" @click="reqNFT">Request License</div>
                  </li>
                  <li class="flex-row">
                    <div class="m-width" @click="handleClick('community')">
                      Community
                    </div>
                  </li>
                  <li class="flex-row">
                    <div class="m-width" @click="shareTwitter">
                      Share on Twitter
                    </div>
                  </li>
                  <li class="flex-row" v-if="metaAddress && metaAddress === route.params.wallet_address && (parentValue === 'Assigning to provider' || parentValue === 'Waiting for transaction' || parentValue === 'Deploying' || parentValue === 'Running')">
                    <div class="m-width" @click="closeSpace">
                      Close
                    </div>
                  </li>
                </ul>
              </template>
            </el-popover>
          </div>
        </div>
      </div>

      <div :class="{'details-cont': route.params.tabs === 'app', 'container-landing': route.params.tabs !== 'app', 'details-style': true}">
        <detail-card @handleValue="handleValue" :likesValue="likesValue" :urlChange="activeName" v-if="activeName === 'card'"></detail-card>
        <detail-files @handleValue="handleValue" :likesValue="likesValue" v-else-if="activeName === 'files'"></detail-files>
        <detail-community @handleValue="handleValue" :likesValue="likesValue" v-else-if="activeName === 'community'"></detail-community>
        <detail-setting @handleValue="handleValue" :likesValue="likesValue" :listValue="listValue.data" v-else-if="activeName === 'settings'"></detail-setting>
        <detail-app @handleValue="handleValue" @hardRedeploy="hardRedeploy" :likesValue="likesValue" :urlChange="activeName" :listValue="listValue.data" v-else></detail-app>
      </div>
    </div>

    <el-drawer v-model="drawer" :with-header="false" :direction="direction" :size="'70%'" :destroy-on-close="true" custom-class="drawer_style">
      <template #default>
        <div class="close flex-row" @click="drawer=false">
          <el-icon>
            <CloseBold />
          </el-icon>
        </div>
        <el-tabs v-model="drawerName" @tab-click="drawerClick" class="demo-tabs">
          <el-tab-pane label="Overview" name="Overview" v-if="drawerType === 'detail'">
            <div class="over-view">
              <div class="remain flex-row" v-if="expireTime.time>=0 && allData.space.status !== 'Stopped'">
                <el-icon>
                  <svg t="1691549660950" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4361" width="200" height="200">
                    <path d="M696.301 511.83H514.257V329.784c0-21.845-14.564-36.409-36.41-36.409s-36.408 14.564-36.408 36.409v218.453c0 21.846 14.563 36.41 36.409 36.41H696.3c21.845 0 36.409-14.564 36.409-36.41S718.146 511.83 696.3 511.83z" p-id="4362" fill="#333333"></path>
                    <path d="M514.257 2.105C230.267 2.105 4.532 227.84 4.532 511.829s225.735 509.725 509.725 509.725 509.724-225.735 509.724-509.725S798.246 2.105 514.257 2.105z m0 946.631c-240.3 0-436.907-196.608-436.907-436.907S273.958 74.923 514.257 74.923 951.163 271.53 951.163 511.829 754.555 948.736 514.257 948.736z"
                      p-id="4363" fill="#333333"></path>
                  </svg>
                </el-icon>
                Remaining Time： {{expireTime.time
                < 0.1 ? '&lt; 3': expireTime.time}} {{expireTime.unit}} </div>
                  <div class="remain flex-row" v-if="allData.space.status === 'Running' && allData.space.activeOrder && allData.space.activeOrder.config">
                    <el-icon>
                      <svg t="1691549579889" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3276" width="200" height="200">
                        <path d="M950.856571 1023.999c-7.313993 0-14.627986-3.656996-21.942978-7.313993L757.029761 881.369139H73.143429c-21.942979 0-36.571964-14.627986-36.571965-36.570964V36.570964C36.571464 14.629986 51.20045 0 73.143429 0h877.713142C972.79955 0 987.429536 14.628986 987.429536 36.570964V987.429036c0 14.627986-7.314993 25.599975-21.942979 32.913968-3.656996 3.656996-10.971989 3.656996-14.628986 3.656996zM109.714393 808.228211H767.99975c7.313993 0 14.628986 3.656996 21.942979 7.313993l124.342878 98.742903V73.142929H109.714393v735.085282z"
                          fill="#333333" p-id="3277"></path>
                        <path d="M753.370764 252.342754H248.686257c-21.942979 0-36.571964-14.628986-36.571964-36.571965s14.628986-36.570964 36.571964-36.570964H753.369764c21.942979 0 36.571964 14.628986 36.571965 36.570964s-14.628986 36.571964-36.571965 36.571965z m0 215.770789H248.686257c-21.942979 0-36.571964-14.627986-36.571964-36.570964s14.628986-36.571964 36.571964-36.571965H753.369764c21.942979 0 36.571964 14.628986 36.571965 36.571965s-14.628986 36.570964-36.571965 36.570964z m-153.59985 212.114793H248.686257c-21.942979 0-36.571964-14.628986-36.571964-36.571965s14.628986-36.570964 36.571964-36.570964H599.769914c21.942979 0 36.571964 14.627986 36.571965 36.570964s-14.628986 36.571964-36.571965 36.571965z"
                          fill="#333333" p-id="3278"></path>
                      </svg>
                    </el-icon>
                    Running as {{allData.space.activeOrder.config.description}} </div>
                  <el-row class="logRow" :gutter="30">
                    <el-col :span="24">
                      <el-descriptions title="Space Info:" direction="vertical" :column="bodyWidth" border>
                        <el-descriptions-item label="Visibility">{{allData.space.is_public?'Public':'Private'}}</el-descriptions-item>
                        <el-descriptions-item label="License Type">{{allData.space.license}}</el-descriptions-item>
                        <el-descriptions-item label="SDK Type">{{allData.space.sdk}}</el-descriptions-item>
                        <el-descriptions-item label="Space UUID">
                          <p>
                            {{allData.space.uuid}}
                            <i class="icon icon_copy" @click="system.$commonFun.copyContent(allData.space.uuid, 'Copied')"></i>
                          </p>
                        </el-descriptions-item>
                        <el-descriptions-item label="Last Stop Reason">{{allData.space.last_stop_reason || '-'}}</el-descriptions-item>
                      </el-descriptions>
                    </el-col>
                  </el-row>
                  <el-row class="logRow" :gutter="30" v-if="allData.space.activeOrder&&allData.space.activeOrder.config &&allData.space.status !== 'Stopped'">
                    <el-col :span="24">
                      <el-descriptions title="You're using:" direction="vertical" :column="bodyWidth" border>
                        <el-descriptions-item label="Name">{{allData.space.activeOrder.config.name}}</el-descriptions-item>
                        <el-descriptions-item label="Type">{{allData.space.activeOrder.config.hardware_type}}</el-descriptions-item>
                        <el-descriptions-item label="Memory">{{allData.space.activeOrder.config.memory}}</el-descriptions-item>
                        <el-descriptions-item label="VCPU">{{allData.space.activeOrder.config.vcpu}}</el-descriptions-item>
                        <el-descriptions-item label="Price">{{allData.space.activeOrder.config.price_per_hour}} LAG per hour</el-descriptions-item>
                        <el-descriptions-item label="Description">{{allData.space.activeOrder.config.description}}</el-descriptions-item>
                        <el-descriptions-item label="Expiration Time">{{system.$commonFun.momentFun(allData.space.expiration_time) || '-'}}</el-descriptions-item>
                      </el-descriptions>
                    </el-col>
                  </el-row>
                  <div class="logBody" v-if="allData.task">
                    <json-viewer :value="allData.task" :expand-depth=5 copyable boxed sort></json-viewer>
                  </div>
              </div>
          </el-tab-pane>
          <el-tab-pane v-for="(dataJob, j) in logsContAll.data" v-if="logsContAll.data && drawerType === 'detail'" :key="j" :name="j.toString()">
            <template #label>
              <span class="custom-tabs-label font-14 flex-row">
                <span :class="{'span-cp': allData.task && allData.task.leading_job_id === dataJob.job.uuid}">CP {{j+1}}</span>
              </span>
            </template>
            <div class="over-view">
              <el-row class="logRow" :gutter="30" v-if="allData.space.activeOrder&&allData.space.activeOrder.config">
                <el-col :span="24">
                  <el-alert v-if="!dataJob.job.job_result_uri" :closable="false" title="Result Uri is Null, this result is not available." type="warning" />
                  <el-descriptions title="CP Status:" direction="vertical" :column="bodyWidth" border>
                    <el-descriptions-item label="CP Node ID">
                      <p v-if="dataJob.job.bidder_id">
                        {{system.$commonFun.hiddAddress(dataJob.job.bidder_id)}}
                        <i class="icon icon_copy" @click="system.$commonFun.copyContent(dataJob.job.bidder_id, 'Copied')"></i>
                      </p>
                      <p v-else>Waiting for CP finish deployment</p>
                    </el-descriptions-item>
                    <el-descriptions-item label="Provider status" v-if="dataJob.job.provider_status">
                      {{dataJob.job.provider_status.status}}, {{dataJob.job.provider_status.online ? 'Online' : 'Offline'}}
                    </el-descriptions-item>
                    <el-descriptions-item label="Name" v-if="dataJob.job.provider_status">
                      {{dataJob.job.provider_status.name}}
                    </el-descriptions-item>
                    <el-descriptions-item label="Score" v-if="dataJob.job.provider_status">
                      {{dataJob.job.provider_status.score}}
                    </el-descriptions-item>
                    <el-descriptions-item label="Multi address" v-if="dataJob.job.provider_status">
                      {{dataJob.job.provider_status.multi_address}}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-col>
              </el-row>
              <div class="logBody">
                <json-viewer :value="dataJob.job" :expand-depth=6 copyable boxed sort></json-viewer>
              </div>

              <!-- <div :class="{'logs_style flex-row': true, 'is-disabled': parentValue === 'Created' || parentValue === 'Stopped' }">
                <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                  <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
                </svg> Logs
              </div>
              <div class="logBody" v-if="!(parentValue.value === 'Created' || parentValue.value === 'Stopped')">
                <h4>build</h4>
                <el-card class="box-card mianscroll">
                  <p v-for="build in dataJob.buildLog" :key="build">{{build}}</p>
                </el-card>
                <h4>container</h4>
                <el-card class="box-card mianscroll">
                  <p v-for="container in dataJob.containerLog" :key="container">{{container}}</p>
                </el-card>
              </div>
              <b v-else>Nothing To Show</b> -->
            </div>
          </el-tab-pane>
          <el-tab-pane v-for="(dataJob, j) in logsCont.data" v-if="logsCont.data && drawerType === 'log'" :key="j" :name="j.toString()">
            <template #label>
              <span class="custom-tabs-label font-14 flex-row">
                <span :class="{'span-cp':  allData.task && allData.task.leading_job_id === dataJob.job.uuid}">CP {{j+1}}</span>
              </span>
            </template>
            <div class="log-all">
              <div class="flex-row log-title">
                <div class="flex-row">
                  <div class="flex-row log">
                    <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="16px" height="16px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                      <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
                    </svg>
                    <p class="text-base font-semibold">Logs</p>
                  </div>
                  <h4 class="font-16 weight-6" :class="{'is-active': logsType === 'build'}" @click="logsMethod(1, 'build', j)">build</h4>
                  <h4 class="font-16 weight-6" :class="{'is-active': logsType !== 'build'}" @click="logsMethod(2, 'container', j)">container</h4>
                </div>
                <div class="flex-row clear">
                  <div class="close-btn flex-row">
                    <el-checkbox v-model="checkedLock" label="Lock scroll" size="small" />
                  </div>
                  <div class="close-btn flex-row" @click="clearWebsocket(j)">
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
                </div>
              </div>
              <div class="box-card mianscroll font-14" v-show="logsType === 'build'">
                <!-- <div class="mian"> -->
                <p v-for="build in dataJob.buildLog" :key="build">{{build}}</p>
                <!-- </div>
                <el-backtop :right="20" :bottom="50" /> -->
              </div>
              <el-card class="box-card mianscroll-container font-14" v-show="logsType !== 'build'">
                <p v-for="container in dataJob.containerLog" :key="container">{{container}}</p>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Build" name="Build" v-if="false">
            <div class="uploadBody">
              <div class="top_title flex-row">
                <div class="left flex-row">
                  <i class="icon"></i>
                  Computing provider
                </div>
              </div>
              <ul>
                <li v-for="n in 20" :key="n" class="flex-row">
                  <div class="type">name</div>
                  <div>= db.Column(db.String)</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogCont.spaceHardFork" title="" :width="diagWidth" :show-close="true" :close-on-click-modal="false">
      <space-hardware v-if="dialogCont.spaceHardFork" @handleHard="handleHard" :listdata="allData.space" :renewButton="renewButton"></space-hardware>
    </el-dialog>
    <space-hardware v-if="dialogCont.spaceHardRenew" @handleHard="handleHard" :listdata="allData.space" :renewButton="renewButton"></space-hardware>
    <network-change v-if="networkC" :networkC="networkC" :netEnv="netEnv" @netChange="netChange"></network-change>
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
import networkChange from '@/components/networkChange'
import { defineComponent, computed, onMounted, onActivated, onBeforeUnmount, watch, ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import JsonViewer from 'vue-json-viewer'
import {
  Setting, ArrowLeft, WarningFilled, CloseBold, Close, Timer, ArrowUp
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
    networkChange,
    JsonViewer,
    Setting, sharePop, ArrowLeft, WarningFilled, CloseBold, Close, Timer, ArrowUp
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
    const bodyWidth = ref(document.body.clientWidth > 600 ? 7 : 1)
    const diagWidth = ref(document.body.clientWidth > 1536 ? '1536px' : '90%')
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const activeName = ref('app')
    const settingOneself = ref(false)
    const forkLoad = ref(false)
    const parentValue = ref('')
    const likeValue = ref(0)
    const likeOwner = ref(false)
    const likesValue = ref(false)
    const drawer = ref(false)
    const drawerName = ref('Overview')
    const drawerType = ref('detail')
    const direction = ref('btt')
    const expireTime = reactive({
      time: NaN,
      unit: 'day'    })
    const logsCont = reactive({
      data: [],
      dataLog: []
    })
    const logsContAll = reactive({
      data: [],
      dataLog: []
    })
    const nft = reactive({
      contract_address: null,
      chain_id: null
    })
    const nftTokens = ref([])
    const noteShow = ref(true)
    const allData = reactive({
      space: {},
      job: null,
      files: [],
      task: {},
      paymentStatus: 'Created'
    })
    const dialogCont = reactive({
      spaceHardFork: false,
      spaceHardRenew: false,
      spaceHardDia: false
    })
    const renewButton = ref('renew')
    const logsType = ref('build')
    const checkedLock = ref(false)
    const listValue = reactive({
      data: {}
    })
    const networkC = ref(false)
    const netEnv = ref([])
    const visible = ref(false)

    function handleClick (tab, event) {
      visible.value = false
      const nameTab = tab.props ?.name || tab
      if (nameTab === 'community') activeName.value = 'community'
      router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: nameTab } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    async function jobList (list) {
      let arr = list || []
      for (let j = 0; j < arr.length; j++) {
        try {
          const response = await fetch(arr[j].job_source_uri)
          const textUri = await new Promise(async resolve => {
            resolve(response.text())
          })
          arr[j].job_textUri = textUri ? JSON.parse(textUri).data : {}
        } catch (err) {
          console.log('err space detail job:', err)
          arr[j].job_textUri = {}
        }
      }
      return arr
    }
    async function jobWSList (list, space, type) {
      let logArr = []
      let arr = list || []
      if (arr.length > 0) {
        for (let j = 0; j < arr.length; j++) {
          if (type === 'log') {
            let spaceCont = space || {}
            if ((space.status && space.status.toLowerCase() === "running") && (arr[j].status && arr[j].status.toLowerCase() !== "running")) { }
            else logArr.push({
              job: arr[j],
              space: spaceCont,
              buildLog: [],
              containerLog: [],
              ws: null
            })
          } else if (arr[j] && arr[j].status && arr[j].status.toLowerCase() !== "failed") {
            let spaceCont = space || {}
            logArr.push({
              job: arr[j],
              space: spaceCont,
              buildLog: [],
              containerLog: [],
              ws: null
            })
          }
        }
      }
      //  else if (space && space.jobs_status && space.jobs_status.length > 0) {
      //   for (let j = 0; j < space.jobs_status.length; j++) {
      //     logArr.push({
      //       job: {},
      //       space: space,
      //       buildLog: [],
      //       containerLog: []
      //     })
      //   }
      // }
      return logArr
    }
    const hardRedeploy = (dialog) => {
      if (dialog) hardwareOperate('setting')
    }
    async function requestDetail () {
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      try {
        const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}?requester=${store.state.metaAddress}`, 'get')
        if (listRes && listRes.status === 'success') {
          listValue.data = listRes || {}
          allData.space = listRes.data.space
          allData.task = listRes.data.task
          parentValue.value = numRe.test(listRes.data.space.status) ? '' : listRes.data.space.status
          likeValue.value = listRes.data.space.likes || 0
          const expireTimeCont = await system.$commonFun.expireTimeFun(listRes.data.space.expiration_time)
          expireTime.time = expireTimeCont.time
          expireTime.unit = expireTimeCont.unit
          logsCont.data = await jobWSList(listRes.data.job, listRes.data.space, 'log')
          logsContAll.data = await jobWSList(listRes.data.job, listRes.data.space, 'detail')
        } else if (listRes.message) system.$commonFun.messageTip(listRes.status, listRes.message)
      } catch{ forkLoad.value = false }
    }
    async function requestNft () {
      try {
        const listNftRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/nft`, 'get')
        if (listNftRes && listNftRes.status === 'success' && listNftRes.data) {
          nft.contract_address = listNftRes.data.contract_address
          nft.chain_id = listNftRes.data.chain_id
          nftTokens.value = listNftRes.data.tokens || []
        }
      } catch{ }
    }
    async function requestFiles () {
      // const listFilesRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/files`, 'get')
      // if (listFilesRes && listFilesRes.status === 'success') allData.files = listFilesRes.data || []
      forkLoad.value = false
    }
    async function requestAll (type) {
      switch (type) {
        case 'files':
          requestFiles()
          break
        case 'setting':
          requestDetail()
          requestNft()
          break
        case 'delete':
          break
        default:
          requestDetail()
          requestFiles()
          requestNft()
          break
      }
    }
    const handleValue = async (dataRes, type) => {
      if (type) requestAll(type)
    }
    const hardwareOperate = async (type) => {
      visible.value = false
      if (type === 'renew') dialogCont.spaceHardRenew = true
      else dialogCont.spaceHardFork = true
      renewButton.value = type
      dialogCont.spaceHardDia = true
    }
    function init () {
      activeName.value = route.params.tabs || 'app'
      forkLoad.value = false
      noteShow.value = true
      parentValue.value = ''
      expireTime.time = NaN
      logsCont.data = []
      logsContAll.data = []
      window.scrollTo(0, 0)
      settingOneself.value = accessSpace.value.some(ele => ele === route.params.name)
      requestAll()
      if (metaAddress.value) likesData()
      else if (activeName.value === 'settings') router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: 'app' } })
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
              else if (index === 1) logsCont.data[n].buildLog.push(event.data)
              else if (index === 2) logsCont.data[n].containerLog.push(event.data)
              nextTick(() => {
                let scrollEl = document.querySelectorAll('.mianscroll')
                let scrollContainerEl = document.querySelectorAll('.mianscroll-container')
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
            if (index === 1) logsCont.data[n].buildLog = ["Websocket connection error"]
            else if (index === 2) logsCont.data[n].containerLog = ["Websocket connection error"]
          }
          ws.onclose = () => {
            console.log("ws connection closed")
          }
        } catch (err) {
          if (index === 1) logsCont.data[n].buildLog = [{ err }]
          else if (index === 2) logsCont.data[n].containerLog = [{ err }]
        }
      }
    }
    function back () {
      router.push({ path: '/spaces' })
    }
    async function rebootFun () {
      forkLoad.value = true
      try {
        const rebootRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/redeploy`, 'post')
        if (rebootRes && rebootRes.status === 'success') {
          await system.$commonFun.timeout(500)
          window.location.reload()
        } else if (rebootRes.message) system.$commonFun.messageTip('error', rebootRes.message)
        forkLoad.value = false
      } catch{ forkLoad.value = false }
    }
    async function reqNFT () {
      if (!nft.contract_address || nftTokens.value.length === 0) return
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      if (getID.toString() !== nft.chain_id) {
        const { name } = await system.$commonFun.getUnit(Number(nft.chain_id))
        await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
        return
      }
      visible.value = false
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
      try {
        if (likeOwner.value) {
          const unlikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/unlike`, 'post', {})
        } else {
          const likeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/like`, 'post', {})
        }
      } catch{ }
      likesValue.value = !likesValue.value
      requestAll()
      likesData()
    }
    const likesData = async () => {
      forkLoad.value = true
      try {
        const getLikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/like`, 'get')
        if (getLikeRes) likeOwner.value = getLikeRes.data.liked
      } catch{ }
      forkLoad.value = false
    }
    async function logsMethod (type, name, index) {
      logsType.value = name
      await websocketclose()
      if (type === 1) {
        logsCont.data[index].buildLog = []
        await WebSocketFun(logsCont.data[index].job.build_log, 1, index)
      } else {
        logsCont.data[index].containerLog = []
        await WebSocketFun(logsCont.data[index].job.container_log, 2, index)
      }
    }
    const drawerClick = async (tab, event) => {
      checkedLock.value = false
      await websocketclose()
      if (drawerName.value === 'Overview') return
      let n = Number(drawerName.value)
      logsCont.data[n].buildLog = []
      logsCont.data[n].containerLog = []
      logsType.value = 'build'
      // 请求logsCont.data[n].space.result_uri地址，获取其中的build_log和container_log
      if (logsCont.data[n].job) {
        if (logsCont.data[n].job.build_log) await WebSocketFun(logsCont.data[n].job.build_log, 1, n)
        if (logsCont.data[n].job.container_log && drawerName.value !== 'log') await WebSocketFun(logsCont.data[n].job.container_log, 2, n)
      } else if (logsCont.data[n].space.jobs_status) {
        await WebSocketFun(logsCont.data[n].space.jobs_status[n].build_log, 1, n)
        if (drawerName.value !== 'log') await WebSocketFun(logsCont.data[n].space.jobs_status[n].container_log, 2, n)
      } else {
        logsCont.data[n].buildLog = []
        logsCont.data[n].containerLog = []
      }
    }
    function clearWebsocket (index) {
      if (logsType.value === 'build') logsCont.data[index].buildLog = []
      else logsCont.data[index].containerLog = []
    }
    function upWebsocket () {
      const name = logsType.value === 'build' ? 'mianscroll' : 'mianscroll-container'
      nextTick(() => {
        checkedLock.value = true
        let scrollEl = document.querySelectorAll('.' + name)
        scrollEl.forEach(async el => {
          el.scrollTo({ top: 0, behavior: 'instant' })
        })
      })
    }
    function handleHard (val, refresh, net) {
      if (net) {
        netEnv.value = [{
          name: 'OpSwan',
          id: 8598668088
        },
        {
          name: 'Mumbai Testnet',
          id: 80001
        }]
        networkC.value = true
      } else {
        dialogCont.spaceHardDia = val
        dialogCont.spaceHardRenew = val
        dialogCont.spaceHardFork = val
        if (refresh) {
          requestAll()
          likesValue.value = !likesValue.value
        }
      }
    }

    async function netChange (dialog, rows) {
      networkC.value = dialog
      if (rows) system.$commonFun.walletChain(Number(rows))
    }

    function logDrawer (type) {
      if (type === 'log' && (parentValue.value === 'Created' || parentValue.value === 'Stopped')) return
      visible.value = false
      drawerType.value = type
      drawer.value = true
      drawerName.value = type === 'detail' ? 'Overview' : '0'
      if (type === 'log' && logsCont.data && logsCont.data.length > 0) drawerClick()
    }

    function shareTwitter () {
      visible.value = false
      let typeName = 'Space'
      let type = 'space'
      let urlType = `spaces`
      switch (route.name) {
        case 'spaceDetail':
          typeName = 'Space'
          type = 'space'
          urlType = `spaces`
          break;
        case 'modelsDetail':
          typeName = 'Model'
          type = 'model'
          urlType = `models`
          break;
        case 'datasetDetail':
          typeName = 'Dataset'
          type = 'dataset'
          urlType = `datasets`
          break;
      }
      const text =
        `Try out this ${type} on the Lagrange platform! ` +
        '\n\n' +
        `${typeName} Name: ${route.params.name} ` +
        '\n' +
        `${typeName} Link: ${process.env.VUE_APP_DOMAINLINK}/${urlType}/${route.params.wallet_address}/${route.params.name}/card` +
        '\n\n' +
        `#LagrangeDAO #DecentralizedComputing #Web3GitHub`
      system.$commonFun.popupwindow(text);
    }

    async function closeSpace () {
      visible.value = false
      forkLoad.value = true
      try {
        const closeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${allData.space.uuid}/deployment`, 'delete')
        if (closeRes && closeRes.status === 'success') {
          system.$commonFun.messageTip('success', 'The space has be closed')
          await requestDetail()
        } else if (closeRes && closeRes.status === 'failed' && closeRes.message) system.$commonFun.messageTip('error', closeRes.message)
      } catch{ }
      forkLoad.value = false
    }

    onMounted(() => system.$commonFun.gatewayGain())
    onActivated(() => init())
    onBeforeUnmount(() => {
      websocketclose()
    })
    watch(drawer, (newValue, oldValue) => {
      if (!drawer.value) websocketclose()
    })
    watch(route, (to, from) => {
      if (to.name !== 'spaceDetail') return
      if (!metaAddress.value && to.params.tabs === 'settings') activeName.value = 'app'
      requestDetail()
      if (to.params.tabs === 'card') {
        window.scrollTo(0, 0)
        // init()
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
      diagWidth,
      system,
      route,
      router,
      settingOneself,
      forkLoad,
      nft,
      nftTokens,
      noteShow,
      allData,
      drawerName,
      drawerType,
      dialogCont,
      renewButton,
      logsType,
      checkedLock,
      listValue, networkC, netEnv, visible,
      parentValue, likeOwner, likeValue, likesValue, drawer, direction, expireTime, logsCont, logsContAll, handleValue, hardRedeploy,
      handleCurrentChange, handleSizeChange, handleClick, shareTwitter, closeSpace, logsMethod, clearWebsocket, upWebsocket,
      hardwareOperate, back, rebootFun, reqNFT, likeMethod, drawerClick, handleHard, logDrawer, netChange
    }
  }
})
</script>

<style lang="scss" scoped>
// @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,600;1,700&display=swap");
.space-height {
  min-height: 100vh;
}
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .space_head {
    // padding: 0;
    // background-color: #fbfbfc;
    // border-bottom: 1px solid #f1f1f1;
    border-top: 1px solid rgba(229, 231, 235, 0.7);
    &.space-flex {
      align-items: flex-start;
      flex-wrap: wrap;
      flex-direction: column;
      .details-style,
      .details-cont {
        width: 100%;
      }
      .details-cont {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        section {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
      }
    }
    .content {
      width: 100%;
      align-items: stretch;
      justify-content: space-between;
      flex-wrap: wrap;
      // background-image: linear-gradient(to top, #f9fafb, #fff);
      background: #fff;
      margin: 0 auto;
      font-size: 14px;
      border-bottom: 1px solid rgba(229, 231, 235, 0.7);
      .backTo {
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
        padding: 0.05rem 0;
        font-size: 18px;
        color: #878c93;
        line-height: 1;
        @media screen and (max-width: 992px) {
          flex-wrap: wrap;
        }
        .back-logo {
          font-weight: 600;
          cursor: pointer;
          color: #000;
        }
        b {
          font-family: "FIRACODE-BOLD";
          padding: 0.03rem 0.07rem 0 0;
          color: #000;
        }
        .icon {
          width: 0.2rem;
          height: 0.2rem;
          margin: -1px 0.07rem 0 0;
        }
        .logo_lagrange {
          background: url(../../../assets/images/icons/logo_lagrange.png)
            no-repeat left center;
          background-size: auto 100%;
          cursor: pointer;
        }
        .icon_spaces {
          background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
            left center;
          background-size: auto 100%;
        }
        .icon_copy {
          width: 14px;
          height: 14px;
          background: url(../../../assets/images/icons/icon_36.png) no-repeat
            left center;
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
        .icon_like {
          width: 14px;
          height: 14px;
          margin: 0;
          background: url(../../../assets/images/icons/icon_37.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: inherit;
          @media screen and (min-width: 1800px) {
            width: 16px;
            height: 16px;
          }
          &.unlink {
            background: url(../../../assets/images/icons/icon_37_1.png)
              no-repeat left center;
            background-size: auto 100%;
          }
        }
        .el-button {
          height: 28px;
          padding: 0.05rem 0.1rem;
          margin: 0.1rem 0;
          font-family: inherit;
          font-size: 14px;
          // color: #878c93;
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
            &:hover,
            &:active {
              color: #fff;
            }
          }
          &.is-disabled {
            &:hover {
              color: inherit;
            }
          }
          &.is-disabled {
            color: #e6a23c;
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
          text-transform: capitalize;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            font-size: 12px;
          }
          &.animate-spin-slow {
            padding: 0.05rem 0.1rem;
            svg {
              width: 10px;
              height: 10px;
              margin-right: 0.05rem;
              animation: spin-running 3s linear infinite;
            }
            &::after {
              display: none;
            }
          }
          &.is-status {
            background-color: #ffecf2;
            color: #f56c6c;
            border: 1px solid #f56c6c;
            &::after {
              background-color: #f56c6c;
            }
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
          i {
            font-family: "Helvetica-Bold";
            font-weight: 600;
            text-transform: uppercase;
          }
        }
        .logs_style {
          position: relative;
          padding: 0.05rem 0.05rem;
          margin: 0.1rem 0 0.1rem 0.07rem;
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
          &.popDown {
            svg {
              width: 16px;
              height: 16px;
              margin: 0;
            }
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
      width: 100%;
      padding: 0.03rem 0;
      font-weight: bold;
      @media screen and (max-width: 768px) {
        margin-top: 0.1rem;
      }
      i {
        margin-right: 5px;
      }
    }
    .space-right {
      .logs_style {
        position: relative;
        padding: 0.05rem 0.05rem;
        margin: 0.05rem 0 0;
        background-color: linear-gradient(to bottom, #fff, #f3f4f6);
        color: #878c93;
        border: 1px solid rgba(229, 231, 235, 1);
        border-radius: 0.05rem;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
        &:hover {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        }
      }
    }
    :deep(.demo-tabs) {
      display: block;
      flex-wrap: wrap;
      height: 100%;
      margin: 0;
      @media screen and (max-width: 1260px) {
        width: 100%;
      }
      .el-tabs__header {
        display: flex;
        align-items: stretch;
        height: 100%;
        min-height: 35px;
        margin: 0 auto;
        font-size: 14px;
        .el-tabs__nav-scroll,
        .el-tabs__nav {
          height: 100%;
        }
      }
      .el-tabs__content {
        border-top: 1px solid #f1f1f1;
        overflow: visible;
      }
      .el-tabs__item {
        height: 100%;
        padding: 0;
        line-height: 1;
        font-family: "Helvetica-light";
        font-size: 16px;
        @media screen and (max-width: 1600px) {
          font-size: 15px;
        }
        @media screen and (max-width: 441px) {
          font-size: 14px;
        }
        .custom-tabs-label {
          height: 100%;
          padding: 0 0.15rem;
          &.font-14 {
            font-size: 14px;
          }
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
            height: 1px;
            // background-color: #000;
          }
        }
        &:hover {
          color: #7405ff;
        }
      }
      .el-tabs__active-bar {
        // display: none;
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
    z-index: 2000;
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
          font-size: 0.15rem;
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
  :deep(.net_body) {
    width: 570px;
    margin: auto;
    border-radius: 0.23rem;
    text-align: left;
    color: #000;
    word-break: break-word;
    @media screen and (max-width: 600px) {
      width: 94%;
    }
    .el-dialog__header {
      padding: 0.25rem 0.6rem 0.1rem;
      font-size: 0.2rem;
      .el-dialog__headerbtn {
        right: 0.3rem;
        top: 0.28rem;
        font-size: 0.2rem;
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
      padding: 0 0 0.15rem;
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
<style lang="scss">
.drawer_style {
  background-color: #fafafa;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  &.app {
    .el-drawer__body {
      overflow: hidden;
    }
  }
  .close {
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
  .close-btn {
    padding: 5px;
    border: 1px solid rgb(229, 231, 235);
    border-radius: 6px;
    cursor: pointer;
    line-height: 1.2;
    &:hover {
      background-color: rgba(229, 231, 235, 0.2);
    }
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
        min-height: 45px;
        margin: 0;
        background-color: #fff;
        .el-tabs__nav-wrap {
          height: 100%;
          padding: 0 4%;
          @media screen and (max-width: 768px) {
            padding: 0 2%;
          }
        }
      }
      .el-tabs__content {
        width: 100%;
        height: calc(100% - 0.4rem - 18px);
        padding: 0;
        background: transparent;
        // .el-tab-pane {
        //   height: 100%;
        // }
        .el-tab-pane {
          height: 100%;
        }
        .over-view {
          height: calc(100% - 0.4rem);
          padding: 0.2rem 4%;
          overflow-y: scroll;
          @media screen and (max-width: 768px) {
            padding: 0.2rem 2%;
          }
        }
        .el-steps {
          margin: 0.1rem 0 0.2rem;
          box-shadow: 0 0 9px rgba(0, 0, 0, 0.1);
          @media screen and (max-width: 600px) {
            flex-wrap: wrap;
          }
          .el-step {
            flex-basis: 50%;
            text-transform: capitalize;
            @media screen and (max-width: 600px) {
              flex-basis: 100%;
              margin: 0.1rem 0;
            }
            * {
              word-break: break-word;
            }
            .copy {
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
          .el-step.is-simple:not(:last-of-type) .el-step__title {
            max-width: 70%;
          }
        }
        .remain {
          width: 100%;
          padding: 0.03rem 0;
          font-weight: bold;
          @media screen and (max-width: 768px) {
            margin-top: 0.1rem;
          }
          i {
            margin-right: 5px;
          }
        }
        .logs_style {
          position: relative;
          padding: 0;
          margin: 0.16rem 0;
          color: #303133;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
          &.is-disabled {
            opacity: 0.5;
            cursor: no-drop;
          }
          svg {
            width: 20px;
            height: 20px;
            margin-right: 0.05rem;
            @media screen and (max-width: 1600px) {
              width: 19px;
              height: 19px;
            }
            @media screen and (max-width: 441px) {
              width: 18px;
              height: 18px;
            }
          }
        }
        .logRow {
          margin: 0.2rem 0;
          .el-col {
            word-break: break-word;
            p {
              display: flex;
              align-items: center;
              .icon {
                width: 0.23rem;
                height: 0.23rem;
                margin: -1px 0 0 0.07rem;
              }
              .icon_copy {
                width: 16px;
                height: 16px;
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
            .el-alert {
              margin: 0 0 0.3rem;
            }
          }
        }
        .log-all {
          height: 100%;
          padding: 20px 0 20px 4%;
          margin: 0;
          @media screen and (max-width: 768px) {
            padding: 20px 0 20px 2%;
          }
          .log-title {
            justify-content: space-between;
            padding: 0 4% 0 0;
            @media screen and (max-width: 768px) {
              padding: 0 2% 0 0;
            }
            .log {
              p {
                margin: 0 32px 0 6px;
                font-size: 15px;
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
            font-family: IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo,
              Monaco, Consolas, Liberation Mono, Courier New, monospace;
            white-space: nowrap;
            overflow-y: auto;
            box-shadow: none;
            border: 0;
            padding: 0;
            .el-card__body {
              padding: 0;
            }
          }
        }
        .titleLog {
          margin: 0.2rem 0 0;
          font-size: 16px;
          font-weight: 600;
        }
        .titleLog + .logBody {
          margin-top: 0.2rem;
        }
        .logBody {
          width: calc(100% - 30px);
          padding: 15px;
          margin: 0;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 9px rgba(0, 0, 0, 0.1);
          h4 {
            margin: 0.1rem 0;
            text-transform: capitalize;
          }
          .box-card {
            max-height: 300px;
            margin: 0.1rem 0;
            white-space: nowrap;
            color: #525252;
            font-size: 14px;
            overflow-y: auto;
          }
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
        padding: 0.2rem 0;
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
        .custom-tabs-label {
          line-height: 1;
          &.font-14 {
            font-size: 14px;
          }
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
              no-repeat left center;
            background-size: 13px;
          }
        }
        &.is-active {
          color: #000;
        }
        &:hover {
          color: #c37af9;
        }
      }
    }
    .drawer-header {
      height: 40px;
      padding: 0 20px;
      line-height: 40px;
    }
    .log_app {
      height: calc(100% - 10px);
      padding: 0;
      margin: 10px 0 0;
      .logBody {
        h4 {
          margin: 0.1rem 0;
          text-transform: capitalize;
        }
        .log-title {
          justify-content: space-between;
          padding: 0 20px;
          .log {
            p {
              margin: 0 32px 0 6px;
              font-size: 15px;
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
        .box-card {
          max-height: calc(100% - 60px);
          margin: 20px 0 0;
          background: transparent;
          font-family: IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo,
            Monaco, Consolas, Liberation Mono, Courier New, monospace;
          font-size: 14px;
          color: #525252;
          // white-space: nowrap;
          border: 0;
          overflow-y: auto;
          box-shadow: none;
          .el-card__body {
            padding: 0 20px;
          }
          p {
            word-break: break-word;
          }
        }
      }
    }
  }
}
</style>

