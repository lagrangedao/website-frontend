<template>
  <div class="headerCont">
    <el-row class="headerStyle">
      <el-col :xs="20" :sm="20" :md="20" :lg="8" :xl="8" class="logoImg">
        <img :src="logo" @click="header_logo" alt='' />
        <el-input v-model="searchValue" class="w-50 m-2" placeholder="search spaces, users..." />
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="16" :xl="16" class="header_right">
        <el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="/dataset">
            <i class="icon icon_datasets"></i>
            Datasets
          </el-menu-item>
          <!-- <el-menu-item index="/models">
            <i class="icon icon_models"></i>
            Models
          </el-menu-item> -->
          <el-menu-item index="/spaces">
            <i class="icon icon_spaces"></i>
            Spaces
          </el-menu-item>
          <el-menu-item index="4">
            <i class="icon icon_docs"></i>
            Docs
          </el-menu-item>
          <el-menu-item index="5">
            <i class="icon icon_solutions"></i>
            Solutions
          </el-menu-item>
          <el-menu-item index="6">
            Pricing
          </el-menu-item>
          <!-- <el-menu-item index="web3Model">
            <w3m-core-button></w3m-core-button>
            <button id="my-button" @click="web3modal.openModal()">Connect Wallet</button>
          </el-menu-item> -->
          <el-menu-item index="signature" v-if="!lagLogin">
            &nbsp;
            <span class="loginBtn">Login</span>
          </el-menu-item>
          <el-sub-menu index="8" v-else>
            <template #title>
              <router-link to="/personal_center" class="loginImg">
                <img :src="accessAvatar||people_img" class="people" width="30" height="30" alt="">
              </router-link>
            </template>
            <el-menu-item index="/create_dataset">+ New Dataset</el-menu-item>
            <el-menu-item index="/create_space">+ New Space</el-menu-item>
            <!-- <el-menu-item index="/create_organizations">Create Organizations</el-menu-item> -->
            <el-menu-item index="settings">Settings</el-menu-item>
            <el-menu-item index="sign_out">Sign Out</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig, signMessage, connect, InjectedConnector, disconnect } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'

