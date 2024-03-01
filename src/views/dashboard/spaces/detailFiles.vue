<template>
  <section id="space">
    <el-row class="space_body flex-row">
      <header class="flex-row">
        <div class="title flex-row">
          <a @click="getListFolderMain('')">{{route.params.name}}</a>
          {{labelTab === 'upload'||fileRow.fileTitle?'/':''}}
          <span class="main" v-for="(item, index) in fileRow.fileTitle" :key="index">
            {{index>0?'/':''}}
            <a href="javascript:;" style="word-break: break-word;" @click="getListFolderMain(item, true, index)">{{item.title}}</a>
          </span>
          <span v-if="labelTab === 'edit'" class="about flex-row">
            {{fileRow.fileTitle.length>0?'/':''}}
            <el-input v-if="fileTextShow" v-model="fileBody.title" placeholder=" " v-loading="uploadLoad" />
            <p v-else>{{fileBody.title}}</p>
          </span>
        </div>
        <div class="flex-row" style="align-items: stretch;" v-if="labelTab === 'list'">
          <div class="button flex-row">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-eye">
              <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
            </svg>
            Viewed
            <b>{{system.$commonFun.NumFormat(fileRow.stats.views) || 0}}</b>
          </div>
          <div class="button flex-row">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg>
            Fork
            <b>{{system.$commonFun.NumFormat(fileRow.stats.forks) || 0}}</b>
          </div>
          <el-dropdown trigger="click" @command="handleCommand" v-if="metaAddress === route.params.wallet_address">
            <span class="el-dropdown-link">
              <el-icon class="el-icon--right">
                <Plus />
              </el-icon>
              Contribute
              <el-icon class="el-icon--right">
                <caret-bottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="create" disabled>Create a new file</el-dropdown-item>
                <el-dropdown-item command="upload" disabled>Upload files</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="fileList">
        <el-table v-if="labelTab === 'list'" :data="fileRow.filedata" :table-layout="tableLayout" v-loading="listLoad" style="width: 100%">
          <el-table-column label="name" min-width="120">
            <template #default="scope">
              <div class="dir_parent flex-row" v-if="scope.row.isDir" @click="folderDetails(scope.row)">
                <div class="i icon_fold">
                  <img src="@/assets/images/icons/icon_40.png" alt="" />
                </div>
                <span class="is_file is_dir" :title="scope.row.title">{{scope.row.title}}</span>
              </div>
              <div class="dir_parent flex-row" v-else @click="fileEdit(scope.row)">
                <div class="i icon_file">
                  <img src="@/assets/images/icons/icon_41.png" alt="" />
                </div>
                <span class="is_file">{{scope.row.title}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="cid" min-width="140">
            <template #default="scope">
              {{ scope.row.isDir ? '-' :scope.row._originPath.cid}}
            </template>
          </el-table-column>
          <el-table-column label="url" min-width="140">
            <template #default="scope">
              <span v-if="scope.row.isDir">-</span>
              <a v-else-if="userGateway" :href="`${userGateway}/ipfs/${scope.row._originPath.cid}`" target="_blank">{{`${userGateway}/ipfs/${scope.row._originPath.cid}`}}</a>
              <a v-else-if="scope.row._originPath.url" :href="`${scope.row._originPath.url}`" target="_blank">{{scope.row._originPath.url}}</a>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="Created At" align="center" min-width="110">
            <template #default="scope">
              <div>
                <span v-if="scope.row.isDir">-</span>
                <span v-else :title="system.$commonFun.momentFun(scope.row._originPath.created_at)">{{ system.$commonFun.calculateDiffTime(scope.row._originPath.created_at)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Actions" align="center" width="110" v-if="metaAddress === route.params.wallet_address">
            <template #default="scope">
              <div class="hot-cold-box flex-row" v-if="!scope.row.isDir">
                <svg @click="fileEdit(scope.row)" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                  <path d="M2 26h28v2H2z" fill="currentColor"></path>
                  <path d="M25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4l15-15zm-5-5L24 7.6l-3 3L17.4 7l3-3zM6 22v-3.6l10-10l3.6 3.6l-10 10H6z" fill="currentColor"></path>
                </svg>
                <svg @click="deleteFile(scope.row.title)" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 32 32">
                  <path d="M12 12h2v12h-2z" fill="currentColor"></path>
                  <path d="M18 12h2v12h-2z" fill="currentColor"></path>
                  <path d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z" fill="currentColor"></path>
                  <path d="M12 2h8v2h-8z" fill="currentColor"></path>
                </svg>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="labelTab === 'edit'" class="uploadBody">
          <div class="top_title flex-row">
            <div class="left flex-row">
              <img :src="peopleAvatarImg || peopleImg" class="people" width="30" height="30" alt=""> {{peopleName|| system.$commonFun.hiddAddress(route.params.wallet_address)}}
            </div>
            <div class="right" :title="system.$commonFun.momentFun(fileBody._originPath.created_at)">
              {{system.$commonFun.calculateDiffTime(fileBody._originPath.created_at)}}
            </div>
          </div>
          <div v-loading="uploadLoad">
            <div class="worktop flex-row" style="justify-content: space-between;">
              <ul class="flex-row">
                <li v-if="fileTextType !== 'binary'">
                  <a class=" flex-row" :href="userGateway?`${userGateway}/ipfs/${fileBody._originPath.cid}`:''" target="_blank" :title="fileBody.title">
                    <svg class="mr-raw" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" style="transform: rotate(360deg);">
                      <path d="M31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9l7 7z" fill="currentColor"></path>
                      <path d="M1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23l-7-7z" fill="currentColor"></path>
                      <path d="M12.419 25.484L17.639 6l1.932.518L14.35 26z" fill="currentColor"></path>
                    </svg>
                    raw
                  </a>
                </li>
                <li v-else>
                  <a class=" flex-row" @click="downFile">
                    <svg class="mr-edit" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 32 32" style="transform: rotate(360deg);">
                      <path d="M24.59 16.59L17 24.17V4h-2v20.17l-7.59-7.58L6 18l10 10l10-10l-1.41-1.41z" fill="currentColor"></path>
                    </svg>
                    download
                  </a>
                </li>
                <li>
                  <a @click="deleteFile()" :class="{'disable': metaAddress !== route.params.wallet_address,' flex-row':true}">
                    <svg class="mr-edit" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                      <path d="M12 12h2v12h-2z" fill="currentColor"></path>
                      <path d="M18 12h2v12h-2z" fill="currentColor"></path>
                      <path d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z" fill="currentColor"></path>
                      <path d="M12 2h8v2h-8z" fill="currentColor"></path>
                    </svg>
                    delete
                  </a>
                </li>
              </ul>
              <small>{{system.$commonFun.sizeChange(blobSize)}}</small>
            </div>
            <img v-if="fileTextType === 'image'" :src="fileTextEditor" :alt="fileBody.title" class="img_file">
            <div v-else-if="fileTextType === 'text'" v-loading="uploadLoad">
              <div class="mirror">
                <Codemirror v-model:value="fileTextEditor" :options="system.$commonFun.cmOptions(metaAddress === route.params.wallet_address)" border placeholder="" @blur="onBlur" />
              </div>
              <!-- <v-md-editor v-model="fileTextEditor" height="450px"></v-md-editor> -->
              <el-button-group class="ml-4 worktop flex-row">
                <el-button @click="commitEditFun('edit')" v-if="metaAddress === route.params.wallet_address" :disabled="!fileBody.title">Commit changes</el-button>
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </div>
            <div class="tip_down" v-else>
              This file contains binary data. It cannot be displayed, but you can still
              <a @click="downFile">download</a>
              it.
            </div>
          </div>
        </div>
        <div v-else-if="labelTab === 'upload'" class="uploadBody">
          <el-tabs type="border-card" v-loading="uploadLoad" @tab-click="folderModeOn">
            <el-tab-pane label="Upload file(S）">
              <el-upload class="upload-demo" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" action="#" multiple :auto-upload="false">
                <div class="el-upload__text el-upload-dragger uploadDigFolder">
                  <div>
                    Drag files/folders here or click to browse from your computer.
                    <p class="m-p">The frontend supports uploads of files totaling up to 50MB and no more than 100 files simultaneously. For bulkier or greater quantities of files, kindly utilize our CLI:
                      <a href="https://github.com/lagrangedao/lagrange-cli" target="_blank">https://github.com/lagrangedao/lagrange-cli</a>.</p>
                  </div>
                </div>
                <!-- <template #tip>
                  <div class="el-upload__tip">
                    jpg/png files with a size less than 500kb
                  </div>
                </template> -->
              </el-upload>
              <el-form :label-position="'top'" ref="ruleFormRef" :model="info" :rules="rules" @submit.native.prevent>
                <el-form-item label="Commit changes" prop="name">
                  <el-input v-model="info.name" :placeholder="`Upload ${fileList.length} files (${system.$commonFun.sizeChange(totalSize)})`" />
                </el-form-item>
              </el-form>
              <el-button-group class="ml-4">
                <el-button @click="commitFun" :disabled="fileList.length===0 || fileList.length > 100 || totalSize > totalMaximum">Commit changes</el-button>
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </el-tab-pane>
            <!-- <el-tab-pane label="Upload folder" id="upload-folder">
              <el-upload class="upload-demo" ref="uploadFolderRef" :file-list="stateUpload.files" :on-change="handleFolderChange" :on-remove="handleFolderRemove" action="#" multiple :auto-upload="false" webkitdirectory>
                <div class="el-upload__text el-upload-dragger uploadDigFolder">Browse Folders</div>
              </el-upload>
              <el-form :label-position="'top'" ref="ruleFormFolderRef" :model="info" :rules="rules" @submit.native.prevent>
                <el-form-item label="Commit changes" prop="name">
                  <el-input v-model="info.name" :placeholder="'Upload '+stateUpload.files.length+' files'" />
                </el-form-item>
              </el-form>
              <el-button-group class="ml-4">
                <el-button @click="commitFolderFun" :disabled="stateUpload.files.length===0">Commit changes</el-button>
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <div v-else-if="labelTab === 'create'" class="uploadBody">
          <el-tabs type="border-card" v-loading="uploadLoad">
            <el-tab-pane label="Create new file">
              <div class="mirror">
                <Codemirror v-model:value="textEditor" :options="system.$commonFun.cmOptions" border placeholder="" />
              </div>
              <!-- <v-md-editor v-model="textEditor"></v-md-editor> -->
              <el-form :label-position="'top'" ref="ruleEditName" :model="textInfo" :rules="rulesEdit" @submit.native.prevent>
                <el-form-item label="File name" prop="name">
                  <el-input v-model="textInfo.name" :placeholder="'Name your file'" maxlength="96" />
                </el-form-item>
              </el-form>
              <el-button-group class="ml-4">
                <el-button @click="commitEditFun('create')" :disabled="!textInfo.name">Commit new file</el-button>
                <el-button @click="cancelFun">Cancel</el-button>
              </el-button-group>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, nextTick, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom,
  Document,
  Folder,
  Plus,
  UploadFilled,
  EditPen
} from '@element-plus/icons-vue'
import Codemirror from "codemirror-editor-vue3"
export default defineComponent({
  name: 'Spaces',
  components: {
    CaretBottom,
    Document,
    Folder,
    Plus,
    UploadFilled,
    EditPen,
    Codemirror
  },
  props: {
    likesValue: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const userGateway = computed(() => (store.state.gateway))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const peopleImg = require("@/assets/images/dashboard/people_default.png")
    const peopleAvatarImg = ref('')
    const peopleName = ref('')
    const tableLayout = ref('fixed')
    const labelTab = ref('list')
    const fileRow = reactive({
      fileAlldata: [],
      fileResdata: [],
      filedata: [],
      fileTitle: [],
      stats: {}
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
    const pathList = ref([])
    const ruleFormRef = ref(null)
    const ruleFormFolderRef = ref(null)
    const stateUpload = reactive({
      files: [],
      uploadFolderRef: null
    })
    const ruleEditName = ref(null)
    const validateInput = async (rule, value, callback) => {
      if (!checkSpecialKey(value)) {
        callback(new Error("File name not valid. Only '.','_','-' are accepted. '..' and '--' are forbidden. Max length is 96."));
      } else {
        const res = await checkFolder(value)
        if (!res) callback(new Error("The format of the folder name is incorrect"));
        else callback()
      }
    }
    const textInfo = reactive({
      name: ''
    })
    const rulesEdit = reactive({
      name: [
        { required: true, message: 'Please fill in this field', trigger: 'blur' },
        { validator: validateInput, trigger: "blur" }
      ]
    })
    const textEditor = ref('')
    const blobSize = ref(0)
    const fileTextEditor = ref('')
    const fileTextShow = ref(false)
    const fileTextType = ref('binary')
    const fileBody = reactive({
      _originPath: {},
      title: ''
    })
    const totalSize = ref(0)
    const totalMaximum = 50 * 1024 * 1024
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function checkSpecialKey (str) {
      let specialKey =
        "[~!#$^&*()=|{}':;'\\[\\],<>?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      // let specialKey =
      //   "\\:*?\"<>|";
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      if (str.indexOf('..') > -1 || str.indexOf('--') > -1) return false
      return true;
    }
    async function checkFolder (val) {
      const name = val.split('/')
      const key = ['.', '..']
      for (let n = 0; n < name.length; n++) {
        const checkName = await key.some(t => t === name[n])
        if (checkName) return false
      }
      return true
    }
    async function statsInit () {
      try {
        const listStatsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}stats/space?public_address=${route.params.wallet_address}&&space_name=${route.params.name}`, 'get')
        if (listStatsRes && listStatsRes.status === 'success') fileRow.stats = listStatsRes.data.stats
      } catch (err) { }
    }
    async function init () {
      if (route.name !== 'spaceDetail') return
      listLoad.value = true
      fileRow.fileTitle = []
      await statsInit()
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/files`, 'get')
      if (listRes && listRes.status === 'success') {
        fileRow.fileResdata = listRes.data || []
        const path = await getCatalogPath(fileRow.fileResdata);
        // console.log('path', path)
        const r = await treeify(path);
        // fileRow.fileAlldata = r.children[0] ? r.children[0].children[0].children[0].children : []
        if (r.children[0]) {
          r.children[0].children[0].children.forEach(element => {
            fileRow.fileAlldata = fileRow.fileAlldata.concat(element.children)
          })
        } else fileRow.fileAlldata = []
        // console.log(fileRow.fileAlldata)
        fileRow.filedata = await sortList(fileRow.fileAlldata)
        // console.log(fileRow.filedata)
      }

      const listOnwerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/${route.params.wallet_address}`, 'get')
      if (listOnwerRes && listOnwerRes.status === 'success') {
        if (listOnwerRes.data.avatar) peopleAvatarImg.value = listOnwerRes.data.avatar && userGateway.value ? `${userGateway.value}/ipfs/${listOnwerRes.data.avatar}` : ''
        peopleName.value = listOnwerRes.data.full_name || ''
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
      labelTab.value = 'list'
      listLoad.value = true
      if (fileName) {
        fileRow.fileTitle = index === 0 ? fileRow.fileTitle.slice(0, 1) : fold
        fileRow.filedata = index === 0 ? await sortList(fold.children) : await sortList(fold[index].children)
      }
      else fileRow.filedata = await sortList(fold)
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function handleCommand (command) {
      if (!userGateway.value) return
      uploadLoad.value = command === 'create'
      labelTab.value = command
      await pathPush()
      await system.$commonFun.timeout(1000)
      if (command === 'upload') addEvent()
      else if (command === 'create') createText()
    }
    async function pathPush () {
      pathList.value = []
      fileRow.fileTitle.forEach((element, i) => {
        pathList.value.push(element.title)
      })
    }
    async function createText () {
      try {
        var response = await fetch(`/static/template/create.md`)
        textEditor.value = await new Promise(async resolve => {
          resolve(response.text())
        })
        await system.$commonFun.timeout(500)
        textEditor.value = ''
      } catch (err) {
        console.log('err space create.md:', err)
      }
      uploadLoad.value = false
    }
    function handleChange (uploadFile, uploadFiles) {
      // console.log('handleChange:', uploadFiles)
      fileList.value = uploadFiles
    }
    function handleRemove (file, uploadFiles) {
      // console.log('handleRemove:', uploadFiles)
      fileList.value = uploadFiles
    }
    function folderModeOn () {
      addEvent()
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
    }

    function addEvent () {
      const oDragBody = document.querySelector('.uploadDigFolder')
      oDragBody.addEventListener('dragenter', (e) => {
        e.preventDefault() // 拖进
      })
      oDragBody.addEventListener('dragover', (e) => {
        e.preventDefault() // 清除默认事件
      })
      oDragBody.addEventListener('dragleave', (e) => {
        e.preventDefault() // 拖离
      })
      oDragBody.addEventListener('drop', (e) => {
        dropHandler(e) // 抛下
      })
    }
    function dropHandler (e) {
      let items = e.dataTransfer.items
      // const fileList = e.dataTransfer.files
      for (let i = 0; i <= items.length - 1; i++) {
        let item = items[i]
        if (item.kind === 'file') {
          let entry = item.webkitGetAsEntry()
          getFileFromEntryRecursively(entry)
        }
      }
      e.preventDefault()
    }
    function getFileFromEntryRecursively (entry) {
      if (entry.isFile) {
        entry.file(file => {
          let path = entry.fullPath.substring(1)
          let folder = path.split('/').length > 1
          // console.log('文件夹：' + folder + '，文件名称：' + file.name + '，相对路径：' + path, 'wenjian:' + file)
          let fileCont = {
            name: path,
            size: file.size
          }
          fileCont.raw = new File([file], path)
          // stateUpload.files.push(fileCont)
          fileList.value.push(fileCont)
          totalFiles(fileList.value)
        }, e => { console.log(e) })
      } else {
        let reader = entry.createReader()
        reader.readEntries(entries => {
          entries.forEach(entry => getFileFromEntryRecursively(entry))
        }, e => { console.log(e) })
      }
    }
    function handleFolderRemove (file, uploadFiles) {
      // console.log(file, uploadFiles)
      stateUpload.files = uploadFiles
    }
    async function commitFun () {
      if (fileList.value.length === 0) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          uploadLoad.value = true
          let fd = new FormData()
          fileList.value.forEach(file => {
            let name = pathList.value.join('/') || ''
            let fileNew = new File([file.raw], `${name ? name + '/' : ''}${file.name}`)
            fd.append('file', fileNew, `${name ? name + '/' : ''}${file.name}`)
          })
          // fd.append("is_public", listdata.value.is_public)
          // fd.append("name", info.name || `${'Upload ' + fileList.value.length + ' files'}`)
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/upload`, 'post', fd)
          await system.$commonFun.timeout(500)
          if (uploadRes && uploadRes.status === "success") {
            system.$commonFun.messageTip('success', uploadRes.message ? uploadRes.message : 'Upload files successfully!')
            // if (uploadRes.data.job) system.$commonFun.messageTip('success', 'Upload files successfully!')
            // else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
          } else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
          reset()
          context.emit('handleValue', true, 'files')
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
            let name = pathList.value.join('/') || ''
            let namepath = file.raw.webkitRelativePath || file.raw.name
            let fileNew = new File([file.raw], `${name ? name + '/' : ''}${namepath}`)
            fd.append('file', fileNew, `${name ? name + '/' : ''}${namepath}`)
            // console.log('file', fileNew)
          })
          const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/upload`, 'post', fd)
          await system.$commonFun.timeout(500)
          if (uploadRes && uploadRes.status === "success") {
            system.$commonFun.messageTip('success', uploadRes.message ? uploadRes.message : 'Upload files successfully!')
            // if (uploadRes.data.job) system.$commonFun.messageTip('success', 'Upload files successfully!')
            // else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
          } else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
          reset()
          context.emit('handleValue', true, 'files')
          init()
        } else {
          console.log('error submit!', fields)
          reset()
          return false
        }
      })
    }
    async function commitEditFun (type) {
      if (type === 'edit') fileChange(type)
      else await ruleEditName.value.validate(async (valid, fields) => {
        if (valid) {
          fileChange(type)
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    async function fileChange (type) {
      uploadLoad.value = true
      let name = pathList.value.join('/') || ''
      let newFile = new File([type === 'create' ? textEditor.value : fileTextEditor.value], `${name ? name + '/' : ''}${type === 'create' ? textInfo.name : fileBody.title}`)
      let fd = new FormData()
      fd.append('file', newFile, `${name ? name + '/' : ''}${type === 'create' ? textInfo.name : fileBody.title}`)
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/upload`, 'post', fd)
      await system.$commonFun.timeout(3000)
      if (uploadRes && uploadRes.status === "success") system.$commonFun.messageTip('success', uploadRes.message ? uploadRes.message : 'Upload files successfully!')
      else system.$commonFun.messageTip('error', uploadRes ? uploadRes.message : type === 'create' ? 'Create failed!' : 'Update failed!')
      reset()
      context.emit('handleValue', true, 'files')
      init()
    }
    function cancelFun () {
      labelTab.value = 'list'
      fileList.value = []
      info.name = ''
      stateUpload.files = []
      textInfo.name = ''
      textEditor.value = ''
      totalSize.value = 0
    }
    function reset () {
      labelTab.value = 'list'
      uploadLoad.value = false
      fileList.value = []
      info.name = ''
      textInfo.name = ''
      textEditor.value = ''
      stateUpload.files = []
      fileRow.fileAlldata = []
      fileRow.fileResdata = []
      fileRow.filedata = []
      fileRow.fileTitle = []
      fileRow.stats = {}
      totalSize.value = 0
    }
    async function fileEdit (row) {
      if (!userGateway.value) return
      handleCommand('edit')
      uploadLoad.value = true
      fileTextEditor.value = ''
      fileTextShow.value = false
      fileBody._originPath = row._originPath
      fileBody.title = row.title
      await getTitle(`${userGateway.value}/ipfs/${fileBody._originPath.cid}`)
    }
    const getTitle = async (url) => {
      if (!url) return
      try {
        var response = await fetch(url);
        const resType = response.headers.get("content-type")
        const text = await new Promise(async resolve => {
          if (resType.indexOf('image') > -1) {
            fileTextType.value = 'image'
            resolve(response.arrayBuffer())
          }
          else if (resType.indexOf('text') > -1 || resType.indexOf('json') > -1) {
            fileTextType.value = 'text'
            resolve(response.text())
          } else {
            fileTextType.value = 'binary'
            resolve(response.arrayBuffer())
          }
        })
        let blob = new Blob([text])
        blobSize.value = blob.size

        // let reader = new FileReader();
        // reader.readAsArrayBuffer(blob);
        // reader.onload = function () {
        //   var wordArray = system.$CryptoJS.lib.WordArray.create(reader.result);
        //   var hash = system.$CryptoJS.SHA256(wordArray).toString();
        //   console.log('SHA256', hash)
        // }
        if (fileTextType.value === 'image') fileTextEditor.value = window.URL.createObjectURL(blob)
        else if (fileTextType.value === 'text') fileTextEditor.value = text
        else fileTextEditor.value = url
        uploadLoad.value = false
      } catch (err) {
        console.log('err space files:', err)
        system.$commonFun.messageTip('error', err)
        reset()
        init()
      }
    }
    function downFile () {
      var link = document.createElement('a');
      link.href = fileTextEditor.value
      link.download = fileBody.title;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
    function editChange () {
      if (metaAddress.value !== route.params.wallet_address) return
      fileTextShow.value = !fileTextShow.value
    }
    async function deleteFile (filesTitle) {
      if (metaAddress.value !== route.params.wallet_address) return
      if (filesTitle) {
        listLoad.value = true
        await pathPush()
      }
      uploadLoad.value = true
      let name = pathList.value.join('/') || ''
      let fileNew = `${name ? name + '/' : ''}${filesTitle ? filesTitle : fileBody.title}`
      let paramsBody = {
        filename: fileNew
      }
      const deleteRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/delete`, 'post', paramsBody)
      if (deleteRes && deleteRes.status === 'success') system.$commonFun.messageTip('success', deleteRes.message || 'Delete successfully!')
      else system.$commonFun.messageTip('error', 'Delete failed!')
      reset()
      context.emit('handleValue', true, 'files')
      init()
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
          _patPath: level === 0 ? '/' : isDir ? pathInfoList.slice(0, pathInfoList.length - 2).join('/') : pathInfoList.slice(0, pathInfoList.length - 1).join('/'),
          _patPathParent: (level === 0 ? '/' : isDir ? pathInfoList.slice(0, pathInfoList.length - 3).join('/') : pathInfoList.slice(0, pathInfoList.length - 2).join('/')) || '/',
          isDir,
          children: isDir ? [] : null,
          key,
          title,
        })
      });
      const getNodeCot = (node, level, root) => {
        const { _patName, _patPath, _patPathParent } = node;
        let curCot = null;
        if (level === 0) {
          curCot = root.children
        } else {
          const pat = nodeInLevel[level - 1].find(t => t.isDir && t.title === _patName && t._patPath === _patPathParent);
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
        nodeInLevel[level].forEach((node, nodexIndex) => {
          let curCot = getNodeCot(node, level, root);
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
    const onBlur = (option) => {
      // console.log("update:value", option.getValue())
    }
    async function totalFiles (list) {
      // console.log(list, list.length)
      totalSize.value = 0
      for (let s = 0; s < list.length; s++) {
        totalSize.value += list[s].size
      }
    }
    onMounted(() => {
      reset()
      window.scrollTo(0, 0)
      init()
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    watch(fileList, (newValue, oldValue) => {
      totalFiles(newValue)
    })
    // watch(() => props.likesValue, () => {
    //   init()
    // })
    return {
      peopleName,
      metaAddress,
      userGateway,
      lagLogin,
      peopleImg,
      peopleAvatarImg,
      tableLayout,
      labelTab,
      fileRow,
      listLoad,
      fileList,
      info,
      rules,
      ruleFormRef,
      ruleFormFolderRef,
      ruleEditName,
      stateUpload,
      uploadLoad,
      system,
      route,
      router,
      rulesEdit,
      textInfo,
      textEditor,
      fileBody,
      fileTextEditor,
      fileTextShow,
      fileTextType,
      blobSize,
      totalSize,
      totalMaximum,
      init, handleCommand, handleChange, handleRemove, commitFun, reset, cancelFun, commitEditFun,
      folderModeOn, handleFolderRemove, handleFolderChange, commitFolderFun, folderDetails, getListFolderMain,
      fileEdit, editChange, downFile, deleteFile, onBlur
    }
  }
})
</script>

<style lang="scss" scoped>
#space {
  background: #fff;
  color: #333;
  font-size: 16px;
  text-align: left;
  @media screen and (max-width: 1600px) {
    font-size: 15px;
  }
  :deep(.space_body) {
    align-items: stretch;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding-bottom: 0.9rem;
    }
    header {
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      .title {
        flex-wrap: wrap;
        gap: 5px;
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
        .about {
          gap: 5px;
        }
      }
      .el-dropdown {
        width: auto;
        padding: 7px 12px;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        border: 1px solid #e1e1e1;
        font-size: 14px;
        line-height: 1;
        color: #666;
        border-radius: 0.09rem;
        @media screen and (min-width: 1800px) {
          font-size: 15px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 13px;
        }
        .el-dropdown-link {
          display: flex;
          align-items: center;
          .el-icon {
            width: 16px;
            height: 16px;
            margin: 0 4px;
          }
        }
      }
      .button {
        padding: 0.07rem 0.12rem;
        margin: 0 0.1rem 0 0;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        border: 1px solid #e1e1e1;
        color: #666;
        border-radius: 0.09rem;
        text-decoration: none;
        font-size: 14px;
        line-height: 1;
        @media screen and (min-width: 1800px) {
          font-size: 15px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 13px;
        }
        svg {
          margin: 0 4px 0 0;
          color: #666;
          fill: #666;
        }
        b {
          padding: 1px 6px;
          margin: 0 0 0 2px;
          background-color: #f0f0f0;
          font-weight: normal;
          border-radius: 24px;
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
              i,
              .i {
                width: 16px;
                font-size: 14px;
                margin-right: 5px;
                text-align: center;
                &.icon_fold {
                  img {
                    width: 15px;
                    margin-top: 4px;
                  }
                }
                &.icon_file {
                  img {
                    width: 12px;
                    margin-top: 4px;
                  }
                }
              }
              a {
                color: inherit;
                &:hover {
                  text-decoration: underline;
                }
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
                cursor: pointer;
                &.is_dir {
                  text-decoration: underline;
                  cursor: pointer;
                }
                &:hover {
                  text-decoration: underline;
                }
              }
              .hot-cold-box {
                position: relative;
                justify-content: center;
                flex-wrap: wrap;
                i,
                svg {
                  width: 15px;
                  height: 15px;
                  margin: 0 0.05rem;
                  cursor: pointer;
                  path {
                    cursor: inherit;
                  }
                  &:hover {
                    color: #c37af9;
                  }
                }
              }
            }
          }
          th {
            font-size: 15px;
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
        .top_title {
          justify-content: space-between;
          padding: 0.1rem 0.15rem;
          font-size: 14px;
          font-weight: normal;
          background: linear-gradient(180deg, #fefefe, #f0f0f0);
          text-transform: lowercase;
          color: #606060;
          @media screen and (min-width: 1800px) {
            font-size: 15px;
          }
          @media screen and (max-width: 768px) {
            font-size: 13px;
          }
          .left {
            .people {
              width: 30px;
              height: 30px;
              margin: 0 10px 0 0;
              border-radius: 100%;
            }
          }
          .right {
          }
        }
        .worktop {
          padding: 0.15rem 0.15rem;
          font-family: "Helvetica-light";
          font-size: 15px;
          font-weight: normal;
          background: transparent;
          color: #878c93;
          border-top: 1px solid #e4e4e4;
          border-bottom: 1px solid #e4e4e4;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }
          ul {
            text-transform: lowercase;
          }
          li {
            margin-right: 0.25rem;
            a {
              cursor: pointer;
              line-height: 1;
              i,
              svg {
                width: 17px;
                height: 17px;
                margin-right: 0.05rem;
                &.mr-edit {
                  width: 15px;
                  height: 15px;
                }
              }
              &:hover {
                text-decoration: underline;
              }
              &.disable {
                opacity: 0.5;
                cursor: no-drop;
                &:hover {
                  text-decoration: none;
                }
              }
            }
            &.disabled {
              opacity: 0.5;
              a {
                cursor: no-drop;
                &:hover {
                  text-decoration: unset;
                }
              }
            }
          }
          small {
            color: #333;
          }
        }
        .img_file {
          display: block;
          width: auto;
          width: calc(100% - 0.4rem);
          max-width: 500px;
          margin: 0.2rem;
        }
        .tip_down {
          padding: 0.5rem 0.2rem;
          text-align: center;
          a {
            text-decoration: underline;
          }
        }
        .el-tabs {
          .el-tabs__header {
            max-width: none;
            padding: 0;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            .el-tabs__item {
              height: auto;
              padding: 0 0.15rem;
              font-size: 14px;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
              &.is-active {
                &::after {
                  height: 0;
                }
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
              .m-p {
                width: 90%;
                max-width: 800px;
                margin: 0.15rem auto 0;
                font-size: 15px;
                color: #8c8c8c;
                @media screen and (max-width: 1600px) {
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
          }
        }
        .el-form {
          margin: 0.3rem 0 0;
          .el-form-item {
            font-size: 16px;
            @media screen and (max-width: 1600px) {
              font-size: 15px;
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
                  font-size: 16px;
                  @media screen and (max-width: 1600px) {
                    font-size: 14px;
                  }
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
            font-family: inherit;
            font-size: 16px;
            @media screen and (max-width: 1600px) {
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}
</style>

