<template>
  <section id="dataset">
    <el-row class="dataset_body">
      <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" class="left">
        <div class="list">
          <div class="title">
            <!-- <i class="icon icon_licenses"></i> -->
            Tasks
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-for="(l, index) in dataList.Tasks" :key="index">
                <router-link to="">
                  <i class="icon"></i>
                  <span class="a_text">{{l}}</span>
                </router-link>
              </el-col>
              <el-col :span="24">
                <div class="more">+ 54 Tasks</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <!-- <i class="icon icon_sizes"></i> -->
            Libraries
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <!-- :xs="6" :sm="6" :md="6" :lg="12" :xl="12" -->
              <el-col v-for="(l, index) in dataList.Libraries" :key="index">
                <router-link to="">
                  <span class="a_text">{{l}}</span>
                </router-link>
              </el-col>
              <el-col :span="24">
                <div class="more">+ 57</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <!-- <i class="icon icon_licenses"></i> -->
            Datasets
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-for="(l, index) in dataList.Datasets" :key="index">
                <router-link to="">
                  <i class="icon icon_licenses"></i>
                  <span class="a_text">{{l}}</span>
                </router-link>
              </el-col>
              <el-col :span="24">
                <div class="more">+ 380</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <!-- <i class="icon icon_licenses"></i> -->
            Licenses
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-for="(l, index) in dataList.Licenses" :key="index">
                <router-link to="">
                  <i class="icon icon_licenses"></i>
                  <span class="a_text">{{l}}</span>
                </router-link>
              </el-col>
              <el-col :span="24">
                <div class="more">+ 45</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="list">
          <div class="title">
            <!-- <i class="icon icon_licenses"></i> -->
            Other
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-for="(l, index) in dataList.Other" :key="index">
                <router-link to="">
                  <i class="icon icon_licenses"></i>
                  <span class="a_text">{{l}}</span>
                </router-link>
              </el-col>
              <el-col :span="24">
                <div class="more">+ 49</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18" class="right">
        <div class="top">
          <div class="top_text">
            <b>Models</b> {{NumFormat(117462)}}
            <el-input v-model="searchValue" class="w-50 m-2" placeholder="Filter by name" />
          </div>
          <el-select v-model="value" class="m-2" placeholder="Sort: most Downloads">
            <template #prefix>
              <i class="el-icon-select"></i>
            </template>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-row :gutter="32" class="list_body" v-loading="listLoad">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" v-for="(list, l) in listdata" :key="l">
            <el-card class="box-card" @click="detailFun(list, l)">
              <template #header>
                <div class="card-header">
                  <div class="name">
                    <img src="@/assets/images/dashboard/people.png" alt="">
                    <b>{{list.name}}</b>
                  </div>
                  <span>27</span>
                </div>
              </template>
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.license}}</p>
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
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <p v-if="total<1" class="list_nodata">No Data</p>
        </el-row>
        <el-pagination :current-page="currentPage1" v-if="false" :page-size="20" :small="small" :background="background" layout="prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'Models',
  components: {},
  setup () {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const dataList = reactive({
      Tasks: [
        'Image Classification', 'Translation', 'Image Segmentation', 'Fill-Mask',
        'Automatic Speech Recognition', 'Audio Classification'
      ],
      Libraries: [
        'PyTorch', 'Sentence Transformers', 'ONNX',
        'Sentence Transformers', 'Sample Factory', 'TensorFlowTTS', 'speechbrain'
      ],
      Datasets: [
        'mozilla-foundation/common_voice_7_0', 'squad', 'common_voice', 'wikipedia',
        'mozilla-foundation/common_voice_11_0', 'glue', 'xtreme'
      ],
      Licenses: [
        'mit', 'apache-2.0', 'cc-by-4.0',
        'creativeml-openrail-m'
      ],
      Other: [
        'AutoTrain Compatible', 'Eval Results', 'Has a Space', 'Carbon Emissions'
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
      // console.log(row, index)
      router.push({ name: 'modelsDetail', params: { name: row.name, tabs: 'card' } })
    }
    async function init () {
      listLoad.value = true
      listdata.value = []
      total.value = 0
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets`, 'get')
      if (listRes) {
        listdata.value = listRes.datasets || []
        total.value = listRes.datasets.length
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function momentFilter (data) {
      return system.$commonFun.momentFun(data)
    }
    onActivated(() => {
      window.scrollTo(0, 0)
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
      init, NumFormat, handleCurrentChange, handleSizeChange, momentFilter, detailFun
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  background: linear-gradient(90deg, #fbfbfc, #fff, #fff, #fff);
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.dataset_body) {
    display: flex;
    align-items: stretch;
    padding: 0 0.16rem;
    margin: auto;
    font-size: 14px;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .left {
      position: relative;
      padding: 1rem 1% 0.5rem 0;
      background-color: #fbfbfc;
      .list {
        margin: 0.2rem 0 0;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 0.11rem;
          font-size: 0.19rem;
          color: #000;
          border-radius: 0.08rem;
          .icon {
            width: 0.22rem;
            height: 0.22rem;
            margin: 0 0.13rem 0 0;
          }
          .icon_sizes {
            background: url(../../../assets/images/icons/icon_7.png) no-repeat
              left center;
            background-size: 17px;
            @media screen and (max-width: 768px) {
              width: 20px;
              background-size: 15px;
            }
          }
          .icon_licenses {
            background: url(../../../assets/images/icons/icon_8.png) no-repeat
              left center;
            background-size: 17px;
            @media screen and (max-width: 768px) {
              width: 20px;
              background-size: 15px;
            }
          }
          &:hover {
            background-color: #f1f7ff;
          }
        }
        .cont {
          padding: 0 0.06rem 0.12rem;
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
                  padding: 0.04rem 0.07rem;
                }
                .icon {
                  width: 0.3rem;
                  height: 0.26rem;
                  padding: 0;
                }
                .icon_sizes {
                  background: url(../../../assets/images/icons/icon_7.png)
                    no-repeat center;
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
                      background: #fef7ef
                        url(../../../assets/images/icons/icon_22.png) no-repeat
                        center;
                      background-size: 17px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(2) {
                  a {
                    .icon {
                      background: #f8f9ff
                        url(../../../assets/images/icons/icon_29.png) no-repeat
                        center;
                      background-size: 17px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(3) {
                  a {
                    .icon {
                      background: #f7f8ff
                        url(../../../assets/images/icons/icon_30.png) no-repeat
                        center;
                      background-size: 17px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(4) {
                  a {
                    .icon {
                      background: #fef4f4
                        url(../../../assets/images/icons/icon_31.png) no-repeat
                        center;
                      background-size: 17px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(5) {
                  a {
                    .icon {
                      background: #f3f8ff
                        url(../../../assets/images/icons/icon_32.png) no-repeat
                        center;
                      background-size: 15px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(6) {
                  a {
                    .icon {
                      background: #effdf7
                        url(../../../assets/images/icons/icon_33.png) no-repeat
                        center;
                      background-size: 17px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
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
                  display: flex;
                  align-items: center;
                  background-color: #dfbafa;
                  color: #5b21c6;
                  border: 0;
                  .icon {
                    width: 21px;
                    background: url(../../../assets/images/icons/icon_34.png)
                      no-repeat right center;
                    background-size: 13px;
                  }
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
        &:nth-child(5) {
          .cont {
            .el-row {
              .el-col {
                a {
                  background-color: #eef2ff;
                  color: #3742ac;
                  border: 0;
                }
              }
            }
          }
        }
      }
    }
    .right {
      position: relative;
      padding: 0.4rem 3%;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #606060;
        font-size: 0.19rem;
        .top_text {
          display: flex;
          align-items: center;
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
          //   .el-input {
          //     max-width: 3.4rem;
          //     margin: 0 0 0 0.17rem;
          //     .el-input__inner {
          //       background-color: #f5f6f8;
          //       border-color: #e1e1e1;
          //       font-size: 0.19rem;
          //       line-height: 1;
          //       border-radius: 0.09rem;
          //     }
          //   }

          .el-input {
            max-width: 3.45rem;
            margin: 0 0 0 0.17rem;
            .el-input__inner {
              padding-left: 0.35rem;
              background: url(../../../assets/images/icons/icon_10_2.png)
                no-repeat 0.1rem center;
              background-size: 17px;
              border-radius: 0.2rem;
              border-color: #cccccc;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
              @media screen and (max-width: 768px) {
                background-size: 15px;
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
        }
        .el-select {
          float: right;
          .el-input {
            cursor: pointer;
            .el-input__inner {
              width: 195px;
              padding: 0 12px 0 40px !important;
              background: linear-gradient(180deg, #fefefe, #f0f0f0);
              border-color: #e1e1e1;
              font-size: 14px;
              line-height: 1;
              border-radius: 0.09rem;
              @media screen and (min-width: 1800px) {
                font-size: 15px;
              }
            }
            .el-input__prefix {
              color: #9ca3b1;
              .el-icon-select {
                width: 21px;
                height: 21px;
                background: url(../../../assets/images/icons/icon_12.png)
                  no-repeat left center;
                background-size: 100%;
              }
            }
            .el-input__suffix {
              display: none;
            }
            ::-webkit-input-placeholder {
              color: #9ca3b1;
            } /* 使用webkit内核的浏览器 */
            :-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本4-18 */
            ::-moz-placeholder {
              color: #9ca3b1;
            } /* Firefox版本19+ */
            :-ms-input-placeholder {
              color: #9ca3b1;
            }
          }
        }
      }
      .list_body {
        padding: 0.2rem 0;
        min-height: 200px;
        .el-col {
          margin: 0.16rem 0;
          .box-card {
            padding: 0.1rem 0.2rem;
            background-color: #fff;
            border-color: #e4e4e4;
            border-radius: 0.1rem;
            box-shadow: 5px 7px 9px rgba(0, 0, 0, 0.15);
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
                    font-weight: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-spacing: normal;
                    text-align: left;
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
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-spacing: normal;
                  text-align: left;
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
      .el-pagination {
        margin: 0.1rem auto;
        display: flex;
        justify-content: center;
        .btn-prev {
          i {
            font-size: 14px;
            @media screen and (min-width: 1800px) {
              font-size: 16px;
            }
          }
        }
      }
      //   &::after {
      //     position: absolute;
      //     content: "";
      //     right: 0;
      //     top: 0;
      //     bottom: 0;
      //     width: 1px;
      //     background-color: #c6c6c6;
      //   }
      //   &::before {
      //     position: absolute;
      //     content: "";
      //     left: 0;
      //     top: 0;
      //     bottom: 0;
      //     width: 1px;
      //     background-color: #c6c6c6;
      //   }
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
