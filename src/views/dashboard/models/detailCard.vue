<template>
  <section id="dataset">
    <div id="datasetBody">
      <el-row class="dataset_body" v-loading="listLoad">
        <el-col v-if="!urlReadme" :xs="24" :sm="24" :md="17" :lg="17" :xl="17" class="readme_text">
          <div class="readme_body">
            <div>
              <b>No model card yet</b>
              <p>New: Create and edit this model card directly on the website!</p>
            </div>
          </div>
        </el-col>
        <el-col v-if="urlReadme && isPreview" :xs="0" :sm="0" :md="0" :lg="0" :xl="0" class="left">
          <div class="labelList" id="permiss">
            <ul>
              <li v-for="(anchor, index) in titles" :key="index + 'art'">
                <a @click="handleAnchorClick(anchor, index, anchor.indent)" :class="{'title':anchor.indent===0,'sub_title':anchor.indent===1}">{{ anchor.title }}</a>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col v-if="urlReadme && isPreview" :xs="24" :sm="24" :md="17" :lg="17" :xl="17" class="right">
          <div class="button">
            <el-button type="" text bg v-if="urlReadme && isPreview && metaAddress === route.params.wallet_address" @click="editFun">Edit model card</el-button>
          </div>
          <v-md-preview :text="textEditor" ref="preview" @image-click="imgClick" id="preview"></v-md-preview>
        </el-col>
        <el-col v-if="urlReadme && !isPreview" :xs="24" :sm="24" :md="17" :lg="17" :xl="17" class="right">
          <div class="button">
            <el-button type="" text bg @click="isPreview=true">Cancel</el-button>
            <el-button type="" text bg @click="editCommitFun">Commit changes</el-button>
          </div>
          <v-md-editor v-model="textEditorChange"></v-md-editor>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="left left_light">
          <div class="list" style="display: flex;justify-content: space-between;">
            <div class="title">
              Downloads last month
              <b>30,701,057</b>
            </div>
            <div class="echarts">
              <div id="maychar"></div>
            </div>
          </div>
          <div class="list list_border">
            <div class="title">
              Hosted inference API
            </div>
            <div class="list_select">
              <router-link to="">
                <i class="icon icon_fillMask"></i>
                <span class="a_text">Fill-Mask</span>
              </router-link>
              <el-select v-model="formInline.region" placeholder="">
                <el-option label="Example 1" value="Example1" />
              </el-select>
            </div>
            <el-form label-position="top" :model="formInline" class="demo-form-inline">
              <el-form-item label="Mask token: [MASK]">
                <el-input v-model="formInline.user" placeholder="Paris is the [MASK] of France." />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">Compute</el-button>
              </el-form-item>
            </el-form>
            <div class="progress">
              <p>Computation time on Intel Xeon 3rd Gen Scalable cpu: cached</p>
            </div>
            <div class="progress">
              <el-progress :percentage="90" :color="'#7405ff'">
                <span text>0.997</span>
              </el-progress>
              <p>Capital</p>
            </div>
            <div class="progress">
              <el-progress :percentage="3" :color="'#7405ff'">
                <span text>0.001</span>
              </el-progress>
              <p>heart</p>
            </div>
            <div class="progress">
              <el-progress :percentage="1" :color="'#7405ff'">
                <span text>0.000</span>
              </el-progress>
              <p>center</p>
            </div>
            <div class="progress">
              <el-progress :percentage="1" :color="'#7405ff'">
                <span text>0.000</span>
              </el-progress>
              <p>centre</p>
            </div>
            <div class="progress">
              <el-progress :percentage="1" :color="'#7405ff'">
                <span text>0.000</span>
              </el-progress>
              <p>city</p>
            </div>
          </div>
          <div class="list">
            <div class="title title_top">
              <p>
                <i class="icon icon_models"></i>
                Datasets used to train</p>
              <small>{{route.params.name}}</small>
            </div>
          </div>
          <el-row class="list_body" v-loading="false">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-for="(list, l) in listdata" :key="l">
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
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance, toRefs, nextTick, inject } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  EditPen, Edit, CircleClose
} from '@element-plus/icons-vue'
import { async } from 'q';

