<template>
  <section id="step">
    <div class="step_body container-landing">
      <div class="login-body width flex-row">
        <div class="left">
          <h1>Data <br />And<br /> Computing</h1>
          <h4>Decentralized data science without borders</h4>
          <h4>To receive product news, sign up for our newsletter
            <a href="https://mailchi.mp/nbai/mars-lagrange" target="_blank">here</a>
          </h4>
        </div>
      </div>
      <div class="space-list">
        <div class="tit flex-row">
          <div class="to-white left"></div>
          <b>
            Space of this week
          </b>
          <div class="to-white right"></div>
        </div>
        <el-row justify="space-between" class="list_body" v-loading="listLoad">
          <el-col :xs="24" :sm="12" :md="7" :lg="7" :xl="7" v-for="ls in spaceLikesData" :key="ls">
            <el-card class="box-card" @click="detailFun(ls, l)">
              <template #header>
                <div class="card-header">
                  <span class="right flex-row">{{ls.likes}}</span>
                </div>
                <h1>{{ls.name}}</h1>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <footer>
        <el-row class="row-bg" justify="space-between">
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" v-for="foot in footData" :key="foot">
            <div class="content">
              <div class="tit">{{foot.menu}}</div>
              <ul>
                <li v-for="m in foot.list" :key="m">
                  <p v-if="m.link" @click="system.$commonFun.goLink(m.link)">{{m.name}}</p>
                  <router-link v-else-if="m.path" :to="{name: m.path}">{{m.name}}</router-link>
                  <p v-else>{{m.name}}</p>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </footer>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'home',
  setup () {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const metaAddress = computed(() => (store.state.metaAddress))
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const share_telegram = require("@/assets/images/icons/media_4.png")
    const share_twitter = require("@/assets/images/icons/media_5.png")
    const share_discord = require("@/assets/images/icons/media_6.png")
    const share_github = require("@/assets/images/icons/media_7.png")
    const footData = ref([
      {
        menu: 'Website',
        list: [
          {
            name: 'Datasets',
            path: 'datasets',
            link: ''
          },
          {
            name: 'Spaces',
            path: 'spaces',
            link: ''
          }
        ]
      },
      {
        menu: 'Company',
        list: [
          {
            name: 'About',
            path: '',
            link: 'https://www.swanchain.io/product/lagrange_web'
          },
          {
            name: 'Terms of service',
            path: 'termsOfService',
            link: ''
          },
          {
            name: 'Privacy',
            path: 'privacy',
            link: ''
          }
        ]
      },
      {
        menu: 'Resources',
        list: [
          {
            name: 'Learn',
            path: '',
            link: 'https://docs.lagrangedao.org/lagrange-dao/spaces/create-space'
          },
          {
            name: 'Documentation',
            path: '',
            link: 'https://docs.lagrangedao.org/'
          },
          {
            name: 'Blog',
            path: '',
            link: 'https://swanchain.medium.com/ '
          },
          {
            name: 'Service Status',
            path: '',
            link: 'https://provider.lagrangedao.org/provider-status'
          }
        ]
      },
      {
        menu: 'Social',
        list: [
          {
            name: 'GitHub',
            link: 'https://github.com/lagrangedao'
          },
          {
            name: 'Twitter',
            link: 'https://twitter.com/lagrangedao'
          },
          {
            name: 'Telegram',
            link: 'https://t.me/datadao'
          },
          {
            name: 'Discord',
            link: 'https://discord.gg/8vaB6rKSAu'
          }
        ]
      }
    ])
    const listLoad = ref(true)
    const spaceLikesData = ref([])
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function init (name) {
      listLoad.value = true
      spaceLikesData.value = []
      const likesRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/spaces_of_the_week?${Qs.stringify({ limit: 6 })}`, 'get')
      if (likesRes) spaceLikesData.value = likesRes.spaces || []
      listLoad.value = false
    }
    function detailFun (row, index) {
      // console.log(row, index)
      router.push({ name: 'spaceDetail', params: { wallet_address: row.wallet_address, name: row.name, tabs: 'app' } })
    }
    onMounted(() => init())
    return {
      lagLogin,
      logoUrl,
      navLogin,
      metaAddress,
      spaceLikesData,
      listLoad,
      footData,
      system,
      route,
      router,
      detailFun
    }
  }
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "TRAJANPRO";
  src: url(../../../assets/font/TRAJANPRO3-BOLD.OTF);
  font-style: normal;
  font-display: block;
}
#step {
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .step_body {
    position: relative;
    margin: 0.3rem auto 0;
    // background: url(../../../assets/images/dashboard/main/bg_small_1.png),
    //   url(../../../assets/images/dashboard/main/bg_small_2.png);
    // background-repeat: no-repeat, no-repeat;
    // background-size: 14%, 10%;
    // background-position: bottom left, top right;
    .login-body {
      padding: 0.96rem;
      color: #fff;
      background: #180e1a url(../../../assets/images/dashboard/main/bg.jpg)
        no-repeat center right;
      // background-size: auto 100%;
      background-size: auto 100%;
      flex-wrap: wrap;
      border-radius: 0.25rem;
      @media screen and (max-width: 992px) {
        padding: 0.6rem 0.16rem 0.96rem;
      }
      @media screen and (max-width: 600px) {
        padding: 0.6rem 0.16rem;
        background-size: 0;
      }
      .left {
        width: 50%;
        padding: 0.15rem 5% 0 0;
        color: #fff;
        line-height: 1.2;
        @media screen and (max-width: 992px) {
          width: 100%;
          padding: 0;
        }
        h1 {
          padding: 0 0 0.4rem;
          font-family: "TRAJANPRO";
          font-size: 0.6rem;
          text-transform: capitalize;
          @media screen and (max-width: 768px) {
            font-size: 22px;
          }
          @media screen and (max-width: 540px) {
            padding: 0 0 0.2rem;
          }
        }
        h3 {
          font-size: 0.3rem;
          font-weight: normal;
          @media screen and (max-width: 768px) {
            font-size: 16px;
          }
        }
        h4 {
          padding: 0 0.24rem 0 0;
          font-size: 0.18rem;
          font-weight: normal;
          color: rgba(209, 213, 219, 0.8);
          line-height: 1.6;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
          a {
            color: inherit;
            text-decoration: underline;
          }
        }
        .el-button {
          display: inline-block;
          max-width: 3.4rem;
          font-family: inherit;
          font-size: 0.18rem;
          font-weight: normal;
          height: auto;
          padding: 0.15rem 0.25rem;
          margin: 0.1rem 0 0;
          background: #c37af9;
          color: #fff;
          border: 0;
          border-radius: 0.5rem;
          line-height: 1.1;
          white-space: normal;
          text-transform: uppercase;
          @media screen and (max-width: 600px) {
            font-size: 14px;
          }
          span {
            cursor: pointer;
          }
          &:hover {
            opacity: 0.9;
          }
        }
        .el-button > span {
          cursor: pointer;
        }
      }
    }
    :deep(.space-list) {
      padding: 0.8rem 0 0.25rem;
      .tit {
        justify-content: center;
        font-size: 0.2rem;
        font-weight: 600;
        color: #000;
        gap: 0.08rem;
        .to-white {
          height: 1px;
          flex: 1 1 0%;
          &.left {
            background-image: linear-gradient(to left, #e5e7eb, #fff);
          }
          &.right {
            background-image: linear-gradient(to right, #e5e7eb, #fff);
          }
        }
        b {
          padding: 0 0.05rem;
        }
      }
      .list_body {
        padding: 0.55rem 0;
        min-height: 80px;
        @media screen and (max-width: 600px) {
          padding: 0.4rem 0;
        }
        .el-col {
          margin: 0.16rem 0 0;
          .box-card {
            max-width: 350px;
            margin: auto;
            background-color: #fff;
            box-shadow: none;
            border: 0;
            border-radius: 0;
            .el-card__header {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 0.68rem;
              padding: 0.4rem 0.16rem;
              border: 0;
              border-radius: 0.1rem;
              font-size: 0.16rem;
              color: #fff;
              cursor: pointer;
              .card-header {
                span {
                  position: absolute;
                  height: 18px;
                  font-size: 12px;
                  color: #fff;
                  line-height: 18px;
                  @media screen and (min-width: 1800px) {
                    font-size: 13px;
                  }
                  &.left {
                    left: 0.15rem;
                    top: 0.1rem;
                    font-family: "Helvetica-Bold";
                    opacity: 0.9;
                  }
                  &.right {
                    right: 0.15rem;
                    top: 0.1rem;
                    padding-left: 19px;
                    background: url(../../../assets/images/icons/icon_9_1.png)
                      no-repeat left 1px;
                    background-size: 13px;
                  }
                  &.bottom {
                    left: 0.15rem;
                    bottom: 0.05rem;
                    opacity: 0.9;
                    font-size: 12px;
                    @media screen and (min-width: 1800px) {
                      font-size: 13px;
                    }
                  }
                }
              }
              .card-owner {
                position: absolute;
                right: 0.15rem;
                bottom: 0.05rem;
                opacity: 0.8;
                span {
                  font-size: 13px;
                  color: #fff;
                  line-height: 1.2;
                  @media screen and (min-width: 1800px) {
                    font-size: 14px;
                  }
                }
              }
              h1 {
                // text-shadow: 3px 3px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                font-size: 0.16rem;
                font-weight: 900;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                line-height: 1.5;
                word-break: break-word;
                @media screen and (max-width: 1440px) {
                  font-size: 16px;
                }
                @media screen and (max-width: 768px) {
                  font-size: 14px;
                }
              }
            }
            .el-card__body {
              padding: 0;
              cursor: pointer;
              .text {
                justify-content: space-between;
                color: #000;
                line-height: 1;
                cursor: pointer;
                @media screen and (min-width: 1800px) {
                  font-size: 15px;
                }
                .text_left {
                  justify-content: space-between;
                }
                .icon,
                .icon_img {
                  width: 0.25rem;
                  height: 0.25rem;
                  margin: 0 0.1rem 0 0;
                  border-radius: 0.04rem;
                }
                span {
                  color: #878c93;
                  font-size: 12px;
                  cursor: pointer;
                  @media screen and (min-width: 1440px) {
                    font-size: 13px;
                  }
                  @media screen and (min-width: 1800px) {
                    font-size: 15px;
                  }
                }
                .small {
                  font-weight: 500;
                  color: #000;
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
            }
          }
          &:hover {
            .box-card {
              .el-card__header {
                opacity: 0.8;
              }
            }
          }
          &:nth-child(9n + 1) {
            .box-card {
              .el-card__header {
                background: #d896f7
                  url(../../../assets/images/dashboard/spaces/space_b_01.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_01.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 2) {
            .box-card {
              .el-card__header {
                background: #c37af9
                  url(../../../assets/images/dashboard/spaces/space_b_02.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_02.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 3) {
            .box-card {
              .el-card__header {
                background: #a85cfc
                  url(../../../assets/images/dashboard/spaces/space_b_03.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_03.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 4) {
            .box-card {
              .el-card__header {
                background: #853fff
                  url(../../../assets/images/dashboard/spaces/space_b_04.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_04.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 5) {
            .box-card {
              .el-card__header {
                background: #7405ff
                  url(../../../assets/images/dashboard/spaces/space_b_05.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_05.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 6) {
            .box-card {
              .el-card__header {
                background: #7220b4
                  url(../../../assets/images/dashboard/spaces/space_b_06.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_06.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 7) {
            .box-card {
              .el-card__header {
                background: #562683
                  url(../../../assets/images/dashboard/spaces/space_b_07.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_07.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 8) {
            .box-card {
              .el-card__header {
                background: #47187d
                  url(../../../assets/images/dashboard/spaces/space_b_08.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_08.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
          &:nth-child(9n + 9) {
            .box-card {
              .el-card__header {
                background: #2d165a
                  url(../../../assets/images/dashboard/spaces/space_b_09.png)
                  no-repeat center;
                background-size: auto 61%;
              }
              .el-card__body {
                .text {
                  .icon {
                    background: url(../../../assets/images/dashboard/spaces/space_w_09.png)
                      no-repeat center;
                    background-size: 100%;
                  }
                }
              }
            }
          }
        }
      }
    }
    .background {
      padding-top: 0.96rem;
      background-image: linear-gradient(
        to bottom,
        rgba(243, 244, 246, 0.6),
        #fff
      );
    }
    footer {
      width: 100%;
      min-height: 0.5rem;
      padding-top: 0.2rem;
      padding-bottom: 1rem;
      border-top: 1px solid rgba(229, 231, 235, 0.7);
      text-align: center;
      .el-row {
        .el-col {
          padding-top: 0.2rem;
          line-height: 1.5;
          .tit {
            padding: 0 0 0.08rem;
            font-size: 0.18rem;
            font-weight: 600;
            color: #000;
          }
          ul {
            li {
              padding: 0.08rem 0 0;
              font-size: 0.16rem;
              color: rgb(75, 85, 99);
              a,
              p {
                display: inline-block;
                color: inherit;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

