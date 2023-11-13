<template>
  <div class="headerCont">
    <el-row class="headerStyle container-landing flex-row">
      <el-col :xs="14" :sm="12" :md="4" :lg="4" :xl="4" class="logoImg flex-row">
        <div @click="header_logo" class="flex-row">
          <img :src="logo" alt='Lagrange' />
        </div>
        <!-- <el-divider direction="vertical" />
        <div class="net">{{info.network||'-'}}</div> -->
        <!-- <el-input v-model="searchValue" class="w-50 m-2" placeholder="search spaces, users..." /> -->
      </el-col>
      <el-col :xs="10" :sm="12" :md="20" :lg="20" :xl="20" class="header_right flex-row">
        <el-menu :default-active="activeIndex" class="el-menu-demo" menu-trigger="click" mode="horizontal" :teleported="true" :ellipsis="true" @select="handleSelect">
          <el-menu-item index="dataset">
            <i class="icon-style icon_datasets"></i>
            Datasets
          </el-menu-item>
          <!-- <el-menu-item index="models">
            <i class="icon-style icon_models"></i>
            Models
          </el-menu-item> -->
          <el-menu-item index="spaces">
            <i class="icon-style icon_spaces"></i>
            Spaces
          </el-menu-item>
          <el-menu-item index="Infrastructure">
            <i class="icon-style icon_Infrastructure"></i>
            Infrastructure
          </el-menu-item>
          <el-menu-item index="4">
            <i class="icon-style icon_docs"></i>
            Docs
          </el-menu-item>
          <el-menu-item index="pricing">
            <i class="icon-style icon_solutions"></i>
            Pricing
          </el-menu-item>
          <el-menu-item index="dashboard">
            Provider
          </el-menu-item>
          <el-menu-item index="personal_center" v-if="!lagLogin">
            &nbsp;
            <span class="loginBtn">Log In</span>
          </el-menu-item>
          <el-menu-item index="8" class="address-style" v-else>
            <div class="set flex-row">
              <div class="info-style flex-row">
                <div class="address" @click="wrongVisible = true">
                  {{system.$commonFun.hiddAddress(metaAddress)}}
                </div>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
        <div class="set">
          <el-dropdown popper-class="menu-style" v-if="lagLogin" @command="handleSelect" :hide-on-click="false">
            <router-link to="/personal_center" class="el-dropdown-link setting-style loginImg flex-row">
              <el-icon>
                <Avatar />
              </el-icon>
            </router-link>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personal_center">
                  <div class="profile">
                    <div class="tit">Profile</div>
                    <div class="flex-row">
                      <img :src="accessAvatar||people_img" width="15" height="15" alt="">
                      <span class="link">{{accessName}}</span>
                    </div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="asProvider">
                  <div class="profile router-link">- As Provider</div>
                </el-dropdown-item>
                <el-dropdown-item command="asUser">
                  <div class="profile router-link b">- As Space Builder</div>
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu>
                <el-dropdown-item command="create_dataset">
                  <span class="link">+ New Dataset</span>
                </el-dropdown-item>
                <el-dropdown-item command="create_space">
                  <span class="link">+ New Space</span>
                </el-dropdown-item>
                <!--<el-dropdown-item command="create_organizations"> Create Organizations</el-dropdown-item> -->
                <el-dropdown-item command="settings">
                  <span class="link">Settings</span>
                </el-dropdown-item>
                <el-dropdown-item command="sign_out">
                  <span class="link">Sign Out</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="Account" v-model="wrongVisible" :append-to-body="false" :width="bodyWidth" custom-class="wrongNet">
      <label>Connected with MetaMask</label>
      <div class="address">{{system.$commonFun.hiddAddress(metaAddress)}}</div>
      <div class="area flex-row">
        <div class="fast">
          <label>Network</label>
          <div class="address">{{info.network}}</div>
        </div>
        <div class="fast">
          <label>Balance</label>
          <div class="address">{{info.balance||'-'}} {{info.unit}}</div>
        </div>
      </div>
      <div class="share flex-row">
        <el-button :disabled="info.url?false:true" @click="system.$commonFun.goLink(`${info.url}${metaAddress}`)">
          <svg t="1669800457857" class="icon icon_big" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6207" width="64" height="64">
            <path d="M923.648 1015.442H100.206a91.648 91.648 0 0 1-91.721-91.72V101.01a91.502 91.502 0 0 1 91.72-91.501H649.29a30.72 30.72 0 0 1 0 61.44H130.487a60.855 60.855 0 0 0-60.928 60.854v762.003a60.855 60.855 0 0 0 60.928 60.928h762.441a60.855 60.855 0 0 0 60.928-60.928V345.088a30.72 30.72 0 1 1 61.44 0v579.291a91.21 91.21 0 0 1-91.648 91.063z m-497.81-403.675a30.574 30.574 0 1 1-43.228-43.228L930.816 17.92a30.574 30.574 0 1 1 43.154 43.3L425.91 611.768z"
              p-id="6208" fill="#7405ff"></path>
            <path d="M923.648 1023.854H100.206A100.206 100.206 0 0 1 0.073 923.72v-822.71C0.22 45.86 44.91 1.096 100.206 1.096h549.083a39.131 39.131 0 1 1 0 78.263H130.414a52.443 52.443 0 0 0-52.444 52.443v762.003c0 28.964 23.48 52.443 52.517 52.516H893a52.368 52.368 0 0 0 37.084-15.36 52.81 52.81 0 0 0 15.36-37.156V345.088a39.131 39.131 0 0 1 78.262 0v579.291a99.913 99.913 0 0 1-100.059 99.475zM100.059 17.92c-45.787 0-82.944 37.23-83.017 83.09v822.784c0.073 46.007 37.303 83.237 83.31 83.31h823.37a83.09 83.09 0 0 0 83.163-82.798V345.015a22.309 22.309 0 0 0-44.544 0v548.864c0 18.359-7.315 35.986-20.188 49.006a68.754 68.754 0 0 1-49.079 20.333H130.487a69.486 69.486 0 0 1-69.34-69.34V131.804a69.266 69.266 0 0 1 69.267-69.339h518.948a22.309 22.309 0 1 0-0.146-44.544h-549.01z m304.202 611.328a39.058 39.058 0 0 1-27.575-66.706L924.818 11.995a38.985 38.985 0 1 1 55.077 55.223l-548.06 550.473c-7.314 7.315-17.261 11.484-27.574 11.557zM952.32 17.335a22.162 22.162 0 0 0-15.58 6.583L388.536 574.39a22.162 22.162 0 1 0 31.378 31.451L968.046 55.296a21.943 21.943 0 0 0 6.583-15.726 22.382 22.382 0 0 0-22.236-22.235z"
              p-id="6209" fill="#7405ff"></path>
          </svg>
          View on explorer
        </el-button>

        <el-button @click="system.$commonFun.copyContent(metaAddress, 'Copied')">
          <svg t="1640938541398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4760" width="32" height="32">
            <path d="M746.932 698.108" p-id="4761" fill="#7405ff"></path>
            <path d="M925.731 288.698c-1.261-1.18-3.607-3.272-6.902-6.343-5.486-5.112-11.615-10.758-18.236-16.891-18.921-17.526-38.003-35.028-56.046-51.397-2.038-1.848-2.038-1.835-4.077-3.682-24.075-21.795-44.156-39.556-58.996-52.076-8.682-7.325-15.517-12.807-20.539-16.426-3.333-2.402-6.043-4.13-8.715-5.396-3.365-1.595-6.48-2.566-10.905-2.483C729.478 134.227 720 143.77 720 155.734l0 42.475 0 42.475 0 84.95L720 347l21.205 0L890 347l0 595L358.689 942C323.429 942 295 913.132 295 877.922L295 177l361.205 0c11.736 0 21.25-9.771 21.25-21.5s-9.514-21.5-21.25-21.5l-382.5 0L252 134l0 21.734L252 813l-52.421 0C166.646 813 140 786.928 140 754.678L140 72l566.286 0C739.29 72 766 98.154 766 130.404L766 134l40 0 0-3.596C806 76.596 761.271 33 706.286 33L119.958 33 100 33l0 19.506 0 702.172C100 808.463 144.642 852 199.579 852L252 852l0 25.922C252 936.612 299.979 984 358.689 984l552.515 0L932 984l0-21.237L932 325.635 932 304l0.433 0C932.432 299 930.196 292.878 925.731 288.698zM762 304l0-63.315L762 198.21l0-0.273c14 11.479 30.3 26.369 49.711 43.942 2.022 1.832 2.136 1.832 4.157 3.665 17.923 16.259 36.957 33.492 55.779 50.926 2.878 2.666 5.713 5.531 8.391 7.531L762 304.001z"
              p-id="4762" fill="#7405ff"></path>
            <path d="M816.936 436 407.295 436c-10.996 0-19.91 8.727-19.91 19.5 0 10.77 8.914 19.5 19.91 19.5l409.641 0c11 0 19.914-8.73 19.914-19.5C836.85 444.727 827.936 436 816.936 436z" p-id="4763" fill="#7405ff"></path>
            <path d="M816.936 553 407.295 553c-10.996 0-19.91 8.727-19.91 19.5 0 10.774 8.914 19.5 19.91 19.5l409.641 0c11 0 19.914-8.726 19.914-19.5C836.85 561.727 827.936 553 816.936 553z" p-id="4764" fill="#7405ff"></path>
            <path d="M816.936 689 407.295 689c-10.996 0-19.91 8.729-19.91 19.503 0 10.769 8.914 19.497 19.91 19.497l409.641 0c11 0 19.914-8.729 19.914-19.497C836.85 697.729 827.936 689 816.936 689z" p-id="4765" fill="#7405ff"></path>
          </svg>
          Copy Wallet Address
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown, Setting, Avatar } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'header_page',
  components: { ArrowDown, Setting, Avatar },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessName = computed(() => (store.state.accessName))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const logo = require("@/assets/images/icons/logo_black.png")
    const people_img = require("@/assets/images/dashboard/people_default.png")
    const searchValue = ref('')
    const activeIndex = ref('')
    const info = reactive({
      network: '',
      url: '',
      balance: '',
      unit: ''
    })
    const wrongVisible = ref(false)
    const bodyWidth = ref(document.body.clientWidth > 600 ? '450px' : '95%')
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function header_logo () {
      if (metaAddress.value) router.push({ path: '/personal_center' })
      else router.push({ name: 'main' })
    }
    async function handleSelect (key, keyPath) {
      // console.log(key, keyPath) //  
      if (key === 'personal_center') {
        router.push({ path: '/personal_center' })
        store.dispatch('setNavLogin', true)
      } else if (key === '4') window.open('https://docs.lagrangedao.org')
      else if (key === 'asProvider') router.push({ name: 'paymentHistory', query: { type: 'provider' } })
      else if (key === 'asUser') router.push({ name: 'paymentHistory', query: { type: 'user' } })
      else if (key === 'dataset') router.push({ path: '/dataset' })
      else if (key === 'models') router.push({ path: '/models' })
      else if (key === 'spaces') router.push({ path: '/spaces' })
      else if (key === 'Infrastructure') router.push({ path: '/Infrastructure' })
      else if (key === 'create_space') router.push({ path: '/create_space' })
      else if (key === 'create_dataset') router.push({ path: '/create_dataset' })
      else if (key === 'create_organizations') router.push({ path: '/create_organizations' })
      else if (key === 'dashboard') window.open(process.env.VUE_APP_DASHBOARD_LINK)
      else if (key === 'pricing') router.push({ path: '/pricing' })
      else if (key === 'settings') router.push({ name: 'personalCenterProfile', params: { menu: 'profile' } })
      else if (key === 'sign_out') {
        await system.$commonFun.signOutFun()
        // await system.$commonFun.timeout(50)
        window.location.reload()
      }
      else store.dispatch('setNavLogin', false)
    }
    async function activeMenu (row) {
      const nameMenu = row || route.name
      if (nameMenu.indexOf('dataset') > -1) activeIndex.value = 'dataset'
      else if (nameMenu.indexOf('model') > -1) activeIndex.value = 'models'
      else if (nameMenu.indexOf('space') > -1) activeIndex.value = 'spaces'
      else if (nameMenu.indexOf('Infrastructure') > -1) activeIndex.value = 'Infrastructure'
      else if (nameMenu.indexOf('pricing') > -1) activeIndex.value = 'pricing'
      else activeIndex.value = nameMenu

      const chainId = await system.$commonFun.web3Init.eth.net.getId()
      const { unit, name, url } = await system.$commonFun.getUnit(chainId)
      info.network = name || `Chain ID: ${chainId}`
      info.unit = unit
      info.url = url || ''
    }
    function balanceMethod () {
      if (!metaAddress.value) return
      system.$commonFun.web3Init.eth.getBalance(metaAddress.value).then((balance) => {
        // console.log(balance)
        const myBalance = balance
        const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
        info.balance = Number(balanceAll).toFixed(4)
      })
    }
    onMounted(() => {
      activeMenu()
      balanceMethod()
    })
    watch(route, (to, from) => {
      activeMenu(to.path)
      window.scrollTo(0, 0)
    })
    watch(metaAddress, (to, from) => {
      balanceMethod()
    })
    return {
      metaAddress,
      accessName,
      accessAvatar,
      lagLogin,
      logo,
      people_img,
      searchValue,
      activeIndex,
      info,
      wrongVisible,
      bodyWidth,
      system,
      header_logo, handleSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.headerCont {
  min-height: 0.65rem;
  overflow: hidden;
  .headerStyle {
    height: 0.65rem;
    margin: auto;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 14px;
    .logoImg {
      width: auto;
      height: 0.42rem;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      color: #000;
      @media screen and (max-width: 441px) {
        width: 50%;
        height: auto;
      }
      div {
        cursor: pointer;
      }
      img {
        display: block;
        height: 28px;
        width: auto;
        max-width: 100%;
        margin-right: 8px;
        cursor: pointer;
        @media screen and (max-width: 441px) {
          width: 100%;
          max-width: 105px;
          height: auto;
        }
      }
      .net {
        position: relative;
        padding: 4px 0 0 13px;
        font-size: 14px;
        @media screen and (max-width: 1680px) {
          font-size: 13px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          content: "";
          width: 6px;
          height: 6px;
          margin-top: -1px;
          background-color: #fff;
          border-radius: 6px;
        }
      }
      :deep(.el-divider) {
        margin: 0 0.15rem;
        border-color: transparent;
        @media screen and (max-width: 441px) {
          margin: 0 10px;
        }
      }
      :deep(.el-input) {
        .el-input__inner {
          padding-left: 0.35rem;
          background: url(../assets/images/icons/icon_13.png) no-repeat 0.1rem
            center;
          background-size: 17px;
          border-radius: 0.1rem;
          border-color: #cfcfcf;
          @media screen and (min-width: 1800px) {
            font-size: 15px;
          }
        }
        .el-input__prefix {
          padding: 0;
          .el-icon {
            svg {
              width: 0.22rem;
              height: 0.22rem;
              color: #9ea5b3;
            }
          }
        }
      }
    }
    .header_right {
      flex-wrap: nowrap;
      :deep(.el-menu) {
        width: 100%;
        padding-right: 0.15rem;
        border: 0;
        justify-content: flex-end;
        align-items: center;
        @media screen and (max-width: 441px) {
          width: 90%;
          margin-left: 10%;
        }
        .el-menu-item,
        .el-sub-menu {
          padding: 0 0.15rem;
          background-color: transparent !important;
          border: 0 !important;
          color: #000;
          &.address-style {
            padding-right: 0;
          }
          @media screen and (min-width: 1800px) {
            font-size: 15px;
          }
          .icon-style {
            width: 20px;
            height: 19px;
            margin: -1px 0 0 0;
          }
          svg {
            width: 21px;
          }
          img.people {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            border: 2px solid #4784ea;
            cursor: pointer;
          }
          .icon_datasets {
            background: url(../assets/images/icons/icon_1.png) no-repeat left
              center;
            background-size: 12px;
          }
          .icon_models {
            background: url(../assets/images/icons/icon_2.png) no-repeat left
              center;
            background-size: 12px;
          }
          .icon_spaces {
            margin: -1px 6px 0 0;
            background: url(../assets/images/icons/icon_3.png) no-repeat left
              center;
            background-size: 19px;
          }
          .icon_Infrastructure {
            margin: 0;
            background: url(../assets/images/icons/icon_Infrastructure.png)
              no-repeat left center;
            background-size: 12px;
          }
          .icon_docs {
            background: url(../assets/images/icons/icon_4.png) no-repeat left
              center;
            background-size: 13px;
          }
          .icon_solutions {
            background: url(../assets/images/icons/icon_5.png) no-repeat left
              center;
            background-size: 12px;
          }
          .loginBtn {
            padding: 0.08rem 0.18rem;
            margin: 0;
            background-color: #7405ff;
            font-weight: normal;
            line-height: 1;
            color: #fff;
            border: 1px solid #7405ff;
            border-radius: 0.5rem;
            &:hover {
              background-color: #fff;
              color: #7405ff;
              opacity: 1;
              cursor: pointer;
            }
          }
          .set {
            align-items: center;
            vertical-align: middle;
            * {
              vertical-align: middle;
            }
            .info-style {
              background-color: rgba(116, 5, 255, 0.2);
              color: #333;
              border: 1px solid rgba(116, 5, 255, 0.2);
              cursor: text;
              border-radius: 0.1rem;
              &:hover {
                background-color: rgba(116, 5, 255, 0.3) !important;
              }
              .address {
                padding: 5px 0.1rem;
                line-height: 25px;
                cursor: pointer;
              }
              .el-dropdown {
                padding: 0.05rem 0.07rem 0.05rem 0.05rem;
                border-left: 1px solid #9f5ff0;
              }
            }
            .el-button-group > .el-button {
              border-radius: 7px;
              &:first-child {
                padding-left: 10px;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
              &:last-child {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
              }
            }
            .el-icon {
              margin: auto;
              cursor: pointer;
              color: #fff;
              svg {
                width: 1em;
                cursor: pointer;
                path {
                  cursor: pointer;
                }
              }
            }
            .loginImg {
              cursor: pointer;
              img {
                width: 23px;
                height: 23px;
                margin: 0 0 0 5px;
                cursor: pointer;
                background-color: #fff;
                border: 1px solid #b9b9b9;
                border-radius: 50%;
              }
            }
          }
          &.is-active,
          &:hover {
            color: #c37af9 !important;
            .icon_datasets {
              background: url(../assets/images/icons/icon_1_1.png) no-repeat
                left center;
              background-size: 12px;
            }
            .icon_models {
              background: url(../assets/images/icons/icon_2_1.png) no-repeat
                left center;
              background-size: 12px;
            }
            .icon_spaces {
              background: url(../assets/images/icons/icon_3_1.png) no-repeat
                left center;
              background-size: 19px;
            }
            .icon_Infrastructure {
              background: url(../assets/images/icons/icon_Infrastructure_1.png)
                no-repeat left center;
              background-size: 12px;
            }
            .icon_docs {
              background: url(../assets/images/icons/icon_4_1.png) no-repeat
                left center;
              background-size: 13px;
            }
            .icon_solutions {
              background: url(../assets/images/icons/icon_5_1.png) no-repeat
                left center;
              background-size: 12px;
            }
          }
        }
        .el-sub-menu {
          padding: 0;
          color: #000;
          .el-sub-menu__title {
            padding: 0;
            color: #000;
          }
        }
        .el-sub-menu__title {
          border: 0;
          background-color: transparent !important;
          .loginImg {
            cursor: pointer;
            img {
              cursor: pointer;
              background-color: #fff;
              border: 2px solid #fff;
              border-radius: 50%;
            }
          }
        }
      }
      .setting-style {
        width: 35px;
        height: 35px;
        padding: 0;
        background-color: rgba(116, 5, 255, 0.2) !important;
        border: 1px solid rgba(116, 5, 255, 0.2) !important;
        cursor: pointer;
        border-radius: 0.1rem;
        &:hover {
          background-color: rgba(116, 5, 255, 0.3) !important;
        }
        * {
          cursor: pointer;
        }
        i,
        svg,
        path {
          width: 18px;
          height: 18px;
          margin: 0 auto;
          color: #333;
        }
        .el-sub-menu__icon-arrow {
          display: none;
        }
        .el-sub-menu__title {
          padding: 0;
        }
      }
    }
  }
}
:deep(.el-overlay-dialog) {
  display: flex;
  align-items: center;
  .wrongNet {
    margin: auto !important;
    box-shadow: 0 0 13px rgba(128, 128, 128, 0.8);
    border-radius: 0.2rem;
    text-align: left;
    .el-dialog__header {
      padding: 0.2rem 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dfdfdf;
      color: #000;
      font-size: 0.2rem;
      font-weight: 500;
      line-height: 1;
      text-transform: capitalize;
      @media screen and (max-width: 479px) {
        padding: 0.3rem 0.2rem;
      }
      .el-dialog__headerbtn {
        position: relative;
        top: auto;
        right: auto;
        font-size: inherit;
        i {
          font-size: inherit;
          * {
            cursor: pointer;
          }
          &:hover {
            color: #7405ff;
          }
        }
      }
      .el-dialog__title {
        font-size: inherit;
      }
    }
    .el-dialog__body {
      position: relative;
      padding: 0.3rem 0.4rem 0.4rem;
      font-size: 0.16rem;
      @media screen and (max-width: 540px) {
        padding: 0.2rem;
      }
      label {
        word-break: break-word;
        line-height: 1;
        color: #666;
        font-size: inherit;
      }
      .address {
        background: rgba(233, 233, 233, 1);
        padding: 8px;
        margin: 10px 0 12px;
        border-radius: 8px;
        font-size: inherit;
      }
      .address_email {
        margin: 0 0 10px;
        .address_body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 0;
          .address {
            width: 80%;
            margin: 0;
          }
          .address_right {
            position: relative;
            display: inline-block;
            padding: 0.05rem 0.2rem 0.05rem 0.32rem;
            margin: 0 5px;
            background-color: rgba(85, 128, 233, 0.15);
            font-size: 14px;
            border-radius: 0.5rem;
            white-space: nowrap;
            @media screen and (max-width: 1600px) {
              font-size: 13px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }
            &::before {
              position: absolute;
              left: 0.16rem;
              top: 50%;
              content: "";
              width: 0.08rem;
              height: 0.08rem;
              margin-top: -0.04rem;
              background-color: #606266;
              border-radius: 0.5rem;
            }
          }
          .bg-primary {
            &::before {
              background-color: #4d73ff;
            }
          }
        }
        .share {
          .el-button {
            width: 100%;
            margin: 3px 0 0;
            font-size: 13px;
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }
          }
        }
        .el-loading-mask {
          .el-loading-spinner {
            top: 50%;
          }
        }
      }
      .area {
        justify-content: space-between;
        .fast {
          width: 48%;
          .address {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .share {
        flex-wrap: wrap;
        justify-content: flex-start;
        font-size: inherit;
        .el-button {
          justify-content: flex-start;
          min-width: 50%;
          padding: 0;
          margin: 8px 0 0;
          background: transparent !important;
          border: 0;
          color: #7405ff;
          font-size: inherit;
          font-weight: normal;
          font-family: inherit;
          opacity: 0.8;
          span {
            display: flex;
            align-items: center;
            svg {
              width: 15px;
              height: 15px;
              margin: 0 3px 0 0;
            }
            .icon_big {
              width: 13px;
              height: 13px;
            }
          }
          &:hover {
            background: transparent;
            opacity: 1;
          }
          &.is-disabled {
            opacity: 0.4;
          }
        }
      }
      .loadStyle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.2rem;
      }
      .apiTipCont {
        p {
          display: flex;
          align-items: center;
          text-indent: 0.1rem;
          margin: 0.1rem;
          color: #7e7e7e;
          font-size: 0.18rem;
          .el-icon-document-copy {
            display: block;
            font-size: 17px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1024px) {
}
</style>
<style lang="scss">
.menu-style {
  border-radius: 0.1rem;
  border-top-right-radius: 0.05rem;
  .el-dropdown-menu {
    position: relative;
    border-radius: 0.1rem;
    border-top-right-radius: 0.05rem;
    &:first-child {
      &:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 12px;
        height: 1px;
        background-color: #e7e7e7;
      }
    }
    .el-dropdown-menu__item {
      min-width: 170px;
      padding: 0 12px;
      &:hover,
      &:focus {
        background-color: #fbfbfc;
        color: #000;
        // background-color: rgba(116, 5, 255, 0.1);
        // color: rgba(116, 5, 255, 1);
        .link {
          text-decoration: underline;
        }
      }
      .link {
        padding: 5px 0;
        cursor: pointer;
      }
      .profile {
        width: 100%;
        padding: 5px 0 0;
        margin: 0;
        &.router-link {
          display: block;
          width: 100%;
          height: auto;
          padding: 3px 3px 3px 22px;
          &:hover {
            text-decoration: underline;
          }
        }
        &.b {
        }
        cursor: pointer;
        * {
          cursor: pointer;
        }
        .tit {
          font-size: 12px;
          color: #989898;
          line-height: 1.5;
        }
        .flex-row {
          img {
            margin-right: 7px;
            border-radius: 100%;
          }
          .link {
            padding: 2px 0;
          }
        }
      }
      .set {
        vertical-align: middle;
        * {
          vertical-align: middle;
        }
        .el-button-group > .el-button {
          border-radius: 7px;
          &:first-child {
            padding-left: 10px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
        .el-icon {
          margin: auto;
          cursor: pointer;
          svg {
            width: 1em;
            cursor: pointer;
            path {
              cursor: pointer;
            }
          }
        }
        .loginImg {
          cursor: pointer;
          img {
            width: 23px;
            height: 23px;
            margin: 0 5px 0 0;
            cursor: pointer;
            background-color: #fff;
            border: 1px solid #b9b9b9;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
.loginImg {
  cursor: pointer;
}

// .el-popper {
//   border-radius: 0.1rem;
//   .el-menu {
//     border-radius: 0.1rem;
//     .el-menu-item,
//     .el-sub-menu__title,
//     .el-menu-item-group {
//       height: auto;
//       padding: 10px;
//       line-height: 1.2;
//       text-align: left;
//       &:hover,
//       &:focus {
//         background-color: #fbfbfc;
//         color: #000;
//         // background-color: rgba(116, 5, 255, 0.1);
//         // color: rgba(116, 5, 255, 1);
//         .link {
//           text-decoration: underline;
//         }
//       }
//       .link {
//         padding: 0;
//         cursor: pointer;
//       }
//       .profile {
//         width: 100%;
//         padding: 0 0 8px;
//         &.router-link {
//           display: block;
//           width: 100%;
//           height: auto;
//           padding: 3px 3px 3px 22px;
//           margin-top: -25px;
//           &:hover {
//             text-decoration: underline;
//           }
//         }
//         &.b {
//           margin-top: -20px;
//           padding-bottom: 10px;
//           border-bottom: 1px solid #e7e7e7;
//         }
//         cursor: pointer;
//         * {
//           cursor: pointer;
//         }
//         .tit {
//           font-size: 12px;
//           color: #989898;
//           line-height: 1.5;
//         }
//         .flex-row {
//           img {
//             margin-right: 7px;
//             border-radius: 100%;
//           }
//         }
//       }
//       .set {
//         vertical-align: middle;
//         * {
//           vertical-align: middle;
//         }
//         .el-button-group > .el-button {
//           border-radius: 7px;
//           &:first-child {
//             padding-left: 10px;
//             border-top-right-radius: 0;
//             border-bottom-right-radius: 0;
//           }
//           &:last-child {
//             border-top-left-radius: 0;
//             border-bottom-left-radius: 0;
//           }
//         }
//         .el-icon {
//           margin: auto;
//           cursor: pointer;
//           svg {
//             width: 1em;
//             cursor: pointer;
//             path {
//               cursor: pointer;
//             }
//           }
//         }
//         .loginImg {
//           cursor: pointer;
//           img {
//             width: 23px;
//             height: 23px;
//             margin: 0 5px 0 0;
//             cursor: pointer;
//             background-color: #fff;
//             border: 1px solid #b9b9b9;
//             border-radius: 50%;
//           }
//         }
//       }
//     }
//   }
// }
</style>

