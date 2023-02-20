<template>
  <section id="space">
    <el-row class="space_body">
      <div class="fileList">
        No Data
      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Spaces',
  components: {
    CaretBottom
  },
  props: {
    isVisible: { type: Boolean, default: false }
  },
  setup (props) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const info = reactive({
      name: ''
    })
    const renameLoad = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function renameFun () {
      renameLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {

      }
      await system.$commonFun.timeout(500)
      renameLoad.value = false
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    onMounted(() => {
      info.name = ''
      window.scrollTo(0, 0)
    })
    return {
      lagLogin,
      info,
      renameLoad,
      system,
      route,
      router,
      props,
      renameFun, momentFilter
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
  :deep(.space_body) {
    display: flex;
    align-items: stretch;
    padding: 0.4rem 0;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding: 0.4rem 0.16rem;
    }
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .fileList {
      width: 100%;
      margin: 0.2rem 0 0;
      padding: 0.2rem;
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      text-align: center;
      overflow: hidden;
    }
  }
  .affix-container {
    position: relative;
    margin: 80px 0 0;
    text-align: center;
    height: 1400px;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
  }
}
</style>


<i18n>
{
  "en": {},
  "zh": {}
}
</i18n>
