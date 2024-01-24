<template>
  <div class="wrapper" id="wrapper" ref="area" @click="vis=!vis">
    <el-container :class="{'container_height':true}">
      <el-header v-if="!(route.name === 'spaceDetail' && route.params.tabs === 'app')">
        <v-head></v-head>
      </el-header>
      <el-main>
        <div class="content flex-row">
          <router-view v-slot="{ Component }" :vis="vis">
            <transition name="move" mode="out-in">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
          <el-backtop :right="20" :bottom="50" />
        </div>
      </el-main>
      <el-footer v-if="route.name !== 'main' && !(route.name === 'spaceDetail' && (route.params.tabs === 'app' || route.params.tabs === 'files'))" :class="{'footer_position': positionStyle}">
        <v-foot :positionStyle="positionStyle"></v-foot>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import vHead from './Header.vue';
import vFoot from './Footer.vue';
import elementResizeDetectorMaker from "element-resize-detector"
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  setup () {
    const store = useStore()
    const positionStyle = ref(false)
    const area = ref(null)
    const prevType = ref(true)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const vis = ref(false)

    function footer_style () {
      positionStyle.value = false
      let erd = elementResizeDetectorMaker();
      erd.listenTo(area.value, (element) => {
        let width = element.offsetWidth;
        let height = element.offsetHeight;
        let clientHeight = document.documentElement.clientHeight;
        if (height < clientHeight) positionStyle.value = true
        else positionStyle.value = false
      })
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      system.$commonFun.providerInit.on('accountsChanged', function (account) {
        // console.log('account header:', account[0], !(account[0]));  //Once the account is switched, it will be executed here
        if (!prevType.value) return false
        store.dispatch('setMetaAddress', '')
        store.dispatch('setNavLogin', false)
        store.dispatch('setLogin', false)
        store.dispatch('setAccessToken', '')
        store.dispatch('setAccessSpace', '')
        store.dispatch('setAccessDataset', '')
        window.location.reload()
      })
      // 监听metamask网络断开
      system.$commonFun.providerInit.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    onMounted(() => {
      system.$commonFun.gatewayGain(1)
      fn()
      footer_style()
    })
    watch(route, (to, from) => {
      if (to.path !== '/personal_center' || (store.state.accessToken && to.path === '/personal_center')) store.dispatch('setGetRouter', to.path)
    })
    return {
      positionStyle,
      area,
      bodyWidth,
      system,
      route,
      router,
      footer_style,
      vis
    }
  },
  components: {
    vHead,
    vFoot
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  .content {
    .el-backtop {
      background-color: #c37af9;
    }
    .el-backtop,
    .el-calendar-table td.is-today {
      color: #fff;
    }
  }
  .container_height {
    min-height: 100vh;
  }
  .container_position {
    @media screen and (min-width: 768px) {
      position: fixed;
      left: 0;
      right: 0;
      width: 100%;
      min-height: 100%;
    }
  }
  .el-header {
    height: auto;
    padding: 0;
    // background-color: #180e1a;
  }
  .el-main {
    padding: 0;
    background-color: #fff;
    overflow: visible;
    .content {
      width: 100%;
      min-height: 100%;
      flex: 1;
    }
  }
  .el-footer {
    height: auto;
    padding: 0;
  }
  .footer_position {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &::-webkit-scrollbar-track {
    background: #f7f7f7;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background: #ccc;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}
</style>
<style lang="scss">
.popper_style {
  padding: 0.05rem 0 !important;
  word-break: break-word;
  text-align: left;
  .demo-rich-conent {
    li {
      font-size: 14px;
      cursor: pointer;
      color: #767676;
      // border-top: 1px solid #e6e6e6;
      &.hidden {
        display: none;
        @media screen and (max-width: 1260px) {
          display: block;
        }
      }
      svg {
        margin-right: 0.08rem;
      }
      &.is-disabled {
        opacity: 0.5;
        cursor: no-drop;
      }
      &:nth-child(1) {
        border-top: 0;
      }
      &:hover {
        color: rgb(41, 41, 41);
        svg {
          path {
            fill: rgb(41, 41, 41);
          }
        }
      }
      .m-width {
        padding: 0.1rem 0.2rem;
        .custom-tabs-label {
          height: 100%;
          padding: 0;
          &.font-14 {
            font-size: 14px;
          }
          .icon {
            height: 16px;
          }
          .el-icon {
            margin: -1px 0.1rem 0 0;
          }
          .icon_spaces {
            width: 16px;
            margin: -1px 0.1rem 0 0;
            background: url(../assets/images/icons/icon_2_2.png) no-repeat left
              center;
            background-size: auto 100%;
          }
          .icon-files {
            width: 16px;
            height: auto;
            margin: -1px 0.1rem 0 0;
          }
          b {
            display: block;
            height: auto;
            padding: 0.03rem;
            margin: 0 0.05rem;
            background-color: #7405ff;
            color: #fff;
            border-radius: 5px;
            line-height: 1;
            font-size: 14px;
          }
        }
      }
    }
  }
}
#dataset,
#space,
#step {
  width: 100%;
  min-height: 100%;
  .dataset_body,
  .space_body,
  .step_body {
    min-height: 100%;
  }
}

.mirror {
  margin: auto;
  @media screen and (max-width: 1600px) {
    // padding: 0.4rem 0.16rem 0.9rem;
  }
  @media screen and (min-width: 1280px) {
    max-width: 1280px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1536px;
  }
  .codemirror-container {
    font-size: 15px;
    color: #878c93;
    @media screen and (max-width: 1600px) {
      font-size: 14px;
    }
    @media screen and (max-width: 768px) {
      font-size: 13px;
    }
  }
}

.container-landing {
  padding: 0 16px;
  margin: auto;
  box-sizing: border-box;
  @media screen and (min-width: 640px) {
    max-width: 640px;
  }
  @media screen and (min-width: 768px) {
    max-width: 768px;
  }
  @media screen and (min-width: 1024px) {
    max-width: 1024px;
  }
  @media screen and (min-width: 1200px) {
    max-width: 1200px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1536px;
  }
  &.all {
    max-width: none;
  }
}

.flex-row {
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
  .nowrap {
    flex-wrap: nowrap;
  }
}
</style>

