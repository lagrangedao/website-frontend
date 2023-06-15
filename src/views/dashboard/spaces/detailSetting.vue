<template>
  <section id="space">
    <el-row class="space_body" v-loading="listLoad">
      <div class="fileList">
        <el-row class="space_hardware" :gutter="30">
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <h2 class="flex">
              <svg class="mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 12">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.92865 7.42863H10.643C10.7377 7.42863 10.8285 7.39098 10.8955 7.32405C10.9625 7.25705 11.0001 7.16619 11.0001 7.07148C11.0001 6.97676 10.9625 6.88591 10.8955 6.81891C10.8285 6.75198 10.7377 6.71433 10.643 6.71433H9.92865V5.28575H10.643C10.7377 5.28575 10.8285 5.24812 10.8955 5.18114C10.9625 5.11417 11.0001 5.02333 11.0001 4.9286C11.0001 4.83388 10.9625 4.74304 10.8955 4.67607C10.8285 4.60909 10.7377 4.57146 10.643 4.57146H9.92865V2.78573C9.92865 2.59628 9.85336 2.4146 9.71943 2.28065C9.5855 2.1467 9.40378 2.07144 9.21435 2.07144H7.42862V1.35715C7.42862 1.26242 7.39098 1.17158 7.32405 1.10461C7.25705 1.03763 7.16619 1 7.07148 1C6.97676 1 6.88591 1.03763 6.81891 1.10461C6.75198 1.17158 6.71433 1.26242 6.71433 1.35715V2.07144H5.28575V1.35715C5.28575 1.26242 5.24812 1.17158 5.18114 1.10461C5.11417 1.03763 5.02333 1 4.9286 1C4.83388 1 4.74304 1.03763 4.67607 1.10461C4.60909 1.17158 4.57146 1.26242 4.57146 1.35715V2.07144H2.78573C2.59628 2.07144 2.4146 2.1467 2.28065 2.28065C2.14669 2.4146 2.07144 2.59628 2.07144 2.78573V4.57146H1.35714C1.26242 4.57146 1.17158 4.60909 1.10461 4.67607C1.03763 4.74304 1 4.83388 1 4.9286C1 5.02333 1.03763 5.11417 1.10461 5.18114C1.17158 5.24812 1.26242 5.28575 1.35714 5.28575H2.07144V6.71433H1.35714C1.26242 6.71433 1.17158 6.75198 1.10461 6.81891C1.03763 6.88591 1 6.97676 1 7.07148C1 7.16619 1.03763 7.25705 1.10461 7.32405C1.17158 7.39098 1.26242 7.42863 1.35714 7.42863H2.07144V9.21435C2.07144 9.40378 2.14669 9.5855 2.28065 9.71943C2.4146 9.85336 2.59628 9.92865 2.78573 9.92865H4.57146V10.6429C4.57146 10.7377 4.60909 10.8285 4.67607 10.8955C4.74304 10.9624 4.83388 11.0001 4.9286 11.0001C5.02333 11.0001 5.11417 10.9624 5.18114 10.8955C5.24812 10.8285 5.28575 10.7377 5.28575 10.6429V9.92865H6.71433V10.6429C6.71433 10.7377 6.75198 10.8285 6.81891 10.8955C6.88591 10.9624 6.97676 11.0001 7.07148 11.0001C7.16619 11.0001 7.25705 10.9624 7.32405 10.8955C7.39098 10.8285 7.42862 10.7377 7.42862 10.6429V9.92865H9.21435C9.40378 9.92865 9.5855 9.85336 9.71943 9.71943C9.85336 9.5855 9.92865 9.40378 9.92865 9.21435V7.42863Z"
                  fill="currentColor" fill-opacity="0.3"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.44771 4 4 4.44771 4 5V7C4 7.55227 4.44771 8 5 8H7C7.55227 8 8 7.55227 8 7V5C8 4.44771 7.55227 4 7 4H5Z" fill-opacity="0.5"></path>
              </svg>
              Space Hardware</h2>
            <p class="p-2">Choose a hardware for your Space.</p>
            <p class="p-4">
              You'll be billed for uptime on a per minute basis.<br> View usage in your
              <router-link to="">billing settings</router-link>.
            </p>
            <div class="sleep_style">
              <div class="title_tip flex">
                <p>
                  Sleep time settings
                  <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor"></path>
                    <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor"></path>
                    <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor"></path>
                  </svg>
                </p>
                <el-divider />
              </div>
              <div class="time flex">
                Sleep after
                <el-select v-model="ruleForm.sleepTime" disabled class="m-2" placeholder="Select" size="small">
                  <el-option v-for="item in ruleForm.sleepTimeOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                of inactivity
              </div>
              <p class="p-4">Upgrade to a paid Hardware to set a custom sleep time.</p>
              <div class="title_tip flex pause_margin">
                <p>
                  Pause Space
                  <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                    <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor"></path>
                    <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor"></path>
                    <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor"></path>
                  </svg>
                </p>
                <el-divider />
                <el-switch v-model="ruleForm.pauseSpace" size="small" />
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
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <div class="price_switch flex">
              Display price:
              <el-switch v-model="ruleForm.displayPrice" size="small" active-text="per month" inactive-text="per hour" />
            </div>
            <el-row :gutter="25" class="space_hardware_list" v-for="(item,index) in hardwareOptions" :key="index">
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(ol, o) in item.options.concat(item.options_setting)" :key="o">
                <el-card class="box-card" :class="{'active': listdata.hardware === ol.value}" @click="sleepChange(ol)">
                  <div class="abo" v-if="listdata.hardware === ol.value">
                    <svg t="1678084765267" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2340" width="200" height="200">
                      <path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 128a298.666667 298.666667 0 1 0 0 597.333334 298.666667 298.666667 0 0 0 0-597.333334z"
                        fill="#7405ff" fill-opacity=".05" p-id="2341"></path>
                      <path d="M813.696 813.696c166.613333-166.613333 166.613333-436.778667 0-603.392-166.613333-166.613333-436.778667-166.613333-603.392 0A64 64 0 0 0 300.8 300.8a298.666667 298.666667 0 1 1 422.4 422.4 64 64 0 0 0 90.496 90.496z" fill="#7405ff"
                        p-id="2342"></path>
                    </svg>
                  </div>
                  <h5>{{ol.type}}</h5>
                  <div class="desc">{{ol.label_short}}</div>
                  <div class="price">
                    <b>{{ol.price}}</b>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="fileList" v-loading="renameLoad">
        <div class="title">Rename or transfer this space</div>
        <!-- <div class="desc">New: Automatic Redirection</div> -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
          <el-form-item prop="" class="flex_left">
            <label class="label" for="owner">
              New owner
              <div class="flex flex-row">
                <el-select v-model="metaAddress" placeholder="">
                  <el-option :label="metaAddress" :value="metaAddress" />
                </el-select>
                <span class="text-2xl text-gray-400 self-end pb-2">/</span>
              </div>
            </label>
          </el-form-item>
          <el-form-item prop="name" class="flex_right">
            <label class="label" for="dataname">
              New name
              <div class="flex flex-row">
                <el-input v-model="ruleForm.name" placeholder="New space name" />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="!ruleForm.name" @click="submitForm('ruleFormRef')">I understand the consequences, rename this space</el-button>
      </div>
      <div class="fileList" v-loading="deleteLoad">
        <div class="title">Delete this space</div>
        <div class="tip">This action
          <b>cannot</b> be undone. This will permanently delete the
          <b class="b">{{route.params.name}}</b> space repository and all its files.</div>

        <el-form ref="ruleFormRefDelete" :model="ruleForm" :rules="rulesDelete" class="demo-ruleForm" status-icon>
          <el-form-item prop="delete" style="width:100%">
            <label class="label" for="dataname">
              Please type
              <b class="b">{{route.params.name}}</b> to confirm.
              <div class="flex flex-row">
                <el-input v-model="ruleForm.delete" placeholder=" " />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="ruleForm.delete && ruleForm.delete !== route.params.name" @click="submitDeleteForm('ruleFormRefDelete')">I understand the consequences, delete this space</el-button>
      </div>
    </el-row>

    <el-dialog v-model="dialogDOIVisible" title="DNFT Agreement" :show-close="false" custom-class="doi_body">
      <div class="tip">
        Generating a DNFT restricts certain features of the space: it will no longer be possible to rename, transfer, delete or change the visibility to private.
      </div>
      <div class="tip_black">
        By using this feature, you agree to transfer metadata about your space and your name to
        <a href="https://www.multichain.storage" target="_blank">multichain.storage</a> For more information please contact
        <a href="mailto:team@filswan.com">team@filswan.com</a>
      </div>
      <el-form ref="ruleFormRefDelete" status-icon>
        <el-form-item prop="agreeDoi" style="width:100%">
          <label class="label" for="dataname">
            Type
            <b class="b">I agree</b> to confirm
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.agreeDoi" placeholder=" " />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="ruleForm.agreeDoi && ruleForm.agreeDoi !== 'I agree'" @click="dialogDOIVisible = false">
            Generate DNFT
          </el-button>
          <el-button @click="dialogDOIVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog custom-class="sleep_body" v-model="sleepVisible" title="Confirm hardware update" :width="dialogWidth">
      <div class="title">The hardware of
        <span>{{accessName || metaAddress}}/{{route.params.name}}</span> will be switched to:</div>
      <el-card class="box-card">
        <h5>{{sleepSelect.type}}</h5>
        <div class="desc">{{sleepSelect.label_short}}</div>
        <div class="price">
          <b>{{sleepSelect.price}}</b>
        </div>
      </el-card>
      <div class="sleep_style">
        <div class="title_tip flex">
          <p>
            Sleep time settings
            <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
              <path d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3z" fill="currentColor"></path>
              <path d="M16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z" fill="currentColor"></path>
              <path d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z" fill="currentColor"></path>
            </svg>
          </p>
          <el-divider />
        </div>
        <div class="time flex">
          Sleep after
          <el-select v-model="ruleForm.sleepTime" class="m-2" placeholder="Select" size="small">
            <el-option v-for="item in ruleForm.sleepTimeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          of inactivity
        </div>
        <el-divider />
        <p class="p-1">Make sure to follow
          <router-link to="">this guide</router-link> to ensure your Space takes advantage of the improved hardware.</p>
        <p class="p-1">You can switch to a different hardware at any time. Monitor your usage in real time from your
          <router-link to="">billing settings</router-link>.</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button-group class="flex">
            <el-button @click="sleepVisible = false" disabled>Confirm new hardware</el-button>
            <el-button @click="sleepVisible = false">Cancel</el-button>
          </el-button-group>
        </span>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom
} from '@element-plus/icons-vue'
import tokenABI from '@/utils/abi/LagrangeDAOToken.json'
import hyperspaceABI from '@/utils/abi/SpacePayment.json'
import hardwareList from '@/utils/hardware-list.js'
export default defineComponent({
  name: 'Spaces',
  components: {
    CaretBottom
  },
  props: {
    // listdata: { type: Number, default: 1 }
  },
  setup (props, context) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const metaAddress = computed(() => {
      let val = store.state.metaAddress || ''
      return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
    })
    const metaAddressFull = computed(() => (store.state.metaAddress))
    const accessSpace = computed(() => (store.state.accessSpace ? JSON.parse(store.state.accessSpace) : []))
    const accessName = computed(() => (store.state.accessName))
    const ruleForm = reactive({
      name: '',
      delete: '',
      agreeDoi: '',
      sleepTime: '259200',
      sleepTimeOption: [
        {
          value: '-1',
          label: "Don't sleep",
        }, {
          value: '300',
          label: "5 minutes",
        }, {
          value: '900',
          label: "15 minutes",
        }, {
          value: '1800',
          label: "30 minutes",
        }, {
          value: '3600',
          label: "1 hour",
        }, {
          value: '36000',
          label: "10 hours",
        }, {
          value: '86400',
          label: "24 hours",
        }, {
          value: '259200',
          label: "72 hours",
        }, {
          value: '604800',
          label: "1 week",
        }
      ],
      pauseSpace: false,
      displayPrice: false
    })
    const validateInput = (rule, value, callback) => {
      if ((/[^a-zA-Z0-9-]/g).test(value)) {
        callback(new Error("Only regular alphanumeric characters and '-' support"));
      } else {
        callback();
      }
    }
    const rules = reactive({
      name: [
        { required: true, message: ' ', trigger: 'blur' },
        { validator: validateInput, trigger: "blur" }
      ]
    })
    const hardwareOptions = ref([])
    const rulesDelete = reactive({
      delete: [
        { required: true, message: ' ', trigger: 'blur' }
      ]
    })
    const ruleFormRef = ref(null)
    const listdata = ref({})
    const ruleFormRefDelete = ref(null)
    const renameLoad = ref(false)
    const deleteLoad = ref(false)
    const doiLoad = ref(false)
    const doiIndex = ref(1)
    const doiData = ref([
      {
        doi: '10.574654/hf/12587',
        version: '1046541'
      }
    ])
    const sleepVisible = ref(false)
    const sleepSelect = ref({})
    const dialogWidth = ref(document.body.clientWidth < 992 ? '90%' : '800px')
    const listLoad = ref(false)
    const dialogDOIVisible = ref(false)
    const settingIndex = ref(0)
    const gutterRow = ref(document.body.clientWidth < 992 ? '0' : '30')
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    const submitForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          renameLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          formData.append('is_public', listdata.value.is_public) // public:1, private:0
          formData.append('new_name', ruleForm.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/update`, 'post', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.space) {
              accessSpace.value.splice(settingIndex.value, 1, ruleForm.name)
              store.dispatch('setAccessSpace', JSON.stringify(accessSpace.value))
              system.$commonFun.messageTip('success', 'Update successfully!')
              router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: ruleForm.name, tabs: 'settings' } })
            }
            else system.$commonFun.messageTip('error', listRes.data.message)
          } else system.$commonFun.messageTip('error', 'Upload failed!')
          ruleForm.name = ''
          renameLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    const submitDeleteForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRefDelete.value.validate(async (valid, fields) => {
        if (valid) {
          deleteLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/delete`, 'post', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.space) system.$commonFun.messageTip('success', 'Delete successfully!')
            else system.$commonFun.messageTip('error', listRes.data.message)
            router.push({ name: 'personalCenter' })
          } else system.$commonFun.messageTip('error', 'Delete failed!')
          ruleForm.name = ''
          ruleForm.delete = ''
          deleteLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    async function init () {
      if (route.name !== 'spaceDetail') return
      listLoad.value = true
      listdata.value = {}
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        listdata.value = listRes.data.space || { name: route.params.name, is_public: '1' }
        const current = Math.floor(Date.now() / 1000)
        let expireTime = current
        if (listRes.data.space.expiration_date) {
          const currentTime = (listRes.data.space.expiration_date - current) / 86400
          expireTime = Math.floor(currentTime)
        }
        context.emit('handleValue', listRes.data.space.status, listRes.data.job ? listRes.data.job.job_source_uri : '', expireTime)
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function sleepChange (row) {
      if (listdata.value.hardware === row.value) return false
      sleepSelect.value = row
      sleepVisible.value = true
    }
    async function spaceIndex () {
      let index = 0
      accessSpace.value.forEach((ele, i) => {
        if (ele === route.params.name) index = i
      })
      return index
    }
    onMounted(async () => {
      window.scrollTo(0, 0)
      init()
      hardwareOptions.value = hardwareList
      settingIndex.value = await spaceIndex()
    })
    onDeactivated(() => {
      ruleForm.name = ''
      ruleForm.delete = ''
    })
    return {
      lagLogin,
      metaAddress,
      accessName,
      renameLoad,
      deleteLoad,
      doiLoad,
      doiIndex,
      doiData,
      ruleForm,
      listdata,
      hardwareOptions,
      rules,
      rulesDelete,
      ruleFormRef,
      ruleFormRefDelete,
      listLoad,
      dialogDOIVisible,
      system,
      gutterRow,
      route,
      router,
      sleepVisible,
      sleepSelect,
      dialogWidth,
      props, submitForm, submitDeleteForm, momentFilter, sleepChange
    }
  }
})
</script>

