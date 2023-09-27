<template>
  <section id="access_token">
    <el-row>
      <el-col :span="24">
        <div class="list">
          <div class="title">As Client</div>
        </div>
        <div class="token_list">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Profile" name="profile">
              <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm list_body_spaces" status-icon>
                <el-form-item prop="name">
                  <label class="label" for="dataname">
                    Username
                  </label>
                  <div class="flex flex-row">
                    <el-input v-model="ruleForm.name" placeholder="Username" />
                  </div>
                </el-form-item>
                <el-form-item prop="email">
                  <label class="label" for="dataname">
                    Primary email
                  </label>
                  <div class="flex flex-row">
                    <el-input v-model="ruleForm.email" placeholder="Primary email" />
                    <small>We will use this email to communicate with you. This is also the email to use to authenticate on hf.co.</small>
                  </div>
                </el-form-item>
                <el-form-item prop="avatar">
                  <label class="label">
                    Logo
                    <span class="span">(optional)</span>
                  </label>
                  <div class="flex flex-row">
                    <el-upload class="avatar-uploader" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" action="#" :auto-upload="false">
                      <!-- <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" /> -->
                      <el-button class="avatar-uploader-icon" type="" text bg>Upload file</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item prop="">
                  <div class="flex flex-row">
                    <div class="avatar-uploader">
                      <el-button class="avatar-uploader-icon uploader-btn" type="" text bg>Save changes</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Password" name="password">
              <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm list_body_spaces" status-icon>
                <el-form-item prop="name">
                  <label class="label" for="password">
                    Current Password
                  </label>
                  <div class="flex flex-row">
                    <el-input v-model="ruleForm.password" placeholder="Old Password" />
                  </div>
                </el-form-item>
                <el-form-item prop="new_password">
                  <label class="label" for="new_password">
                    New Password
                  </label>
                  <div class="flex flex-row">
                    <el-input v-model="ruleForm.new_password" placeholder="New Password" />
                  </div>
                </el-form-item>
                <el-form-item prop="new_password_again">
                  <label class="label" for="new_password_again">
                    Reenter New Password
                  </label>
                  <div class="flex flex-row">
                    <el-input v-model="ruleForm.new_password_again" placeholder="Confirm Password" />
                  </div>
                </el-form-item>
                <el-form-item prop="">
                  <div class="flex flex-row">
                    <div class="avatar-uploader">
                      <el-button class="avatar-uploader-icon uploader-btn" type="" text bg>Save changes</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Payment" name="payment">
              <div class="card">
                <div class="card_header">
                  <div class="card_left">
                    <div class="face"></div>
                    <div class="name">
                      User Name
                      <small>No Data</small>
                    </div>
                  </div>
                  <div class="card_right">
                    <el-button size="large" class="token_button token_setting" @click="settingShow=true">
                      <el-icon>
                        <Setting />
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Developer Setting" name="developer_setting">
              <div class="user_contRight">
                <h4>Your API keys</h4>
                <h6>API keys provide full access to your swan account, so keep them safe.
                  <a href="javascript:;" @click="apiTips=true">Tips on keeping API keys secure.</a>
                  <a href="javascript:;" target="_blank">How to use API key.</a>
                </h6>
                <div class="form_table">
                  <el-button type="primary" class="new_api" @click="addVisible=true">New API Key</el-button>
                  <el-table :data="toolData" style="width: 100%" empty-text="No Data" class="table_cell">
                    <el-table-column prop="key_name" label="NAME"></el-table-column>

                    <el-table-column prop="apikey" label="KEY"></el-table-column>
                    <el-table-column prop="token" label="ACCESS TOKEN">
                      <template>*******</template>
                    </el-table-column>
                    <el-table-column prop="created_on" label="DATA CREATED">
                      <template #default="scope">
                        <div style="">
                          {{scope.row.created_on}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="status" label="STATUS" width="85"></el-table-column>
                    <el-table-column prop="qr_code" width="85" label="">
                      <template #default="scope">
                        <div class="revoke">
                          <el-button type="danger" :disabled="scope.row.status == 'Deleted'?true:false" @click="deleteApiKey(scope.row.apikey)">Revoke</el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Payment Method" name="payment_method">
              <div class="rightCont">
                <h3>NBAI Wallet</h3>
                <div class="main_second">
                  <el-button type="primary">
                    <el-icon>
                      <CirclePlusFilled />
                    </el-icon>
                    Add a card</el-button>
                  <div class="main_second_right">
                    <h5>*You can only add a Canadian credit cards.</h5>
                    <h5>*To verify your credit card, we will charge $0.01 from your card.</h5>
                  </div>
                </div>
                <div class="main_six">
                  <h2>Credit Cards</h2>
                </div>

                <el-form :model="ruleFormSecond" status-icon :rules="rulesSecond" ref="ruleFormSecond" class="demo-ruleForm">
                  <el-form-item label="Card number*" prop="cardNumber" :class="{'borderColor': ruleFormSecond.cardNumber_tip}">
                    <el-input v-model="ruleFormSecond.cardNumber" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Expiration date*" prop="expiration">
                    <el-col :span="24" style="display: flex;justify-content: space-between;">
                      <el-select v-model="expiration_month" placeholder="">
                        <el-option v-for="item in expiration_month_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>

                      <el-select v-model="expiration_year" placeholder="">
                        <el-option v-for="item in expiration_year_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="CVV*" prop="cvd">
                    <el-input type="text" v-model="ruleFormSecond.cvd" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Phone*" prop="cphone" :class="{'borderColor': ruleFormSecond.cphone_tip}">
                    <el-input v-model="ruleFormSecond.cphone" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Email*" prop="cemail">
                    <el-input type="text" v-model="ruleFormSecond.cemail" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Street number*" prop="streetnumber">
                    <el-input type="text" v-model="ruleFormSecond.streetnumber" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Street name*" prop="streetname">
                    <el-input type="text" v-model="ruleFormSecond.streetname" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="ZIP*" prop="postcode">
                    <el-input type="text" v-model="ruleFormSecond.postcode" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item label=" " class="">
                    <el-button class="avatar-uploader-icon" type="" text bg disabled>Add Credit card</el-button>
                    <el-button class="avatar-uploader-icon" type="" text bg>Cancel</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="addVisible" title="Create A Key" :show-close="false" custom-class="add_body">
      <el-form ref="ruleFormRefDelete" status-icon v-loading="listLoad">
        <el-form-item prop="name" style="width:100%">
          <label class="label" for="name">
            Name
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.name" placeholder=" " />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="!ruleForm.name" @click="createCom">
            Create
          </el-button>
          <el-button @click="addVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="apiTips" :title="apiCont.accessToken?'API token successfully created':'Important'" :show-close="true" custom-class="add_body">
      <div class="apiTipCont" v-if="apiCont.accessToken">
        <p>This token is your private secret to access Filswan platform services.</p>
        <p>The secret key is only displayed once. You’ll need to copy it somewhere safe before continuing.</p>

        <p style="margin-top:0.25rem;font-size: 0.15rem;">
          <b>Your new API Key is：</b>
        </p>
        <p style="text-indent:0.1rem">{{apiCont.apiKey}}</p>

        <p style="font-size: 0.15rem;">
          <b>Your new Access Token is：</b>
        </p>
        <p style="text-indent:0.1rem">{{apiCont.access}}
          <span class="el-icon-document-copy" @click="system.$commonFun.copyContent(apiCont.access, 'Copied')"></span>
        </p>
      </div>
      <div class="apiTipCont" v-else>
        <p>When you generate your keys, you will see a modal with the Swan API Key, Swan API Secret, and the JWT.</p>
        <p>Your "Swan API Key" acts as your public key for our REST API, and your "Swan Secret API Key" acts as the password for your public key. The JWT is an encoded mix of the two. Be sure to keep your secret key private!</p>
        <p>For added customer security, these keys are encrypted on Swan's side and will only ever be displayed once, so write them down. If you lose these values you'll need to revoke the key and create a new one.</p>
      </div>
    </el-dialog>
  </section>
</template>
<script>
const ethereum = window.ethereum;
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Delete, Setting, CirclePlusFilled
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Delete, Setting, CirclePlusFilled
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const listLoad = ref(false)
    const tokenShow = ref(false)
    const computeShow = ref(false)
    const addVisible = ref(false)
    const settingShow = ref(false)
    const apiToken = ref('')
    const spData = ref([])
    const activeName = ref('profile')
    const multipleSelection = ref([])
    const multipleTableRef = ref(null)
    const ruleForm = reactive({
      name: '',
      node_id: '',
      multi_address: '',
      password: '',
      new_password: '',
      new_password_again: ''
    })
    const rules = reactive({
      name: [
        { required: true, message: 'Please fill in this field', trigger: 'blur' }
      ]
    })
    const apiTips = ref(false)
    const apiCont = reactive({
      accessToken: false,
      apiKey: '',
      access: ''
    })
    const ruleFormSecond = reactive({
      cardNumber: "",
      cardNumber_tip: false,
      cvd: "",
      cphone: "",
      cphone_tip: false,
      cemail: '',
      streetnumber: "",
      streetname: "",
      postcode: "",
      checked: false
    })
    const rulesSecond = reactive({
      cardNumber: [{ required: true, message: " ", trigger: "blur" }],
      cvd: [{ required: true, message: " ", trigger: "blur" }],
      cphone: [{ required: true, message: " ", trigger: "blur" },
      { min: 10, max: 16, message: ' ', trigger: 'blur' }],
      cemail: [
        { required: true, message: " ", trigger: "blur" },
        { type: "email", message: " ", trigger: ["blur", "change"] }
      ],
      streetnumber: [{ required: true, message: " ", trigger: "blur" }],
      streetname: [{ required: true, message: " ", trigger: "blur" }],
      postcode: [{ required: true, message: " ", trigger: "blur" }]
    })
    const expiration_month = ref("01")
    const expiration_month_options = ref([])
    const expiration_year = ref("")
    const expiration_year_options = ref([])
    const addCreditcards = ref(false)
    const fileList = ref([])
    const toolData = ref([])
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function getToken () {
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token`, 'get')
      if (listRes && listRes.status === 'success') {
        if (listRes.data) return listRes.data.token.token
        // else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      }
      return ''
    }
    async function getdataList () {
      listLoad.value = true
      spData.value = []
      apiToken.value = await getToken()
      // if (!apiToken.value) return
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp`, 'get', '', apiToken.value)
      if (listRes && listRes.status === 'success') {
        if (listRes.data) spData.value = listRes.data.computing_providers
      } else {
        spData.value = []
        system.$commonFun.messageTip('error', listRes.error ? listRes.error : 'Failed!')
        return
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function createCom () {
      // listLoad.value = true
      // let fd = new FormData()
      // fd.append('name', ruleForm.name)
      // fd.append('node_id', ruleForm.node_id)
      // fd.append('multi_address', ruleForm.multi_address)
      // const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp`, 'post', fd, apiToken.value)
      // if (listRes && listRes.status === 'success') {
      //   system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Success!')
      //   getdataList()
      //   computeShow.value = false
      //   addVisible.value = false
      //   return
      // } else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      // // await system.$commonFun.timeout(500)
      // listLoad.value = false
      addVisible.value = false
    }
    async function deleteCom (comName) {
      listLoad.value = true
      let formData = new FormData()
      formData.append('name', comName)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/delete`, 'post', formData, apiToken.value)
      if (listRes && listRes.status === 'success') system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Delete successfully!')
      else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Delete failed!')
      getdataList()
    }

    function detailSetting () {
      // router.push({ name: 'organizationsSettings', params: { submenu: 'profile' } })
    }

    function handleChange (uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles)
      fileList.value = []
      if (uploadFile) fileList.value.push(uploadFile)
      // console.log(fileList.value)
    }
    function handleRemove (file, uploadFiles) {
      // console.log(file, uploadFiles)
      fileList.value = []
    }
    function handleSelectionChange (val) {
      multipleSelection.value = val
      console.log(val)
    }
    function getYear () {
      let tMonth = new Array();
      for (let month = 1; month < 13; month++) {
        let anOption = {
          value: month < 10 ? "0" + month : month,
          label: month < 10 ? "0" + month : month
        };
        tMonth.push(anOption);
      }
      expiration_month_options.value = tMonth;

      let nfOptionsArray = new Array();
      let tYear = new Date().getFullYear();
      for (let i = tYear; i <= tYear + 20; i++) {
        let anOption = {
          value: i,
          label: i
        };
        nfOptionsArray.push(anOption);
      }
      expiration_year.value = tYear;
      expiration_year_options.value = nfOptionsArray;
    }
    onMounted(() => {
      getdataList()
      getYear()
    })
    onActivated(() => {
      spData.value = []
    })
    return {
      metaAddress,
      accessAvatar,
      navLogin,
      lagLogin,
      system,
      spData,
      listLoad,
      tokenShow,
      computeShow,
      addVisible,
      ruleForm,
      fileList,
      settingShow,
      multipleSelection,
      multipleTableRef,
      activeName,
      rules,
      toolData,
      apiTips,
      apiCont,
      ruleFormSecond,
      rulesSecond,
      addCreditcards,
      expiration_month,
      expiration_month_options,
      expiration_year,
      expiration_year_options,
      getdataList, createCom, deleteCom, detailSetting, handleChange, handleRemove, handleSelectionChange
    }
  }
})
</script>

<style lang="scss" scoped>
#access_token {
  position: relative;
  max-width: 850px;
  padding: 0.15rem 0 0.2rem;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.token_list) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0.35rem 0 0.2rem;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      padding: 0.35rem 0 0;
      font-size: 0.18rem;
      line-height: 1.5;
      @media screen and (min-width: 1800px) {
        font-size: 0.22rem;
      }
    }
    .desc {
      padding: 0.1rem 0;
      font-size: 0.16rem;
      line-height: 1.5;
      color: #606060;
      @media screen and (min-width: 1800px) {
        font-size: 0.2rem;
      }
      @media screen and (max-width: 768px) {
        font-size: 14px;
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
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }
    .token_manage {
      height: auto;
      padding: 0.07rem 0.15rem;
      margin-left: 0.1rem;
      line-height: 1;
      @media screen and (max-width: 441px) {
        margin-top: 5px;
        margin-bottom: 5px;
      }
      &.is-disabled {
        opacity: 0.7;
      }
    }
    .card {
      width: calc(100% - 0.24rem - 2px);
      padding: 0.12rem;
      margin: 0.2rem 0;
      background: linear-gradient(180deg, #fefefe, #f0f0f0);
      border: 1px solid #e1e1e1;
      border-radius: 0.05rem;
      .card_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.18rem;
        color: #565656;
        @media screen and (min-width: 1800px) {
          font-size: 0.22rem;
        }
        .face {
          width: 0.6rem;
          height: 0.6rem;
          margin-right: 0.05rem;
          background-color: #7405ff;
          border-radius: 0.05rem;
        }
        .card_left,
        .card_right {
          display: flex;
          align-items: center;
          .token_setting {
            padding: 0.12rem;
            font-size: 0.22rem;
            cursor: pointer;
          }
        }
        .card_left {
          align-items: stretch;
          color: #606060;
          .name {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-left: 0.1rem;
            color: #565656;
            small {
              display: block;
              width: 100%;
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
            display: flex;
            align-items: center;
            height: 100%;
          }
          .icon_copy {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(../../../assets/images/icons/icon_36_1.png)
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
          .icon_look {
            width: 20px;
            height: 20px;
            margin: 0 0.1rem 0 0;
            background: url(../../../assets/images/icons/icon_42.png) no-repeat
              left center;
            background-size: auto 100%;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              width: 22px;
              height: 22px;
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
    .el-tabs {
      width: 100%;
      .el-tabs__item {
        @media screen and (min-width: 1800px) {
          font-size: 16px;
        }
        &.is-active {
          color: #000;
        }
      }
      .list_body_spaces {
        margin-top: 0.1rem !important;
      }
      .el-tabs__active-bar {
        height: 1px;
        background: #000;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
    .user_contRight {
      margin-top: 0.1rem;
      h4 {
        margin: 0 0 0.15rem;
        font-size: 0.162rem;
        font-weight: normal;
        color: #000;
        line-height: 1.5;
        @media screen and (max-width: 768px) {
          font-size: 15px;
        }
      }
      h6 {
        font-size: 0.12rem;
        font-weight: normal;
        color: #222;
        line-height: 1.3;
        @media screen and (min-width: 1800px) {
          font-size: 14px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
        a {
          margin-right: 0.08rem;
          color: #7405ff;
          text-decoration: underline;
        }
      }
      .checkDataCap {
        float: left;
        margin: 0 0 0.2rem;
        padding: 0.1rem 0.15rem;
        border-radius: 0.05rem;
        font-size: 0.1372rem;
        font-weight: 600;
        color: #409eff;
        background-color: #fff;
        border: 0.015rem solid #409eff;
      }
      .form_table {
        margin: 0.24rem 0 0.1rem;
        .table_cell {
          .cell {
            padding: 0;
            font-size: 0.13rem;
            font-weight: 500;
            word-break: break-word;
            color: #000;
            text-align: center;
            line-height: 0.23rem;
            @media screen and (min-width: 1800px) {
              font-size: 16px;
            }
          }
        }
        .el-table {
          border-top: 1px solid #f1f1f1;
          border-bottom: 1px solid #cacaca;
          .el-table__header-wrapper {
            .has-gutter {
              tr {
                background-color: #f2f2f2;
              }
            }
          }
          tr {
            border-radius: 0.08rem;
            th {
              height: 0.5rem;
              padding: 0;
              text-align: center;
              border-bottom: 1px solid #f1f1f1;
              .cell {
                word-break: break-word;
                font-weight: 500;
                color: #565656;
              }
            }
            th:first-child {
              border-top-left-radius: 0.08rem;
              border-bottom-left-radius: 0.08rem;
            }
            th:last-child {
              border-top-right-radius: 0.08rem;
              border-bottom-right-radius: 0.08rem;
            }
            td {
              border-top: 1px solid #f1f1f1;
              .cell {
                padding: 0;
                font-size: 0.1372rem;
                word-break: break-word;
                color: #000;
                text-align: center;
                line-height: 0.25rem;
                .el-rate__icon {
                  font-size: 0.16rem;
                  margin-right: 0;
                  @media screen and (max-width: 768px) {
                    font-size: 14px;
                  }
                }
                .hot-cold-box {
                  .el-button {
                    width: auto;
                    min-width: 0.5rem;
                    padding: 0;
                    background: #7ecdf4;
                    border: 0;
                    color: #fff;
                    line-height: 0.3rem;
                    cursor: pointer;
                  }
                }
                .el-button.el-icon-upload {
                  padding: 0 0.1rem;
                  line-height: 0.25rem;
                  font-size: 0.1372rem;
                }
                .bot {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  p {
                    font-size: 0.1372rem;
                    padding: 0 0.08rem;
                    margin: 0 0.05rem;
                    border: 1px solid #0b318f;
                    border-radius: 0.05rem;
                    cursor: pointer;
                  }
                  p.color {
                    background: #0b318f;
                    color: #fff;
                  }
                  .el-radio {
                    margin: 0;
                    .el-radio__input {
                      display: none;
                    }
                    .el-radio__label {
                      display: block;
                      font-size: 0.1372rem;
                      padding: 0 0.04rem;
                      margin: 0 0.01rem;
                      border: 1px solid #0b318f;
                      border-radius: 0.05rem;
                      cursor: pointer;
                      line-height: 1.8;
                    }
                    .el-radio__input.is-checked + .el-radio__label {
                      background: #0b318f;
                      color: #fff;
                    }
                  }
                }
              }
            }
            td.el-table_1_column_1 {
              .cell {
                // color:#0c3090
              }
            }
          }
        }
        .el-button {
          float: left;
          margin: 0.2rem 0;
          padding: 0.2rem 0.25rem;
          background-color: #c27af8;
          border-color: #c27af8;
          border-radius: 0.08rem;
          font-size: 0.16rem;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
        }
        .revoke {
          .el-button {
            float: right;
            padding: 0.05rem 0.1rem;
            margin: 0 auto;
            border-radius: 4px;
            font-size: 0.12rem;
          }
        }
      }
    }
    .rightCont {
      margin: 0.1rem 0 0;
      background: #fff;
      color: #575962;
      .el-form {
        padding: 0;
        max-width: 700px;
        .el-form-item {
          display: flex;
          align-items: center;
          .el-form-item__label {
            width: 160px;
            padding: 0 0.15rem 0 0;
            color: #919191;
            font-size: 0.18rem;
            font-weight: 400;
            text-align: left;
            line-height: inherit;
            &::before {
              display: none;
            }
          }
          .el-form-item__content {
            width: calc(100% - 190px);
            // padding: 0 0.15rem;
            .el-input__inner {
              // border-color: #ebedf2;
              color: #575962;
            }
          }
        }
        .borderColor {
          .el-form-item__content {
            .el-input__inner {
              border-color: #f56c6c;
            }
          }
        }
      }
      .avatar-uploader-icon {
        padding: 0.15rem 0.2rem;
        margin: 0 0.1rem 0.1rem 0;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        border-radius: 0.07rem;
        color: #606060;
        font-family: inherit;
        &:hover {
          opacity: 0.95;
          border-color: #c37af9;
        }
        &.is-disabled {
          opacity: 0.7;
        }
      }
      h3 {
        margin: 0 0 0.2rem;
        font-size: 0.24rem;
        font-weight: 500;
        line-height: 1.1;
        color: #000;
      }
      h5 {
        margin: 0 0 0.14rem;
        font-size: 0.14rem;
        font-weight: 500;
        line-height: 1.5;
        color: #212529;
      }
      .main_third {
        display: flex;
        align-items: center;
        margin: 0 0 0.2rem;
        h5 {
          margin: 0 0.3rem;
        }
      }
      .main_second {
        display: flex;
        .el-button {
          margin: 0;
          padding: 0.2rem 0.25rem;
          background-color: #c27af8;
          border-color: #c27af8;
          border-radius: 0.08rem;
          font-size: 0.16rem;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
          i {
            margin-right: 0.08rem;
          }
        }
        .main_second_right {
          padding-left: 0.2rem;
          h5 {
            margin: 0;
            font-size: 0.15rem;
            color: #919191;
            @media screen and (max-width: 768px) {
              font-size: 13px;
            }
          }
        }
      }
      .main_six {
        padding: 0.42rem 0 0.2rem;
        h2 {
          margin: 0 0 0.14rem;
          font-size: 0.18rem;
          font-weight: 500;
          line-height: 1.1;
          color: #565656;
        }
        .main_six_cont {
          display: flex;
          align-items: center;
        }
      }
      .refer_list {
        width: 100%;
        text-align: center;
      }
    }

    @media screen and (max-width: 999px) {
      .rightCont {
        .el-form {
          .el-form-item {
            .el-form-item__label {
              width: 35%;
              padding: 0;
              text-align: left;
            }
            .el-form-item__content {
              width: 65%;
            }
          }
        }
        .main_second {
          flex-wrap: wrap;
          .main_second_right {
            width: 100%;
            padding: 0;
            margin: 0.2rem 0 0;
          }
        }
        .main_third {
          font-size: 0.14rem;
          h5 {
            margin: 0;
          }
        }
      }
    }
  }
  .uploader-btn {
    margin-top: 0.2rem;
  }
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 1);
    .el-loading-spinner {
      top: 30%;
    }
  }
  :deep(.add_body) {
    width: 40%;
    max-width: 770px;
    min-width: 310px;
    border-radius: 0.13rem;
    text-align: left;
    @media screen and (max-width: 768px) {
      width: 60%;
    }
    @media screen and (max-width: 441px) {
      width: 90%;
    }
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
        padding: 0.15rem 0.25rem 0;
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
                // background: linear-gradient(180deg, #fefefe, #f0f0f0);
              }
            }
          }
        }
      }
      .apiTipCont {
        padding: 0.15rem 0.25rem;
        p {
          margin-bottom: 0.15rem;
          line-height: 1.5;
          word-break: break-word;
          @media screen and (min-width: 1800px) {
            font-size: 16px;
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
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
