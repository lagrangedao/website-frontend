<template>
  <section id="access_token" v-loading="listLoad">
    <div class="list">
      <div class="title flex-row">Organizations Settings</div>
    </div>

    <div class="token_list flex-row">
      <div class="card">
        <div class="card_header flex-row">
          <div class="card_left flex-row">
            <div class="face"></div>
            <small>Non-Profit</small>
          </div>
          <div class="card_right flex-row">
            <el-button size="large" class="token_button token_setting" @click="detailSetting">
              <el-icon>
                <Setting />
              </el-icon>
            </el-button>
            <el-button size="large" class="token_button">
              Leave Organization
            </el-button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Setting
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Personal Center',
  components: {
    Setting
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const tokenData = reactive({
      token: ''
    })
    const listLoad = ref(false)
    const tokenShow = ref(false)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()


    function detailSetting () {
      router.push({ name: 'organizationsSettings', params: { submenu: 'profile' } })
    }
    onMounted(() => { })
    onActivated(() => {
      tokenData.token = ''
    })
    return {
      metaAddress,
      accessAvatar,
      navLogin,
      lagLogin,
      system,
      tokenData,
      listLoad,
      tokenShow,
      detailSetting
    }
  }
})
</script>

<style lang="scss" scoped>
#access_token {
  position: relative;
  max-width: 620px;
  padding: 0.15rem 0 0;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.token_list) {
    flex-wrap: wrap;
    margin: 0 0 0.2rem;
    .title {
      display: block;
      width: 100%;
      padding: 0.35rem 0 0;
      font-size: 0.18rem;
      line-height: 1.5;
      @media screen and (min-width: 1800px) {
        font-size: 0.22rem;
      }
    }
    .desc {
      padding: 0.1rem 0;
      font-size: 0.16rem;
      line-height: 1.5;
      color: #606060;
      @media screen and (min-width: 1800px) {
        font-size: 0.2rem;
      }
      @media screen and (max-width: 441px) {
        font-size: 14px;
      }
    }
    .token_button {
      padding: 0.13rem 0.15rem;
      margin: 0.15rem 0.05rem;
      background: linear-gradient(180deg, #fefefe, #f0f0f0);
      border-color: #e1e1e1;
      border-radius: 0.08rem;
      font-size: 0.15rem;
      color: #606060;
      line-height: 1;
      @media screen and (min-width: 1800px) {
        font-size: 0.17rem;
      }
      span,
      svg,
      path {
        cursor: pointer;
      }
    }
    .card {
      width: calc(100% - 0.24rem);
      padding: 0.12rem;
      margin: 0.2rem 0;
      background: linear-gradient(180deg, #fefefe, #f0f0f0);
      border: 1px solid #e1e1e1;
      border-radius: 0.05rem;
      .card_header {
        justify-content: space-between;
        font-size: 0.18rem;
        color: #565656;
        @media screen and (min-width: 1800px) {
          font-size: 0.22rem;
        }
        .face {
          width: 0.6rem;
          height: 0.6rem;
          margin-right: 0.05rem;
          background-color: #7405ff;
          border-radius: 0.05rem;
          @media screen and (max-width: 441px) {
            width: 0.45rem;
            height: 0.45rem;
          }
        }
        .card_left,
        .card_right {
          .token_setting {
            padding: 0.12rem;
            font-size: 0.22rem;
            cursor: pointer;
          }
        }
        .card_left {
          align-items: flex-end;
          color: #606060;
        }
      }
      .card_body {
        .el-input {
          border-color: #ececed;
          .el-input__inner {
            height: auto;
            padding: 0.12rem 0.15rem;
            background-color: #fff !important;
            border-right: 0;
            border-color: inherit;
            line-height: 1;
          }
          .el-input-group__append {
            padding: 0 0.15rem;
            background-color: #fff;
            border-left: 0;
            border-color: inherit;
          }
          .action {
            height: 100%;
          }
          .icon_copy {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url(../../../assets/images/icons/icon_36_1.png)
              no-repeat left center;
            background-size: auto 100%;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              width: 18px;
              height: 18px;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          .icon_look {
            width: 20px;
            height: 20px;
            margin: 0 0.1rem 0 0;
            background: url(../../../assets/images/icons/icon_42.png) no-repeat
              left center;
            background-size: auto 100%;
            cursor: pointer;
            @media screen and (min-width: 1800px) {
              width: 22px;
              height: 22px;
            }
            &:hover {
              opacity: 0.7;
            }
          }
          .el-input__suffix {
            right: 0;
            .el-icon {
              font-size: 0.2rem;
              cursor: pointer;
              svg,
              path {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 1);
    .el-loading-spinner {
      top: 30%;
    }
  }
}
</style>


