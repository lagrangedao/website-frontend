<template>
  <section id="dataset">
    <el-row class="dataset_body">
      <header>
        <div class="title">{{route.params.name}}{{labelTab === 'upload'?'/':''}}</div>
        <el-dropdown trigger="click" @command="handleCommand" v-if="labelTab === 'list'">
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <Plus />
            </el-icon>
            Add file
            <el-icon class="el-icon--right">
              <caret-bottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="create">Create a new file</el-dropdown-item>
              <el-dropdown-item command="upload">Upload files</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </header>
      <div class="fileList">
        <el-table v-if="labelTab === 'list'" :data="filedata" :table-layout="tableLayout" v-loading="listLoad" style="width: 100%">
          <el-table-column label="name">
            <template #default="scope">
              <el-icon>
                <Document />
              </el-icon>
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="cid">
            <template #default="scope">
              {{scope.row.cid}}
            </template>
          </el-table-column>
          <el-table-column label="url">
            <template #default="scope">
              <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
            </template>
          </el-table-column>
          <el-table-column label="Created At" align="right">
            <template #default="scope">
              <div>
                <span>{{ momentFilter(scope.row.created_at) }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="labelTab === 'upload'" class="uploadBody">
          <el-tabs type="border-card" v-loading="uploadLoad">
            <el-tab-pane label="Upload file(S）">
              <el-upload class="upload-demo" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" action="#" drag multiple :auto-upload="false">
                <div class="el-upload__text">
                  Drop file here or
                  <em>click to upload</em>
                </div>
                <!-- <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template> -->
              </el-upload>
              <el-form :label-position="'top'" ref="ruleFormRef" :model="info" :rules="rules">
                <el-form-item label="Commit changes" prop="name">
                  <el-input v-model="info.name" :placeholder="'Upload '+fileList.length+' files'" />
                </el-form-item>
              </el-form>
              <el-button-group class="ml-4">
                <el-button @click="commitFun" :disabled="fileList.length===0">Commit changes</el-button>
                <el-button @click="labelTab = 'list'">Cancel</el-button>
              </el-button-group>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom,
  Document,
  Plus,
  UploadFilled
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom,
    Document,
    Plus,
    UploadFilled
  },
  setup () {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const tableLayout = ref('fixed')
    const labelTab = ref('list')
    const listdata = reactive({})
    const filedata = ref([])
    const listLoad = ref(false)
    const uploadLoad = ref(false)
    const fileList = ref([])
    const info = reactive({
      name: '',
      desc: ''
    })
    const rules = reactive({
      // name: [
      //   { required: true, message: 'Please fill in this field', trigger: 'blur' }
      // ]
    })
    const ruleFormRef = ref(null)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function init () {
      if (route.name !== 'datasetDetail') return
      listLoad.value = true
      listdata.value = {}
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        filedata.value = listRes.data.files || []
        listdata.value = listRes.data.dataset || { name: route.params.name }
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function handleCommand (command) {
      if (command === 'upload') labelTab.value = command
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    function handleChange (uploadFile, uploadFiles) {
      // console.log(uploadFile, uploadFiles)
      fileList.value = uploadFiles
      // console.log(fileList.value)
    }
    function handleRemove (file, uploadFiles) {
      // console.log(file, uploadFiles)
      fileList.value = uploadFiles
    }
    async function commitFun () {
      if (fileList.value.length === 0) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          uploadLoad.value = true
          let fd = new FormData()
          fileList.value.forEach(file => {
            let fileNew = new File([file.raw], file.name)
            fd.append('file', fileNew, file.name)
          })
          // fd.append("is_public", listdata.value.is_public)
          // fd.append("name", info.name || `${'Upload ' + fileList.value.length + ' files'}`)
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}/files`, 'put', fd)
          await system.$commonFun.timeout(500)
          if (uploadRes && uploadRes.status === "success") {
            if (uploadRes.data.files) system.$commonFun.messageTip('success', 'Upload files successfully!')
            else system.$commonFun.messageTip('error', uploadRes.data.message)
          } else system.$commonFun.messageTip('error', 'Upload failed!')
          reset()
          init()
        } else {
          console.log('error submit!', fields)
          reset()
          return false
        }
      })
    }
    function reset () {
      labelTab.value = 'list'
      uploadLoad.value = false
      fileList.value = []
      info.name = ''
    }
    onMounted(() => {
      init()
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    watch(route, (to, from) => {
      reset()
      init()
      window.scrollTo(0, 0)
    })
    return {
      lagLogin,
      tableLayout,
      labelTab,
      listdata,
      filedata,
      listLoad,
      fileList,
      info,
      rules,
      ruleFormRef,
      uploadLoad,
      system,
      route,
      router,
      init, handleCommand, momentFilter, handleChange, handleRemove, commitFun
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.dataset_body) {
    display: flex;
    align-items: stretch;
    padding: 0.4rem 0;
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
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      .title {
        padding: 3px 0;
        font-size: 16px;
        color: #606060;
        line-height: 1.2;
        @media screen and (min-width: 1800px) {
          font-size: 18px;
        }
      }
      .el-dropdown {
        width: auto;
        padding: 7px 12px;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        border: 1px solid #e1e1e1;
        font-size: 15px;
        line-height: 1;
        border-radius: 0.09rem;
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 13px;
        }
      }
    }
    .fileList {
      width: 100%;
      margin: 0.2rem 0 0;
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      overflow: hidden;
      .el-table {
        tr {
          th,
          td {
            padding: 0.1rem 0;
            font-size: 15px;
            color: #878c93;
            @media screen and (max-width: 1600px) {
              font-size: 13px;
            }
            @media screen and (max-width: 768px) {
              font-size: 12px;
            }
            .cell {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 1.5;
              word-break: break-word;
              i {
                font-size: 14px;
              }
              a {
                color: inherit;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          th {
            font-size: 16px;
            font-weight: normal;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            text-transform: uppercase;
            color: #606060;
            @media screen and (max-width: 1600px) {
              font-size: 14px;
            }
            @media screen and (max-width: 768px) {
              font-size: 13px;
            }
          }
        }
      }
      .uploadBody {
        width: 100%;
        .el-tabs {
          .el-tabs__header {
            max-width: none;
            padding: 0;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            .el-tabs__item {
              padding: 0.15rem;
              font-size: 16px;
              @media screen and (min-width: 1800px) {
                font-size: 18px;
              }
            }
          }
        }
        .upload-demo {
          .el-upload {
            width: 100%;
            .el-upload-dragger {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: auto;
              min-height: 140px;
              font-size: 16px;
              @media screen and (max-width: 1600px) {
                font-size: 15px;
              }
              .el-upload__text {
                font-size: inherit;
              }
            }
          }
        }
        .el-form {
          margin: 0.3rem 0 0;
          .el-form-item {
            font-size: 18px;
            @media screen and (max-width: 1600px) {
              font-size: 16px;
            }
            .el-form-item__label {
              font-size: inherit;
            }
            .el-form-item__content {
              font-size: inherit;
              .el-input {
                font-size: inherit;
                .el-input__inner {
                  height: auto;
                  padding: 0.05rem 0.1rem;
                  font-size: inherit;
                }
              }
            }
          }
        }
        .el-button-group {
          margin: 0.2rem 0 0;
          .el-button {
            margin: 0 0.15rem 0 0;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
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