<style lang="scss" scoped>
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  :deep(.space_body) {
    display: flex;
    align-items: stretch;
    padding: 0.4rem 0 0.6rem;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding: 0.4rem 0.16rem;
    }
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .fileList {
      width: 100%;
      margin: 0.15rem 0;
      font-family: "Helvetica-light";
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      overflow: hidden;
      .title {
        padding: 0.2rem 0.2rem 0;
        margin: 0 0 0.2rem;
        font-size: 17px;
        font-weight: 600;
        color: #000;
        @media screen and (max-width: 768px) {
          font-size: 15px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 18px;
        }
      }
      .desc,
      .tip,
      .el-row {
        padding: 0 0.2rem;
        font-size: 15px;
        color: #606060;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }
      .tip {
        margin: 0 0 0.15rem;
        font-weight: normal;
        color: #666;
        line-height: 1.5;
      }
      .tip_new {
        padding-top: 0.2rem;
        color: #562683;
      }
      .b {
        // padding: 3px 5px;
        // background-color: #f7f7f7;
        color: #000;
        // border-radius: 3px;
        font-weight: bold;
      }
      .demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.2rem;
        margin: 0;
        .el-form-item {
          &.flex_left {
            width: 225px;
            @media screen and (max-width: 768px) {
              width: 100%;
            }
          }
          &.flex_right {
            width: calc(100% - 225px);
            @media screen and (max-width: 768px) {
              width: 100%;
            }
          }
          @media screen and (max-width: 768px) {
            width: 100% !important;
          }
          .el-form-item__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;
            .label {
              width: 100%;
              text-align: left;
              font-size: 15px;
              color: #666;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }
              .flex-row {
                display: flex;
                width: 100%;
                .el-select {
                  width: calc(100% - 30px);
                  @media screen and (max-width: 768px) {
                    width: 100%;
                  }
                }
                .el-form {
                  width: 100%;
                }
                .self-end {
                  width: 30px;
                  text-align: center;
                  @media screen and (max-width: 768px) {
                    display: none;
                  }
                }
              }
            }
            .el-input {
              font-size: inherit;
              .el-input__inner {
                height: auto;
                padding: 0.03rem 0.1rem;
                font-size: inherit;
              }
            }
          }
          .el-form-item__label {
            display: none;
          }
          &.is-error {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  border-color: #c37af9;
                }
                .el-input__validateIcon {
                  color: #c37af9;
                }
              }
            }
          }
        }
      }
      .el-button {
        width: calc(100% - 0.4rem);
        height: auto;
        padding: 0.1rem;
        margin: 0 0.2rem 0.2rem;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-family: inherit;
        font-size: 16px;
        font-weight: 500;
        line-height: 1;
        color: #f85149;
        word-break: break-word;
        white-space: normal;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }
        &:hover {
          opacity: 0.9;
          background: #fff;
          border-color: #f85149;
          span {
            cursor: inherit;
          }
        }
        &.is-disabled {
          opacity: 0.9;
        }
      }
      .generateDOI {
        width: auto;
        color: #606060;
      }
      .el-table {
        text-align: left;
        // border-top: 1px solid #e4e4e4;
        tr {
          th {
            padding: 0.05rem 0.2rem;
            .cell {
              padding: 0;
              font-family: "FIRACODE-BOLD";
              font-size: 17px;
              color: #000;
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 18px;
              }
            }
          }
          td {
            padding: 0;
            .cell {
              padding: 0.2rem;
              font-family: "FIRACODE-REGULAR";
              font-size: 15px;
              color: #606060;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }
              .current {
                padding: 0.03rem 0.07rem;
                background-color: #c37af9;
                color: #fff;
                border: 1px solid #8842fe;
                border-radius: 0.05rem;
                text-transform: uppercase;
                font-family: "Helvetica-Neue";
                font-size: 14px;
                line-height: 1;
                @media screen and (max-width: 768px) {
                  font-size: 13px;
                }
                @media screen and (min-width: 1800px) {
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
      .space_hardware {
        position: relative;
        padding: 0.3rem 0.2rem;
        color: #000;
        line-height: 1.5;
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
              display: flex;
              align-items: center;
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
            margin-top: 0.25rem;
            border-radius: 0.1rem;
            transition: all 0.3s;
            * {
              cursor: pointer;
            }
            &.active {
              background: linear-gradient(to bottom right, #eff6ff, #fff);
            }
            &:hover {
              box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0.05);
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
              .desc {
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
          &:nth-child(2) {
            margin-top: -0.25rem;
            @media screen and (max-width: 1200px) {
              margin-top: 0.2rem;
            }
          }
        }
      }
    }
  }
  :deep(.doi_body) {
    width: 40%;
    max-width: 770px;
    min-width: 300px;
    border-radius: 0.13rem;
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
      .tip_black {
        padding: 0.1rem 0.25rem;
        background-color: #f3f1ff;
        color: #562683;
        font-size: 15px;
        word-break: break-word;
        line-height: 1.3;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }
      .tip_black {
        background-color: transparent;
        color: #000;
        a {
          text-decoration: underline;
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
            cursor: pointer;
          }
        }
        &.is-disabled {
          opacity: 0.5;
          border-color: #e3e6eb;
        }
      }
    }
  }
  :deep(.sleep_body) {
    border-radius: 0.1rem;
    font-family: "Helvetica-light";
    .el-dialog__body {
      padding: 0.25rem 0.25rem 0.15rem;
      color: #000;
      .title {
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
          .desc {
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
            display: flex;
            align-items: center;
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
    }
    .el-dialog__footer {
      padding: 0 0.25rem 0.25rem;
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
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
