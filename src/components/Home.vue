<template>
    <div class="wrapper" id="wrapper" ref="area">
        <el-container :class="{'container_position': route.name === 'main'}">
            <el-header>
                <v-head></v-head>
            </el-header>
            <el-main :class="{'main_position': route.name === 'main'}">
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
        onMounted(() => footer_style())
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
  .content {
    .el-backtop {
      background-color: #c37af9;
    }
    .el-backtop,
    .el-calendar-table td.is-today {
      color: #fff;
    }
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
    padding: 0;
    background-color: #fff;
    overflow: visible;
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