<template>
  <section id="dataset">
    <el-row class="dataset_body">
      <div class="fileList">
        settings
      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom
  },
  setup () {
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
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {

      }
      await system.$commonFun.timeout(500)
      renameLoad.value = false
    }
    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    onMounted(() => { })
    watch(route, (to, from) => {
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
      renameFun, momentFilter
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
  :deep(.dataset_body) {
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
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      overflow: hidden;
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
