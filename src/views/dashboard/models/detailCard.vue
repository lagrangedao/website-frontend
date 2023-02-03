<template>
  <section id="dataset">
    <div id="datasetBody">
      <el-row class="dataset_body">
        <el-col :xs="24" :sm="14" :md="17" :lg="17" :xl="17" class="right">
          <div class="button">
            <el-button type="" text bg>Edit model card</el-button>
          </div>
          <p class="p title">BERT base model (uncased)</p>
          <p class="p">Pretrained model on English language using a masked language modeling (MLM) objective. It was introduced in this paper and first released in this repository. This model is uncased: it does not make a difference between english and
            English. </p>
          <p class="p title">Disclaimer: The team releasing BERT did not write a model card for this model so this model card has been written by the Hugging Face team. </p>
          <p class="p title">Model description </p>
          <p class="p">BERT is a transformers model pretrained on a large corpus of English data in a self-supervised fashion. This means it was pretrained on the raw texts only, with no humans labeling them in any way (which is why it can use lots of publicly
            available data) with an automatic process to generate inputs and labels from those texts. More precisely, it was pretrained with two objectives: </p>
          <p class="p title">Masked language modeling (MLM): taking a sentence, the model randomly masks 15% of the words in the input then run the entire masked sentence through the model and has to predict the masked words. This is different from traditional
            recurrent neural networks (RNNs) that usually see the words one after the other, or from autoregressive models like GPT which internally masks the future tokens. It allows the model to learn a bidirectional representation of the
            sentence. </p>
          <p class="p">Next sentence prediction (NSP): the models concatenates two masked sentences as inputs during pretraining. Sometimes they correspond to sentences that were next to each other in the original text, sometimes not. The model then has
            to predict if the two sentences were following each other or not. </p>
          <p class="p">This way, the model learns an inner representation of the English language that can then be used to extract features useful for downstream tasks: if you have a dataset of labeled sentences, for instance, you can train a standard classifier
            using the features produced by the BERT model as inputs. </p>
          <p class="p title">Model variations</p>
          <p class="p"> BERT has originally been released in base and large variations, for cased and uncased input text. The uncased models also strips out an accent markers. </p>
          <p class="p">Chinese and multilingual uncased and cased versions followed shortly after.</p>
        </el-col>
        <el-col :xs="24" :sm="10" :md="7" :lg="7" :xl="7" class="left left_light">
          <div class="list">
            <div class="title">
              Downloads last month
              <b>1,149,560</b>
            </div>
          </div>
          <div class="list">
            <div class="title">
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
                      <img v-if="l===0" src="@/assets/images/dashboard/people_01.png" alt="">
                      <img v-else-if="l===1" src="@/assets/images/dashboard/people_02.png" alt="">
                      <img v-else src="@/assets/images/dashboard/people_03.png" alt="">
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
                  <div class="item_body">
                    <i class="icon icon_up"></i>
                    <span class="small">5.15M</span>
                  </div>
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
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance, toRefs, nextTick } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Datasets',
  components: {},
  props: {
    isVisible: { type: Boolean, default: false }
  },
  setup (props) {
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
      // listLoad.value = true
      // listdata.value = []
      // total.value = 0
      // const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}dataset`, 'get')
      // if (listRes) {
      //   listdata.value = listRes.datasets || []
      //   total.value = listRes.datasets.length
      // }
      // await system.$commonFun.timeout(500)
      // listLoad.value = false
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
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}`, 'get')
      console.log(listRes)
    }
    function detailFun (row, index) {
      console.log(row, index)
    }

    const text = ref('')
    const preview = ref(null);
    const titles = ref([]);
    const imgClick = (url, index) => {
      console.log(url, index);
    };
    const getTitle = async () => {
      text.value = await system.$commonFun.sendRequest(`${process.env.BASE_URL}Dataset-Card-Template.md`, 'get')
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
    };
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
    onMounted(() => {
      // getTitle()
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
      listdata,
      total,
      bodyWidth,
      system,
      route,
      router,
      tableData,
      props,
      text, imgClick, getTitle, titles, preview, handleAnchorClick,
      init, getData, NumFormat, handleCurrentChange, handleSizeChange, detailFun, handleClick
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
          font-family: "MYRIADPRO-SEMIBOLD";
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
            font-weight: bold;
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
              padding: 0.12rem 0 0;
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
