<template>
  <el-alert type="warning" effect="dark" center show-icon>
    <div slot="title">
      To use our site, please switch to
      <span @click="changeNetChange(3141)">Filecoin TestNet</span> or
      <span @click="changeNetChange(137)">Polygon Mainnet</span> or
      <span @click="changeNetChange(97)">BSC TestNet</span> or
      <span @click="changeNetChange(11155111)">Sepolia Testnet</span>.
    </div>
  </el-alert>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'Network',
  components: {},
  setup (props, context) {
    const store = useStore()
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function changeNetChange (rows) {
      system.$commonFun.changeNet(rows)
    }
    onMounted(() => { })
    return {
      changeNetChange
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-alert) {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2001;
  .el-alert__icon {
    @media screen and (min-width: 1600px) {
      font-size: 20px;
      width: 20px;
    }
  }
  .el-alert__content {
    display: flex;
    align-items: center;
    .el-alert__description {
      @media screen and (min-width: 1600px) {
        font-size: 14px;
        line-height: 1.3;
      }
      @media screen and (min-width: 1680px) {
        font-size: 16px;
        line-height: 1.3;
      }
      @media screen and (min-width: 1800px) {
        font-size: 18px;
        line-height: 1.3;
      }
      span {
        text-decoration: underline;
        cursor: pointer;
      }
      a {
        text-decoration: underline;
        color: #fff;
      }
    }
    .el-icon-close {
      @media screen and (min-width: 1600px) {
        font-size: 16px;
        line-height: 1.3;
      }
      @media screen and (min-width: 1800px) {
        font-size: 18px;
        line-height: 1.3;
      }
    }
  }
}
</style>

