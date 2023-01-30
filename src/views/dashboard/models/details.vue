<template>
  <section id="dataset">
    <div class="dataset_head">
      <div class="content">
        <div class="name">
          <b>{{route.params.name}}</b>
          <i class="icon icon_copy"></i>
          <el-button-group class="ml-4">
            <el-button>
              <i class="icon icon_like"></i>like</el-button>
            <el-button>444</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="tag content">
        <router-link to="">
          <i class="icon"></i>
          <span class="a_text">Text Classification</span>
        </router-link>
      </div>
      <div class="tag tag_sub content">
        <router-link to="">
          <span class="a_text">language-modeling</span>
        </router-link>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" id="tabs" ref="target" @tab-click="handleClick">
        <el-tab-pane name="card">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon icon_datasets"></i>
              <span>Model card</span>
            </span>
          </template>
          <detail-card></detail-card>
        </el-tab-pane>
        <el-tab-pane name="files">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Files and versions</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="community">
          <template #label>
            <span class="custom-tabs-label">
              <i class="icon"></i>
              <span>Community</span>
              <b>3</b>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import detailCard from './detailCard.vue'
import { defineComponent, computed, onMounted, onUnmounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  Setting
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Datasets',
  components: {
    detailCard,
    Setting
  },
  setup () {
    const store = useStore()
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
    const listdata = ref({})
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

    function handleClick (tab, event) {
      router.push({ name: 'modelsDetail', params: { name: route.params.name, tabs: tab.props.name } })
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
    async function init () {
      if (route.name !== 'modelsDetail') return
      listLoad.value = true
      listdata.value = {}
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        filedata.value = listRes.data.files || []
        listdata.value = listRes.data.dataset || { name: route.params.name }
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false

      // listdata.value = [
      //   {
      //     is_public: "1",
      //     name: "Frigg"
      //   },
      //   {
      //     is_public: "1",
      //     name: "Travis"
      //   },
      //   {
      //     is_public: "1",
      //     name: "Tyree"
      //   }
      // ]
    }
    function detailFun (row, index) {
      console.log(row, index)
    }
    function getDatasetList (meta) {
      if (meta) init()
    }
    onActivated(() => {
      window.scrollTo(0, 0)
      activeName.value = route.params.tabs || 'card'
      init()
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    return {
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
      listdata,
      total,
      activeName,
      bodyWidth,
      system,
      route,
      router,
      tableData,
      init, NumFormat, handleCurrentChange, handleSizeChange, detailFun, handleClick, getDatasetList
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
        font-size: 0.21rem;
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
          width: 0.16rem;
          height: 0.16rem;
          background: url(../../../assets/images/icons/icon_37.png) no-repeat
            left center;
          background-size: auto 100%;
          cursor: pointer;
        }
        .el-button {
          font-size: 15px;
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
          height: 0.23rem;
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
            margin: 0 0.07rem 0 0;
          }
          .icon_datasets {
            width: 16px;
            margin: 0 0.07rem 0 0;
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
          font-weight: 600;
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
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
