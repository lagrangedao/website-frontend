<template>
  <section id="space">
    <div class="space_head">
      <div class="content">
        <div class="name">
          <i class="icon icon_spaces"></i>
          Space:
          <b>{{route.params.name}}</b>
          <i class="icon icon_copy" @click="copyName(route.params.name)"></i>
          <el-button-group class="ml-4">
            <el-button>
              <i class="icon icon_like"></i>like</el-button>
            <el-button>0</el-button>
          </el-button-group>
          <div class="status" v-if="parentValue">{{parentValue}}</div>
          <div class="logs_style" v-if="logsValue" @click="drawer = true">
            <svg class="xl:mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
              <path fill="currentColor" d="M4 6h18v2H4zm0 6h18v2H4zm0 6h12v2H4zm17 0l7 5l-7 5V18z"></path>
            </svg> Logs
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
        <el-tab-pane name="card">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon icon_spaces"></i>
              <span>App</span>
            </span>
          </template>
          <detail-card @handleValue="handleValue" :urlChange="activeName"></detail-card>
        </el-tab-pane>
        <el-tab-pane name="files">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Files and versions</span>
            </span>
          </template>
          <detail-files @handleValue="handleValue" v-if="activeName === 'files'"></detail-files>
        </el-tab-pane>
        <el-tab-pane name="community">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Community</span>
              <b>3</b>
            </span>
          </template>
          <detail-community v-if="activeName === 'community'"></detail-community>
        </el-tab-pane>
        <el-tab-pane name="settings" v-if="settingOneself">
          <template #label>
            <span class="custom-tabs-label">
              <!-- <i class="icon icon_spaces"></i> -->
              <el-icon class="icon">
                <Setting />
              </el-icon>
              <span>Settings</span>
            </span>
          </template>
          <detail-setting @handleValue="handleValue" v-if="activeName === 'settings'"></detail-setting>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-drawer title="Logs" v-model="drawer" :direction="direction" :size="'70%'" :destroy-on-close="true" custom-class="drawer_style">
      <template #default>
        <div>
          {{logsCont.data.job}}
          <br /> {{logsCont.data.task}}
        </div>
      </template>
    </el-drawer>
  </section>
</template>
<script>
import detailCard from './detailCard.vue'
import detailFiles from './detailFiles.vue'
import detailCommunity from './detailCommunity.vue'
import detailSetting from './detailSetting.vue'
import { defineComponent, computed, onMounted, onUnmounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  Setting
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Spaces',
  components: {
    detailFiles,
    detailCard,
    detailCommunity,
    detailSetting,
    Setting
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessSpace = computed(() => (store.state.accessSpace ? JSON.parse(store.state.accessSpace) : []))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const dataList = reactive({
      Tasks: [
        'Text Classification', 'Text Retrieval', 'Text Generation', 'Question Answering',
        'Token Classification', 'Text2Text Generation', 'Voice Activity Detection'
      ],
      SubTasks: [
        'language-modeling', 'multi-class-classification', 'named-entity-recognition',
        'extractive-qa', 'natural-language-inference'
      ],
      Sizes: [
        'n<1K', '1K<n<10K', '10K<n<100K', '100K<n<1M', '1M<n<10M', '10M<n<100M', '100M<n<1B', '1B<n<10B',
        '10B<b<100B', '100B<n<1T', 'n>1T'
      ],
      Licenses: [
        'mit', 'apache-2.0', 'cc-by-4.0', 'other', 'cc-by-sa-4.0'
      ]
    })
    const searchValue = ref('')
    const value = ref('')
    const options = ref([
      {
        value: 'Option1',
        label: 'Most Downloads',
      },
      {
        value: 'Option2',
        label: 'Alphabetical',
      },
      {
        value: 'Option3',
        label: 'Recently Updated',
      },
      {
        value: 'Option4',
        label: 'Most Likes',
      }
    ])
    const currentPage1 = ref(1)
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const filedata = ref([])
    const total = ref(0)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const activeName = ref('card')
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
    const settingOneself = ref(false)
    const parentValue = ref('')
    const drawer = ref(false)
    const direction = ref('btt')
    const logsValue = ref('')
    const logsCont = reactive({
      data: {}
    })

    function handleClick (tab, event) {
      router.push({ name: 'spaceDetail', params: { name: route.params.name, tabs: tab.props.name } })
    }
    async function handleSizeChange (val) { }
    async function handleCurrentChange (val) { }
    function NumFormat (value) {
      if (String(value) === '0') return '0'
      else if (!value) return '-'
      var intPartArr = String(value).split('.')
      var intPartFormat = intPartArr[0]
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartArr[1] ? `${intPartFormat}.${intPartArr[1]}` : intPartFormat
    }
    function detailFun (row, index) {
      console.log(row, index)
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
    const handleValue = async (value, log) => {
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      if (log) {
        const response = await fetch(log)
        const textUri = await new Promise(async resolve => {
          resolve(response.text())
        })
        logsValue.value = log
        logsCont.data = textUri ? JSON.parse(textUri).data : {}
      } else logsValue.value = ''
      parentValue.value = numRe.test(value) ? '' : value
    }
    onActivated(() => {
      activeName.value = route.params.tabs || 'card'
      parentValue.value = ''
      logsValue.value = ''
      logsCont.data = {}
      window.scrollTo(0, 0)
      settingOneself.value = accessSpace.value.some(ele => ele === route.params.name)
    })
    return {
      accessSpace,
      lagLogin,
      dataList,
      searchValue,
      value,
      options,
      currentPage1,
      small,
      background,
      listLoad,
      filedata,
      total,
      activeName,
      bodyWidth,
      system,
      route,
      router,
      settingOneself,
      tableData,
      parentValue, drawer, direction, logsValue, logsCont, handleValue,
      NumFormat, handleCurrentChange, handleSizeChange, detailFun, handleClick, copyName
    }
  }
})
</script>

