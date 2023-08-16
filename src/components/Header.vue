<template>
  <div class="headerCont">
    <el-row class="headerStyle">
      <el-col :xs="20" :sm="20" :md="20" :lg="8" :xl="8" class="logoImg">
        <img :src="logo" @click="header_logo" alt='' />
        <el-divider direction="vertical" />
        <div class="net">{{info.network||'-'}}</div>
        <!-- <el-input v-model="searchValue" class="w-50 m-2" placeholder="search spaces, users..." /> -->
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="16" :xl="16" class="header_right">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="dataset">
            <i class="icon-style icon_datasets"></i>
            Datasets
          </el-menu-item>
          <!-- <el-menu-item index="models">
            <i class="icon-style icon_models"></i>
            Models
          </el-menu-item> -->
          <el-menu-item index="spaces">
            <i class="icon-style icon_spaces"></i>
            Spaces
          </el-menu-item>
          <el-menu-item index="4">
            <i class="icon-style icon_docs"></i>
            Docs
          </el-menu-item>
          <el-menu-item index="5">
            <i class="icon-style icon_solutions"></i>
            Solutions
          </el-menu-item>
          <el-menu-item index="dashboard">
            Provider
          </el-menu-item>
          <el-menu-item index="6">
            Pricing
          </el-menu-item>
          <el-menu-item index="personal_center" v-if="!lagLogin">
            &nbsp;
            <span class="loginBtn">Login</span>
          </el-menu-item>
          <el-menu-item index="8" v-else>
            <div class="set">
              <el-dropdown split-button @command="handleSelect" :hide-on-click="true" trigger="click">
                <router-link to="/personal_center" class="loginImg">
                  {{system.$commonFun.hiddAddress(metaAddress)}}
                </router-link>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="create_dataset">
                      + New Dataset
                    </el-dropdown-item>
                    <el-dropdown-item command="create_space">
                      + New Space
                    </el-dropdown-item>
                    <!--<el-dropdown-item command="create_organizations"> Create Organizations</el-dropdown-item> -->
                    <el-dropdown-item command="settings">
                      Settings
                    </el-dropdown-item>
                    <el-dropdown-item command="sign_out">
                      Sign Out
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'header_page',
  components: { ArrowDown },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const logo = require("@/assets/images/icons/logo_w.png")
    const people_img = require("@/assets/images/dashboard/people_default.png")
    const searchValue = ref('')
    const activeIndex = ref('')
    const info = reactive({
      network: ''
    })
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function header_logo () {
      router.push({ name: 'main' })
    }
    async function handleSelect (key, keyPath) {
      // console.log(key) //  
      if (key === 'personal_center') {
        router.push({ path: '/personal_center' })
        store.dispatch('setNavLogin', true)
      } else if (key === '4') window.open('https://docs.lagrangedao.org')
      else if (key === 'dataset') router.push({ path: '/dataset' })
      else if (key === 'models') router.push({ path: '/models' })
      else if (key === 'spaces') router.push({ path: '/spaces' })
      else if (key === 'create_space') router.push({ path: '/create_space' })
      else if (key === 'create_dataset') router.push({ path: '/create_dataset' })
      else if (key === 'create_organizations') router.push({ path: '/create_organizations' })
      else if (key === 'dashboard') window.open(process.env.VUE_APP_DASHBOARD_LINK)
      else if (key === 'settings') router.push({ name: 'personalCenterProfile', params: { menu: 'profile' } })
      else if (key === 'sign_out') {
        await system.$commonFun.signOutFun()
        await system.$commonFun.timeout(200)
        window.location.reload()
      }
      else store.dispatch('setNavLogin', false)
    }
    async function activeMenu (row) {
      const nameMenu = row || route.name
      if (nameMenu.indexOf('dataset') > -1) activeIndex.value = 'dataset'
      else if (nameMenu.indexOf('model') > -1) activeIndex.value = 'models'
      else if (nameMenu.indexOf('space') > -1) activeIndex.value = 'spaces'
      else activeIndex.value = nameMenu

      const chainId = await system.$commonFun.web3Init.eth.net.getId()
      const { name } = await system.$commonFun.getUnit(chainId)
      info.network = name || `Chain ID: ${chainId}`
    }
    onMounted(() => activeMenu())
    watch(route, (to, from) => {
      activeMenu(to.path)
      window.scrollTo(0, 0)
    })
    return {
      metaAddress,
      accessAvatar,
      lagLogin,
      logo,
      people_img,
      searchValue,
      activeIndex,
      info,
      bodyWidth,
      system,
      header_logo, handleSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.headerCont {
  min-height: 0.68rem;
  overflow: hidden;
  .headerStyle {
    height: 0.68rem;
    padding: 0 0.16rem;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 14px;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    @media screen and (max-width: 441px) {
      padding: 0 2%;
    }
    .logoImg {
      display: flex;
      align-items: center;
      width: auto;
      height: 0.42rem;
      cursor: pointer;
      color: #fff;
      @media screen and (max-width: 441px) {
        width: 50%;
        height: auto;
      }
      img {
        display: block;
        height: 100%;
        width: auto;
        max-width: 100%;
        cursor: pointer;
        @media screen and (max-width: 441px) {
          width: 100%;
          max-width: 105px;
          height: auto;
        }
      }
      .net {
        position: relative;
        padding: 4px 0 0 13px;
        font-size: 14px;
        @media screen and (max-width: 1680px) {
          font-size: 13px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          content: "";
          width: 6px;
          height: 6px;
          margin-top: -1px;
          background-color: #fff;
          border-radius: 6px;
        }
      }
      :deep(.el-divider) {
        margin: 0 0.15rem;
        border-color: transparent;
        @media screen and (max-width: 441px) {
          margin: 0 10px;
        }
      }
      :deep(.el-input) {
        .el-input__inner {
          padding-left: 0.35rem;
          background: url(../assets/images/icons/icon_13.png) no-repeat 0.1rem
            center;
          background-size: 17px;
          border-radius: 0.1rem;
          border-color: #cfcfcf;
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
    .header_right {
      display: flex;
      align-items: center;
      :deep(.el-menu) {
        width: 100%;
        background-color: #180e1a;
        border: 0;
        justify-content: flex-end;
        @media screen and (max-width: 441px) {
          width: 90%;
          margin-left: 10%;
        }
        .el-menu-item {
          padding: 0 0.15rem;
          background-color: transparent !important;
          border: 0 !important;
          color: #fff;
          @media screen and (min-width: 1800px) {
            font-size: 15px;
          }
          .icon-style {
            width: 21px;
            height: 20px;
            margin: -1px 6px 0 0;
          }
          svg {
            width: 21px;
          }
          img.people {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            border: 2px solid #4784ea;
            cursor: pointer;
          }
          .icon_datasets {
            background: url(../assets/images/icons/icon_1.png) no-repeat left
              center;
            background-size: 17px;
          }
          .icon_models {
            background: url(../assets/images/icons/icon_2.png) no-repeat left
              center;
            background-size: 17px;
          }
          .icon_spaces {
            background: url(../assets/images/icons/icon_3.png) no-repeat left
              center;
            background-size: 21px;
          }
          .icon_docs {
            background: url(../assets/images/icons/icon_4.png) no-repeat left
              center;
            background-size: 19px;
          }
          .icon_solutions {
            background: url(../assets/images/icons/icon_5.png) no-repeat left
              center;
            background-size: 17px;
          }
          .loginBtn {
            padding: 0.1rem 0.2rem;
            margin: 0;
            background-color: #fff;
            font-weight: normal;
            line-height: 1;
            color: #7405ff;
            border-radius: 0.05rem;
            &:hover {
              background-color: #7405ff;
              color: #fff;
              opacity: 0.9;
              cursor: pointer;
            }
          }
          .set {
            vertical-align: middle;
            * {
              vertical-align: middle;
            }
            .el-button-group > .el-button {
              border-radius: 7px;
              &:first-child {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
              &:last-child {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
              }
            }
            .el-icon {
              margin: auto;
              cursor: pointer;
              svg {
                width: 1em;
                cursor: pointer;
                path {
                  cursor: pointer;
                }
              }
            }
          }
          &.is-active,
          &:hover {
            color: #c37af9 !important;
            .icon_datasets {
              background: url(../assets/images/icons/icon_1_1.png) no-repeat
                left center;
              background-size: 17px;
            }
            .icon_models {
              background: url(../assets/images/icons/icon_2_1.png) no-repeat
                left center;
              background-size: 17px;
            }
            .icon_spaces {
              background: url(../assets/images/icons/icon_3_1.png) no-repeat
                left center;
              background-size: 21px;
            }
            .icon_docs {
              background: url(../assets/images/icons/icon_4_1.png) no-repeat
                left center;
              background-size: 19px;
            }
            .icon_solutions {
              background: url(../assets/images/icons/icon_5_1.png) no-repeat
                left center;
              background-size: 17px;
            }
          }
        }
        .el-sub-menu {
          color: #fff;
          .el-sub-menu__title {
            color: #fff;
          }
        }
        .el-sub-menu__title {
          border: 0;
          background-color: transparent !important;
          .loginImg {
            display: flex;
            cursor: pointer;
            img {
              cursor: pointer;
              background-color: #fff;
              border: 2px solid #fff;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1024px) {
}
</style>
<style>
.loginImg {
  display: flex;
  cursor: pointer;
}
</style>

