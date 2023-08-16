<template>
  <div class="wrapper" id="wrapper" ref="area">
    <el-container :class="{'container_height':true}">
      <el-header>
        <v-head></v-head>
      </el-header>
      <el-main>
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="move" mode="out-in">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
          <el-backtop :right="20" :bottom="20" />
        </div>
      </el-main>
      <el-footer v-if="route.name !== 'main'" :class="{'footer_position': positionStyle}">
        <v-foot :positionStyle="positionStyle"></v-foot>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
const ethereum = window.ethereum;
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
      ethereum.on('accountsChanged', function (account) {
        // console.log('account header:', account[0], !(account[0]));  //Once the account is switched, it will be executed here
        if (!prevType.value) return false
        system.$commonFun.signOutFun()
      })
      // 监听metamask网络断开
      ethereum.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    onMounted(() => {
      fn()
      footer_style()
    })
    return {
      positionStyle,
      area,
      bodyWidth,
      system,
      route,
      router,
      footer_style
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
    background-color: #180e1a;
  }
  .el-main {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    background-color: #fff;
    overflow: visible;
    .content {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      min-height: 100%;
      flex: 1;
    }
    &.main_position {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 0.68rem);
      background-color: #180e1a;
      .content {
        width: 100%;
        height: 100%;
      }
    }
    &.main_app {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100% - 1.48rem);
      .content {
        width: 100%;
        height: 100%;
      }
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
      display: flex;
      align-items: center;
      padding: 0.1rem 0.2rem;
      font-size: 14px;
      cursor: pointer;
      color: #767676;
      svg {
        margin-right: 0.08rem;
      }
      &:nth-child(1) {
        border-bottom: 1px solid #e6e6e6;
      }
      &:hover {
        color: rgb(41, 41, 41);
        svg {
          path {
            fill: rgb(41, 41, 41);
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
</style>

