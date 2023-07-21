<template>
  <section id="space">
    <div id="spaceBody">
      <el-row class="space_body" v-loading="listLoad">
        <iframe v-if="listdata.job_result_uri" :src="listdata.job_result_uri" title="Space app" class="space_iframe"></iframe>
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
    urlChange: { type: String, default: 'app' },
    likesValue: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const listLoad = ref(true)
    const listdata = reactive({
      job_result_uri: ''
    })
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function handleClick (tab, event) {
      router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: route.params.name, tabs: tab.props.name } })
    }
    async function init () {
      if (route.params.tabs !== 'app') return
      listLoad.value = true
      listdata.job_result_uri = ''
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        const jobData = listRes.data.job || { job_result_uri: '' }
        if (jobData.job_result_uri) {
          const response = await fetch(jobData.job_result_uri)
          const textUri = await new Promise(async resolve => {
            resolve(response.text())
          })
          listdata.job_result_uri = JSON.parse(textUri).job_result_uri
        } else listdata.job_result_uri = jobData.job_result_uri
        const current = Math.floor(Date.now() / 1000)
        let expireTime = NaN
        if (listRes.data.space.expiration_time) {
          const currentTime = (listRes.data.space.expiration_time - current) / 86400
          expireTime = Math.floor(currentTime)
        }
        context.emit('handleValue', listRes.data, jobData ? jobData.job_source_uri : '', expireTime, listRes.data.nft)
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    onActivated(() => { })
    onMounted(() => {
      window.scrollTo(0, 0)
      init()
    })
    onDeactivated(() => { })
    watch(route, (to, from) => {
      if (to.name !== 'spaceDetail') return
      if (to.params.tabs === 'app') {
        window.scrollTo(0, 0)
        init()
      }
    })
    watch(() => props.likesValue, () => {
      init()
    })
    return {
      lagLogin,
      listLoad,
      listdata,
      bodyWidth,
      system,
      route,
      router,
      init, handleClick
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
  .mark {
    display: flex;
    flex-wrap: wrap;
    .left,
    .right {
      width: 50%;
    }
  }
  :deep(.space_body) {
    display: flex;
    align-items: stretch;
    min-height: 80px;
    padding: 0;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .space_iframe {
      width: 100%;
      overflow: auto;
      @media screen and (min-height: 500px) and (min-width: 769px) {
        min-height: 315px;
      }
      @media screen and (min-height: 600px) and (min-width: 769px) {
        min-height: 415px;
      }
      @media screen and (min-height: 680px) and (min-width: 769px) {
        min-height: 495px;
      }
      @media screen and (min-height: 700px) and (min-width: 769px) {
        min-height: 595px;
      }
      @media screen and (min-height: 750px) and (min-width: 769px) {
        min-height: 565px;
      }
      @media screen and (min-height: 768px) and (min-width: 769px) {
        min-height: 595px;
      }
      @media screen and (min-height: 900px) and (min-width: 769px) {
        min-height: 685px;
      }
      @media screen and (min-height: 1000px) and (min-width: 769px) {
        min-height: 755px;
      }
      @media screen and (min-height: 1100px) and (min-width: 769px) {
        min-height: 925px;
      }
      @media screen and (min-height: 1200px) and (min-width: 769px) {
        min-height: 985px;
      }
      &.space_text {
        padding: 11px;
        background-color: #000;
        font-size: 14px;
        color: #fff;
        box-shadow: inset 0 5px 5px rgba(204, 204, 204, 0.55);
        cursor: text;
        word-break: break-all;
        @media screen and (min-width: 1800px) {
          font-size: 16px;
        }
        @media screen and (max-width: 600px) {
          font-size: 13px;
        }
      }
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
          .icon_spaces {
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
