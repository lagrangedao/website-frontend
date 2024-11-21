<script setup>
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { reconnect, disconnect, getChainId, getAccount, watchAccount } from '@wagmi/core'
import { useStore } from "vuex"
import {
  computed,
  ref,
  getCurrentInstance,
  watch,
  onMounted,
  onUpdated,
  watchEffect,
  reactive
} from 'vue'
import configJS from './../utils/config'

const system = getCurrentInstance().appContext.config.globalProperties
const store = useStore()
const metaAddress = computed(() => (store.state.metaAddress))
const signature = computed(() => (store.state.signature))

const projectId = configJS.projectId
const config = configJS.config
reconnect(config)
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#7405ff',
    '--w3m-color-mix': '#ffffff',
    // '--w3m-color-mix': '#447dff',
    // '--w3m-color-mix-strength': 50,
    // '--w3m-font-family': 'HELVETICA-ROMAN'
    // '--w3m-font-size-master': '17',
    // '--wcm-text-small-regular-weight': 'normal',
    // '--wcm-text-small-regular-letter-spacing': '3px',
  }
})

let lastTime = 0
async function throttle () {
  // Prevent multiple signatures
  let now = new Date().valueOf()
  if (lastTime > 0 && now - lastTime <= 2000) return false
  lastTime = now
  return true
}

let account = reactive(getAccount(config))

// const chainId = reactive(getChainId(config))
// console.log(chainId)

async function login2 () {
  // console.log('here')
  // console.log(account)
  const time = await throttle()
  if (!time) return false
  system.$commonFun.Init(async (addr, chain) => {
    await system.$commonFun.timeout(500)
    system.$commonFun.login(config)
  })
}

async function signout2 () {
  await system.$commonFun.signOutFun('disconnect')
  // console.log("in signout function")
  // window.location.reload()
}

watchAccount(config, {
  onChange (account, prevAccount) {
    // account = getAccount(config)
    try {
      // console.log('watch', account)
      // console.log('prev', prevAccount)
      // console.log("changed", account ?.isConnected)
      if (account ?.isConnected && signature.value === '' && metaAddress.value === '') {
        console.log("prompted")
        login2()
      } else if (!account ?.isConnected && prevAccount ?.isConnected) {
        signout2()
      }
    } catch{ }
  },
})

let beginTime = 0; // 执行onbeforeunload的开始时间

window.onbeforeunload = function () {
  beginTime = new Date().getTime();
}

window.onunload = function () {
  let differTime = new Date().getTime() - beginTime;
  if (differTime <= 5) {
    disconnect(config)
    console.log("close")
  } else {
    console.log("Refresh")
  }
}

async function test () {
  // console.log(store.state.metaAddress)
  // console.log(store.state.signature)
  // console.log("here")
}
</script>

<template>
  <div class="flex-row">
    <w3m-button balance="hide" size="sm" @click="test" />
    <!-- <el-button @click="login2" v-if="signature === ''" class="m-button">Login</el-button> -->
  </div>
</template>

<style lang="less" scoped></style>