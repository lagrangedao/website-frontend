<template>
  <section id="dataset">
    <div id="datasetBody">
      <el-row class="dataset_body" v-loading="listLoad">
        <el-col v-if="!urlReadme" :xs="24" :sm="24" :md="17" :lg="17" :xl="17" class="readme_text">
          <div class="readme_body" v-if="!createLoad">
            <div class="desc">
              <b>No space card yet</b>
              <p v-if="metaAddress === route.params.wallet_address">
                <span v-if="fileSpaceData.length === 0">Create a new space card by using following template</span>
                <span v-else>Create a new space card by creating a Readme.md file</span>
              </p>
            </div>
            <el-row class="card" :gutter="20" v-if="metaAddress === route.params.wallet_address && fileSpaceData.length === 0">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="col-title">
                <b>Start with hello-world template</b>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-card class="box-card" shadow="hover" @click="cardAdd('docker')">
                  <div class="text item">Create a hello-world docker container</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div class="readme_create" v-else>
            <el-tabs type="border-card">
              <el-tab-pane label="Create new file">
                <v-md-editor v-model="textEditor"></v-md-editor>
                <el-form :label-position="'top'">
                  <el-form-item label="File name" prop="name">
                    <el-input model-value="README.md" disabled />
                  </el-form-item>
                </el-form>
                <el-button-group class="ml-4">
                  <el-button @click="editCommitFun('create')">Commit new file</el-button>
                  <el-button @click="cancelFun">Cancel</el-button>
                </el-button-group>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <el-col v-if="urlReadme && isPreview" :xs="0" :sm="0" :md="4" :lg="4" :xl="4" class="left">
          <div class="labelList" id="permiss">
            <ul>
              <li v-for="(anchor, index) in titles" :key="index + 'art'">
                <a @click="handleAnchorClick(anchor, index, anchor.indent)" :class="{'title':anchor.indent===0,'sub_title':anchor.indent===1}">{{ anchor.title }}</a>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col v-if="urlReadme && isPreview" :xs="24" :sm="24" :md="13" :lg="14" :xl="14" class="right">
          <v-md-preview :text="textEditor" ref="preview" @image-click="imgClick" id="preview"></v-md-preview>
        </el-col>
        <el-col v-if="urlReadme && !isPreview" :xs="24" :sm="24" :md="17" :lg="17" :xl="17" class="right">
          <v-md-editor v-model="textEditorChange"></v-md-editor>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="6" :xl="6" class="left left_light">
          <div class="list">
            <div class="title">
              Space Total Views
              <b>{{system.$commonFun.NumFormat(listdata.stats.views) || 0}}</b>
            </div>
            <div class="cont">
              <el-row :gutter="12" v-if="urlReadme">
                <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-if="isPreview && metaAddress === route.params.wallet_address">
                  <a>
                    <span class="a_button" v-if="urlReadme && isPreview" @click="editFun">
                      <el-icon>
                        <EditPen />
                      </el-icon>
                      Edit space card
                    </span>
                  </a>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-if="!isPreview">
                  <a>
                    <span class="a_button" @click="isPreview=true">
                      <el-icon>
                        <CircleClose />
                      </el-icon>
                      Cancel
                    </span>
                  </a>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-if="!isPreview">
                  <a>
                    <span class="a_button" @click="editCommitFun">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      Commit changes
                    </span>
                  </a>
                </el-col>
              </el-row>
              <el-row :gutter="12" v-if="false">
                <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12">
                  <router-link to="">
                    <i class="icon icon_01"></i>
                    <span class="a_text">Image Classification</span>
                  </router-link>
                </el-col>
                <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12">
                  <router-link to="">
                    <i class="icon icon_02"></i>
                    <span class="a_text">Translation</span>
                  </router-link>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="labelModel" v-if="false">
            <ul>
              <li>
                <p>Homepage:</p>
                <b>github.com</b>
              </li>
              <li>
                <p>Size of downloaded space files:</p>
                <b>55.66MB</b>
              </li>
              <li>
                <p>Size of the generated space:</p>
                <b>238.01MB</b>
              </li>
              <li>
                <p>Total amount of disk used:</p>
                <b>293.67MB</b>
              </li>
            </ul>
          </div>
          <div class="list" v-if="false">
            <div class="title">
              <p :title="'Models trained or fine-tuned on '+route.params.name">
                <i class="icon icon_datasets"></i>
                Models trained or fine-tuned on
                <small>{{route.params.name}}</small>
              </p>
            </div>
          </div>
          <el-row class="list_body" v-if="false" v-loading="false">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-for="(list, l) in listdata.files" :key="l">
              <el-card class="box-card" @click="detailFun(list, l)">
                <template #header>
                  <div class="card-header">
                    <div class="name">
                      <!-- <img v-if="l===0" src="@/assets/images/dashboard/people_01.png" alt="">
                      <img v-else-if="l===1" src="@/assets/images/dashboard/people_02.png" alt="">
                      <img v-else src="@/assets/images/dashboard/people_03.png" alt=""> -->
                      <b>{{list.name}}</b>
                    </div>
                    <span>27</span>
                  </div>
                </template>
                <div class="text">
                  <i class="icon icon_image"></i>
                  <p class="ellipsis">argilla/news-summary</p>
                </div>
                <!-- <div class="text">
                                  <el-row :gutter="6">
                                      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                                          <router-link to="" class="ellipsis">
                                              {{list.license}}
                                          </router-link>
                                      </el-col>
                                  </el-row>
                              </div> -->
                <div class="text item">
                  <div class="item_body">
                    <i class="icon icon_time"></i>
                    <span class="small">5 Sept 2022 - 5 Oct 2022</span>
                  </div>
                  <!-- <div class="item_body">
                    <i class="icon icon_up"></i>
                    <span class="small">5.15M</span>
                  </div> -->
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance, toRefs, nextTick } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  EditPen, Edit, CircleClose
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Spaces',
  components: {
    EditPen,
    Edit,
    CircleClose
  },
  props: {
    urlChange: { type: String, default: 'card' },
    likesValue: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const urlReadme = ref('')
    const urlReadmeName = ref('')
    const fileSpaceData = ref([])
    const isPreview = ref(true)
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const listdata = reactive({
      files: [],
      stats: {}
    })
    const total = ref(0)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const textEditor = ref('')
    const textEditorChange = ref('')
    const preview = ref(null)
    const titles = ref([])
    const createLoad = ref(false)
    const templateData = ref([
      {
        title: 'No Template',
        desc: 'Create your own template',
        type: 'create'
      },
      {
        title: 'Lagrange Template',
        desc: 'Create a space card by using our template',
        type: 'lag'
      },
      {
        title: 'Hugging Face Template',
        desc: 'Create a space card by using Hugging Face template',
        type: 'hugging'
      }
    ])

    function editFun () {
      textEditorChange.value = textEditor.value
      isPreview.value = false
    }
    async function editCommitFun (type) {
      // console.log(urlReadmeName.value)
      listLoad.value = true
      let newFile = new File([type === 'create' ? textEditor.value : textEditorChange.value], type === 'create' ? 'README.md' : urlReadmeName.value)
      let fd = new FormData()
      fd.append('file', newFile, type === 'create' ? 'README.md' : urlReadmeName.value)
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/upload`, 'post', fd)
      await system.$commonFun.timeout(500)
      if (uploadRes && uploadRes.status === "success") {
        if (uploadRes.data) system.$commonFun.messageTip('success', 'Update ' + urlReadmeName.value + ' successfully!')
        else system.$commonFun.messageTip(uploadRes.status, uploadRes.message)
      } else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
      init()
      isPreview.value = true
    }
    function handleClick (tab, event) {
      router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    async function init () {
      let gate = false
      if (route.params.tabs !== 'card') return
      listLoad.value = true
      listdata.files = []
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}?requester=${store.state.metaAddress}`, 'get')
      if (listRes && listRes.status === 'success') {
        const fileLi = listRes.data.files || []
        fileLi.forEach((element, i) => {
          let el = element.name.split('/')
          el.shift()
          el.shift()
          el.shift()
          if (el.join('/').toLowerCase() === 'readme.md') {
            if (element.gateway !== null) {
              urlReadme.value = `${element.gateway}/ipfs/${element.cid}`
              urlReadmeName.value = el.join('/')
              getTitle(urlReadme.value)
            } else {
              gate = true
              return
            }
          }
        })
        fileSpaceData.value = fileLi
        listdata.stats = listRes.data.stats
        const expireTime = await system.$commonFun.expireTimeFun(listRes.data.space.expiration_time)
        if (!gate) context.emit('handleValue', listRes.data, listRes.data.job, expireTime, listRes.data.nft)
      }
      if (gate) {
        init()
        return
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
      listdata.files = [
        {
          is_public: "1",
          name: "Frigg"
        },
        {
          is_public: "1",
          name: "Travis"
        },
        {
          is_public: "1",
          name: "Tyree"
        }
      ]
    }
    function detailFun (row, index) {
      console.log(row, index)
    }
    function handleAnchorClick (anchor) {
      const { lineIndex } = anchor
      const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

      if (heading) {
        preview.value.scrollToTarget({
          target: heading,
          scrollContainer: window,
          top: 0,
        })
      }
    }
    const imgClick = (url, index) => {
      console.log(url, index);
    }
    const getTitle = async (cid) => {
      if (!urlReadme.value) return
      var response = await fetch(urlReadme.value)
      textEditor.value = await new Promise(async resolve => {
        resolve(response.text())
      })
      nextTick(() => {
        const anchors = preview.value.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
        titles.value = Array.from(anchors).filter(title => !!title.innerText.trim());
        if (!titles.value.length) {
          titles.value = [];
          return;
        }

        const hTags = Array.from(new Set(titles.value.map(title => title.tagName))).sort();
        titles.value = titles.value.map(el => ({
          title: el.innerText,
          lineIndex: el.getAttribute('data-v-md-line'),
          indent: hTags.indexOf(el.tagName)
        }));
      });
    }
    async function cardAdd (type) {
      if (type === 'create') createLoad.value = true
      else if (type === 'lag' || type === 'hugging') {
        listLoad.value = true
        var response = await fetch(type === 'lag' ? `/static/template/lagrangedao-README.md` : `/static/template/huggingface-README.md`)
        textEditor.value = await new Promise(async resolve => {
          resolve(response.text())
        })
        listLoad.value = false
        createLoad.value = true
      } else if (type === 'docker') {
        listLoad.value = true
        let fd = await formDataRetrue()
        const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}/files/upload`, 'post', fd)
        await system.$commonFun.timeout(1000)
        if (uploadRes && uploadRes.status !== "success") system.$commonFun.messageTip(uploadRes.status, `${uploadRes.message}: ${name}`)
        init()
      }
    }
    async function formDataRetrue () {
      let formdata = new FormData()
      const fileList = ['Dockerfile', 'Readme.md', 'requirements.txt', 'app/_init_.py', 'app/main.py']
      for (let f = 0; f < fileList.length; f++) {
        let name = fileList[f]
        let response = await fetch(`/static/template/hello-world/${name}`)
        let text = await new Promise(async resolve => {
          resolve(response.text())
        })
        let newFile = new File([text], name)
        formdata.append('file', newFile, name)
      }

      return formdata
    }
    function cancelFun () {
      createLoad.value = false
      textEditor.value = ''
    }
    onActivated(() => { })
    onMounted(() => {
      urlReadme.value = ''
      createLoad.value = false
      window.scrollTo(0, 0)
      init()
    })
    onDeactivated(() => { })
    watch(() => props.urlChange, (newValue, oldValue) => {
      isPreview.value = true
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    watch(route, (to, from) => {
      if (to.name !== 'spaceDetail') return
      if (to.params.tabs === 'card') {
        urlReadme.value = ''
        createLoad.value = false
        window.scrollTo(0, 0)
        init()
      }
    })
    watch(() => props.likesValue, () => {
      init()
    })
    return {
      lagLogin,
      metaAddress,
      searchValue,
      value,
      currentPage1,
      small,
      background,
      listLoad,
      listdata,
      total,
      bodyWidth,
      system,
      route,
      router,
      props,
      urlReadme,
      fileSpaceData,
      isPreview,
      templateData,
      createLoad,
      textEditor, textEditorChange, imgClick, getTitle, titles, preview, handleAnchorClick, editFun, editCommitFun,
      init, handleCurrentChange, handleSizeChange, detailFun, handleClick,
      cardAdd, cancelFun
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
  .mark {
    display: flex;
    flex-wrap: wrap;
    .left,
    .right {
      width: 50%;
    }
  }
  :deep(.dataset_body) {
    display: flex;
    align-items: stretch;
    padding: 0;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding: 0 0.16rem;
    }
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .readme_text {
      position: relative;
      padding: 0.5rem 0.3rem 0.3rem 0;
      @media screen and (max-width: 992px) {
        padding: 0.3rem 0;
      }
      .readme_body {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        min-height: 230px;
        padding: 0.5rem 0;
        background-color: #fbfbfc;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        b,
        p {
          display: block;
          width: 100%;
          margin: 0.1rem auto;
          text-align: center;
        }
        .desc {
          width: 100%;
          text-align: center;
        }
        .card {
          width: 90%;
          max-width: 900px;
          margin: auto;
          justify-content: center;
          .el-card {
            height: 100%;
            cursor: pointer;
            border-radius: 5px;
            * {
              cursor: inherit;
            }
            &.is-disabled {
              cursor: no-drop;
            }
            .el-card__header {
              padding-bottom: 0;
              border-bottom: 0;
              font-weight: 600;
            }
            .el-card__body {
              padding-top: 0.15rem;
              .text {
                font-size: 13px;
                color: #878c93;
                line-height: 1.3;
                @media screen and (min-width: 1800px) {
                  font-size: 14px;
                }
              }
            }
          }
          .col-title {
            margin-top: 0.3rem;
          }
        }
      }
      .readme_create {
        font-family: "Helvetica-light";
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
            font-family: inherit;
            font-size: 18px;
            @media screen and (max-width: 1600px) {
              font-size: 16px;
            }
          }
        }
      }
      &::after {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
    }
    .left {
      position: relative;
      padding: 0.3rem 0;
      background-color: #fff;
      .labelList {
        margin: 0.2rem 0 0.4rem;
        text-align: left;
        position: -webkit-sticky;
        position: sticky;
        top: 0.2rem;
        width: 100%;
        .sticky_element {
          // position: fixed;
          // top: 10px;
          // display: block;
          // max-width: 16.6666666667%;
        }
        .title {
          padding: 0.05rem 0;
          margin: 0 0 0.1rem;
          font-size: 0.2rem;
          color: #000000;
          @media screen and (max-width: 1600px) {
            font-size: 18px;
          }
          @media screen and (max-width: 441px) {
            font-size: 16px;
          }
        }
        .sub_title {
          padding: 0.05rem 0;
          margin: 0.1rem 0 0;
          font-size: 0.18rem;
          color: #000000;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 441px) {
            font-size: 14px;
          }
        }
        ul {
          li {
            a {
              display: block;
              padding: 0.05rem 0.12rem;
              color: #878c93;
              font-size: 0.16rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              line-height: 1.5;
              word-break: break-word;
              @media screen and (max-width: 1600px) {
                font-size: 15px;
              }
              @media screen and (max-width: 441px) {
                font-size: 13px;
              }
              &:hover {
                text-decoration: underline;
              }
              &.disbled {
                color: #cccccc;
              }
            }
          }
        }
      }
      .list {
        margin: 0.2rem 0.16rem 0;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.1rem 0;
          margin: 0 0 0.1rem;
          font-family: "Helvetica-Neue";
          font-size: 16px;
          color: #000;
          border-radius: 0.08rem;
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          .icon {
            width: 0.22rem;
            height: 0.22rem;
            margin: 0 0.13rem 0 0;
          }
          .icon_sizes {
            background: url(../../../assets/images/icons/icon_7.png) no-repeat
              left center;
            background-size: 17px;
          }
          .icon_licenses {
            background: url(../../../assets/images/icons/icon_8.png) no-repeat
              left center;
            background-size: 17px;
          }
          .icon_datasets {
            width: 16px;
            height: 16px;
            margin: 0 5px 0 0;
            background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
              left center;
            background-size: 100%;
          }
          b {
            font-size: 17px;
            color: #000;
            @media screen and (min-width: 1800px) {
              font-size: 18px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 15px;
            }
          }
          small {
            font-size: 14px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.55);
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 12px;
            }
          }
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            word-spacing: normal;
            white-space: nowrap;
            text-align: left;
            line-height: 1;
            .icon {
              display: block;
              float: left;
            }
          }
        }
        .cont {
          padding: 0.25rem 0.06rem;
          .el-row {
            .el-col {
              max-width: max-content;
              width: auto;
              flex: auto;
              a {
                display: flex;
                padding: 0;
                margin: 0.03rem auto;
                background-color: transparent;
                border-radius: 0.05rem;
                font-size: 13px;
                color: #606060;
                border: 2px solid #f1f1f2;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                @media screen and (max-width: 1440px) {
                  font-size: 12px;
                }
                &:hover {
                  opacity: 0.9;
                }
                .a_text {
                  padding: 0.03rem 0.07rem;
                }
                .a_button {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  padding: 0.05rem 0.15rem;
                  background: linear-gradient(180deg, #fefefe, #f0f0f0);
                  i {
                    margin-right: 3px;
                    font-size: 15px;
                  }
                }
                .icon {
                  width: 0.3rem;
                  height: 0.26rem;
                  padding: 0;
                }
                .icon_sizes {
                  background: url(../../../assets/images/icons/icon_7.png)
                    no-repeat left center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }
                .icon_licenses {
                  width: 0.28rem;
                  background: url(../../../assets/images/icons/icon_21.png)
                    no-repeat right center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }
                .icon_01 {
                  background: #fef7ef
                    url(../../../assets/images/icons/icon_22.png) no-repeat
                    center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
                }
                .icon_02 {
                  background: #f0f3ff
                    url(../../../assets/images/icons/icon_29.png) no-repeat
                    center;
                  background-size: 17px;
                  @media screen and (max-width: 768px) {
                    width: 25px;
                    background-size: 15px;
                  }
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
          }
        }
        &:nth-child(1) {
          .cont {
            .el-row {
              .el-col {
                a {
                  display: flex;
                  align-items: center;
                  &:hover {
                    background-color: #eee;
                  }
                }
                // &:nth-child(1) {
                //   a {
                //     .icon {
                //       background: #fef7ef
                //         url(../../../assets/images/icons/icon_22.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(2) {
                //   a {
                //     .icon {
                //       background: #f0f3ff
                //         url(../../../assets/images/icons/icon_23.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(3) {
                //   a {
                //     .icon {
                //       background: #f6f7ff
                //         url(../../../assets/images/icons/icon_24.png) no-repeat
                //         center;
                //       background-size: 18px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(4) {
                //   a {
                //     .icon {
                //       background: #f1f7ff
                //         url(../../../assets/images/icons/icon_25.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(5) {
                //   a {
                //     .icon {
                //       background: #f2f8ff
                //         url(../../../assets/images/icons/icon_26.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(6) {
                //   a {
                //     .icon {
                //       background: #edfdf6
                //         url(../../../assets/images/icons/icon_27.png) no-repeat
                //         center;
                //       background-size: 15px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
                // &:nth-child(7) {
                //   a {
                //     .icon {
                //       background: #fef3f3
                //         url(../../../assets/images/icons/icon_28.png) no-repeat
                //         center;
                //       background-size: 17px;
                //       @media screen and (max-width: 768px) {
                //         width: 25px;
                //         background-size: 15px;
                //       }
                //     }
                //   }
                // }
              }
            }
          }
        }
        &:nth-child(2) {
          .cont {
            .el-row {
              .el-col {
                a {
                  background-color: #f3f1ff;
                  color: #562683;
                  border: 0;
                }
              }
            }
          }
        }
        &:nth-child(3) {
          .cont {
            .el-row {
              .el-col {
                a {
                  background-color: #dfbafa;
                  color: #5b21c6;
                  border: 0;
                }
              }
            }
          }
        }
        &:nth-child(4) {
          .cont {
            .el-row {
              .el-col {
                a {
                  display: flex;
                  align-items: center;
                  &:hover {
                    background-color: #eee;
                  }
                }
              }
            }
          }
        }
      }
      .labelModel {
        padding: 0.2rem 0.16rem;
        border-top: 1px solid #f1f1f1;
        border-bottom: 1px solid #f1f1f1;
        text-align: left;
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: auto;
            padding: 0.07rem;
            margin: 0.03rem 0.08rem 0.03rem 0;
            border: 1px solid #f1f1f1;
            border-radius: 0.07rem;
            p {
              color: #878c93;
              font-size: 12px;
              @media screen and (min-width: 1800px) {
                font-size: 14px;
              }
            }
            b,
            a {
              color: #606060;
              font-size: 13px;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
            }
          }
        }
      }
      .list_body {
        padding: 0 0.16rem;
        .el-col {
          margin: 0.05rem 0;
          max-width: 350px;
          @media screen and (max-width: 768px) {
            max-width: none;
          }
          .box-card {
            padding: 0.1rem 0.2rem;
            background-color: #fff;
            border-color: #e4e4e4;
            border-radius: 0.1rem;
            box-shadow: none;
            * {
              cursor: pointer;
            }
            .el-card__header {
              padding: 0;
              border: 0;
              .card-header {
                display: flex;
                justify-content: space-between;
                .name {
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  width: 80%;
                  color: #606060;
                  @media screen and (min-width: 441px) {
                  }
                  b {
                    width: calc(100% - 0.6rem);
                    padding: 0;
                    font-size: 16px;
                    font-weight: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-spacing: normal;
                    text-align: left;
                    line-height: 1.2;
                    color: inherit;
                    @media screen and (max-width: 1440px) {
                      font-size: 15px;
                    }
                    @media screen and (max-width: 768px) {
                      font-size: 14px;
                    }
                    @media screen and (max-width: 441px) {
                      font-size: 13px;
                    }
                  }
                }
                img {
                  width: 0.4rem;
                  margin: 0.05rem 0.1rem 0 0;
                  border-radius: 100%;
                  border: 2px solid #7405ff;
                }
                span {
                  height: 0.25rem;
                  padding-left: 0.23rem;
                  background: url(../../../assets/images/icons/icon_9.png)
                    no-repeat left 2px;
                  background-size: 0.17rem;
                  font-size: 13px;
                  color: #000;
                  line-height: 0.25rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 15px;
                  }
                }
              }
            }
            .el-card__body {
              padding: 0.05rem 0 0;
              .text {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                color: #000;
                line-height: 1;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                .icon {
                  width: 20px;
                  height: 20px;
                  margin: 0 6px 0 0;
                }
                .icon_text {
                  background: url(../../../assets/images/icons/icon_10.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_time {
                  width: 15px;
                  background: url(../../../assets/images/icons/icon_11.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_up {
                  width: 15px;
                  margin: 0 3px 0 0;
                  background: url(../../../assets/images/icons/icon_20.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_image {
                  background: url(../../../assets/images/icons/icon_30.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .small {
                  margin-top: 3px;
                  color: #9ca3b1;
                  font-size: 12px;
                  text-align: left;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                }
                .el-row {
                  width: 100%;
                  margin: 0.1rem 0 0.25rem;
                  .el-col {
                    margin: 0.05rem 0;
                    a {
                      display: block;
                      padding-top: 0.05rem;
                      padding-bottom: 0.05rem;
                      margin: 0.03rem auto;
                      background-color: #f3f1ff;
                      border-radius: 0.2rem;
                      font-size: 13px;
                      color: #5b21c6;
                      @media screen and (min-width: 1800px) {
                        font-size: 15px;
                      }
                      @media screen and (max-width: 1440px) {
                        font-size: 12px;
                      }
                      &:hover {
                        opacity: 0.9;
                      }
                    }
                    &:nth-child(2n + 2) {
                      a {
                        background-color: #dfbafa;
                        color: #5b21c6;
                      }
                    }
                  }
                }
                .ellipsis {
                  width: calc(100% - 26px);
                  font-family: "FIRACODE-REGULAR";
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-spacing: normal;
                  text-align: left;
                  line-height: 1.5;
                }
              }
              .item {
                justify-content: space-between;
                margin: 0.2rem 0 0;
                .item_body {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
          &:hover {
            .box-card {
              background-color: #7405ff;
              .el-card__header {
                .card-header {
                  .name {
                    color: #fff;
                  }
                  img {
                    border: 2px solid #fff;
                  }
                  span {
                    background: url(../../../assets/images/icons/icon_9_1.png)
                      no-repeat left 2px;
                    background-size: 0.17rem;
                    color: #fff;
                  }
                }
              }
              .el-card__body {
                .text {
                  color: #fff;
                  .icon_text {
                    background: url(../../../assets/images/icons/icon_10_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .icon_time {
                    background: url(../../../assets/images/icons/icon_11_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .icon_up {
                    background: url(../../../assets/images/icons/icon_20_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .icon_image {
                    background: url(../../../assets/images/icons/icon_30_1.png)
                      no-repeat left center;
                    background-size: 100%;
                  }
                  .small {
                    color: #fff;
                  }
                  .el-row {
                    .el-col {
                      a {
                        background-color: #fff;
                      }
                      &:nth-child(2n + 2) {
                        a {
                          background-color: #dfbafa;
                          color: #5b21c6;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .list_nodata {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 200px;
          font-size: 18px;
        }
      }
    }
    .left_light,
    .readme_text {
      font-family: "FIRACODE-LIGHT";
    }
    .right {
      position: relative;
      padding: 0.4rem 0.2rem;
      font-family: "FIRACODE-LIGHT";
      .data {
        padding: 0.1rem 0 0;
        margin: 0 0 0.4rem;
        border: 1px solid #f1f1f1;
        border-radius: 0.1rem;
        color: #606060;
        overflow: hidden;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 0.1rem 4%;
          font-size: 0.19rem;
          .top_text {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            font-size: 0.2rem;
            color: #000000;
            @media screen and (max-width: 1600px) {
              font-size: 18px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 16px;
            }
            @media screen and (max-width: 441px) {
              font-size: 14px;
            }
            b {
              padding: 0.08rem 0.25rem;
              margin: 0 0.17rem 0 0;
              background-color: #7405ff;
              font-size: 0.215rem;
              font-weight: normal;
              line-height: 1;
              color: #fff;
              border-radius: 0.09rem;
            }
            .el-input {
              max-width: 3.45rem;
              margin: 0.1rem 0 0 0;
              .el-input__inner {
                // padding-left: 0.35rem;
                // background: url(../../../assets/images/icons/icon_10_2.png)
                //   no-repeat 0.1rem center;
                // background-size: 17px;
                border-radius: 0.1rem;
                border-color: #cccccc;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
              }
              .el-input__prefix {
                padding: 0;
                .el-icon {
                  svg {
                    width: 0.22rem;
                    height: 0.22rem;
                    color: #9ea5b3;
                  }
                }
              }
            }
            .el-button {
              padding: 0.03rem 0.1rem;
              margin: 0 0 0 0.2rem;
              line-height: 1;
              border-radius: 5px;
              font-family: inherit;
            }
            .span {
              width: 100%;
              color: #606060;
              font-size: 16px;
              @media screen and (max-width: 1440px) {
                font-size: 15px;
              }
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
            }
          }
          .el-button {
            width: auto;
            height: auto;
            padding: 0.05rem 0.15rem;
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            border-color: #e1e1e1;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.2;
            border-radius: 0.09rem;
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
          }
        }
        .el-table {
          margin: 0.1rem 0 0;
          .el-table__inner-wrapper {
            tr {
              color: #000;
              th,
              td {
                padding: 0.13rem 0;
                .cell {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: normal;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                &:nth-child(3) {
                  text-align: right;
                }
              }
              th {
                padding: 0.18rem 0;
              }
            }
          }
        }
      }
      .text {
        text-align: left;
        p {
          padding: 0.02rem 0;
          font-size: 18px;
          color: #565656;
          line-height: 1.4;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
          @media screen and (max-width: 1440px) {
            font-size: 14px;
          }
          @media screen and (max-width: 600px) {
            font-size: 12px;
          }
        }
      }
      &::after {
        position: absolute;
        content: "";
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
        }
      }
      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #f1f1f1;
        @media screen and (max-width: 992px) {
          width: 0px;
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
