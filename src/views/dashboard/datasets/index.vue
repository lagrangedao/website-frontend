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
            Sub-Tasks
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <!-- :xs="6" :sm="6" :md="6" :lg="12" :xl="12" -->
              <el-col v-for="(l, index) in dataList.SubTasks" :key="index">
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
            Sizes
          </div>
          <div class="cont">
            <el-row :gutter="12">
              <el-col :xs="6" :sm="6" :md="6" :lg="12" :xl="12" v-for="(l, index) in dataList.Sizes" :key="index">
                <router-link to="">
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
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18" class="right" v-loading="listLoad">
        <div class="top">
          <div class="top_text">
            <b>Datasets</b> {{NumFormat(pagin.total)}}
            <el-input v-model="searchValue" clearable @input="searchChange" class="w-50 m-2" placeholder="Filter by name" />
          </div>
          <el-select v-model="optionsValue" @change="sortChange" class="m-2" placeholder="Sort: most Downloads">
            <template #prefix>
              <i class="el-icon-select"></i>
            </template>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-row :gutter="32" class="list_body">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="(list, l) in listdata" :key="l">
            <el-card class="box-card" @click="detailFun(list, l)">
              <template #header>
                <div class="card-header">
                  <div class="name">
                    <!-- <div class="img"></div> -->
                    <b>{{list.name}}</b>
                  </div>
                  <span>27</span>
                </div>
              </template>
              <div class="text">
                <i class="icon icon_text"></i>
                <p class="ellipsis">{{list.license}}</p>
              </div>
              <div class="text">
                <i class="icon icon_wallet"></i>
                <p class="ellipsis">{{hiddAddress(list.wallet_address)}}</p>
              </div>
              <div class="text item">
                <div class="item_body">
                  <i class="icon icon_time"></i>
                  <span class="small">{{momentFilter(list.created_at)}}</span>
                </div>
                <!-- <div class="item_body">
                  <i class="icon icon_up"></i>
                  <span class="small">5.15M</span>
                </div> -->
              </div>
            </el-card>
          </el-col>
          <p v-if="listdata && listdata.length === 0" class="list_nodata">No Data</p>
        </el-row>
        <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import qs from 'qs'
