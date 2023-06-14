<template>
  <section class="profile_body" v-loading="loading" :element-loading-text="loadingText">
    <div class="list">
      <div class="title">
        Members
      </div>
    </div>

    <div class="token_list">
      <div class="title">
        <i class="icon icon_join"></i> Join settings
      </div>
      <div class="card">
        <div class="card_header">
          <el-checkbox-group v-model="radioLink">
            <el-checkbox :label="0">
              <div class="radio_left">
                <div class="title">Enable inviting users by sharing a link</div>
                <div class="tipText">
                  Anyone with the link will be able to join your org - Toggling off and on will regenerate the link.
                </div>
              </div>
              <el-button size="large" class="token_button token_manage">Email link</el-button>
            </el-checkbox>
            <el-checkbox :label="1">
              <div class="radio_left">
                <div class="title">Allow requests to join from the organization page</div>
                <div class="tipText">
                  A button will be visible on your org page allowing anyone to request to join.
                </div>
              </div>
            </el-checkbox>
            <el-checkbox :label="2" class="margin">
              <div class="radio_left">
                <div class="title">Automatically approve join requests</div>
                <div class="tipText">
                  For open organizations: anyone will be able to join your org without any approval.
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="card_body">
          <div class="title">Default role for new members </div>
          <el-select v-model="ruleForm.type" placeholder=" " :suffix-icon="CaretTop">
            <el-option v-for="item in ruleForm.typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div class="tipText">
            New members of the organization will be assigned this role. Visit the
            <a href="javascript:;" target="_blank">documentation</a> for more details.
          </div>
        </div>
      </div>
    </div>
    <div class="token_list">
      <div class="title">
        <i class="icon icon_user"></i> Organization Members
        <el-button size="large" class="token_button token_manage" @click="addVisible=true">
          <i class="icon icon_add"></i> Add user
        </el-button>
      </div>
      <div class="card card_small">
        <div class="card_header">
          <div class="card_left">
            <div class="width_div">
              <div class="logo_sidebar">
                <img :src="peopleUrl" alt="">
              </div>
              <div class="personal">
                <div class="title">
                  Cao
                  <b>·</b>
                  <small>ADMIN</small>
                </div>
                <div class="desc">Non-Profit</div>
              </div>
            </div>
          </div>
          <div class="card_right">
            <el-button size="large" class="token_button" @click="changeVisible=true">
              Change role
            </el-button>
            <el-button size="large" class="token_button" @click="deleteVisible=true">
              Remove
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="addVisible" custom-class="delete_body">
      <template #title>
        <div class="title">
          <i class="icon icon_add"></i> Add a user to Magic house
        </div>
      </template>
      <el-form ref="ruleFormRefDelete" status-icon>
        <el-form-item prop="agreeDoi" style="width:100%">
          <label class="label" for="dataname">
            Username
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.organization_name" placeholder="Username" />
          </div>
        </el-form-item>
        <el-form-item prop="role" style="width:100%">
          <label class="label" for="Role ">
            Role
          </label>
          <div class="flex flex-row">
            <el-select v-model="ruleForm.type" placeholder=" ">
              <el-option v-for="item in ruleForm.typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" class="is-width" :disabled="ruleForm.organization_name" @click="addVisible = false">
            Add user
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="changeVisible" custom-class="delete_body">
      <template #title>
        <div class="title">
          <i class="icon icon_change"></i> Change xxxxx's role
        </div>
      </template>
      <el-form ref="ruleFormRefDelete" status-icon>
        <el-form-item prop="role" style="width:100%">
          <label class="label" for="Role "></label>
          <div class="flex flex-row">
            <div class="change">
              <el-select v-model="ruleForm.type" placeholder=" " :suffix-icon="CaretTop">
                <el-option v-for="item in ruleForm.typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button type="primary">
                Save Changes
              </el-button>
            </div>
            <div class="tipText">
              <a href="javascript:;" target="_blank">Visit the documentation</a> to view the permissions for each role.
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer"></span>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteVisible" :show-close="false" custom-class="delete_body">
      <template #title>
        <div class="title">
          <i class="icon icon_delete"></i> Delete this organization
        </div>
      </template>
      <div class="tip">
        Deleting this organization will delete all its repositories (models, datasets, and Spaces). This organization name will be instantly available for other users. You will be immediately billed for any usage of paid services (such as AutoTrain)
        for the current month.
      </div>
      <el-form ref="ruleFormRefDelete" status-icon>
        <el-form-item prop="agreeDoi" style="width:100%">
          <label class="label" for="dataname">
            Enter organization name
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.organization_name" placeholder=" " />
          </div>
        </el-form-item>
        <el-form-item prop="agreeDoi" style="width:100%">
          <label class="label" for="dataname">
            Type "delete organization"
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.organization_type" placeholder=" " />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="ruleForm.organization_name && ruleForm.organization_type !== 'delete organization'" @click="deleteVisible = false">
            Delete organization
          </el-button>
          <el-button @click="deleteVisible = false">Cancel</el-button>
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
  Plus, CaretTop
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Plus, CaretTop
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const accessName = computed(() => (store.state.accessName))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const info = reactive({
      address: '',
      balance: ''
    })
    const profileName = ref('-')
    const ruleForm = reactive({
      name: store.state.accessName,
      email: '',
      password: '111',
      avatar: '',
      homepage: '',
      github: '',
      twitter: '',
      organization_name: '',
      organization_type: '',
      type: 'write',
      typeOptions: [
        {
          value: 'admin',
          label: 'admin '
        },
        {
          value: 'write',
          label: 'write'
        },
        {
          value: 'contributor',
          label: 'contributor'
        },
        {
          value: 'read',
          label: 'read'
        }
      ]
    })
    const fileList = ref([])
    const validateInput = (rule, value, callback) => {
      if (!value) callback()
      if (!isURL(value)) {
        callback(new Error("Please enter the web address"));
      } else {
        callback();
      }
    }
    const rules = reactive({
      name: [
        { required: true, message: 'Please fill in this field', trigger: 'blur' }
      ],
      homepage: [
        { validator: validateInput, trigger: "blur" }
      ]
    })
    const ruleFormRef = ref(null)
    const small = ref(false)
    const background = ref(false)
    const addVisible = ref(false)
    const changeVisible = ref(false)
    const deleteVisible = ref(false)
    const radioLink = ref([0])
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const peopleUrl = require("@/assets/images/dashboard/people_09.png")
    const loading = ref(true)
    const loadingText = ref('')
    const prevType = ref(true)
    const listLoad = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function isURL (str_url) {
      // var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      //   + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
      //   + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      //   + "|" // 允许IP和DOMAIN（域名）
      //   + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      //   + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      //   + "[a-z]{2,6})" // first level domain- .com or .museum
      //   + "(:[0-9]{1,4})?" // 端口- :80
      //   + "((/?)|" // a slash isn't required if there is no file name
      //   + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      // var re = new RegExp(strRegex);
      var re = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
      return re.test(str_url);
    }
    async function getdataList () {
      loading.value = false
      listLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}profile`, 'get')
      if (listRes && listRes.status === 'success') {
        store.dispatch('setAccessAvatar', listRes.data.user.avatar)
        store.dispatch('setAccessName', listRes.data.user.full_name)
        profileName.value = listRes.data.user.full_name
        ruleForm.name = listRes.data.user.full_name
        ruleForm.avatar = listRes.data.user.avatar
        ruleForm.homepage = listRes.data.user.homepage
        ruleForm.github = listRes.data.user.github_username
        ruleForm.twitter = listRes.data.user.twitter_username
      } else {
        reset()
        system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function changeNetChange (rows) {
      system.$commonFun.changeNet(rows)
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    function detailFun (row, index) {
      // console.log(row, index)
      router.push({ name: 'datasetDetail', params: { name: row.name, tabs: 'card' } })
    }
    const submitForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          listLoad.value = true
          if (fileList.value.length > 0) ruleForm.avatar = await editAvatar()
          let formData = new FormData()
          formData.append('full_name', ruleForm.name)
          formData.append('avatar', ruleForm.avatar || '')
          formData.append('homepage', ruleForm.homepage || '')
          formData.append('github_username', ruleForm.github || '')
          formData.append('twitter_username', ruleForm.twitter || '')
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}profile`, 'post', formData)
          if (listRes && listRes.status === 'success') {
            getdataList()
          }
          await system.$commonFun.timeout(500)
          system.$commonFun.messageTip('success', 'Update successfully!')
          listLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    function removeAvatar () {
      fileList.value = []
      ruleForm.avatar = ''
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
    async function editAvatar () {
      let fd = new FormData()
      fileList.value.forEach(file => {
        let fileNew = new File([file.raw], `${new Date().getTime() + file.name}`)
        fd.append('file', fileNew, `${new Date().getTime() + file.name}`)
        console.log('file', fileNew)
      })
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/profile/files`, 'post', fd)
      await system.$commonFun.timeout(500)
      if (uploadRes && uploadRes.status === "success") {
        if (uploadRes.data.files) return uploadRes.data.files[0].url
      }
      return ruleForm.avatar
    }
    function reset () {
      profileName.value = '-'
      ruleForm.name = ''
      ruleForm.avatar = ''
      ruleForm.homepage = ''
      ruleForm.github = ''
      ruleForm.twitter = ''
      fileList.value = []
    }
    onMounted(() => {
      // getdataList()
      loading.value = false
    })
    onActivated(() => {
      reset()
    })
    return {
      metaAddress,
      accessAvatar,
      accessName,
      navLogin, lagLogin, searchValue, value,
      info,
      ruleForm,
      ruleFormRef,
      rules,
      small,
      background,
      logoUrl,
      peopleUrl,
      system,
      loading,
      loadingText,
      profileName,
      prevType,
      listLoad,
      fileList,
      deleteVisible,
      addVisible,
      changeVisible,
      CaretTop,
      radioLink,
      getdataList, changeNetChange, momentFilter, detailFun, submitForm, editAvatar,
      handleChange, handleRemove, removeAvatar
    }
  }
})
</script>

<style lang="scss" scoped>
.profile_body {
  max-width: 850px;
  padding: 0 0 0.2rem;
  .label {
    font-size: 0.16rem;
    @media screen and (max-width: 441px) {
      font-size: 14px;
    }
    &.label_title {
      color: #000 !important;
    }
  }
  .lable_desc {
    display: block;
    width: 100%;
    max-width: 500px;
    font-size: 0.16rem;
    color: #606060;
    line-height: 1.5;
    @media screen and (max-width: 441px) {
      font-size: 14px;
    }
  }
  .avatar-uploader {
    margin-top: 0.15rem;
  }
  :deep(.token_list) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0.35rem 0 0.2rem;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      padding: 0.1rem 0 0;
      font-size: 0.18rem;
      line-height: 1.5;
      color: #565656;
      @media screen and (min-width: 1800px) {
        font-size: 0.2rem;
      }
      .icon {
        display: block;
        width: 18px;
        height: 18px;
        margin-right: 0.08rem;
      }
      .icon_join {
        background: url(../../../assets/images/icons/icon_43.png) no-repeat
          center;
        background-size: 100%;
      }
      .icon_user {
        background: url(../../../assets/images/icons/icon_44.png) no-repeat
          center;
        background-size: auto 100%;
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
      @media screen and (max-width: 441px) {
        font-size: 14px;
      }
    }
    .token_manage {
      height: auto;
      padding: 0.08rem 0.25rem;
      margin-left: 0.5rem;
      line-height: 1;
      @media screen and (max-width: 441px) {
        margin-top: 5px;
        margin-bottom: 5px;
      }
      &.is-disabled {
        opacity: 0.7;
      }
      .icon {
        display: block;
        width: 18px;
        height: 18px;
        margin-right: 0.1rem;
      }
      .icon_add {
        background: url(../../../assets/images/icons/icon_45.png) no-repeat
          center;
        background-size: 100%;
      }
    }
    .card {
      width: calc(100% - 0.6rem - 2px);
      padding: 0.12rem 0.3rem;
      margin: 0.2rem 0;
      background: #fbfbfc;
      border: 1px solid #e1e1e1;
      border-radius: 0.05rem;
      @media screen and (max-width: 600px) {
        width: calc(100% - 0.3rem - 2px);
        padding: 0.12rem 0.15rem;
      }
      &.card_small {
        max-width: 500px;
        width: calc(100% - 0.5rem - 2px);
        padding: 0.1rem 0.25rem;
      }
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
        .card_left {
          width: 60%;
          margin: 0;
          border: 0;
          text-align: left;
          color: #606060;
          .width_div {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            width: 90%;
            margin: 0;
          }
          .logo_sidebar {
            position: relative;
            display: block;
            width: 45px;
            height: 45px;
            background-color: #fff;
            border: 0.03rem solid #7405ff;
            border-radius: 100%;
            overflow: hidden;
            cursor: pointer;
            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 10px;
              cursor: pointer;
            }
          }
          .el-loading-mask {
            background-color: #fff;
            .el-loading-spinner {
              top: 50%;
            }
          }
          .personal {
            width: calc(100% - 51px - 0.1rem);
            margin: 0 0 0 0.1rem;
            .title {
              display: flex;
              align-items: center;
              padding: 0;
              margin: 0;
              font-size: 0.22rem;
              font-weight: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              word-spacing: normal;
              color: #000000;
              line-height: 1;
              @media screen and (min-width: 1800px) {
                font-size: 0.24rem;
              }
              b {
                margin: 0 0.1rem;
                font-size: 0.3rem;
                color: #c6c6c6;
              }
              small {
                padding: 0.05rem;
                background-color: #c27af8;
                font-size: 12px;
                border-radius: 3px;
                color: #fff;
                line-height: 1;
              }
            }
            .desc {
              font-size: 12px;
              color: #000;
              @media screen and (min-width: 1800px) {
                font-size: 14px;
              }
              @media screen and (max-width: 1440px) {
                font-size: 11px;
              }
            }
            .el-button {
              padding: 0.15rem 0.2rem;
              background: lighten($color: #f0f0f0, $amount: 0);
              border-radius: 0.07rem;
              color: #606060;
              font-family: inherit;
              &:hover {
                opacity: 0.95;
              }
            }
            .top_text {
              display: flex;
              align-items: center;
              margin: 0 0 0.2rem;
              color: #fff;
              font-family: "Helvetica-Bold";
              font-size: 0.2rem;
              .icon {
                display: block;
                width: 25px;
                height: 25px;
                margin: -1px 0.07rem 0 0;
                @media screen and (min-width: 1800px) {
                  width: 30px;
                  height: 30px;
                }
                @media screen and (max-width: 768px) {
                  width: 20px;
                  height: 20px;
                }
              }
              .icon_interests {
                background: url(../../../assets/images/icons/icon_28_1.png)
                  no-repeat left 0px;
                background-size: 100%;
              }
              .icon_organizations {
                background: url(../../../assets/images/icons/icon_35.png)
                  no-repeat 2px 0px;
                background-size: auto 100%;
              }
            }
          }
        }
        .card_right {
          .el-button {
            display: block;
            width: 100%;
            height: auto;
            padding: 0.07rem 0.15rem;
            margin: 0.05rem auto;
            border-color: #eaeaeb;
            border-radius: 0.06rem;
          }
        }
        .el-checkbox-group {
          width: 100%;
          .el-checkbox {
            width: 100%;
            margin: 0.08rem 0;
            height: auto;
            line-height: 1.2;
            &.margin {
              margin-left: 0.2rem;
            }
            .token_manage {
              margin: 0;
              @media screen and (max-width: 600px) {
                margin-top: 0.1rem;
              }
            }
            .el-checkbox__input {
              .el-checkbox__inner {
                width: 18px;
                height: 18px;
                background-color: #cccccd;
                border-radius: 100%;
                border: 0;
                transition: all 0s;
              }
              &.is-checked {
                .el-checkbox__inner {
                  background-color: #0da34a;
                  border-color: #0da34a;
                  &::after {
                    width: 100%;
                    height: 100%;
                    background: url(../../../assets/images/icons/icon_47.png)
                      no-repeat center;
                    background-size: 100%;
                    transform: none;
                    transition: all 0s;
                    border: 0;
                    left: 0;
                    top: 0;
                  }
                }
              }
            }
            .el-checkbox__label {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-wrap: wrap;
              width: calc(100% - 0.18rem - 18px);
              padding-left: 0.18rem;
              .radio_left {
                word-break: break-word;
                text-align: left;
                @media screen and (max-width: 600px) {
                  width: 100%;
                }
                .title {
                  padding: 0 0 0.05rem 0;
                  word-break: break-word;
                  white-space: normal;
                  line-height: 1.2;
                }
              }
            }
          }
        }
      }
      .card_body {
        padding: 0.3rem 0 0.1rem;
        text-align: left;
        .el-input {
          border-color: #ececed;
          .el-input__inner {
            height: auto;
            padding: 0.12rem 0.25rem 0.12rem 0.15rem;
            background-color: #fff !important;
            border-color: #ececed;
            line-height: 1;
          }
          .el-input__suffix {
            right: 12px !important;
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
        .el-select {
          width: 100%;
          max-width: 420px;
          margin: 0.05rem 0;
          path {
            color: #000;
          }
        }
      }
    }
  }
  .tipText {
    font-size: 12px;
    color: #afafaf;
    word-break: break-word;
    white-space: normal;
    @media screen and (min-width: 1800px) {
      font-size: 14px;
    }
    a {
      text-decoration: underline;
      color: inherit;
    }
  }
  :deep(.delete_body) {
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
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        padding: 0;
        font-size: 0.18rem;
        line-height: 1.5;
        color: #565656;
        @media screen and (min-width: 1800px) {
          font-size: 0.22rem;
        }
        .icon {
          display: block;
          width: 18px;
          height: 18px;
          margin-right: 0.08rem;
        }
        .icon_add {
          background: url(../../../assets/images/icons/icon_45.png) no-repeat
            center;
          background-size: auto 100%;
        }
        .icon_delete {
          background: url(../../../assets/images/icons/icon_46.png) no-repeat
            center;
          background-size: auto 100%;
        }
        .icon_change {
          background: url(../../../assets/images/icons/icon_44.png) no-repeat
            center;
          background-size: auto 100%;
        }
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
            .flex-row,
            .el-select {
              width: 100%;
              path {
                color: #000;
              }
              .change {
                display: flex;
                align-items: center;
                width: 100%;
                .el-button {
                  width: auto;
                  height: auto;
                  padding: 0.1rem 0.15rem;
                  margin: 0 0 0 0.15rem;
                  background: linear-gradient(180deg, #fefefe, #f0f0f0);
                  border-color: #dfdfdf;
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
            .el-input {
              .el-input__inner {
                // background: linear-gradient(180deg, #fefefe, #f0f0f0);
                border-color: #c6c6c6;
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
        padding: 0.1rem 0.15rem;
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
        &.is-width {
          width: 100%;
          padding: 0.1rem 0;
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
