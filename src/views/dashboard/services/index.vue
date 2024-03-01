<template>
  <div class="services-main m-width flex-row center">
    <div class="main">
      <el-row justify="space-between">
        <el-col :xs="24" :sm="11" :md="7" :lg="7" :xl="7" class="flex-row center">
          <img :src="imagesIcon" class="img" />
        </el-col>
        <el-col :xs="24" :sm="12" :md="16" :lg="16" :xl="16" class="cont">
          <h2>Lagrange Maintenance Notification</h2>
          <p>lagrangedao.org is currently undergoing maintenance. During this period, all Space related operations will be unavailable, including:</p>
          <ul>
            <li>- Creating new Spaces</li>
            <li>- Uploding and editing Spaces</li>
            <li>- Forking Spaces</li>
            <li>- Deploying Spaces</li>
          </ul>
          <p>Join our official
            <a href="https://discord.gg/8vaB6rKSAu" target="_blank">Discord</a> if you have any urgent needs or questions.</p>
          <div class="homepage flex-row">
            <router-link :to="{name: 'main'}">Back to Homepage</router-link>
          </div>
        </el-col>
      </el-row>
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
.flex-row {
  display: flex;
  align-items: center;
}
.services-main {
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 1rem);
  padding: 0.5rem 0;
  background-color: #ffffff;
  font-family: "Helvetica-light";
  font-size: 18px;
  color: #878c93;
  text-align: left;
  line-height: 1.3;
  overflow-y: auto;
  @media screen and (max-width: 1024px) {
  }
  .main {
    width: 61%;
    min-width: 300px;
    font-size: 0.2rem;
    .img {
      width: 100%;
      max-width: 350px;
    }
    .cont {
      margin: 0.5rem 0;
      h2 {
        margin: 0 0 0.3rem;
        font-family: "Helvetica-light";
        font-size: 0.41rem;
        font-weight: 600;
        color: #000;
      }
      p {
        margin: 0 0 0.22rem;
        a {
          color: #9969c4;
          text-decoration: underline;
        }
      }
      ul {
        margin: 0 0 0.22rem;
        li {
          margin: 2px 0;
          color: #9969c4;
        }
      }
      .homepage {
        justify-content: flex-start;
        a {
          display: inline-block;
          padding: 0.12rem 0.16rem;
          margin: 0;
          background: linear-gradient(180deg, #fefefe, #f0f0f0);
          font-size: 0.21rem;
          font-weight: 500;
          border: 1px solid #9969c4;
          border-radius: 0.08rem;
          color: #606060;
          transition: all 0.2s;
          line-height: 1;
          &:hover {
            // background: linear-gradient(180deg, #bc92e1, #9969c4);
            color: #9969c4;
          }
        }
      }
    }
  }
}
</style>