export default defineComponent({
  name: 'Models',
  components: {
    EditPen,
    Edit,
    CircleClose
  },
  props: {
    urlChange: { type: String, default: 'card' }
  },
  setup (props) {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const searchValue = ref('')
    const value = ref('')
    const urlReadme = ref('')
    const urlReadmeName = ref('')
    const isPreview = ref(true)
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const listdata = ref([])
    const total = ref(0)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const tableData = ref([
      {
        sentence1: '"The cat sat on the mat."',
        sentence2: '"The cat did not sit on the mat."',
        idx: '0',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"The cat did not sit on the mat."',
        sentence2: '"The cat sat on the mat."',
        idx: '1',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"When you\'ve got no snow,  it\'s really hard to...',
        sentence2: '"When you\'ve got snow, it\'s really hard to learn a snowy...',
        idx: '2',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya doesn\'t support media...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '3',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya doesn\'t support media...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '4',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouya supports Twitch.tv...',
        sentence2: '"Out of the box, Ouya supports media apps such as Twitch...',
        idx: '5',
        label: '1   (not_entailment)'
      },
      {
        sentence1: '"Out of the box, Ouy supports media apps...',
        sentence2: '"Out of the box, Ouya supports Twitch.tv and XBMC media player."',
        idx: '6',
        label: '1   (not_entailment)'
      }
    ])
    const textEditor = ref('')
    const textEditorChange = ref('')
    const preview = ref(null);
    const titles = ref([]);
    const formInline = reactive({
      user: '',
      region: 'Example1',
    })

    function editFun () {
      textEditorChange.value = textEditor.value
      isPreview.value = false
    }
    async function editCommitFun () {
      // console.log(urlReadmeName.value)
      listLoad.value = true
      let newFile = new File([textEditorChange.value], urlReadmeName.value)
      let fd = new FormData()
      fd.append('file', newFile, urlReadmeName.value)
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}/files/upload`, 'post', fd)
      await system.$commonFun.timeout(500)
      if (uploadRes && uploadRes.status === "success") {
        if (uploadRes.data.files) system.$commonFun.messageTip('success', 'Update ' + urlReadmeName.value + ' successfully!')
        else system.$commonFun.messageTip(uploadRes.status, uploadRes.message)
      } else system.$commonFun.messageTip('error', uploadRes.message ? uploadRes.message : 'Upload failed!')
      init()
      isPreview.value = true
    }
    function handleClick (tab, event) {
      router.push({ name: 'modelsDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    async function init () {
      if (route.params.tabs !== 'card') return
      listLoad.value = true
      listdata.value = []
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        // listdata.value = listRes.data.files || []
        const fileLi = listRes.data.files || []
        fileLi.forEach((element, i) => {
          let el = element.name.split('/')
          el.shift()
          el.shift()
          el.shift()
          // console.log(el.join('/').toLowerCase())
          if (el.join('/').toLowerCase() === 'readme.md') {
            urlReadme.value = `${store.state.gateway}/ipfs/${element.cid}`
            urlReadmeName.value = el.join('/')
            if (store.state.gateway) getTitle(urlReadme.value)
          }
        })
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
      listdata.value = [
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
    async function getData () {
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}`, 'get')
      console.log(listRes)
    }
    function detailFun (row, index) {
      console.log(row, index)
    }
    const imgClick = (url, index) => {
      console.log(url, index);
    };
    const getTitle = async (cid) => {
      if (!urlReadme.value) return
      try {
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
        })
      } catch (err) {
        console.log('err model card:', err)
        system.$commonFun.messageTip('error', err)
      }
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
    let echarts = inject("echarts")
    const changetype = () => {
      const machart = echarts.init(document.getElementById("maychar"));
      const option = {
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: [820, 1100, 1080, 982, 951, 934, 900, 930, 920]
        },
        yAxis: {
          type: 'value',
          show: false,
          scale: true,
          splitNumber: 5,
          alignTicks: true
        },
        series: [
          {
            data: [920, 1500, 780, 982, 851, 934, 900, 1030, 920],
            type: 'line',
            // smooth:true,
            symbolSize: 0,
            areaStyle: {},
            itemStyle: {
              color: '#5d2eff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#cdb8ff'
                },
                {
                  offset: 1,
                  color: '#f3ecff'
                }
              ])
            },
          }
        ]
      }
      machart.setOption(option);
      window.addEventListener("resize", function () {
        machart.resize();
      })
    }
    onActivated(() => { })
    onMounted(() => {
      textEditor.value = ''
      titles.value = ''
      urlReadme.value = ''
      window.scrollTo(0, 0)
      init()
      changetype();
    })
    onDeactivated(() => { })
    watch(() => props.urlChange, (newValue, oldValue) => {
      isPreview.value = true
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    watch(route, (to, from) => {
      if (to.name !== 'modelsDetail') return
      if (to.params.tabs === 'card') {
        textEditor.value = ''
        titles.value = ''
        urlReadme.value = ''
        window.scrollTo(0, 0)
        init()
      }
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
      tableData,
      props,
      urlReadme,
      isPreview,
      formInline,
      textEditor, textEditorChange, imgClick, getTitle, titles, preview, handleAnchorClick, editFun, editCommitFun,
      init, getData, handleCurrentChange, handleSizeChange, detailFun, handleClick
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
          padding: 0.1rem 0;
          margin: 0 0 0.1rem;
          font-family: "Helvetica-Neue";
          font-size: 15px;
          color: #878c93;
          border-radius: 0.08rem;
          @media screen and (max-width: 1600px) {
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
            background-size: auto 100%;
          }
          .icon_models {
            width: 16px;
            height: 16px;
            margin: 0 5px 0 0;
            background: url(../../../assets/images/icons/icon_19.png) no-repeat
              left center;
            background-size: 100%;
          }
          b {
            display: block;
            font-size: 17px;
            font-weight: normal;
            color: #606060;
            @media screen and (min-width: 1800px) {
              font-size: 18px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 15px;
            }
          }
          small {
            font-size: 14px;
            color: #000;
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
            @media screen and (max-width: 1440px) {
              font-size: 12px;
            }
          }
          p {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            text-align: left;
            .icon {
            }
          }
        }
        .title_top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          color: #000;
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
        .echarts {
          display: flex;
          align-items: center;
          margin-top: 0.2rem;
          #maychar {
            width: 150px;
            height: 50px;
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
                display: block;
                padding: 0.03rem 0.07rem;
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
                .icon {
                  width: 0.22rem;
                  height: 0.22rem;
                  margin: 0 0.03rem 0 0;
                }
                .icon_sizes {
                  background: url(../../../assets/images/icons/icon_7.png)
                    no-repeat left center;
                  background-size: 17px;
                }
                .icon_licenses {
                  background: url(../../../assets/images/icons/icon_21.png)
                    no-repeat left center;
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
                &:nth-child(1) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_22.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(2) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_23.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(3) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_24.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(4) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_25.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(5) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_26.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(6) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_27.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
                &:nth-child(7) {
                  a {
                    .icon {
                      background: url(../../../assets/images/icons/icon_28.png)
                        no-repeat left center;
                      background-size: 17px;
                    }
                  }
                }
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
      .list_border {
        padding: 0.1rem 0.16rem 0.2rem;
        margin: 0.2rem 0 0;
        border-top: 1px solid #f1f1f1;
        border-bottom: 1px solid #f1f1f1;
        .title {
          font-size: 18px;
          color: #000;
          @media screen and (min-width: 1800px) {
            font-size: 19px;
          }
          @media screen and (max-width: 1440px) {
            font-size: 16px;
          }
        }
        .list_select {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.2rem;
          a {
            display: flex;
            padding: 0;
            margin: 0.03rem 0;
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
              align-items: center;
              display: flex;
              padding: 0.04rem 0.07rem;
            }
            .icon {
              width: 0.3rem;
              height: 100%;
              min-height: 0.26rem;
              padding: 0;
            }
            .icon_fillMask {
              background: #fef4f4 url(../../../assets/images/icons/icon_31.png)
                no-repeat center;
              background-size: 17px;
              @media screen and (max-width: 768px) {
                width: 25px;
                background-size: 15px;
              }
            }
          }
          .el-select {
            max-width: 150px;
            margin: 0.03rem 0;
            .el-input {
              .el-input__inner {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
        .el-form {
          color: #878c93;
          .el-form-item {
            margin-bottom: 0.15rem;
            .el-input {
              .el-input__inner {
                height: auto;
                padding: 0.12rem 0.15rem;
                font-family: inherit;
                border-color: #d9d9d9;
                border-radius: 0.08rem;
                line-height: 1;
                color: #8d9298;
              }
            }
            .el-button {
              padding: 0.18rem 0.15rem;
              font-family: inherit;
              background: linear-gradient(180deg, #fefefe, #f0f0f0);
              border-color: #e1e1e1;
              font-size: 14px;
              line-height: 1;
              border-radius: 0.09rem;
              color: #606060;
            }
          }
        }
        .progress {
          p {
            margin-bottom: 0.1rem;
            font-size: 12px;
            color: #878c93;
            word-break: break-word;
            @media screen and (min-width: 1800px) {
              font-size: 13px;
            }
          }
          .el-progress {
            font-size: 14px;
            color: #878c93;
            @media screen and (min-width: 1800px) {
              font-size: 15px;
            }
            .el-progress-bar__outer {
              background: transparent;
              border-radius: 2px;
              .el-progress-bar__inner {
                border-radius: 2px;
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
        min-height: 300px;
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
    .right {
      position: relative;
      padding: 0.2rem 0.2rem 0.4rem 0;
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
      .p {
        width: 100%;
        max-width: 800px;
        line-height: 1.6;
        font-size: 0.18rem;
        color: #565656;
        @media screen and (max-width: 1600px) {
          font-size: 17px;
        }
        @media screen and (max-width: 1440px) {
          font-size: 16px;
        }
        @media screen and (max-width: 441px) {
          font-size: 14px;
        }
        &.title {
          margin-top: 0.2rem;
        }
      }
      .button {
        display: flex;
        justify-content: flex-end;
        padding: 0 0 0.2rem;
        .el-button {
          padding: 0.15rem 0.2rem;
          background: linear-gradient(180deg, #fefefe, #f0f0f0);
          border-color: #e1e1e1;
          border-radius: 0.07rem;
          color: #606060;
          font-family: inherit;
          &:hover {
            opacity: 0.95;
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
      // &::before {
      //   position: absolute;
      //   content: "";
      //   left: 0;
      //   top: 0;
      //   bottom: 0;
      //   width: 1px;
      //   background-color: #f1f1f1;
      // }
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
