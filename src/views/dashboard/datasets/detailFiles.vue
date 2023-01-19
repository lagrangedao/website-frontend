<template>
  <section id="dataset">
    <el-row class="dataset_body">
      <header>
        <div class="title">{{route.params.name}}{{labelTab === 'upload'?'/':''}}</div>
        <el-dropdown trigger="click" @command="handleCommand">
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
            let fileBlob = new Blob([file])
            fd.append('file', fileBlob, file.name)
          })
          fd.append("is_public", listdata.value.is_public)
          fd.append("name", info.name || `${'Upload ' + fileList.value.length + ' files'}`)
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}/files`, 'put', fd)
          if (uploadRes && uploadRes.files) {
            await system.$commonFun.timeout(500)
            system.$commonFun.messageTip('success', 'Upload files successfully!')
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
  .dataset_head {
    padding: 0.7rem 0 0;
    background-color: #fbfbfc;
    border-bottom: 1px solid #f1f1f1;
    .content {
      display: flex;
      align-items: stretch;
      padding: 0 0.16rem;
      margin: 0 auto 0.25rem;
      font-size: 14px;
      @media screen and (min-width: 1280px) {
        max-width: 1280px;
      }
      @media screen and (min-width: 1536px) {
        max-width: 1536px;
      }
      .name {
        display: flex;
        align-items: center;
        font-size: 0.22rem;
        color: #878c93;
        line-height: 1;
        b {
          padding: 0 0.07rem 0 0.1rem;
          color: #000;
        }
        .icon {
          width: 0.23rem;
          height: 0.23rem;
          margin: 0 0.07rem 0 0;
        }
        .icon_datasets {
          background: url(../../../assets/images/icons/icon_19.png) no-repeat
            left center;
          background-size: auto 100%;
        }
        .icon_copy {
          width: 0.18rem;
          height: 0.18rem;
          background: url(../../../assets/images/icons/icon_36.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: pointer;
        }
        .icon_like {
          width: 0.18rem;
          height: 0.18rem;
          background: url(../../../assets/images/icons/icon_37.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: pointer;
        }
        .el-button {
          font-size: 16px;
          color: #878c93;
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          @media screen and (max-width: 441px) {
            font-size: 13px;
          }
        }
      }
    }
    .tag {
      margin: 0 auto;
      line-height: 0.3rem;
      font-size: 0.18rem;
      a {
        display: flex;
        align-items: center;
        padding: 0.03rem 0.07rem;
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
        .icon {
          width: 0.23rem;
          height: 0.23rem;
          margin: 0 0.07rem 0 0;
          background: url(../../../assets/images/icons/icon_22.png) no-repeat
            left center;
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
    :deep(.demo-tabs) {
      margin: 0 auto;
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__item {
        height: auto;
        padding: 0.15rem 0;
        line-height: 1;
        font-size: 0.18rem;
        @media screen and (max-width: 1600px) {
          font-size: 16px;
        }
        @media screen and (max-width: 441px) {
          font-size: 14px;
        }
        .custom-tabs-label {
          display: flex;
          align-items: center;
          padding: 0 0.2rem;
          .icon {
            height: 16px;
            margin: 0 0.07rem 0 0;
          }
          .icon_datasets {
            width: 16px;
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
          color: #000;
        }
        &:hover {
          color: #7405ff;
        }
      }
      .el-tabs__active-bar {
        background-color: #000;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
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
        font-size: 16px;
        line-height: 1;
        border-radius: 0.09rem;
        @media screen and (min-width: 1800px) {
          font-size: 18px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 14px;
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
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
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
