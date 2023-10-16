<template>
  <section id="step">
    <div class="step_body container-landing">
      <div class="loginBody width flex-row">
        <div class="left">
          <h1>Data <br />And<br /> Computing</h1>
          <h4>Decentralized data science without borders</h4>
          <h4>To receive product news, sign up for our newsletter
            <a href="https://mailchi.mp/nbai/mars-lagrange" target="_blank">here</a>
          </h4>
        </div>
      </div>
      <footer>
        <div class="foot_media flex-row">
          <a href="https://t.me/datadao" target="_blank"><img :src="share_telegram" alt=""></a>
          <a href="https://twitter.com/lagrangedao" target="_blank"><img :src="share_twitter" alt=""></a>
          <a href="https://discord.gg/8vaB6rKSAu" target="_blank"><img :src="share_discord" alt=""></a>
          <a href="https://github.com/lagrangedao" target="_blank"><img :src="share_github" alt=""></a>
        </div>
      </footer>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'home',
  setup () {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
    const metaAddress = computed(() => (store.state.metaAddress))
    const logoUrl = require("@/assets/images/icons/logo_w.png")
    const learnUrl = require("@/assets/images/icons/icon_6.png")
    const share_telegram = require("@/assets/images/icons/media_4.png")
    const share_twitter = require("@/assets/images/icons/media_5.png")
    const share_discord = require("@/assets/images/icons/media_6.png")
    const share_github = require("@/assets/images/icons/media_7.png")

    const loadingText = ref('')
    const prevType = ref(true)
    const activeIndex = ref('')
    const active = ref(0)
    const loginLoad = ref(false)
    const ruleFormRef = ref(null)
    const form = reactive({
      email: '',
      tip: false
    })
    const rules = reactive({
      email: [
        {
          required: true,
          message: 'Please input email address',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur', 'change'],
        },
      ]
    })
    const info = reactive({
      address: '',
      balance: ''
    })
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function signFun (params) {
      loadingText.value = ''
      system.$commonFun.Init(async addr => {
        info.address = addr
        system.$commonFun.web3Init.eth.getBalance(addr).then((balance) => {
          // console.log(balance)
          const myBalance = balance
          const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
          info.balance = Number(balanceAll).toFixed(0)
        })
        // await system.$commonFun.timeout(500)
        // if (lagLogin.value) active.value = 2
        if (lagLogin.value) router.push({ path: '/personal_center' })
        else await signIn()
      })
    }
    async function signIn () {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      const [lStatus, signErr] = await system.$commonFun.login()
      // if (lStatus) active.value = 2
      if (lStatus) router.push({ path: '/personal_center' })
      return false
      store.dispatch('setNavLogin', false)
    }
    function hiddAddress (val) {
      if (val) {
        return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
      } else {
        return '-'
      }
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      // ethereum.on('accountsChanged', function (account) {
      //   // console.log('account header:', account[0], !(account[0]));  //Once the account is switched, it will be executed here
      //   if (!prevType.value) return false
      //   loginLoad.value = true
      //   store.dispatch('setMetaAddress', account[0])
      //   store.dispatch('setNavLogin', false)
      //   store.dispatch('setLogin', false)
      //   store.dispatch('setAccessToken', '') 
      //   window.location.reload()
      // })
      // networkChanged
      ethereum.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        signFun()
      })
      // 监听metamask网络断开
      ethereum.on('disconnect', (code, reason) => {
        // console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
        active.value = 1
        // loadingText.value = system.$NetworkPrompt
        system.$commonFun.signOutFun()
        // window.location.reload()
      })
    }
    const submitEmail = async (formEl) => {
      if (!formEl) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          form.tip = true
          // renameLoad.value = true
          // let formData = new FormData()
          // formData.append('name', route.params.name)
          // formData.append('is_public', props.listdata) // public:1, private:0
          // formData.append('new_name', ruleForm.name)
          // const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/update`, 'post', formData)
          // await system.$commonFun.timeout(500)
          // if (listRes && listRes.status === 'success') {
          //   system.$commonFun.messageTip('success', 'Update successfully!')
          //   router.push({ name: 'datasetDetail', params: { name: ruleForm.name, tabs: 'settings' } })
          // } else system.$commonFun.messageTip('error', 'Upload failed!')
          // ruleForm.name = ''
          // renameLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    onMounted(() => {
      fn()
    })
    watch(navLogin, (newValue, oldValue) => {
      if (!navLogin.value) active.value = 0
    })
    return {
      lagLogin,
      logoUrl,
      navLogin,
      learnUrl,
      prevType,
      loginLoad,
      activeIndex,
      metaAddress,
      active,
      info,
      loadingText,
      share_telegram,
      share_twitter,
      share_discord,
      share_github,
      form,
      ruleFormRef,
      rules,
      system,
      route,
      router,
      signFun, signIn, hiddAddress, submitEmail
    }
  }
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "TRAJANPRO";
  src: url(../../../assets/font/TRAJANPRO3-BOLD.OTF);
  font-style: normal;
  font-display: block;
}
#step {
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "TRAJANPRO";
  }
  .step_body {
    position: relative;
    margin: 0.4rem auto;
    // background: url(../../../assets/images/dashboard/main/bg_small_1.png),
    //   url(../../../assets/images/dashboard/main/bg_small_2.png);
    // background-repeat: no-repeat, no-repeat;
    // background-size: 14%, 10%;
    // background-position: bottom left, top right;
    .loginBody {
      padding: 0.96rem;
      color: #fff;
      background: #180e1a url(../../../assets/images/dashboard/main/bg.jpg)
        no-repeat center right;
      // background-size: auto 100%;
      background-size: auto 100%;
      flex-wrap: wrap;
      border-radius: 0.25rem;
      .left {
        width: 50%;
        padding: 0.15rem 5% 0 0;
        color: #fff;
        line-height: 1.2;
        @media screen and (max-width: 992px) {
          width: 90%;
          padding: 0.5rem 0;
          text-align: center;
        }
        h1 {
          padding: 0 0 0.4rem;
          font-size: 0.6rem;
          text-transform: capitalize;
          @media screen and (max-width: 768px) {
            font-size: 22px;
          }
        }
        h3 {
          font-size: 0.3rem;
          font-weight: normal;
          @media screen and (max-width: 768px) {
            font-size: 16px;
          }
        }
        h4 {
          padding: 0 0.24rem 0 0;
          font-size: 0.18rem;
          font-family: "Helvetica-Neue";
          font-weight: normal;
          color: rgba(209, 213, 219, 0.8);
          line-height: 1.6;
          @media screen and (max-width: 768px) {
            font-size: 14px;
          }
          a {
            color: inherit;
            text-decoration: underline;
          }
        }
        .el-button {
          display: inline-block;
          max-width: 3.4rem;
          font-family: inherit;
          font-size: 0.18rem;
          font-weight: normal;
          height: auto;
          padding: 0.15rem 0.25rem;
          margin: 0.1rem 0 0;
          background: #c37af9;
          color: #fff;
          border: 0;
          border-radius: 0.5rem;
          line-height: 1.1;
          white-space: normal;
          text-transform: uppercase;
          @media screen and (max-width: 600px) {
            font-size: 14px;
          }
          span {
            cursor: pointer;
          }
          &:hover {
            opacity: 0.9;
          }
        }
        .el-button > span {
          cursor: pointer;
        }
      }
    }
    footer {
      position: absolute;
      width: auto;
      max-width: 100%;
      bottom: 0.3rem;
      right: 0.16rem;
      min-height: 0.5rem;
      .foot_media {
        justify-content: flex-end;
        a {
          display: block;
          width: 35px;
          margin: 0 0 0 0.2rem;
          img {
            display: block;
            width: 100%;
            cursor: pointer;
            &:hover {
              opacity: 0.9;
            }
          }
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
