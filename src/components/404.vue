<template>
  <div class="services-main">
    <div class="m-width flex-row center">
      <div class="main flex-row center">
        <img :src="imagesIcon" class="img" />
        <div class="text">
          <h2>404</h2>
          <p>This is not the web page you are looking for.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'Be Right Back',
  components: {},
  setup (props, context) {
    const store = useStore()
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const imagesIcon = require("@/assets/images/404/not-fund-icon01.png")

    onMounted(() => { })
    return {
      bodyWidth,
      system,
      imagesIcon
    }
  }
})
</script>
<style lang="scss" scoped>
.services-main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 0.66rem);
  background: url(../assets/images/404/not-fund-bg01.png),
    url(../assets/images/404/not-fund-bg02.png),
    url(../assets/images/404/not-fund-bg03.png),
    url(../assets/images/404/not-fund-bg04.png),
    url(../assets/images/404/not-fund-bg05.png);
  background-color: #1d0c39;
  background-size: 12%, 8%, 15%, 8%, 72%;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
  background-position: top right, 74% center, left bottom, 64% 30%, center;
  font-size: 18px;
  color: #fff;
  overflow-y: auto;
  @media screen and (max-width: 1024px) {
  }
  .main {
    padding: 0.7rem 0;
    .img {
      width: 17%;
      min-width: 250px;
      margin: 0 0.4rem 0 0;
    }
    .text {
      width: 17%;
      min-width: 250px;
      text-align: left;
      h2 {
        font-size: 0.7rem;
        font-weight: bolder;
      }
      p {
        margin: 0.15rem auto 0.3rem;
        font-size: 0.24rem;
      }
    }
  }
}
</style>

