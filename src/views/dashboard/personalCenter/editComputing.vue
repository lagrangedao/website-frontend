<template>
  <section id="access_token">
    <el-row>
      <el-col :span="24" v-if="!settingShow">
        <div class="list">
          <div class="title">Computing Provider</div>
        </div>
        <div class="token_list" v-if="false">
          <div class="title">Computing Provider</div>
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
        </div>
        <div class="token_list">
          <div class="title">
            <div class="title_left">
              Your Computing Providers
              <el-button size="large" v-if="computeShow" class="token_button token_manage" @click="addVisible=true">Add</el-button>
              <el-button size="large" v-if="computeShow" class="token_button token_manage" @click="getdataList">Refresh</el-button>
            </div>
            <div class="title_right" v-if="!listLoad">
              <el-button size="large" class="token_button token_manage" @click="computeShow=false" v-if="computeShow">Cancel</el-button>
              <el-button size="large" class="token_button token_manage" @click="computeShow=!computeShow" :disabled="computeShow">Manage</el-button>
            </div>
          </div>
          <el-table :data="spData" ref="multipleTableRef" stripe style="width: 100%" v-loading="listLoad">
            <el-table-column prop="name" label="Name" min-width="120" />
            <el-table-column prop="node_id" label="Node ID" min-width="120" />
            <el-table-column label="Created At" min-width="120">
              <template #default="scope">
                <div>
                  <span>{{momentFilter(scope.row.created_at)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Updated At" min-width="120">
              <template #default="scope">
                <div>
                  <span>{{momentFilter(scope.row.updated_at)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Action">
              <template #default="scope">
                <el-icon @click="deleteCom(scope.row.name)">
                  <Delete />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="24" v-else>
        <div class="list">
          <div class="title">
            Setting
          </div>
        </div>

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
                <el-button class="avatar-uploader-icon uploader-btn" type="" @click="settingShow=false" text bg>Cancel</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog v-model="addVisible" title="Add computing provider" :show-close="false" custom-class="add_body">
      <el-form ref="ruleFormRefDelete" status-icon v-loading="listLoad">
        <el-form-item prop="name" style="width:100%">
          <label class="label" for="name">
            Name
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.name" placeholder=" " />
          </div>
        </el-form-item>
        <el-form-item prop="node_id" style="width:100%">
          <label class="label" for="node_id">
            Node ID
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.node_id" placeholder=" " />
          </div>
        </el-form-item>
        <el-form-item prop="multi_address" style="width:100%">
          <label class="label" for="multi_address">
            Multi Address
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.multi_address" placeholder=" " />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="!(ruleForm.name && ruleForm.node_id && ruleForm.multi_address)" @click="createCom">
            Add Computing Provider
          </el-button>
          <el-button @click="addVisible = false">Cancel</el-button>
        </span>
      </template>
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
  Delete, Setting
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Delete, Setting
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
    const multipleSelection = ref([])
    const multipleTableRef = ref(null)
    const ruleForm = reactive({
      name: '',
      node_id: '',
      multi_address: ''
    })
    const rules = reactive({
      name: [
        { required: true, message: 'Please fill in this field', trigger: 'blur' }
      ]
    })
    const fileList = ref([])
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
      computeShow.value = false
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
      listLoad.value = true
      let fd = new FormData()
      fd.append('name', ruleForm.name)
      fd.append('node_id', ruleForm.node_id)
      fd.append('multi_address', ruleForm.multi_address)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp`, 'post', fd, apiToken.value)
      if (listRes && listRes.status === 'success') {
        system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Success!')
        getdataList()
        computeShow.value = false
        addVisible.value = false
        return
      } else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      // await system.$commonFun.timeout(500)
      listLoad.value = false
      addVisible.value = false
    }
    async function deleteCom (comName) {
      listLoad.value = true
      let formData = new FormData()
      formData.append('name', comName)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp`, 'delete', formData, apiToken.value)
      if (listRes && listRes.status === 'success') system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Delete successfully!')
      else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Delete failed!')
      getdataList()
    }

    function copyName (text) {
      var txtArea = document.createElement('textarea')
      txtArea.id = 'txt'
      txtArea.style.position = 'fixed'
      txtArea.style.top = '0'
      txtArea.style.left = '0'
      txtArea.style.opacity = '0'
      txtArea.value = text
      document.body.appendChild(txtArea)
      txtArea.select()

      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'successful' : 'unsuccessful'
        console.log('Copying text command was ' + msg)
        if (successful) {
          system.$commonFun.messageTip('success', 'Copied')
          return true
        }
      } catch (err) {
        console.log('Oops, unable to copy')
      } finally {
        document.body.removeChild(txtArea)
      }
      return false
    }

    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    function calculateDiffTime (startTime) {
      var endTime = Math.round(new Date() / 1000)
      var timeDiff = endTime - startTime
      var year = timeDiff > (86400 * 365) ? parseInt(timeDiff / 86400 / 365) : 0
      var month = timeDiff > (86400 * 30) ? parseInt(timeDiff / 86400 / 30) : 0
      var day = parseInt(timeDiff / 86400)
      var hour = parseInt((timeDiff % 86400) / 3600)
      var minute = parseInt((timeDiff % 3600) / 60)
      var m = parseInt((timeDiff % 60))
      if (year > 0) return `about ${year}${year > 1 ? ' years' : ' year'} ago`
      if (month > 0) return `${month} ${month > 1 ? ' months' : ' month'} ago`
      if (day > 0) return `${day} ${day > 1 ? ' days' : ' day'} ago`
      else if (hour > 0) return `${hour} ${hour > 1 ? ' hours' : ' hour'} ago`
      else if (minute > 0) return `${minute} ${minute > 1 ? ' minutes' : ' minute'} ago`
      else if (m > 0) return `${m} ${m > 1 ? ' seconds' : ' second'} ago`
      else return '-'
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
    onMounted(() => {
      getdataList()
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
      rules,
      getdataList, createCom, deleteCom, copyName, detailSetting, calculateDiffTime, momentFilter, handleChange, handleRemove, handleSelectionChange
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
    margin: 0 0 0.2rem;
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
        font-size: 0.2rem;
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
        font-size: 0.17rem;
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
      width: calc(100% - 0.24rem);
      max-width: 620px;
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
    .el-table {
      margin: 0.2rem 0 0;
      border-radius: 0.1rem;
      tr {
        th,
        td {
          word-break: break-word;
          text-align: center;
          border: 0;
          .cell {
            font-size: 12px;
            line-height: 1.3;
            color: #606060;
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
            span {
              word-break: break-word;
            }
          }
        }
        th {
          padding: 0.15rem 0;
          background-color: #7405ff;
          font-weight: normal;
          .cell {
            color: #fff;
            text-transform: uppercase;
          }
        }
        td {
          &:nth-child(1) {
            .cell {
              color: #7405ff;
            }
          }
        }
        .el-icon {
          font-size: 0.18rem;
          cursor: pointer;
          svg,
          path {
            cursor: pointer;
          }
        }
        &.el-table__row--striped {
          td.el-table__cell {
            background: #f9fafc;
          }
        }
      }
    }
  }
  .uploader-btn {
    margin-top: 0.4rem;
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
