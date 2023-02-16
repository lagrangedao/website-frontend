<template>
    <div class="footer">
        <el-row class="footer_menu">
            <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <a href="" target="_blank">
                    @Lagrange
                </a>
                <a href="" target="_blank">
                    TOS
                </a>
                <a href="" target="_blank">
                    Privacy
                </a>
                <a href="" target="_blank">
                    Team
                </a>
                <a href="" target="_blank">
                    Jobs
                </a>
            </el-col>
            <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
                <a href="" target="_blank">
                    <img :src="logo_small" alt="">
                </a>
            </el-col>
            <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <router-link to="/dashboard/dataset">
                    Datasets
                </router-link>
                <router-link to="/dashboard/models">
                    Models
                </router-link>
                <router-link to="/dashboard/spaces">
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
        const logo_small = require("@/assets/images/icons/logo_small.png")
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
  height: 0.8rem;
  font-size: 12px;
  color: #fff;
  @media screen and (min-width: 1800px) {
    font-size: 14px;
  }
  @media screen and (max-width: 768px) {
    height: auto;
    padding: 15px 0;
  }
  .footer_menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 0.16rem;
    margin: auto;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .el-col {
      display: flex;
      justify-content: space-around;
      @media screen and (max-width: 768px) {
        flex-wrap: wrap;
      }
      a {
        color: #fff;
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
      }
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