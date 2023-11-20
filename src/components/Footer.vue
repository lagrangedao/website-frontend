<template>
    <div class="footer landing">
        <el-row class="footer_menu container-landing flex-row">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="flex-row">
                <a class="text">
                    @Lagrange
                </a>
                <router-link to="/terms_of_service">
                    TOS
                </router-link>
                <router-link to="/privacy">
                    Privacy
                </router-link>
                <a href="/" target="_blank">
                    Team
                </a>
                <a href="/" target="_blank">
                    Jobs
                </a>
                <a href="" target="_blank">
                    <img :src="logo_small" alt="">
                </a>
                <router-link to="/dataset">
                    Datasets
                </router-link>
                <!-- <router-link to="/models">
                    Models
                </router-link> -->
                <router-link to="/spaces">
                    Spaces
                </router-link>
                <a href="https://docs.lagrangedao.org" target="_blank">
                    Docs
                </a>
                <a href="" target="_blank">
                    Solutions
                </a>
                <a href="" target="_blank">
                    Pricing
                </a>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    name: 'footer_page',
    setup () {
        const store = useStore()
        const logo_small = require("@/assets/images/icons/logo_lagrange.png")
        const system = getCurrentInstance().appContext.config.globalProperties
        const route = useRoute()
        const router = useRouter()

        onMounted(() => { })
        return {
            logo_small,
            system,
            route,
            router
        }
    },
})
</script>
<style  lang="scss" scoped>
.footer {
  position: relative;
  height: 0.55rem;
  padding: 0 0 8px;
  font-size: 12px;
  color: rgb(107, 114, 128);
  border-top: 1px solid rgb(229, 231, 235);
  @media screen and (min-width: 1800px) {
    font-size: 14px;
  }
  @media screen and (max-width: 768px) {
    height: auto;
    padding: 15px 0;
  }
  .footer_menu {
    justify-content: space-between;
    height: 100%;
    padding: 0 0.16rem;
    margin: auto;
    .el-col {
      justify-content: space-between;
      @media screen and (max-width: 768px) {
        flex-wrap: wrap;
      }
      a {
        color: inherit;
        @media screen and (max-width: 768px) {
          width: 100%;
          margin: 10px 0;
          font-size: 13px;
          text-align: left;
        }
        img {
          width: 0.3rem;
        }
        &:hover {
          text-decoration: underline;
        }
        &.text {
          cursor: text;
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>