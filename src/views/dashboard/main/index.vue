<template>
  <section id="step">
    <div class="step_body">
      <div class="loginBody width">
        <el-row>
          <el-col :xs="24" :sm="12" :md="13" :lg="13" :xl="13" class="left">
            <h1>{{$t('fs3Login.Connect_text')}}</h1>
            <h4>{{$t('fs3Login.Connect_text_desc')}}</h4>
            <el-button type="primary" @click="getStart">
              {{$t('fs3Login.Connect_StartFree')}}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="12" :md="11" :lg="11" :xl="11" class="metamask" v-if="active === 1">
            <div class="titleCont" v-if="!activeIndex">
              <p>{{$t('fs3Login.Connect_to_MetaMask')}}</p>
            </div>
            <div class="titleCont" v-else-if="activeIndex == 'connect'">
              <div class="address">
                <div class="address_left">
                  <img src="@/assets/images/icons/metamask.png" class="resno" alt=""> {{ hiddAddress(metaAddress)}}
                </div>
                <div class="address_right">
                  <div class="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                  <div>{{$t('fs3Login.Connected')}}</div>
                </div>
              </div>
            </div>
            <div v-loading="loginLoad">
              <div class="cont_p">{{$t('fs3Login.Connect_cont_tip')}}</div>
              <div class="login_footer">
                <el-button type="primary" @click="signFun">
                  <img src="@/assets/images/icons/metamask.png" class="resno" alt=""> {{$t('fs3Login.Connect_cont_Wallet')}}
                </el-button>
              </div>
            </div>
          </el-col>

          <!-- <el-col :xs="24" :sm="12" :md="11" :lg="11" :xl="11" class="metamask" v-else-if="active === 2">
            <div class="titleCont">
              <div class="address">
                <div class="address_left">
                  <img src="@/assets/images/icons/metamask.png" class="resno" alt=""> {{ hiddAddress(metaAddress)}}
                </div>
                <div class="address_right">
                  <div class="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                  <div>{{$t('fs3Login.Connected')}}</div>
                </div>
              </div>
            </div>
            <div v-loading="loginLoad" class="demo-ruleForm">
              <div class="form_title">Enter your email address to verify login</div>
              <el-form :model="form" status-icon :rules="rules" ref="ruleFormRef">
                <el-form-item prop="email">
                  <el-input v-model="form.email" placeholder="you@domain.com"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitEmail('ruleFormRef')">{{$t('fs3Login.Connect_form_btn')}}</el-button>
                  <p v-if="form.tip" style="color:#f40000">Unable to verify captcha. Please try again</p>
                </el-form-item>
              </el-form>
            </div>
          </el-col> -->
        </el-row>
      </div>
      <footer>
        <div class="foot_media">
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

    function getStart () {
      // if (lagLogin.value) active.value = 2
      if (lagLogin.value) router.push({ path: '/personal_center' })
      else active.value = 1
    }
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
      const lStatus = await system.$commonFun.login()
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
      signFun, signIn, hiddAddress, getStart, submitEmail
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
  color: #fff;
  background: #180e1a url(../../../assets/images/dashboard/main/bg.jpg)
    no-repeat center;
  background-size: auto 100%;
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
    min-height: calc(100% - 0.6rem);
    padding: 0.6rem 0.16rem 0;
    margin: auto;
    // background: url(../../../assets/images/dashboard/main/bg_small_1.png),
    //   url(../../../assets/images/dashboard/main/bg_small_2.png);
    // background-repeat: no-repeat, no-repeat;
    // background-size: 14%, 10%;
    // background-position: bottom left, top right;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    @media screen and (max-width: 600px) {
      min-height: calc(100% - 0.8rem);
      padding: 0 0.16rem 0.8rem;
    }
    .loginBody {
      height: calc(100% - 0.85rem);
      padding: 0.6rem 0 0.25rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      @media screen and (max-width: 600px) {
        height: calc(100% - 0.5rem);
        padding: 0.25rem 0;
      }
      .el-row {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .metamask {
          max-width: 10rem;
          padding: 0.2rem 5%;
          margin: auto;
          background: rgba(4, 20, 23, 0.5);
          border: 1px solid #4e82ff;
          border-radius: 0.2rem;
          .titleCont {
            padding: 0.2rem 0;
            font-size: 0.286rem;
            font-weight: normal;
            color: #fff;
            line-height: 1.3;
            border-bottom: 1px solid #dde0e2;
            @media screen and (max-width: 1600px) {
              font-size: 0.26rem;
            }
            @media screen and (max-width: 600px) {
              font-size: 16px;
            }
            p {
              text-align: center;
            }
            .address {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 0.223rem;
              font-weight: normal;
              color: #fff;
              line-height: 1.2;
              @media screen and (max-width: 1600px) {
                font-size: 0.2rem;
              }
              @media screen and (max-width: 600px) {
                font-size: 13px;
              }
              .address_left {
                display: flex;
                align-items: center;
                img {
                  height: 30px;
                  margin: 0 0.25rem 0 0;
                  @media screen and (max-width: 600px) {
                    height: 24px;
                  }
                }
              }
              .address_right {
                position: relative;
                display: inline-block;
                padding: 0.1rem 0.2rem 0.1rem 0.32rem;
                background-color: rgba(85, 128, 233, 0.3);
                font-size: 0.148rem;
                border-radius: 0.5rem;
                @media screen and (max-width: 1600px) {
                  font-size: 14px;
                }
                @media screen and (max-width: 1440px) {
                  font-size: 13px;
                }
                &::before {
                  position: absolute;
                  left: 0.16rem;
                  top: 50%;
                  content: "";
                  width: 0.08rem;
                  height: 0.08rem;
                  margin-top: -0.04rem;
                  background-color: #4d73ff;
                  border-radius: 0.5rem;
                }
              }
            }
          }
          .el-row {
            border-radius: 0.08rem;
            margin: 0.25rem 0px;
            border: 1px solid rgb(229, 232, 235);
            text-align: center;
            position: static;
            transition: all 0.3s ease 0s;
            overflow: hidden;
            &:hover {
              // background: rgba(240, 185, 11, 0.1);
              // border: 1px solid rgb(240, 185, 11);
              box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
            }
            .el-col {
              display: flex;
              -webkit-box-pack: justify;
              justify-content: flex-start;
              -webkit-box-align: center;
              align-items: center;
              background: #fff;
              padding: 0.16rem;
              transition: all 0.3s ease 0s;
              cursor: pointer;
              img {
                display: block;
                height: 0.3rem;
                margin: 0 0.15rem 0 0;
                order: 1;
                @media screen and (max-width: 600px) {
                  height: 24px;
                }
              }
              span {
                order: 2;
                font-size: 0.18rem;
                @media screen and (max-width: 600px) {
                  font-size: 14px;
                }
              }
            }
          }
          .cont_p {
            padding: 0.4rem 5%;
            font-size: 0.223rem;
            font-weight: 100;
            line-height: 1.5;
            text-align: center;
            color: #fff;
            @media screen and (max-width: 600px) {
              font-size: 14px;
            }
          }
          .login_footer {
            padding: 0.25rem 5% 0.1rem;
            .el-button {
              display: block;
              width: 100%;
              max-width: 4rem;
              font-family: inherit;
              font-size: 0.25rem;
              font-weight: 600;
              height: calc(30px + 0.3rem);
              padding: 0.15rem 0.2rem;
              margin: auto;
              // background: linear-gradient(45deg, #0353fe, #7cebfe);
              background: #7405ff;
              color: #fff;
              border: 0;
              border-radius: 0.5rem;
              line-height: 30px;
              letter-spacing: 1px;
              @media screen and (max-width: 1600px) {
                padding: 0.1rem 0.2rem;
                height: calc(30px + 0.2rem);
                font-size: 0.2rem;
              }
              @media screen and (max-width: 600px) {
                height: calc(24px + 0.2rem);
                font-size: 14px;
                line-height: 24px;
              }
              span {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                height: 30px;
                margin: 0 0.1rem 0 0;
                @media screen and (max-width: 600px) {
                  height: 24px;
                }
              }
              &:hover {
                background: linear-gradient(45deg, #021cad, #3e70fe);
              }
            }
            .el-button > span {
              cursor: pointer;
            }
            p {
              font-size: 0.13rem;
              line-height: 1.5;
              color: #c37af9;
              margin: 0.1rem 0 0;
              text-align: center;
              @media screen and (max-width: 1600px) {
                font-size: 14px;
              }
              @media screen and (max-width: 600px) {
                font-size: 12px;
              }
            }
          }
          .back_home {
            float: right;
            color: #fff;
            text-decoration: underline;
            font-size: 14px;
            @media screen and (max-width: 1600px) {
              font-size: 12px;
            }
          }
          .el-loading-mask {
            background-color: rgba(46, 77, 91, 0.75);
          }
          .demo-ruleForm {
            padding: 0.3rem 0;
            .form_title {
              font-size: 14px;
              font-weight: normal;
              color: #fff;
              line-height: 1.2;
              @media screen and (max-width: 600px) {
                font-size: 13px;
              }
            }
            :deep(.el-form) {
              padding: 0.1rem 0 0;
              .el-form-item {
                display: block;
                height: auto;
                max-width: 4.5rem;
                text-align: left;
                .el-form-item__content {
                  height: auto;
                  width: 100%;
                  font-size: 0.223rem;
                  font-weight: normal;
                  color: #fff;
                  line-height: 1.2;
                  @media screen and (max-width: 600px) {
                    font-size: 13px;
                  }
                  .el-input {
                    width: 100%;
                    .el-input__inner {
                      height: auto;
                      padding: 0.1rem 0.15rem;
                      border-radius: 0.05rem;
                      border-color: #3d6ddb;
                      color: #041417;
                      line-height: 1.2;
                      font-family: inherit;
                      font-size: inherit;
                    }
                  }
                  .el-button {
                    display: block;
                    width: 80%;
                    max-width: 4.4rem;
                    font-family: inherit;
                    font-size: 0.2rem;
                    font-weight: normal;
                    height: auto;
                    padding: 0.15rem 0.25rem;
                    margin: 0;
                    background: #7405ff;
                    color: #fff;
                    border: 0;
                    border-radius: 0.5rem;
                    line-height: 1.1;
                    white-space: normal;
                    @media screen and (max-width: 600px) {
                      font-size: 14px;
                    }
                    span {
                      display: flex;
                      align-items: center;
                      justify-content: center;
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
            }
          }
        }
        .checkEmail {
          padding: 5%;
          background: rgba(4, 20, 23, 0.5);
          border: 1px solid #4e7cff;
          border-radius: 0.2rem;
          .check_email {
            display: flex;
            justify-content: center;
            align-items: center;
            .check_left {
              padding-right: 0.1rem;
              color: #fff;
              text-align: left;
              h3 {
                font-size: 0.298rem;
                line-height: 1.5;
                @media screen and (max-width: 1600px) {
                  font-size: 22px;
                }
                @media screen and (max-width: 600px) {
                  font-size: 16px;
                }
              }
              h4,
              u {
                padding: 0.1rem 0;
                font-size: 0.18rem;
                font-weight: normal;
                line-height: 1.5;
                opacity: 0.9;
                @media screen and (max-width: 1600px) {
                  font-size: 16px;
                }
                @media screen and (max-width: 600px) {
                  font-size: 14px;
                }
              }
              u {
                cursor: pointer;
              }
            }
            .check_right {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 50%;
              img {
                width: 95%;
                max-width: 1.8rem;
                margin: auto;
              }
            }
          }
        }
        .left {
          padding: 0.15rem 5% 0 0;
          color: #fff;
          line-height: 1.2;
          @media screen and (max-width: 992px) {
            padding: 0.5rem 0;
            text-align: center;
          }
          h1 {
            font-size: 0.7rem;
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
            font-size: 0.18rem;
            font-family: "Helvetica-Neue";
            font-weight: normal;
            color: #878c93;
            @media screen and (max-width: 768px) {
              font-size: 14px;
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
            margin: 0.5rem 0 0;
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
      .collaborators {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        width: 96%;
        margin: auto;
        @media screen and (max-width: 992px) {
          margin: 0.5rem auto 0;
        }
        .el-col {
          margin: 0 auto;
          a {
            img {
              display: block;
              height: 45px;
              margin: 20px auto;
              cursor: pointer;
              @media screen and (max-width: 1600px) {
                height: 40px;
              }
              @media screen and (max-width: 1440px) {
                margin: 15px auto;
              }
            }
            .height {
              height: 80px;
              margin: 10px auto;
              @media screen and (max-width: 1600px) {
                height: 65px;
              }
              @media screen and (max-width: 1440px) {
                margin: 5px auto;
              }
            }
          }
        }
      }
    }
    footer {
      position: absolute;
      width: 100%;
      bottom: 0.3rem;
      right: 0.16rem;
      min-height: 0.5rem;
      .foot_media {
        display: flex;
        justify-content: flex-end;
        align-items: center;
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