export default defineComponent({
  name: 'Datasets',
  components: {},
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
    const optionsValue = ref('')
    const options = ref([
      {
        value: 'downloads',
        label: 'Most Downloads',
      },
      {
        value: 'alphabetical',
        label: 'Alphabetical',
      },
      {
        value: 'updated',
        label: 'Recently Updated',
      },
      {
        value: 'likes',
        label: 'Most Likes',
      }
    ])
    const pagin = reactive({
      pageSize: 12,
      pageNo: 1,
      total: 0,
      sort: ''
    })
    const small = ref(false)
    const background = ref(false)
    const listLoad = ref(true)
    const listdata = ref([])
    const listdataAll = ref([])
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function handleSizeChange (val) {
      // console.log('handleSizeChange:', val)
    }
    async function handleCurrentChange (currentPage) {
      // console.log('handleCurrentChange:', currentPage)
      pagin.pageNo = currentPage
      init()
    }
    async function searchChange (val) {
      // listdata.value = await filterData(listdataAll.value, val)
      pagin.pageNo = 1
      pagin.sort = ''
      optionsValue.value = ''
      init()
    }
    function filterData (listData, val) {
      if (val === '') return listdataAll.value
      let data = []
      listData.forEach(list => {
        if (list.name.indexOf(val) > -1) data.push(list)
      })
      return data
    }
    function NumFormat (value) {
      if (String(value) === '0') return '0'
      else if (!value) return '-'
      var intPartArr = String(value).split('.')
      var intPartFormat = intPartArr[0]
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartArr[1] ? `${intPartFormat}.${intPartArr[1]}` : intPartFormat
    }
    function sortChange (val) {
      pagin.sort = val
      pagin.pageNo = 1
      init()
    }
    async function init () {
      listLoad.value = true
      listdata.value = []
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const params = {
        limit: pagin.pageSize,
        offset: page,
        sort: pagin.sort, // alphabetical， updated
        public_name: searchValue.value
      }
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets?${qs.stringify(params)}`, 'get')
      if (listRes) {
        listdataAll.value = listRes.datasets || []
        listdata.value = listRes.datasets || []
        pagin.total = listRes.total || 0
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    function detailFun (row, index) {
      // console.log(row, index)
      router.push({ name: 'datasetDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'card' } })
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    function hiddAddress (val) {
      if (val) return `${val.substring(0, 5)}...${val.substring(val.length - 5)}`
      else return '-'
    }
    // onMounted(() => init())
    onActivated(() => {
      window.scrollTo(0, 0)
      init()
    })
    onDeactivated(() => {
      searchValue.value = ''
      pagin.pageNo = 1
      pagin.total = 0
      pagin.sort = ''
      optionsValue.value = ''
    })
    watch(lagLogin, (newValue, oldValue) => {
      if (!lagLogin.value) init()
    })
    return {
      lagLogin,
      dataList,
      searchValue,
      optionsValue,
      options,
      small,
      background,
      listLoad,
      listdata,
      pagin,
      bodyWidth,
      system,
      route,
      router,
      init, NumFormat, handleCurrentChange, handleSizeChange, detailFun, momentFilter, searchChange, hiddAddress, sortChange
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
      @media screen and (max-width: 768px) {
        padding: 0 1% 0.2rem;
      }
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
          }
          .icon_licenses {
            background: url(../../../assets/images/icons/icon_8.png) no-repeat
              left center;
            background-size: 17px;
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
                      background: #f0f3ff
                        url(../../../assets/images/icons/icon_23.png) no-repeat
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
                      background: #f6f7ff
                        url(../../../assets/images/icons/icon_24.png) no-repeat
                        center;
                      background-size: 18px;
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
                      background: #f1f7ff
                        url(../../../assets/images/icons/icon_25.png) no-repeat
                        center;
                      background-size: 15px;
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
                      background: #f2f8ff
                        url(../../../assets/images/icons/icon_26.png) no-repeat
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
                      background: #edfdf6
                        url(../../../assets/images/icons/icon_27.png) no-repeat
                        center;
                      background-size: 15px;
                      @media screen and (max-width: 768px) {
                        width: 25px;
                        background-size: 15px;
                      }
                    }
                  }
                }
                &:nth-child(7) {
                  a {
                    .icon {
                      background: #fef3f3
                        url(../../../assets/images/icons/icon_28.png) no-repeat
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
        @media screen and (max-width: 600px) {
          flex-wrap: wrap;
        }
        .top_text {
          display: flex;
          align-items: center;
          @media screen and (max-width: 600px) {
            margin-bottom: 0.1rem;
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
                .img {
                  width: 14px;
                  height: 14px;
                  margin: 0 5px 0 0;
                  background: url(../../../assets/images/icons/icon_1_1.png)
                    no-repeat left center;
                  background-size: 100%;
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
                margin-bottom: 0.1rem;
                flex-wrap: wrap;
                color: #000;
                line-height: 1;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                .icon {
                  width: 18px;
                  height: 18px;
                  margin: 0 6px 0 0;
                }
                .icon_text {
                  background: url(../../../assets/images/icons/icon_10.png)
                    no-repeat left center;
                  background-size: 100%;
                }
                .icon_wallet {
                  background: url(../../../assets/images/icons/icon_48.png)
                    no-repeat left -1px;
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
                  font-family: "FIRACODE-REGULAR";
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
                  .img {
                    background: url(../../../assets/images/icons/icon_1.png)
                      no-repeat left center;
                    background-size: 100%;
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
                  .icon_wallet {
                    background: url(../../../assets/images/icons/icon_48_1.png)
                      no-repeat left -1px;
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
