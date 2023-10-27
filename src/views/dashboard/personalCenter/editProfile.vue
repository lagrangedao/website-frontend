<template>
  <section class="profile_body" v-loading="loading" :element-loading-text="loadingText">
    <div class="list">
      <div class="title flex-row">
        Profile Settings
      </div>
    </div>

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" v-loading="listLoad" class="demo-ruleForm list_body_spaces flex-row" status-icon>
      <el-form-item prop="name">
        <label class="label" for="dataname">
          Full name
        </label>
        <div class="flex flex-row">
          <el-input v-model="ruleForm.name" placeholder="Full name" />
        </div>
      </el-form-item>
      <el-form-item prop="avatar">
        <label class="label">
          Avatar
          <span class="span">(optional)</span>
        </label>
        <div class="flex flex-row">
          <el-upload class="avatar-uploader" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" action="#" :auto-upload="false">
            <el-button class="avatar-uploader-icon" type="" text bg>Upload file</el-button>
          </el-upload>
        </div>
        <div class="flex flex-row" v-if="ruleForm.avatar">
          <img class="img" :src="ruleForm.avatar" />
          <!-- <div class="remove" @click="removeAvatar">Remove</div> -->
        </div>
      </el-form-item>
      <el-form-item prop="homepage">
        <label class="label">
          Homepage
          <span class="span">(optional)</span>
        </label>
        <div class="flex flex-row">
          <el-input v-model="ruleForm.homepage" placeholder="Homepage" />
        </div>
      </el-form-item>
      <el-form-item prop="github">
        <label class="label">
          <i class="icon_media icon_github"></i>
          GitHub username
          <span class="span">(optional)</span>
        </label>
        <div class="flex flex-row">
          <el-input v-model="ruleForm.github" placeholder="GitHub username" />
        </div>
      </el-form-item>
      <el-form-item prop="twitter">
        <label class="label">
          <i class="icon_media icon_twitter"></i>
          Twitter username
          <span class="span">(optional)</span>
        </label>
        <div class="flex flex-row">
          <el-input v-model="ruleForm.twitter" placeholder="Twitter username" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="large" @click="submitForm('ruleFormRef')">Save changes </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Plus
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Plus
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
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
      name: '',
      avatar: '',
      homepage: '',
      github: '',
      twitter: ''
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
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const peopleUrl = require("@/assets/images/dashboard/people_default.png")
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
        store.dispatch('setAccessAvatar', listRes.data.user.avatar && store.state.gateway ? `${store.state.gateway}/ipfs/${listRes.data.user.avatar}` : '')
        store.dispatch('setAccessName', listRes.data.user.full_name)
        profileName.value = listRes.data.user.full_name
        ruleForm.name = listRes.data.user.full_name
        ruleForm.avatar = listRes.data.user.avatar && store.state.gateway ? `${store.state.gateway}/ipfs/${listRes.data.user.avatar}` : ''
        ruleForm.homepage = listRes.data.user.homepage
        ruleForm.github = listRes.data.user.github_username
        ruleForm.twitter = listRes.data.user.twitter_username
      } else {
        reset()
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
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
          fileList.value = []
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
        fd.append('avatar', fileNew, `${new Date().getTime() + file.name}`)
        // console.log('file', fileNew)
      })
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/profile/avatar`, 'post', fd)
      if (uploadRes && uploadRes.status === "success") {
        if (uploadRes.data) return `${store.state.gateway}/ipfs/${uploadRes.data.user.avatar}`
      } else system.$commonFun.messageTip('error', 'Failed to upload avatar!')
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
      getdataList()
    })
    onActivated(() => {
      reset()
    })
    return {
      metaAddress,
      accessAvatar,
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
      getdataList, detailFun, submitForm, editAvatar,
      handleChange, handleRemove, removeAvatar
    }
  }
})
</script>

<style lang="scss" scoped>
.profile_body {
  max-width: 850px;
  padding: 0 0 0.2rem;
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
