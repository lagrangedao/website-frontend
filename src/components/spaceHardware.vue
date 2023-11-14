<template>
  <div id="hardware" v-loading="forkLoad">
    <div v-if="props.renewButton !== 'renew'">
      <div class="space-hard" v-if="props.renewButton === 'setting' && props.listdata.activeOrder && props.listdata.activeOrder.config">
        <el-row class="space_hardware" :gutter="30">
          <el-col :span="24">
            <el-descriptions title="You're using:" direction="vertical" :column="6" border>
              <el-descriptions-item label="Name">{{ props.listdata.activeOrder.config.name }}</el-descriptions-item>
              <el-descriptions-item label="Type">{{ props.listdata.activeOrder.config.hardware_type }}
              </el-descriptions-item>
              <el-descriptions-item label="Memory">{{ props.listdata.activeOrder.config.memory }}</el-descriptions-item>
              <el-descriptions-item label="VCPU">{{ props.listdata.activeOrder.config.vcpu }}</el-descriptions-item>
              <el-descriptions-item label="Price">{{ props.listdata.activeOrder.config.price_per_hour }} LAG per hour
              </el-descriptions-item>
              <el-descriptions-item label="Description">{{ props.listdata.activeOrder.config.description }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
      <div :class="{'space-hard':true}">
        <el-row class="space_hardware" :gutter="30">
          <el-col :md="24" :lg="6" class="hardware-left">
            <div class="sleep_style">
              <div class="title_tip flex-row pause_margin">
                <p class="flex-row">
                  Pause Space
                  <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor"></path>
                    <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor"></path>
                    <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor"></path>
                  </svg>
                </p>
                <el-divider/>
                <el-switch disabled v-model="ruleForm.pauseSpace" size="small" />
              </div>
              <p class="p-4">Building something cool as a side project? Apply for a
                <span>
                  <svg class="text-xs mr-1.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path d="M20.6081 3C21.7684 3 22.8053 3.49196 23.5284 4.38415C23.9756 4.93678 24.4428 5.82749 24.4808 7.16133C24.9674 7.01707 25.4353 6.93643 25.8725 6.93643C26.9833 6.93643 27.9865 7.37587 28.696 8.17411C29.6075 9.19872 30.0124 10.4579 29.8361 11.7177C29.7523 12.3177 29.5581 12.8555 29.2678 13.3534C29.8798 13.8646 30.3306 14.5763 30.5485 15.4322C30.719 16.1032 30.8939 17.5006 29.9808 18.9403C30.0389 19.0342 30.0934 19.1319 30.1442 19.2318C30.6932 20.3074 30.7283 21.5229 30.2439 22.6548C29.5093 24.3704 27.6841 25.7219 24.1397 27.1727C21.9347 28.0753 19.9174 28.6523 19.8994 28.6575C16.9842 29.4379 14.3477 29.8345 12.0653 29.8345C7.87017 29.8345 4.8668 28.508 3.13831 25.8921C0.356375 21.6797 0.754104 17.8269 4.35369 14.1131C6.34591 12.058 7.67023 9.02782 7.94613 8.36275C8.50224 6.39343 9.97271 4.20438 12.4172 4.20438H12.4179C12.6236 4.20438 12.8314 4.2214 13.0364 4.25468C14.107 4.42854 15.0428 5.06476 15.7115 6.02205C16.4331 5.09583 17.134 4.359 17.7682 3.94323C18.7242 3.31737 19.6794 3 20.6081 3ZM20.6081 5.95917C20.2427 5.95917 19.7963 6.1197 19.3039 6.44225C17.7754 7.44319 14.8258 12.6772 13.7458 14.7131C13.3839 15.3952 12.7655 15.6837 12.2086 15.6837C11.1036 15.6837 10.2408 14.5497 12.1076 13.1085C14.9146 10.9402 13.9299 7.39584 12.5898 7.1776C12.5311 7.16799 12.4731 7.16355 12.4172 7.16355C11.1989 7.16355 10.6615 9.33114 10.6615 9.33114C10.6615 9.33114 9.0863 13.4148 6.38031 16.206C3.67434 18.998 3.5346 21.2388 5.50675 24.2246C6.85185 26.2606 9.42666 26.8753 12.0653 26.8753C14.8021 26.8753 17.6077 26.2139 19.1799 25.793C19.2574 25.7723 28.8193 22.984 27.6081 20.6107C27.4046 20.212 27.0693 20.0522 26.6471 20.0522C24.9416 20.0522 21.8393 22.6726 20.5057 22.6726C20.2076 22.6726 19.9976 22.5416 19.9116 22.222C19.3433 20.1173 28.552 19.2325 27.7758 16.1839C27.639 15.6445 27.2677 15.4256 26.746 15.4263C24.4923 15.4263 19.4358 19.5181 18.3759 19.5181C18.2949 19.5181 18.2368 19.4937 18.2053 19.4419C17.6743 18.557 17.9653 17.9394 21.7082 15.6009C25.4511 13.2617 28.0783 11.8545 26.5841 10.1752C26.4121 9.98141 26.1684 9.8956 25.8725 9.8956C23.6001 9.89634 18.2311 14.9403 18.2311 14.9403C18.2311 14.9403 16.7821 16.496 15.9057 16.496C15.7043 16.496 15.533 16.4139 15.4169 16.2112C14.7956 15.1296 21.1879 10.1286 21.5484 8.06535C21.7928 6.66715 21.3771 5.95917 20.6081 5.95917Z"
                      fill="#FF9D00"></path>
                    <path d="M5.50686 24.2246C3.53472 21.2387 3.67446 18.9979 6.38043 16.206C9.08641 13.4147 10.6615 9.33111 10.6615 9.33111C10.6615 9.33111 11.2499 6.95933 12.59 7.17757C13.93 7.39581 14.9139 10.9401 12.1069 13.1084C9.29997 15.276 12.6659 16.7489 13.7459 14.713C14.8258 12.6772 17.7747 7.44316 19.304 6.44221C20.8326 5.44128 21.9089 6.00204 21.5484 8.06532C21.188 10.1286 14.795 15.1295 15.4171 16.2118C16.0391 17.2934 18.2312 14.9402 18.2312 14.9402C18.2312 14.9402 25.0907 8.49588 26.5842 10.1752C28.0776 11.8545 25.4512 13.2616 21.7082 15.6008C17.9646 17.9393 17.6744 18.557 18.2054 19.4418C18.7372 20.3266 26.9998 13.1351 27.7759 16.1838C28.5513 19.2324 19.3434 20.1173 19.9117 22.2219C20.48 24.3274 26.3979 18.2382 27.6082 20.6107C28.8193 22.9839 19.2574 25.7722 19.18 25.7929C16.0914 26.62 8.24723 28.3726 5.50686 24.2246Z"
                      fill="#FFD21E"></path>
                  </svg>
                  community GPU grant
                </span>.
              </p>
            </div>
            <div class="fork-btn flex-row" v-if="props.renewButton === 'fork'">
              <el-button type="info" @click="forkDuplicate('fork')">Just Fork, choose config later</el-button>
            </div>
          </el-col>
          <el-col :md="24" :lg="18" class="hardware-right">
            <!-- <div class="price_switch flex-row">
                Display price:
                <el-switch v-model="ruleForm.displayPrice" size="small" active-text="per month" inactive-text="per hour" />
              </div> -->
            <h2 class="flex-row">
              <svg class="mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 12">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.92865 7.42863H10.643C10.7377 7.42863 10.8285 7.39098 10.8955 7.32405C10.9625 7.25705 11.0001 7.16619 11.0001 7.07148C11.0001 6.97676 10.9625 6.88591 10.8955 6.81891C10.8285 6.75198 10.7377 6.71433 10.643 6.71433H9.92865V5.28575H10.643C10.7377 5.28575 10.8285 5.24812 10.8955 5.18114C10.9625 5.11417 11.0001 5.02333 11.0001 4.9286C11.0001 4.83388 10.9625 4.74304 10.8955 4.67607C10.8285 4.60909 10.7377 4.57146 10.643 4.57146H9.92865V2.78573C9.92865 2.59628 9.85336 2.4146 9.71943 2.28065C9.5855 2.1467 9.40378 2.07144 9.21435 2.07144H7.42862V1.35715C7.42862 1.26242 7.39098 1.17158 7.32405 1.10461C7.25705 1.03763 7.16619 1 7.07148 1C6.97676 1 6.88591 1.03763 6.81891 1.10461C6.75198 1.17158 6.71433 1.26242 6.71433 1.35715V2.07144H5.28575V1.35715C5.28575 1.26242 5.24812 1.17158 5.18114 1.10461C5.11417 1.03763 5.02333 1 4.9286 1C4.83388 1 4.74304 1.03763 4.67607 1.10461C4.60909 1.17158 4.57146 1.26242 4.57146 1.35715V2.07144H2.78573C2.59628 2.07144 2.4146 2.1467 2.28065 2.28065C2.14669 2.4146 2.07144 2.59628 2.07144 2.78573V4.57146H1.35714C1.26242 4.57146 1.17158 4.60909 1.10461 4.67607C1.03763 4.74304 1 4.83388 1 4.9286C1 5.02333 1.03763 5.11417 1.10461 5.18114C1.17158 5.24812 1.26242 5.28575 1.35714 5.28575H2.07144V6.71433H1.35714C1.26242 6.71433 1.17158 6.75198 1.10461 6.81891C1.03763 6.88591 1 6.97676 1 7.07148C1 7.16619 1.03763 7.25705 1.10461 7.32405C1.17158 7.39098 1.26242 7.42863 1.35714 7.42863H2.07144V9.21435C2.07144 9.40378 2.14669 9.5855 2.28065 9.71943C2.4146 9.85336 2.59628 9.92865 2.78573 9.92865H4.57146V10.6429C4.57146 10.7377 4.60909 10.8285 4.67607 10.8955C4.74304 10.9624 4.83388 11.0001 4.9286 11.0001C5.02333 11.0001 5.11417 10.9624 5.18114 10.8955C5.24812 10.8285 5.28575 10.7377 5.28575 10.6429V9.92865H6.71433V10.6429C6.71433 10.7377 6.75198 10.8285 6.81891 10.8955C6.88591 10.9624 6.97676 11.0001 7.07148 11.0001C7.16619 11.0001 7.25705 10.9624 7.32405 10.8955C7.39098 10.8285 7.42862 10.7377 7.42862 10.6429V9.92865H9.21435C9.40378 9.92865 9.5855 9.85336 9.71943 9.71943C9.85336 9.5855 9.92865 9.40378 9.92865 9.21435V7.42863Z"
                  fill="currentColor" fill-opacity="0.3"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.44771 4 4 4.44771 4 5V7C4 7.55227 4.44771 8 5 8H7C7.55227 8 8 7.55227 8 7V5C8 4.44771 7.55227 4 7 4H5Z" fill-opacity="0.5"></path>
              </svg>
              <span v-if="props.listdata.activeOrder === null || props.renewButton !== 'setting'">Space Hardware</span>
              <span v-else>Update Hardware</span>
            </h2>
            <p class="p-2 flex-row">Choose a hardware for your Space.</p>

            <el-row :gutter="25" class="space_hardware_list" v-for="(item, index) in hardwareOptions" :key="index">
              <el-divider content-position="left">{{ item.label }}</el-divider>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(ol, o) in item.list" :key="o">
                <el-card class="box-card" :class="{'active': props.renewButton === 'setting' && props.listdata.activeOrder && props.listdata.activeOrder.config && props.listdata.activeOrder.config.name === ol.hardware_name && (props.listdata.activeOrder.ended_at === null || (props.listdata.activeOrder.ended_at !== null && props.listdata.activeOrder.ended_at > Math.floor(Date.now() / 1000))) && props.listdata.status !== 'Stopped','is-disabled':ol.hardware_status !== 'available'}"
                  @click="sleepChange(ol)">
                  <div class="abo" v-if="props.renewButton === 'setting' && props.listdata.activeOrder && props.listdata.activeOrder.config && props.listdata.activeOrder.config.name === ol.hardware_name && (props.listdata.activeOrder.ended_at === null || (props.listdata.activeOrder.ended_at !== null && props.listdata.activeOrder.ended_at > Math.floor(Date.now() / 1000))) && props.listdata.status !== 'Stopped'">
                    <svg t="1678084765267" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2340" width="200" height="200">
                      <path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 128a298.666667 298.666667 0 1 0 0 597.333334 298.666667 298.666667 0 0 0 0-597.333334z"
                        fill="#7405ff" fill-opacity=".05" p-id="2341"></path>
                      <path d="M813.696 813.696c166.613333-166.613333 166.613333-436.778667 0-603.392-166.613333-166.613333-436.778667-166.613333-603.392 0A64 64 0 0 0 300.8 300.8a298.666667 298.666667 0 1 1 422.4 422.4 64 64 0 0 0 90.496 90.496z" fill="#7405ff"
                        p-id="2342"></path>
                    </svg>
                  </div>
                  <h5>{{ ol.hardware_name }}</h5>
                  <div class="desc-text">{{ ol.hardware_description }}</div>
                  <div class="price">
                    <b v-if="ol.hardware_status.toLowerCase() === 'available'">{{ ol.hardware_price }} LAG per hour</b>
                    <b v-else>No available CP</b>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog custom-class="sleep_body" @close="close" v-model="sleepVisible" title="Confirm hardware update" :width="dialogWidth">
      <div v-loading="hardwareLoad">
        <div class="title-hard">The hardware of
          <span>{{ accessName || system.$commonFun.hiddAddress(metaAddress) }}/{{ route.params.name }}</span> will be switched to:
        </div>
        <el-card class="box-card">
          <h5>{{ sleepSelect.hardware_name }}</h5>
          <div class="desc-text">{{ sleepSelect.hardware_description }}</div>
          <div class="price">
            <b>{{ sleepSelect.hardware_price }} LAG per hour</b>
          </div>
        </el-card>
        <div class="sleep_style">
          <div>
            <div class="title_tip flex-row">
              <div class="flex-row">
                Usage Time
              </div>
              <el-divider/>
            </div>
            <div class="time flex-row">
              <el-input-number v-model="ruleForm.usageTime" :min="24" :max="sleepSelect.hardware_type.toLowerCase() === 'gpu' ? 168:336" :precision="0" :step="1" controls-position="right" /> &nbsp; hours
            </div>
          </div>
          <div>
            <div class="title_tip flex-row">
              <div class="flex-row">
                Region
              </div>
              <el-divider/>
            </div>
            <div class="time flex-row">
              <el-select v-model="sleepSelect.regionValue" class="m-region" placeholder="Region">
                <el-option v-for="item in sleepSelect.regionOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div>
            <div class="title_tip flex-row">
              <div class="flex-row">
                Start time settings
                <el-popover placement="top-start" :width="200" trigger="hover" content="If the task isn't successfully taken by the CP within the specified time, we will consider it as failed and refund your tokens.">
                  <template #reference>
                    <div>
                      <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                        <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor"></path>
                        <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor"></path>
                        <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </div>
              <el-divider/>
            </div>
            <div class="time flex-row">
              Start after
              <el-select v-model="ruleForm.sleepTime" class="m-2" placeholder="Select" size="small">
                <el-option v-for="item in ruleForm.sleepTimeOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <p class="p-1 p-small" v-if="sleepSelect.hardware_type.toLowerCase() === 'gpu' && ruleForm.sleepTime < 20">
              For GPU tasks, we recommend that you choose a longer wait time to ensure that the CP can complete the task within your desired time frame</p>
          </div>
          <el-divider/>
          <p class="p-1">Make sure to follow
            <router-link to="">this guide</router-link>
            to ensure your Space takes advantage of the improved hardware.
          </p>
          <p class="p-1">You can switch to a different hardware at any time. Monitor your usage in real time from your
            <router-link to="">billing settings</router-link>
            .
          </p>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button-group class="flex-row">
            <el-button @click="hardwareFun" :disabled="hardwareLoad">Confirm new hardware</el-button>
            <el-button @click="close" :disabled="hardwareLoad">Cancel</el-button>
          </el-button-group>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'

import SpaceHardwareABI from '@/utils/abi/SpaceHardware.json'
import SpaceTokenABI from '@/utils/abi/SpacePaymentV5.json'
import tokenABI from '@/utils/abi/tokenLLL.json'
import tokenUSDCABI from '@/utils/abi/USDC.json'
import {
  InfoFilled
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Space Hardware',
  components: {},
  props: {
    listdata: { type: Object, default: {} },
    renewButton: { type: String, default: 'setting' }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => store.state.metaAddress)
    const accessName = computed(() => (store.state.accessName))
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const ruleForm = reactive({
      usageTime: 24,
      sleepTime: '1',
      sleepTimeOption: [
        {
          value: "1",
          label: "1 minute",
        },
        {
          value: '5',
          label: "5 minutes",
        }, {
          value: '10',
          label: "10 minutes",
        }, {
          value: '15',
          label: "15 minutes",
        }, {
          value: '20',
          label: "20 minutes",
        }, {
          value: '30',
          label: "30 minutes",
        }, {
          value: '40',
          label: "40 minutes",
        }, {
          value: '50',
          label: "50 minutes",
        }, {
          value: '60',
          label: "60 minutes",
        }, {
          value: '70',
          label: "70 minutes",
        }, {
          value: '80',
          label: "80 minutes",
        }, {
          value: '90',
          label: "90 minutes",
        }, {
          value: '100',
          label: "100 minutes",
        }, {
          value: '110',
          label: "110 minutes",
        }, {
          value: '120',
          label: "120 minutes",
        }
      ],
      pauseSpace: false,
      displayPrice: false
    })
    const hardwareOptions = ref([])
    const hardwareLoad = ref(false)
    const machinesLoad = ref(false)
    const sleepVisible = ref(false)
    const forkLoad = ref(false)
    const sleepSelect = ref({})
    const dialogWidth = ref(document.body.clientWidth < 992 ? '90%' : '800px')
    let tokenAddress = process.env.VUE_APP_MUMBAI_USDC_ADDRESS
    let tokenContract = new system.$commonFun.web3Init.eth.Contract(tokenABI, tokenAddress);
    let paymentContractAddress = process.env.VUE_APP_HARDWARE_ADDRESS
    let paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceHardwareABI, paymentContractAddress)

    async function hardwareFun () {
      const net = await networkEstimate()
      if (!net) return
      hardwareLoad.value = true
      try {
        if (props.renewButton === 'fork') {
          const forkRes = await forkDuplicate()
          if (forkRes !== 'success') {
            closePart()
            return
          }
        }
        const hardwareInfo = await paymentContract.methods.hardwareInfo(sleepSelect.value.hardware_id).call()
        const pricePerHour = system.$commonFun.web3Init.utils.fromWei(String(hardwareInfo.pricePerHour), 'mwei')
        const approveAmount = (pricePerHour * ruleForm.usageTime).toFixed(6) // usdc is 6 decimal, ensure the amount will not be more than 6

        let approveGasLimit = await tokenContract.methods
          .approve(paymentContractAddress, system.$commonFun.web3Init.utils.toWei(String(approveAmount), 'mwei'))
          .estimateGas({ from: store.state.metaAddress })

        const approve_tx = await tokenContract.methods
          .approve(paymentContractAddress, system.$commonFun.web3Init.utils.toWei(String(approveAmount), 'mwei'))
          .send({
            from: store.state.metaAddress, gasLimit: approveGasLimit
          })

        let payMethod = getnetID === 80001 ? paymentContract.methods
          .makePayment(props.listdata.uuid, sleepSelect.value.hardware_id, ruleForm.usageTime) :
          paymentContract.methods
            .lockRevenue(props.listdata.uuid, sleepSelect.value.hardware_id, ruleForm.usageTime)

        let gasLimit = await payMethod.estimateGas({ from: store.state.metaAddress })
        const tx = await payMethod.send({ from: store.state.metaAddress, gasLimit: gasLimit })
          .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash:', transactionHash)
            await hardwareHash(transactionHash, approveAmount)
            closePart()
            context.emit('handleHard', false, true)
          })
          .on('error', () => hardwareLoad.value = false)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        closePart()
        if (props.renewButton === 'fork') context.emit('handleHard', false, false)
      }
    }

    function closePart () {
      hardwareLoad.value = false
      sleepVisible.value = false
    }

    async function forkDuplicate (type) {
      forkLoad.value = true
      const forkRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/duplicate`, 'post', {})
      if (forkRes && forkRes.status === 'success') {
        system.$commonFun.messageTip('success', forkRes.message ? forkRes.message : 'Fork successfully!')
        if (type) context.emit('handleHard', false, false)
        router.push({
          name: 'spaceDetail',
          params: { wallet_address: metaAddress.value, name: route.params.name, tabs: 'card' }
        })
      } else system.$commonFun.messageTip('error', forkRes.message ? forkRes.message : 'Fork failed!')
      forkLoad.value = false
      return forkRes.status
    }

    async function networkEstimate () {
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      const list = [80001, 8598668088]
      const getPast = await list.some(t => t === getID)
      if (getPast) return true
      else {
        context.emit('handleHard', false, false, true)
        // await system.$commonFun.messageTip('error', 'Please switch to the network: Mumbai Testnet, OpSwan')
        return false
      }
    }

    async function hardwareHash (tx_hash, approveAmount) {
      const net = await networkEstimate()
      if (!net) return
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      let fd = new FormData()
      // fd.append('paid', system.$commonFun.web3Init.utils.fromWei(String(approveAmount), 'ether')) // 授权代币的金额
      fd.append('paid', approveAmount) // 授权代币的金额
      fd.append('space_name', route.params.name)
      fd.append('cfg_name', sleepSelect.value.hardware_name)
      fd.append('duration', ruleForm.usageTime * 3600)
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      fd.append('region', sleepSelect.value.regionValue)
      fd.append('start_in', ruleForm.sleepTime * 60)
      const urlRes = `${process.env.VUE_APP_BASEAPI}space/deployment`
      const hardhashRes = await system.$commonFun.sendRequest(urlRes, 'post', fd)
      if (hardhashRes) system.$commonFun.messageTip(hardhashRes.status, hardhashRes.message)
    }

    function close () {
      if (props.renewButton === 'renew') context.emit('handleHard', false, false)
      else sleepVisible.value = false
    }

    async function sleepChange (row) {
      if (row.hardware_status.toLowerCase() !== 'available' && props.renewButton === 'renew') {
        system.$commonFun.messageTip('warning', 'There are no corresponding resources for the current configuration, unable to renew. Please try again later')
        close()
        return
      } else if (row.hardware_status.toLowerCase() !== 'available' || (props.listdata.activeOrder && (props.listdata.activeOrder.ended_at !== null && props.listdata.activeOrder.ended_at > Math.floor(Date.now() / 1000)))) return false
      const net = await networkEstimate()
      if (!net) return
      ruleForm.usageTime = 24
      sleepSelect.value = row
      sleepSelect.value.regionOption = await regionList(row.region)
      sleepSelect.value.regionValue = row.region && row.region[0] ? "Global" : ''
      ruleForm.sleepTime = sleepSelect.value.hardware_type.toLowerCase() === 'gpu' ? '20' : '1'
      sleepVisible.value = true
    }

    async function listArray (arrayList) {
      let listArr = [
        {
          label: 'CPU',
          list: []
        },
        {
          label: 'GPU',
          list: []
        }
      ]
      // arrayList.sort((a, b) => a['hardware_name'].localeCompare(b['hardware_name']))
      arrayList.forEach(async hard => {
        hard.regionOption = await regionList(hard.region)
        hard.regionValue = hard.region && hard.region[0] ? hard.region[0] : ''
        if (hard.hardware_type.toLowerCase() === 'cpu') listArr[0].list.push(hard)
        else listArr[1].list.push(hard)
      })
      return listArr
    }

    async function regionList (list) {
      if (!list || !Array.isArray(list) || list.length === 0) {
        return [];
      }

      let arr = [{
        value: "Global",
        label: "Global"
      }];

      list.forEach(l => {
        arr.push({
          value: l,
          label: l
        });
      });

      return arr;
    }

    async function paymentEnv () {
      if (getnetID !== 80001) {
        tokenAddress = process.env.VUE_APP_OPSWAN_USDC_ADDRESS
        tokenContract = new system.$commonFun.web3Init.eth.Contract(tokenUSDCABI, tokenAddress);
        paymentContractAddress = process.env.VUE_APP_OPSWAN_ADDRESS
        paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, paymentContractAddress)
      }
    }
    async function init (params) {
      machinesLoad.value = true
      const machinesRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/machines`, 'get')
      if (machinesRes && machinesRes.status === 'success') {
        if (props.renewButton === 'renew') {
          if (props.listdata.activeOrder === null) return
          for (let hard = 0; hard < machinesRes.data.hardware.length; hard++) {
            if (machinesRes.data.hardware[hard].hardware_name === props.listdata.activeOrder.config.name) {
              sleepChange(machinesRes.data.hardware[hard])
              break
            }
          }
        } else hardwareOptions.value = await listArray(machinesRes.data.hardware)
      } else if (machinesRes.message) system.$commonFun.messageTip('error', machinesRes.message)
      machinesLoad.value = false
    }

    let getnetID = NaN
    onMounted(async () => {
      getnetID = await system.$commonFun.web3Init.eth.net.getId()
      paymentEnv()
      init()
    })
    return {
      route,
      accessName,
      metaAddress,
      bodyWidth,
      system,
      props,
      ruleForm,
      sleepVisible,
      sleepSelect,
      dialogWidth,
      hardwareOptions,
      hardwareLoad,
      machinesLoad,
      forkLoad,
      sleepChange, hardwareFun, close, forkDuplicate
    }
  }
})
</script>
<style lang="scss" scoped>
#hardware {
  width: 100%;
  .space-hard {
    width: 100%;
    margin: 0.15rem 0;
    font-family: "Helvetica-light";
    border: 1px solid #e4e4e4;
    border-radius: 0.1rem;
    color: #606060;
    text-align: left;
    word-break: break-word;
    overflow: hidden;

    :deep(.space_hardware) {
      position: relative;
      padding: 0.3rem 0.2rem;
      color: #000;
      line-height: 1.5;

      .el-col {
        position: relative;
      }

      h2 {
        margin: 0 0 0.12rem;
        font-size: 20px;
        font-weight: 600;
        color: #000;
        @media screen and (max-width: 1600px) {
          font-size: 18px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 17px;
        }
        @media screen and (max-width: 768px) {
          font-size: 15px;
        }

        svg {
          width: 20px;
          height: 20px;
          margin-right: 0.05rem;
        }
      }

      .p-2 {
        align-items: flex-start;
        margin: 0 0 0.08rem;
        font-size: 17px;
        @media screen and (max-width: 1600px) {
          font-size: 15px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 14px;
        }
        @media screen and (max-width: 768px) {
          font-size: 13px;
        }

        strong {
          min-width: 90px;
          margin-right: 0.05rem;
          text-transform: capitalize;
        }
      }

      .p-4 {
        margin: 0 0 0.08rem;
        font-size: 15px;
        color: rgba(107, 114, 128, 1);
        @media screen and (max-width: 1600px) {
          font-size: 13px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }

        a {
          color: inherit;
          text-decoration: underline;
        }

        span {
          padding: 0.02rem 0.05rem;
          margin: 0 0 0 0.05rem;
          background: linear-gradient(
            45.4deg,
            rgba(247, 0, 89, 0.1),
            rgba(82, 255, 0, 0.1) 22.65%,
            rgba(20, 0, 255, 0.075) 46.82%,
            rgba(255, 0, 0, 0.1) 67.96%,
            rgba(255, 230, 0, 0.1) 96.66%
          );
          border-radius: 0.05rem;
          white-space: nowrap;
          cursor: pointer;
        }
      }

      .fork {
        position: absolute;
        bottom: 0;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .hardware-right {
        max-height: 430px;
        border-left: 1px solid #dcdfe6;
        overflow-y: scroll;
      }

      .hardware-left {
        padding-bottom: 0.5rem;
      }

      .sleep_style {
        margin: 0 0 0.28rem;

        .title_tip {
          white-space: nowrap;
          font-size: 18px;
          font-weight: 600;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 1440px) {
            font-size: 15px;
          }
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }

          p {
            flex-wrap: inherit;
          }

          svg {
            width: 12px;
            height: 12px;
            margin: 0 0.08rem;
          }

          .el-divider {
            margin: auto;
          }

          .el-switch {
            margin: 0 0 0 0.08rem;

            .el-switch__core {
              width: 30px !important;
              height: 16.05px;

              .el-switch__action {
                width: 12px;
                height: 12px;
              }
            }

            &.is-checked {
              .el-switch__core {
                .el-switch__action {
                  margin-left: -13px;
                }
              }
            }
          }
        }

        .pause_margin {
          margin: 0.2rem 0 0.3rem;
        }

        .time {
          margin: 0.15rem 0;
          white-space: nowrap;
          font-size: 17px;
          @media screen and (max-width: 1600px) {
            font-size: 15px;
          }
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          @media screen and (max-width: 768px) {
            font-size: 13px;
          }

          .el-select {
            margin: 0 0.08rem;

            .el-input {
              .el-input__inner {
                max-width: 120px;
              }

              &.is-disabled {
                .el-input__inner {
                  background-color: transparent;
                  opacity: 0.8;
                }
              }
            }
          }

          .m-region {
            margin: 0;
          }
        }
      }

      .price_switch {
        position: absolute;
        top: 0.2rem;
        right: 0.6rem;
        font-size: 14px;
        color: #333;
        z-index: 9;
        @media screen and (max-width: 1600px) {
          font-size: 13px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
        @media screen and (max-width: 1200px) {
          position: relative;
          right: 0;
          left: 0;
        }

        .el-switch {
          margin: 0 0 0 0.08rem;

          .el-switch__core {
            width: 25px !important;
            height: 14.05px;

            .el-switch__action {
              width: 10px;
              height: 10px;
            }
          }

          * {
            font-size: 14px;
            color: #333;
            @media screen and (max-width: 1600px) {
              font-size: 13px;
            }
            @media screen and (max-width: 768px) {
              font-size: 12px;
            }
          }

          .el-switch__label.is-active {
            color: inherit;
          }

          &.is-checked {
            .el-switch__core {
              .el-switch__action {
                margin-left: -11px;
              }
            }
          }
        }
      }

      .space_hardware_list {
        @media screen and (max-width: 1200px) {
          padding: 0;
        }

        .el-card {
          position: relative;
          padding: 0.1rem;
          margin: 0.12rem 0;
          border-radius: 0.1rem;
          transition: all 0.3s;
          cursor: pointer;

          * {
            cursor: inherit;
          }

          &.active {
            background: linear-gradient(to bottom right, #eff6ff, #fff);
            // cursor: no-drop;
            &:hover {
              box-shadow: none;
            }
          }

          &:hover {
            box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0.05);
          }

          &.is-disabled {
            background: linear-gradient(to bottom right, #eeeeee, #f2f2f2);
            cursor: no-drop;

            &:hover {
              box-shadow: none;
            }
          }

          .el-card__body {
            padding: 0;

            .abo {
              position: absolute;
              top: 0.1rem;
              right: 0.1rem;
              width: 15px;
              height: 15px;
              z-index: 9;

              svg {
                width: 100%;
                height: 100%;
                animation: spin 1.5s linear infinite;
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                @-webkit-keyframes spin /* Safari 与 Chrome */ {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              }
            }

            h5 {
              padding: 0.05rem 0;
              font-size: 16px;
              @media screen and (max-width: 1600px) {
                font-size: 14px;
              }
              @media screen and (max-width: 768px) {
                font-size: 13px;
              }
            }

            .desc-text {
              height: 30px;
              padding: 0;
              font-size: 14px;
              color: #6b7280;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 15px;
              @media screen and (max-width: 1600px) {
                font-size: 12px;
              }
              @media screen and (max-width: 768px) {
                font-size: 11px;
              }
            }

            .price {
              margin-top: 0.05rem;

              b {
                padding: 0.03rem 0.08rem;
                background: rgba(243, 244, 246, 1);
                border-radius: 0.05rem;
                font-size: 14px;
                font-weight: normal;
                color: #333;
                @media screen and (max-width: 1600px) {
                  font-size: 12px;
                }
                @media screen and (max-width: 768px) {
                  font-size: 11px;
                }
              }
            }
          }
        }

        // &:nth-child(2) {
        //   margin-top: -0.25rem;
        //   @media screen and (max-width: 1200px) {
        //     margin-top: 0.2rem;
        //   }
        // }
      }
    }

    .fork-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      justify-content: flex-end;
      padding: 0 0.2rem;

      .el-button {
        span {
          cursor: inherit;
        }

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &.space-hard-fork {
      margin: 0;

      :deep(.space_hardware) {
        padding: 0.1rem 0.2rem 0.3rem;

        .hardware-right {
          border: 0;
        }
      }
    }
  }
}

:deep(.sleep_body) {
  border-radius: 0.1rem;
  font-family: "Helvetica-light";
  text-align: left;

  .el-dialog__body {
    padding: 0.25rem 0.25rem 0.15rem;
    color: #000;

    .title-hard {
      font-size: 18px;
      @media screen and (max-width: 1600px) {
        font-size: 16px;
      }
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }

      span {
        color: rgba(107, 114, 128, 1);
      }
    }

    .el-card {
      position: relative;
      padding: 0.15rem;
      margin-top: 0.25rem;
      border-radius: 0.1rem;
      transition: all 0.3s;

      * {
        cursor: pointer;
      }

      &.active {
        background: linear-gradient(to bottom right, #eff6ff, #fff);
      }

      // &:hover {
      //   box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0.05);
      // }
      .el-card__body {
        padding: 0;

        .abo {
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          width: 15px;
          height: 15px;
          z-index: 9;

          svg {
            width: 100%;
            height: 100%;
            animation: spin 1.5s linear infinite;
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            @-webkit-keyframes spin /* Safari 与 Chrome */ {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          }
        }

        h5 {
          padding: 0.05rem 0;
          font-size: 16px;
          @media screen and (max-width: 1600px) {
            font-size: 14px;
          }
          @media screen and (max-width: 768px) {
            font-size: 13px;
          }
        }

        .desc-text {
          height: 30px;
          padding: 0;
          font-size: 14px;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 15px;
          @media screen and (max-width: 1600px) {
            font-size: 12px;
          }
          @media screen and (max-width: 768px) {
            font-size: 11px;
          }
        }

        .price {
          margin-top: 0.05rem;

          b {
            padding: 0.03rem 0.08rem;
            background: rgba(243, 244, 246, 1);
            border-radius: 0.05rem;
            font-size: 14px;
            font-weight: normal;
            color: #333;
            @media screen and (max-width: 1600px) {
              font-size: 12px;
            }
            @media screen and (max-width: 768px) {
              font-size: 11px;
            }
          }
        }
      }
    }

    .sleep_style {
      margin: 0.28rem 0 0;

      .title_tip {
        white-space: nowrap;
        font-size: 18px;
        font-weight: 600;
        @media screen and (max-width: 1600px) {
          font-size: 16px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 15px;
        }
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }

        p {
          flex-wrap: inherit;
        }

        svg {
          width: 12px;
          height: 12px;
          margin: 0 0.08rem;
        }

        .el-switch {
          margin: 0 0 0 0.08rem;

          .el-switch__core {
            width: 30px !important;
            height: 16.05px;

            .el-switch__action {
              width: 12px;
              height: 12px;
            }
          }

          &.is-checked {
            .el-switch__core {
              .el-switch__action {
                margin-left: -13px;
              }
            }
          }
        }
      }

      .pause_margin {
        margin: 0.2rem 0 0.3rem;
      }

      .time {
        margin: 0.15rem 0;
        white-space: nowrap;
        font-size: 17px;
        @media screen and (max-width: 1600px) {
          font-size: 15px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 14px;
        }
        @media screen and (max-width: 768px) {
          font-size: 13px;
        }

        .el-select {
          margin: 0 0.08rem;

          .el-input {
            .el-input__inner {
              max-width: 120px;
            }

            &.is-disabled {
              .el-input__inner {
                background-color: transparent;
                opacity: 0.8;
              }
            }
          }

          &.m-region {
            margin: 0;

            .el-input {
              .el-input__inner {
                max-width: 155px;
              }
            }
          }
        }
      }
    }

    .el-divider {
      margin: 0;
    }

    .p-1 {
      margin: 0.15rem 0;
      color: rgba(107, 114, 128, 1);
      font-size: 17px;
      word-break: break-word;
      @media screen and (max-width: 1600px) {
        font-size: 15px;
      }
      @media screen and (max-width: 1440px) {
        font-size: 14px;
      }
      @media screen and (max-width: 768px) {
        font-size: 13px;
      }

      a {
        text-decoration: underline;
        color: inherit;
      }
    }

    .p-small {
      font-size: 15px;
      color: #f85149;
      @media screen and (max-width: 1600px) {
        font-size: 13px;
      }
      @media screen and (max-width: 1440px) {
        font-size: 12px;
      }
      @media screen and (max-width: 768px) {
        font-size: 11px;
      }
    }
  }

  .el-dialog__footer {
    padding: 0 0.25rem 0.25rem;
    text-align: left;

    .dialog-footer {
      .el-button-group {
        margin: 0;

        .el-button {
          margin: 0 0.15rem 0 0;
          background: linear-gradient(180deg, #fefefe, #f0f0f0);
          font-family: inherit;
          font-size: 18px;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>