<style lang="scss" scoped>
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .space_head {
    padding: 0.5rem 0 0;
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
        font-family: "Helvetica-Bold";
        font-size: 0.21rem;
        color: #878c93;
        line-height: 1;
        @media screen and (max-width: 600px) {
          flex-wrap: wrap;
        }
        b {
          font-family: "FIRACODE-BOLD";
          padding: 0 0.07rem 0 0.1rem;
          color: #000;
        }
        .icon {
          width: 0.23rem;
          height: 0.23rem;
          margin: -1px 0.07rem 0 0;
        }
        .icon_spaces {
          background: url(../../../assets/images/icons/icon_2_2.png) no-repeat
            left center;
          background-size: auto 100%;
        }
        .icon_copy {
          width: 16px;
          height: 16px;
          background: url(../../../assets/images/icons/icon_36.png) no-repeat
            left center;
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
        .icon_like {
          width: 0.16rem;
          height: 0.16rem;
          background: url(../../../assets/images/icons/icon_37.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: pointer;
        }
        .el-button {
          height: 28px;
          padding: 0.05rem 0.1rem;
          font-family: inherit;
          font-size: 14px;
          color: #878c93;
          line-height: 1;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            padding: 0 5px;
            font-size: 12px;
          }
        }
        .status {
          position: relative;
          padding: 0.05rem 0.1rem 0.05rem 0.22rem;
          margin: 0 0.07rem;
          background-color: #ecfdf5;
          color: #047857;
          border: 1px solid #d1fae5;
          border-radius: 0.05rem;
          font-size: 14px;
          line-height: 1;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            font-size: 12px;
          }
          &::after {
            position: absolute;
            left: 0.1rem;
            top: 50%;
            bottom: 0;
            width: 6px;
            height: 6px;
            margin-top: -3px;
            content: "";
            font-size: 55px;
            background-color: #11b981;
            //#11b981   #7edbbb
            border-radius: 100%;
            animation: spin 1.5s linear alternate infinite;
            @keyframes spin {
              from {
                opacity: 1;
              }
              to {
                opacity: 0.5;
              }
            }
            @-webkit-keyframes spin {
              from {
                opacity: 1;
              }
              to {
                opacity: 0.5;
              }
            }
          }
        }
        .logs_style {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.05rem 0.05rem;
          margin: 0 0.07rem 0 0;
          background-color: transparent;
          color: #878c93;
          border: 1px solid rgba(229, 231, 235, 1);
          border-radius: 0.05rem;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 441px) {
            font-size: 12px;
          }
          &:hover {
            background-color: #f7f7f7;
          }
          svg {
            width: 14px;
            height: 14px;
            margin-right: 0.05rem;
            @media screen and (max-width: 1600px) {
              width: 13px;
              height: 13px;
            }
            @media screen and (max-width: 441px) {
              width: 12px;
              height: 12px;
            }
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
        padding: 0;
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
        .a_text {
          padding: 0.04rem 0.07rem;
        }
        .icon {
          width: 0.3rem;
          height: 0.26rem;
          margin: 0;
          background: #fef7ef url(../../../assets/images/icons/icon_22.png)
            no-repeat center;
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
      display: block;
      flex-wrap: wrap;
      margin: 0 auto;
      .el-tabs__header {
        display: flex;
        align-items: stretch;
        padding: 0 0.16rem;
        margin: 0 auto;
        font-size: 14px;
        @media screen and (min-width: 1280px) {
          max-width: 1280px;
        }
        @media screen and (min-width: 1536px) {
          max-width: 1536px;
        }
      }
      .el-tabs__content {
        border-top: 1px solid #f1f1f1;
        overflow: visible;
      }
      .el-tabs__item {
        height: auto;
        padding: 0.15rem 0;
        line-height: 1;
        font-family: "Helvetica-light";
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
          }
          .el-icon {
            margin: -1px 0.07rem 0 0;
          }
          .icon_spaces {
            width: 16px;
            margin: -1px 0.07rem 0 0;
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
          font-family: "Helvetica-Neue";
          color: #000;
          font-weight: 600;
          position: relative;
          &::after {
            position: absolute;
            content: "";
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #000;
          }
        }
        &:hover {
          color: #7405ff;
        }
      }
      .el-tabs__active-bar {
        display: none;
        background-color: #000;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }
}
</style>
<style lang="scss">
.drawer_style {
  padding-bottom: 15px;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  .el-drawer__header {
    padding-top: 15px;
    font-size: 16px;
    margin-bottom: 0;
    line-height: 1;
    color: #000;
  }
}
</style>



<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
