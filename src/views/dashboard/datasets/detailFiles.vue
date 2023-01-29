<template>
  <section id="dataset">
    <el-row class="dataset_body">
      <header>
        <div class="title">
          <!-- {{route.params.name}}{{labelTab === 'upload'||fileRow.fileTitle?'/'+fileRow.fileTitle:''}} -->
          <a @click="getListFolderMain('')">{{route.params.name}}</a>
          {{labelTab === 'upload'||fileRow.fileTitle?'/':''}}
          <span class="main" v-for="(item, index) in fileRow.fileTitle" :key="index">
            {{index>0?'/':''}}
            <a href="javascript:;" style="word-break: break-word;" @click="getListFolderMain(item, true, index)">{{item.title}}</a>
          </span>
        </div>
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
        <el-table v-if="labelTab === 'list'" :data="fileRow.filedata" :table-layout="tableLayout" v-loading="listLoad" style="width: 100%">
          <el-table-column label="name">
            <template #default="scope">
              <div class="dir_parent" v-if="scope.row.isDir" @click="folderDetails(scope.row)">
                <el-icon>
                  <Folder />
                </el-icon>
                <span class="is_file is_dir" :title="scope.row.title">{{scope.row.title}}</span>
              </div>
              <div class="dir_parent" v-else>
                <el-icon>
                  <Document />
                </el-icon>
                <!-- <span class="is_file">{{scope.row.title}}</span> -->
                <a class="is_file" :href="scope.row._originPath.url" target="_blank" :title="scope.row.title">{{scope.row.title}}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="cid">
            <template #default="scope">
              {{ scope.row.isDir ? '-' :scope.row._originPath.cid}}
            </template>
          </el-table-column>
          <el-table-column label="url">
            <template #default="scope">
              <span v-if="scope.row.isDir">-</span>
              <a v-else :href="scope.row._originPath.url" target="_blank">{{scope.row._originPath.url}}</a>
            </template>
          </el-table-column>
          <el-table-column label="Created At" align="right">
            <template #default="scope">
              <div>
                <span>{{ scope.row.isDir ? '-' :momentFilter(scope.row._originPath.created_at)}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="labelTab === 'upload'" class="uploadBody">
          <el-tabs type="border-card" v-loading="uploadLoad" @tab-click="folderModeOn">
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
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </el-tab-pane>
            <el-tab-pane label="Upload folder" id="upload-folder">
              <el-upload class="upload-demo" ref="uploadFolderRef" :file-list="stateUpload.files" :on-change="handleFolderChange" :on-remove="handleFolderRemove" action="#" drag multiple :auto-upload="false" webkitdirectory>
                <div class="el-upload__text">Browse Folders</div>
                <!-- <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template> -->
              </el-upload>
              <el-form :label-position="'top'" ref="ruleFormFolderRef" :model="info" :rules="rules">
                <el-form-item label="Commit changes" prop="name">
                  <el-input v-model="info.name" :placeholder="'Upload '+stateUpload.files.length+' files'" />
                </el-form-item>
              </el-form>
              <el-button-group class="ml-4">
                <el-button @click="commitFolderFun" :disabled="stateUpload.files.length===0">Commit changes</el-button>
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- <el-table v-if="labelTab === 'list'" :data="fileRow.fileResdata" :table-layout="tableLayout" v-loading="listLoad" style="width: 100%">
          <el-table-column label="name">
            <template #default="scope">
              <el-icon>
                <Document />
              </el-icon>
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="cid">
            <template #default="scope">
              {{ scope.row.cid}}
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
                <span>{{ momentFilter(scope.row.created_at)}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table> -->

      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, nextTick, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom,
  Document,
  Folder,
  Plus,
  UploadFilled
} from '@element-plus/icons-vue'
import { async } from 'q';
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom,
    Document,
    Folder,
    Plus,
    UploadFilled
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const tableLayout = ref('fixed')
    const labelTab = ref('list')
    const listdata = reactive({})
    const fileRow = reactive({
      fileAlldata: [],
      fileResdata: [],
      filedata: [],
      fileTitle: []
    })
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
    const ruleFormFolderRef = ref(null)
    const stateUpload = reactive({
      files: [],
      uploadFolderRef: null
    })
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function init () {
      if (route.name !== 'datasetDetail') return
      listLoad.value = true
      listdata.value = {}
      fileRow.fileTitle = []
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        fileRow.fileResdata = listRes.data.files || []
        listdata.value = listRes.data.dataset || { name: route.params.name }

        const path = await getCatalogPath(fileRow.fileResdata);
        // console.log('path', path)
        const r = await treeify(path);
        fileRow.fileAlldata = r.children[0] ? r.children[0].children : []
        fileRow.filedata = await sortList(fileRow.fileAlldata)
        console.log(fileRow.filedata)
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function sortList (list) {
      let fileFoldArray = []
      let fileArray = []
      let fileEnd = []
      list.forEach((element, i) => {
        if (element.isDir) fileFoldArray.push(element)
        else fileArray.push(element)
      })
      fileEnd = fileFoldArray.concat(fileArray)
      return fileEnd
    }
    async function folderDetails (row) {
      // console.log(row.children)
      listLoad.value = true
      fileRow.fileTitle.push(row)
      fileRow.filedata = await sortList(row.children)
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function getListFolderMain (fileName, type, index) {
      let fold = ''
      if (type && index) fold = fileRow.fileTitle.slice(0, index + 1)
      else if (type && index === 0) fold = fileRow.fileTitle[0]
      else {
        fileRow.fileTitle = []
        fold = fileRow.fileAlldata
      }
      listLoad.value = true
      if (fileName) {
        fileRow.fileTitle = index === 0 ? fileRow.fileTitle.slice(0, 1) : fold
        fileRow.filedata = index === 0 ? await sortList(fold.children) : await sortList(fold[index].children)
      }
      else fileRow.filedata = await sortList(fold)
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function handleCommand (command) {
      if (command === 'upload') {
        labelTab.value = command
        getListFolderMain('')
      }
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
    function folderModeOn () {
      nextTick(() => {
        const uploadEle = document.querySelector('#upload-folder').querySelector('.el-upload__input')
        stateUpload.uploadFolderRef = uploadEle
        stateUpload.uploadFolderRef.webkitdirectory = true
        // console.log(stateUpload.uploadFolderRef.value)
        return
      })
    }
    function handleFolderChange (uploadFile, uploadFiles) {
      // console.log(uploadFile, uploadFiles)
      stateUpload.files = uploadFiles
      // console.log(fileList.value)
    }
    function handleFolderRemove (file, uploadFiles) {
      // console.log(file, uploadFiles)
      stateUpload.files = uploadFiles
    }
    async function commitFun () {
      if (fileList.value.length === 0) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          // console.log('fileTitle:',fileRow.fileTitle)
          //           return
          uploadLoad.value = true
          let fd = new FormData()
          fileList.value.forEach(file => {
            // console.log('file', file)
            let fileNew = new File([file.raw], file.name)
            fd.append('file', fileNew, file.name)
            console.log('file', fileNew, file.name)
          })
          // fd.append("is_public", listdata.value.is_public)
          // fd.append("name", info.name || `${'Upload ' + fileList.value.length + ' files'}`)
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}/files`, 'put', fd)
          await system.$commonFun.timeout(500)
          if (uploadRes && uploadRes.status === "success") {
            if (uploadRes.data.files) system.$commonFun.messageTip('success', 'Upload files successfully!')
            else system.$commonFun.messageTip('error', uploadRes.message)
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
    async function commitFolderFun () {
      if (stateUpload.files.length === 0) return
      await ruleFormFolderRef.value.validate(async (valid, fields) => {
        if (valid) {
          uploadLoad.value = true
          let fd = new FormData()
          stateUpload.files.forEach(file => {
            // console.log('file', file)
            let fileNew = new File([file.raw], file.raw.webkitRelativePath)
            fd.append('file', fileNew, file.raw.webkitRelativePath)
            console.log('file', fileNew)
          })
          // fd.append("is_public", listdata.value.is_public)
          // fd.append("name", info.name || `${'Upload ' + fileList.value.length + ' files'}`)
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}/files`, 'put', fd)
          await system.$commonFun.timeout(500)
          if (uploadRes && uploadRes.status === "success") {
            if (uploadRes.data.files) system.$commonFun.messageTip('success', 'Upload files successfully!')
            else system.$commonFun.messageTip('error', uploadRes.message)
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
    function cancelFun () {
      labelTab.value = 'list'
      fileList.value = []
      info.name = ''
      stateUpload.files = []
    }
    function reset () {
      labelTab.value = 'list'
      uploadLoad.value = false
      fileList.value = []
      info.name = ''
      stateUpload.files = []
      fileRow.fileAlldata = []
      fileRow.fileResdata = []
      fileRow.filedata = []
      fileRow.fileTitle = []
    }

    const treeify = (nodeList) => {
      const root = {
        key: 1,
        children: []
      };
      const nodeInLevel = []
      nodeList.forEach(t => {
        const pathInfoList = t.file_name.split('/');
        let isDir = true
        if (pathInfoList[pathInfoList.length - 1]) {
          isDir = false
        }
        const key = (Math.random() + '').split('.')[1] * 1
        const title = isDir ? pathInfoList[pathInfoList.length - 2] : pathInfoList[pathInfoList.length - 1]
        const level = isDir ? pathInfoList.length - 2 : pathInfoList.length - 1
        nodeInLevel[level] = nodeInLevel[level] || []
        nodeInLevel[level].push({
          _originPath: t.row,
          _pathInfo: pathInfoList,
          _patName: level === 0 ? '/' : isDir ? pathInfoList[pathInfoList.length - 3] : pathInfoList[pathInfoList.length - 2],
          isDir,
          children: isDir ? [] : null,
          key,
          title,
        })
      });
      const getNodeCot = (node, level, root) => {
        const { _patName } = node;
        let curCot = null;
        if (level === 0) {
          curCot = root.children
        } else {
          const pat = nodeInLevel[level - 1].find(t => t.isDir && t.title === _patName);
          if (!pat) {
            throw new Error(
              `Node ${node._originPath} cant find parent ${_patName}`,
            );
          }
          return pat.children
        }
        return curCot
      };
      const maxLevel = nodeInLevel.length;
      for (let level = 0; level < maxLevel; level++) {
        nodeInLevel[level].forEach(node => {
          const curCot = getNodeCot(node, level, root);
          curCot.push(node)
        })
      }
      return root;
    };
    function getCatalogPath (nodeList) {
      let newNodeList = [];
      for (let i = 0; i < nodeList.length; i++) {
        let pathNameArr = nodeList[i].name.split('/');
        // pathNameArr.shift() // Remove wallet address
        let pathNameCatalog = '';
        if (pathNameArr.length > 1) {
          for (let y = 0; y < pathNameArr.length; y++) {
            if (pathNameArr[pathNameArr.length - 1]) {
              if (y === pathNameArr.length - 1) {
                pathNameCatalog = pathNameCatalog + pathNameArr[y];
              } else {
                pathNameCatalog = pathNameCatalog + pathNameArr[y] + '/';
              }
              let flag = false;
              if (newNodeList.length > 0) {
                for (let d = 0; d < newNodeList.length; d++) {
                  if (newNodeList[d].file_name === pathNameCatalog) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  newNodeList.push({
                    row: nodeList[i],
                    file_name: pathNameCatalog
                  });
                }
              } else {
                newNodeList.push({
                  row: nodeList[i],
                  file_name: pathNameCatalog
                });
              }
            }
          }
        } else {
          newNodeList.push({
            row: nodeList[i],
            file_name: nodeList[i].name
          });
        }
      }
      return newNodeList;
    }
    onMounted(() => {
      reset()
      window.scrollTo(0, 0)
      init()
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    return {
      metaAddress,
      lagLogin,
      tableLayout,
      labelTab,
      listdata,
      fileRow,
      listLoad,
      fileList,
      info,
      rules,
      ruleFormRef,
      ruleFormFolderRef,
      stateUpload,
      uploadLoad,
      system,
      route,
      router,
      init, handleCommand, momentFilter, handleChange, handleRemove, commitFun, reset, cancelFun,
      folderModeOn, handleFolderRemove, handleFolderChange, commitFolderFun, folderDetails, getListFolderMain
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
        a {
          // color: #4f84ff;
          font-size: inherit;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .main {
          a {
            margin-right: 3px;
          }
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
              display: flex;
              align-items: center;
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
                margin-right: 5px;
              }
              a {
                color: inherit;
                &:hover {
                  text-decoration: underline;
                }
              }
              .dir_parent {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
              }
              .is_file {
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                width: calc(100% - 1em - 8px);
                &.is_dir {
                  text-decoration: underline;
                  cursor: pointer;
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
