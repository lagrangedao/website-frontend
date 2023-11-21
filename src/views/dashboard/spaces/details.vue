<template>
  <section id="space" v-loading="forkLoad" element-loading-text="Please wait...">
    <div class="space_head container-landing">
      <div class="content flex-row">
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
          <!-- <i class="icon icon_copy" @click="system.$commonFun.copyContent(route.params.name, 'Copied')"></i> -->
          <el-button-group class="ml-4">
            <el-button @click="likeMethod" v-if="likeOwner">
              <i class="icon icon_like"></i>
            </el-button>
            <el-button @click="likeMethod" v-else :disabled="metaAddress?false:true">
              <i class="icon icon_like unlink"></i>
            </el-button>
            <el-button disabled>{{likeValue}}</el-button>
          </el-button-group>
          <div class="status" v-if="parentValue">{{parentValue}}</div>
          <el-button-group class="ml-4" v-if="metaAddress && metaAddress === route.params.wallet_address && ((expireTime.time <=5&&expireTime.unit!=='hours') ||(expireTime.time <=24&&expireTime.unit==='hours'))">
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
          <div :class="{'logs_style flex-row': true, 'is-disabled': !nft.contract_address || nftTokens.length === 0 }" @click="reqNFT" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg t="1687225756039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2674" width="200" height="200">
              <path d="M256 128c-70.58 0-128 57.42-128 128 0 47.274 25.78 88.614 64 110.782l0 354.438C153.78 743.386 128 784.726 128 832c0 70.58 57.42 128 128 128s128-57.42 128-128c0-47.274-25.78-88.614-64-110.782L320 366.782c38.22-22.168 64-63.508 64-110.782C384 185.42 326.58 128 256 128zM256 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 896 256 896zM256 320c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S291.346 320 256 320z"
                p-id="2675" fill="#878c93"></path>
              <path d="M830 720.068 830 409.978c0-67.974-20.98-122.004-62.36-160.588-44.222-41.236-108.628-60.776-191.64-58.212L576 64l-192 192 192 192 0-128c53 0 85.34 5.284 104.35 23.008 14.366 13.396 21.65 35.928 21.65 66.97l0 312.392c-37.124 22.434-62 63.178-62 109.628 0 70.58 57.42 128 128 128s128-57.42 128-128C896 783.902 869.324 741.938 830 720.068zM768 896c-35.346 0-64-28.654-64-64s28.654-64 64-64 64 28.654 64 64S803.346 896 768 896z"
                p-id="2676" fill="#878c93"></path>
            </svg> Request License
          </div>
          <div class="logs_style flex-row" @click="hardwareOperate('fork')" v-if="metaAddress && metaAddress !== route.params.wallet_address">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg> Fork
          </div>

          <div class="logs_style popDown flex-row">
            <el-popover :width="190" trigger="click" popper-class="popper_style">
              <template #reference>
                <div class="share_style flex-row">
                  <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
                  </svg>
                </div>
              </template>
              <template #default>
                <ul class="demo-rich-conent">
                  <li class="flex-row" v-if="metaAddress && metaAddress === route.params.wallet_address && ((expireTime.time <=5&&expireTime.unit!=='hours') ||(expireTime.time <=24&&expireTime.unit==='hours'))">
                    <div class="m-width" @click="hardwareOperate('renew')">Renew</div>
                  </li>
                  <li class="flex-row">
                    <div class="m-width" @click="logDrawer('detail')">
                      Space Detail
                    </div>
                  </li>
                  <li class="flex-row">
                    <share-pop></share-pop>
                  </li>
                </ul>
              </template>
            </el-popover>
          </div>
        </div>

        <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
          <el-tab-pane name="app">
            <template #label>
              <span class="custom-tabs-label flex-row">
                <i class="icon icon_spaces"></i>
                <span>App</span>
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
          <el-tab-pane name="card">
            <template #label>
              <span class="custom-tabs-label flex-row">
                <i class="icon icon_spaces"></i>
                <span>Space card</span>
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane name="community">
            <template #label>
              <span class="custom-tabs-label flex-row">
                <i class="icon"></i>
                <span>Community</span>
                <!-- <b>3</b> -->
              </span>
            </template>
          </el-tab-pane>
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
      </div>

      <detail-card @handleValue="handleValue" :likesValue="likesValue" :urlChange="activeName" v-if="activeName === 'card'"></detail-card>
      <detail-files @handleValue="handleValue" :likesValue="likesValue" v-else-if="activeName === 'files'"></detail-files>
      <detail-community @handleValue="handleValue" :likesValue="likesValue" v-else-if="activeName === 'community'"></detail-community>
      <detail-setting @handleValue="handleValue" :likesValue="likesValue" v-else-if="activeName === 'settings'"></detail-setting>
      <detail-app @handleValue="handleValue" @hardRedeploy="hardRedeploy" :likesValue="likesValue" :urlChange="activeName" v-else></detail-app>
    </div>

    <el-drawer v-model="drawer" :with-header="false" :direction="direction" :size="'70% '" :destroy-on-close="true" custom-class="drawer_style">
      <template #default>
        <div class="close flex-row" @click="drawer=false">
          <el-icon>
            <CloseBold />
          </el-icon>
        </div>
        <el-tabs v-model="drawerName" @tab-click="drawerClick" class="demo-tabs" v-if="drawerType === 'detail'">
          <el-tab-pane label="Overview" name="Overview">
            <div class="el-steps el-steps--simple">
              <div class="el-step is-simple is-flex">
                <div class="el-step__head" :class="{'is-success': allData.files.length>0, 'is-wait':allData.files.length === 0}">
                  <div class="el-step__icon is-text">
                    <i v-if="allData.files.length>0" class="el-icon el-step__icon-inner is-status">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div class="el-step__main">
                  <div class="el-step__title" :class="{'is-success': allData.files.length>0, 'is-wait':allData.files.length === 0}">Update Files</div>
                  <div class="el-step__arrow"></div>
                </div>
              </div>
              <div class="el-step is-simple is-flex">
                <div class="el-step__head" :class="{'is-success': allData.space.status !== allData.paymentStatus, 'is-wait':allData.space.status === allData.paymentStatus}">
                  <div class="el-step__icon is-text">
                    <i v-if="allData.space.status !== allData.paymentStatus" class="el-icon el-step__icon-inner is-status">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div class="el-step__main">
                  <div class="el-step__title" :class="{'is-success': allData.space.status !== allData.paymentStatus, 'is-wait':allData.space.status === allData.paymentStatus}">Waiting for transaction complete</div>
                  <div class="el-step__arrow"></div>
                </div>
              </div>
              <div class="el-step is-simple is-flex">
                <div class="el-step__head" :class="{'is-success': allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction', 'is-wait':!(allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction')}">
                  <div class="el-step__icon is-text">
                    <i v-if="allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction'" class="el-icon el-step__icon-inner is-status">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div class="el-step__main">
                  <div class="el-step__title" :class="{'is-success': allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction', 'is-wait':!(allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction')}">Assigning to provider Complete</div>
                  <div class="el-step__arrow"></div>
                </div>
              </div>
              <div class="el-step is-simple is-flex">
                <div class="el-step__head" :class="{'is-success': allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction' && allData.space.status !== 'Assigning to provider', 'is-wait':!(allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction' && allData.space.status !== 'Assigning to provider')}">
                  <div class="el-step__icon is-text">
                    <i v-if="allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction' && allData.space.status !== 'Assigning to provider'" class="el-icon el-step__icon-inner is-status">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div class="el-step__main">
                  <div class="el-step__title" :class="{'is-success':allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction' && allData.space.status !== 'Assigning to provider', 'is-wait':!(allData.space.status !== allData.paymentStatus && allData.space.status !== 'Waiting for transaction' && allData.space.status !== 'Assigning to provider')}">Deploying Complete</div>
                  <div class="el-step__arrow"></div>
                </div>
              </div>
              <div class="el-step is-simple is-flex">
                <div class="el-step__head" :class="{'is-success': allData.space.status === 'Running', 'is-wait':allData.space.status !== 'Running'}">
                  <div class="el-step__icon is-text">
                    <i v-if="allData.space.status === 'Running'" class="el-icon el-step__icon-inner is-status">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div class="el-step__main">
                  <div class="el-step__title" :class="{'is-success': allData.space.status === 'Running', 'is-wait':allData.space.status !== 'Running'}">running space</div>
                  <div class="el-step__arrow"></div>
                </div>
              </div>
            </div>
            <div class="remain flex-row" v-if="expireTime.time>=0">
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
                <el-row class="logRow" :gutter="30" v-if="allData.space.activeOrder&&allData.space.activeOrder.config">
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
          </el-tab-pane>
          <el-tab-pane v-for="(dataJob, j) in logsCont.data" v-if="logsCont.data" :key="j" :name="j.toString()">
            <template #label>
              <span class="custom-tabs-label flex-row">
                <span :class="{'span-cp': dataJob.job.is_leading_job.toString() === 'true'}">CP {{j+1}}</span>
              </span>
            </template>
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
                  <el-descriptions-item label="Provider status">
                    {{dataJob.job.provider_status.status}}, {{dataJob.job.provider_status.online ? 'Online' : 'Offline'}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Name">
                    {{dataJob.job.provider_status.name}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Score">
                    {{dataJob.job.provider_status.score}}
                  </el-descriptions-item>
                  <el-descriptions-item label="Multi address">
                    {{dataJob.job.provider_status.multi_address}}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
            <div class="logBody">
              <json-viewer :value="dataJob.job" :expand-depth=6 copyable boxed sort></json-viewer>
            </div>

            <div :class="{'logs_style flex-row': true, 'is-disabled': parentValue === 'Created' || parentValue === 'Stopped' }">
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
            <b v-else>Nothing To Show</b>
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

    <div class="note" v-if="noteShow && !forkLoad && !dialogCont.spaceHardDia && !(allData.files.length>0 && allData.space.status !== allData.paymentStatus)">
      <div class="close flex-row" @click="noteShow=false">
        <el-icon>
          <Close />
        </el-icon>
      </div>
      <div class="box">
        <div class="title">Space 101</div>
        <ul>
          <li :class="{'strikeout': allData.files.length>0}">Upload runnable file</li>
          <li :class="{'strikeout': allData.space.status !== allData.paymentStatus}">Choose the hardware you want</li>
          <li>Done!</li>
        </ul>
      </div>
    </div>

    <el-dialog v-model="dialogCont.spaceHardFork" title="" :width="diagWidth" :show-close="true" :close-on-click-modal="false">
      <space-hardware v-if="dialogCont.spaceHardFork" @handleHard="handleHard" :listdata="allData.space" :renewButton="renewButton"></space-hardware>
    </el-dialog>
    <space-hardware v-if="dialogCont.spaceHardRenew" @handleHard="handleHard" :listdata="allData.space" :renewButton="renewButton"></space-hardware>
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
import { defineComponent, computed, onMounted, onUnmounted, onActivated, onBeforeUnmount, watch, ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import JsonViewer from 'vue-json-viewer'
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
    JsonViewer,
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

    function handleClick (tab, event) {
      router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
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
    async function jobWSList (list, space) {
      let logArr = []
      let arr = list || []
      if (arr.length > 0) {
        for (let j = 0; j < arr.length; j++) {
          let spaceCont = space || {}
          logArr.push({
            job: arr[j],
            space: spaceCont,
            buildLog: [],
            containerLog: []
          })
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
      if (dialog) hardwareOperate('renew')
    }
    async function requestDetail () {
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}?requester=${store.state.metaAddress}`, 'get')
      if (listRes && listRes.status === 'success') {
        allData.space = listRes.data.space
        allData.task = listRes.data.task
        parentValue.value = numRe.test(listRes.data.space.status) ? '' : listRes.data.space.status
        likeValue.value = listRes.data.space.likes || 0
        const expireTimeCont = await system.$commonFun.expireTimeFun(listRes.data.space.expiration_time)
        expireTime.time = expireTimeCont.time
        expireTime.unit = expireTimeCont.unit
        logsCont.data = await jobWSList(listRes.data.job, listRes.data.space)
      } else if (listRes.message) system.$commonFun.messageTip(listRes.status, listRes.message)
    }
    async function requestNft () {
      const listNftRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/nft`, 'get')
      if (listNftRes && listNftRes.status === 'success' && listNftRes.data) {
        nft.contract_address = listNftRes.data.contract_address
        nft.chain_id = listNftRes.data.chain_id
        nftTokens.value = listNftRes.data.tokens || []
      }
    }
    async function requestFiles () {
      const listFilesRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/files`, 'get')
      if (listFilesRes && listFilesRes.status === 'success') allData.files = listFilesRes.data || []
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
                scrollEl.forEach(async el => {
                  await system.$commonFun.timeout(1000)
                  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
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
      const rebootRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/redeploy`, 'post')
      if (rebootRes && rebootRes.status === 'success') {
        await system.$commonFun.timeout(500)
        window.location.reload()
      } else if (rebootRes.message) system.$commonFun.messageTip('error', rebootRes.message)
      forkLoad.value = false
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
      requestAll()
      likesData()
    }
    const likesData = async () => {
      forkLoad.value = true
      const getLikeRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/like`, 'get')
      if (getLikeRes) likeOwner.value = getLikeRes.data.liked
    }
    const drawerClick = async (tab, event) => {
      await websocketclose()
      if (drawerName.value === 'Overview') return
      let n = Number(drawerName.value)
      logsCont.data[n].buildLog = []
      logsCont.data[n].containerLog = []
      // 请求logsCont.data[n].space.result_uri地址，获取其中的build_log和container_log
      if (logsCont.data[n].job.job_result_uri && logsCont.data[n].job.job_result_uri !== 'null') {
        const response = await fetch(logsCont.data[n].job.job_result_uri)
        const textUri = await new Promise(async resolve => {
          resolve(response.text())
        })
        const logUri = textUri ? JSON.parse(textUri) : {}
        if (logUri.build_log) await WebSocketFun(logUri.build_log, 1, n)
        if (logUri.container_log) await WebSocketFun(logUri.container_log, 2, n)
      } else if (logsCont.data[n].space.jobs_status) {
        await WebSocketFun(logsCont.data[n].space.jobs_status[n].build_log, 1, n)
        await WebSocketFun(logsCont.data[n].space.jobs_status[n].container_log, 2, n)
      } else {
        logsCont.data[n].buildLog = []
        logsCont.data[n].containerLog = []
      }
    }
    function handleHard (val, refresh) {
      dialogCont.spaceHardDia = val
      dialogCont.spaceHardRenew = val
      dialogCont.spaceHardFork = val
      if (refresh) {
        requestAll()
        likesValue.value = !likesValue.value
      }
    }
    function logDrawer (type) {
      if (type === 'log' && (parentValue.value === 'Created' || parentValue.value === 'Stopped')) return
      drawerType.value = type
      drawer.value = true
      drawerName.value = type === 'detail' ? 'Overview' : '0'
      if (type === 'log' && logsCont.data && logsCont.data.length > 0) drawerClick()
    }
    onActivated(() => init())
    onBeforeUnmount(() => {
      websocketclose()
    })
    watch(drawer, (newValue, oldValue) => {
      if (!drawer.value) websocketclose()
    })
    watch(route, (to, from) => {
      if (to.name !== 'spaceDetail') return
      if (!metaAddress.value) activeName.value = 'app'
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
      parentValue, likeOwner, likeValue, likesValue, drawer, direction, expireTime, logsCont, handleValue, hardRedeploy,
      handleCurrentChange, handleSizeChange, handleClick,
      hardwareOperate, back, rebootFun, reqNFT, likeMethod, drawerClick, handleHard, logDrawer
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
    // padding: 0;
    // background-color: #fbfbfc;
    // border-bottom: 1px solid #f1f1f1;
    border-top: 1px solid rgba(229, 231, 235, 0.7);
    .content {
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
        font-family: "Helvetica-Bold";
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
    :deep(.demo-tabs) {
      display: block;
      flex-wrap: wrap;
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
}
</style>
<style lang="scss">
.drawer_style {
  background-color: #fafafa;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
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
          padding: 0 4%;
          @media screen and (max-width: 768px) {
            padding: 0 2%;
          }
        }
      }
      .el-tabs__content {
        width: 92%;
        height: calc(100% - 0.8rem - 18px);
        padding: 0.2rem 4%;
        overflow-y: scroll;
        @media screen and (max-width: 768px) {
          width: 96%;
          padding: 0.2rem 2%;
        }
        // .el-tab-pane {
        //   height: 100%;
        // }
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
        .custom-tabs-label {
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
  }
}
</style>

