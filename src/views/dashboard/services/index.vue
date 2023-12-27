<template>
  <div class="services-main m-width flex-row">
    <div class="main">
      <img :src="imagesIcon" class="img" />
      <h2>Be right back.</h2>
      <p>We are making update to the Lagrange Services.</p>
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
    const imagesIcon = require("@/assets/images/services.jpg")

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
  height: 100vh;
  background-color: #010101;
  font-size: 18px;
  color: #fff;
  overflow-y: auto;
  @media screen and (max-width: 1024px) {
  }
  .main {
    .img {
      width: 90%;
      max-width: 450px;
      margin: 0 auto;
    }
    h2 {
      font-size: 0.4rem;
      font-weight: normal;
    }
    p {
      margin: 0.15rem auto 0.3rem;
      font-size: 0.18rem;
    }
  }
}
</style>