import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'header_page',
  components: {},
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessAvatar = computed(() => (store.state.accessAvatar))
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const logo = require("@/assets/images/icons/logo_w.png")
    const people_img = require("@/assets/images/dashboard/people_default.png")
    const searchValue = ref('')
    const activeIndex = ref('')
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function header_logo () {
      router.push({ name: 'main' })
    }
    async function handleSelect (key, keyPath) {
      // console.log(key) //  
      if (key === '/personal_center') store.dispatch('setNavLogin', true)
      else if (key === '4') window.open('https://docs.lagrangedao.org')
      else if (key === 'settings') router.push({ name: 'personalCenterProfile', params: { menu: 'profile' } })
      else if (key === 'sign_out') {
        system.$commonFun.signOutFun()
        // await system.$commonFun.timeout(200)
        // window.location.reload()
        await disconnect()
      }
      else if (key === 'signature') signature()
      else store.dispatch('setNavLogin', false)
    }
    function activeMenu (row) {
      const name = row || route.name
      if (name.indexOf('dataset') > -1) activeIndex.value = '/dataset'
      else if (name.indexOf('model') > -1) activeIndex.value = '/models'
      else if (name.indexOf('space') > -1) activeIndex.value = '/spaces'
      else activeIndex.value = name
    }



    const chains = [arbitrum, mainnet, polygon]
    const projectId = 'a7dcc1b6f7e8fba0ae488b807e86969f'

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId, chains }),
      publicClient
    })
    const ethereumClient = new EthereumClient(wagmiConfig, chains)
    const web3modal = new Web3Modal({ projectId }, ethereumClient)
    let provider

    async function onConnect () {
      console.log("Opening a dialog", web3modal);
      try {
        // provider = await connect({
        //   connector: new InjectedConnector(),
        // })
        web3modal.openModal(row => { console.log(row) })
        provider = web3modal
        console.log(provider)
      } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
      }

      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        fetchAccountData();
      });

      // Subscribe to networkId change
      provider.on("networkChanged", (networkId) => {
        fetchAccountData();
      });

      return provider ?.account
    }

    /**
     * Disconnect wallet button pressed.
     */
    async function onDisconnect () {

      console.log("Killing the wallet connection", provider);

      // TODO: Which providers have close method?
      if (provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3modal.clearCachedProvider();
        provider = null;
      }

      selectedAccount = null;

      // Set the UI back to the initial state
      document.querySelector("#prepare").style.display = "block";
      document.querySelector("#connected").style.display = "none";
    }
    async function fetchAccountData () {

      // Get a Web3 instance for the wallet
      const web3 = new Web3(provider);

      console.log("Web3 instance is", system.$commonFun.web3Init);

      // Get connected chain id from Ethereum node
      const chainId = await web3.eth.getChainId();
      // Load chain information over an HTTP API
      const chainData = await EvmChains.getChain(chainId);
      document.querySelector("#network-name").textContent = chainData.name;

      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();

      // MetaMask does not give you all accounts, only the selected account
      console.log("Got accounts", accounts);
      selectedAccount = accounts[0];
    }
    async function signature () {
      const lStatus = await system.$commonFun.login()
      if (lStatus) router.push({ path: '/personal_center' })
    }
    onMounted(() => activeMenu())
    watch(route, (to, from) => {
      activeMenu(to.path)
      window.scrollTo(0, 0)
    })
    return {
      metaAddress,
      accessAvatar,
      lagLogin,
      logo,
      people_img,
      searchValue,
      activeIndex,
      bodyWidth,
      system,
      signature, web3modal,
      header_logo, handleSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.headerCont {
  min-height: 0.68rem;
  overflow: hidden;
  .headerStyle {
    height: 0.68rem;
    padding: 0 0.16rem;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 14px;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .logoImg {
      display: flex;
      align-items: center;
      width: auto;
      height: 0.42rem;
      cursor: pointer;
      img {
        display: block;
        height: 100%;
        width: auto;
        max-width: 100%;
        margin: 0 0.35rem 0 0;
        cursor: pointer;
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
      display: flex;
      align-items: center;
      :deep(.el-menu) {
        width: 100%;
        background-color: #180e1a;
        border: 0;
        justify-content: flex-end;
        @media screen and (max-width: 441px) {
          width: 90%;
          margin-left: 10%;
        }
        .el-menu-item {
          padding: 0 0.15rem;
          background-color: transparent !important;
          border: 0 !important;
          color: #fff;
          @media screen and (min-width: 1800px) {
            font-size: 15px;
          }
          .icon {
            width: 21px;
            height: 20px;
            margin: -1px 6px 0 0;
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
            background-size: 17px;
          }
          .icon_models {
            background: url(../assets/images/icons/icon_2.png) no-repeat left
              center;
            background-size: 17px;
          }
          .icon_spaces {
            background: url(../assets/images/icons/icon_3.png) no-repeat left
              center;
            background-size: 21px;
          }
          .icon_docs {
            background: url(../assets/images/icons/icon_4.png) no-repeat left
              center;
            background-size: 19px;
          }
          .icon_solutions {
            background: url(../assets/images/icons/icon_5.png) no-repeat left
              center;
            background-size: 17px;
          }
          .loginBtn {
            padding: 0.1rem 0.2rem;
            margin: 0;
            background-color: #fff;
            font-weight: normal;
            line-height: 1;
            color: #7405ff;
            border-radius: 0.05rem;
            &:hover {
              background-color: #7405ff;
              color: #fff;
              opacity: 0.9;
              cursor: pointer;
            }
          }
          &.is-active,
          &:hover {
            color: #c37af9 !important;
            .icon_datasets {
              background: url(../assets/images/icons/icon_1_1.png) no-repeat
                left center;
              background-size: 17px;
            }
            .icon_models {
              background: url(../assets/images/icons/icon_2_1.png) no-repeat
                left center;
              background-size: 17px;
            }
            .icon_spaces {
              background: url(../assets/images/icons/icon_3_1.png) no-repeat
                left center;
              background-size: 21px;
            }
            .icon_docs {
              background: url(../assets/images/icons/icon_4_1.png) no-repeat
                left center;
              background-size: 19px;
            }
            .icon_solutions {
              background: url(../assets/images/icons/icon_5_1.png) no-repeat
                left center;
              background-size: 17px;
            }
          }
        }
        .el-sub-menu {
          color: #fff;
          .el-sub-menu__title {
            color: #fff;
          }
        }
        .el-sub-menu__title {
          border: 0;
          background-color: transparent !important;
          .loginImg {
            display: flex;
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
    }
  }
}

@media screen and (max-width: 1024px) {
}
@media screen and (max-width: 441px) {
  .headerCont {
    .headerStyle {
      padding: 0 2%;
      .logoImg {
        width: 50%;
        height: auto;
        img {
          width: 100%;
          max-width: 105px;
          height: auto;
          margin: 0 10px 0 0;
        }
      }
    }
  }
}
</style>
<style>
.loginImg {
  display: flex;
  cursor: pointer;
}
</style>

