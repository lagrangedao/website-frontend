<template>
    <section id="space">
        <el-row class="space_body" v-loading="loading.createLoad" :element-loading-text="loading.createText">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="text-center">
                    <h1 class="text-xl md:text-3xl font-semibold">New Organization</h1>
                    <p class="text-lg text-gray-500">Complete your organization profile</p>
                </div>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon scroll-to-error>
                    <el-form-item prop="name" class="flex_form">
                        <label class="label" for="dataname">
                            Organization Username
                            <div class="flex flex-row">
                                <el-input v-model="ruleForm.name" placeholder="Username" />
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="full_name" class="flex_form">
                        <label class="label">
                            Organization Full name
                            <div class="flex flex-row">
                                <el-input v-model="ruleForm.full_name" placeholder="Full name" />
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="logo" class="flex_form">
                        <label class="label">
                            Logo
                            <span class="span">(optional)</span>
                        </label>
                        <div class="flex flex-row">
                            <el-upload class="avatar-uploader" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" action="#" :auto-upload="false">
                                <el-button class="avatar-uploader-icon" type="" text bg>Upload file</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item prop="type" class="flex_form">
                        <label class="label" for="owner">
                            Organization type
                        </label>
                        <div class="flex flex-row">
                            <el-select v-model="ruleForm.type" placeholder=" ">
                                <el-option v-for="item in ruleForm.typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item prop="github" class="flex_form">
                        <label class="label">
                            <i class="icon_media icon_github"></i>
                            GitHub username
                            <span class="span">(optional)</span>
                        </label>
                        <div class="flex flex-row">
                            <el-input v-model="ruleForm.github" placeholder="GitHub username" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="twitter" class="flex_form">
                        <label class="label">
                            <i class="icon_media icon_twitter"></i>
                            Twitter username
                            <span class="span">(optional)</span>
                        </label>
                        <div class="flex flex-row">
                            <el-input v-model="ruleForm.twitter" placeholder="Twitter username" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="homepage">
                        <label class="label">
                            Homepage
                            <span class="span">(optional)</span>
                        </label>
                        <div class="flex flex-row">
                            <el-input v-model="ruleForm.homepage" placeholder="Homepage" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="homepage">
                        <label class="label">
                            Research interests
                            <span class="span">(optional)</span>
                        </label>
                        <div class="flex flex-row">
                            <el-input v-model="ruleForm.research" :rows="2" type="textarea" placeholder="Research interests" />
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button size="large" class="create_btn" disabled @click="submitForm('ruleFormRef')">Create Organization</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { FormInstance, FormRules } from 'element-plus'
import { Unlock } from '@element-plus/icons-vue'
import tokenABI from '@/utils/abi/LagrangeDAOToken.json'
import hyperspaceABI from '@/utils/abi/SpacePayment.json'
import licenseList from '@/utils/License-list.js'
import hardwareList from '@/utils/hardware-list.js'
export default defineComponent({
    name: "Create Organizations",
    components: {
        Unlock
    },
    setup () {
        const store = useStore()
        const metaAddress = computed(() => (store.state.metaAddress))
        const metaAddressEllipsis = computed(() => {
            let val = store.state.metaAddress || ''
            return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
        })
        const accessSpace = computed(() => (store.state.accessSpace ? JSON.parse(store.state.accessSpace) : []))
        const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
        const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
        const ruleForm = reactive({
            name: '',
            full_name: '',
            type: '',
            homepage: '',
            github: '',
            twitter: '',
            research: '',
            typeOptions: [
                {
                    value: 'Company',
                    label: 'Company '
                },
                {
                    value: 'University',
                    label: 'University'
                },
                {
                    value: 'Classroom',
                    label: 'Classroom'
                },
                {
                    value: 'Non-profit',
                    label: 'Non-profit'
                },
                {
                    value: 'Community',
                    label: 'Community'
                }
            ]
        })
        const fileList = ref([])
        const validateInput = (rule, value, callback) => {
            if (!checkSpecialKey(value)) {
                callback(new Error("Only regular alphanumeric characters, '-', '.' and '_' supported"));
            } else {
                callback();
            }
        }
        const rules = reactive({
            name: [
                { required: true, message: 'Please fill in this field', trigger: 'blur' },
                { validator: validateInput, trigger: "blur" }
            ],
            full_name: [
                { required: true, message: 'Please fill in this field', trigger: 'blur' },
                { validator: validateInput, trigger: "blur" }
            ]
        })
        const ruleFormRef = ref(null)
        const loading = reactive({
            createLoad: false,
            createText: ''
        })
        const system = getCurrentInstance().appContext.config.globalProperties
        const route = useRoute()
        const router = useRouter()
        const depostVisible = ref(false)
        const formLabelWidth = '140px'
        const depostForm = reactive({
            num: 1
        })
        const dialogWidth = ref(document.body.clientWidth < 600 ? '90%' : '400px')

        function checkSpecialKey (str) {
            let specialKey =
                "[~!#$^&*()=|{}':;'\\[\\],<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            for (let i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        }
        const submitForm = async (formEl) => {
            if (!formEl) return
            await ruleFormRef.value.validate(async (valid, fields) => {
                if (valid) {
                    loading.createLoad = true
                    ruleForm.payment_hash = await init()
                    if (!ruleForm.payment_hash && ruleForm.hardware !== '0') return false
                    loading.createText = 'Please wait for the space creation to complete.'
                    let formData = new FormData()
                    formData.append('name', ruleForm.name)
                    formData.append('is_public', ruleForm.resource) // public:1, private:0
                    formData.append('license', ruleForm.license)
                    formData.append('hardware', ruleForm.hardware)
                    formData.append('sdk', ruleForm.sdk)
                    formData.append('hours', ruleForm.hours)
                    formData.append('payment_hash', !ruleForm.payment_hash ? '' : ruleForm.payment_hash)
                    const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces`, 'post', formData)
                    await system.$commonFun.timeout(500)
                    if (listRes && listRes.data) system.$commonFun.messageTip('success', 'Created Space successfully!')
                    else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Created Failed!')
                    ruleForm.name = ''
                    ruleForm.license = ''
                    router.push({ name: 'personalCenter' })
                    loading.createLoad = false
                } else {
                    console.log('error submit!', fields)
                    return false
                }
            })
        }
        function handleChange (uploadFile, uploadFiles) {
            console.log(uploadFile, uploadFiles)
            fileList.value = []
            if (uploadFile) fileList.value.push(uploadFile)
            // console.log(fileList.value)
        }
        function handleRemove (file, uploadFiles) {
            // console.log(file, uploadFiles)
            fileList.value = []
        }
        function ModelChangeSelect (e) {
            let value = e.target.value
            if (value) ruleForm.license = value
        }
        function radioChange (val) { }

        let tx_config = {
            'from': metaAddress.value,
            // 'maxFeePerGas': system.$commonFun.web3Init.utils.toWei('250', 'gwei'),
            // 'maxPriorityFeePerGas': system.$commonFun.web3Init.utils.toWei('5', 'gwei'),
        }
        let nonce = 0
        let hash = ''
        const space_contract_address = process.env.VUE_APP_SPACE_ADDRESS
        const token_contract_address = process.env.VUE_APP_TOKEN_ADDRESS
        const token_contract = new system.$commonFun.web3Init.eth.Contract(tokenABI, token_contract_address)
        const space_contract = new system.$commonFun.web3Init.eth.Contract(hyperspaceABI, space_contract_address)

        const init = async () => {
            try {
                if (ruleForm.hardware === '0') return false
                const chainId = await ethereum.request({ method: 'eth_chainId' })
                if (parseInt(chainId, 16) !== 3141) {
                    await errFun('please switch to Filecoin TestNet.')
                    return false
                }
                loading.createText = 'Please wait until the process completed.'
                const token_name = await token_contract.methods.name().call().then()
                const token_symbol = await token_contract.methods.symbol().call().then()
                const token_decimals = await token_contract.methods.decimals().call().then()
                const token_balance = await token_contract.methods.balanceOf(metaAddress.value).call().then()
                const fil_balance = await system.$commonFun.web3Init.eth.getBalance(metaAddress.value).then()
                const user_balance = await space_contract.methods.balanceOf(metaAddress.value).call().then()
                const lad_allowance = await token_contract.methods.allowance(metaAddress.value, space_contract_address).call().then()
                // console.log(`Your payment wallet address: ${metaAddress.value}`)
                // console.log(`Your Account balance: ${fil_balance / (10 ** token_decimals)} tFIL`)
                // console.log(`Your Account balance: ${token_balance / (10 ** token_decimals)} ${token_symbol}`)

                const blocks = 120
                const prices = [0, 1, 20, 30, 35, 105]
                const price = prices[ruleForm.hardware] * parseInt(blocks)
                const price_in_wei = toFixed(parseInt(price) * (10 ** token_decimals))
                // console.log(`Confirm purchasing hardware type ${ruleForm.hardware} for ${blocks} blocks (${price} ${token_symbol})?`)
                console.log('LAD approved:', lad_allowance / (10 ** token_decimals), ',user_balance:', user_balance / (10 ** token_decimals), ',token_balance:', token_balance, ',price_in_wei:', price_in_wei)
                if (token_balance < price_in_wei) {
                    await errFun('Not enough LAD tokens!')
                    return false
                }

                if (user_balance < price_in_wei && parseInt(ruleForm.hardware) !== 0) {
                    console.log('Deposit LAD into contract')
                    loading.createText = 'Deposit LAD into contract'
                    if (lad_allowance < price_in_wei) {
                        console.log('user needs to approve spending LAD')
                        nonce = await system.$commonFun.web3Init.eth.getTransactionCount(metaAddress.value).then()
                        tx_config["nonce"] = nonce
                        const approve_tx = await token_contract.methods.approve(space_contract_address, String(price_in_wei)).send(tx_config)
                        console.log('approve_tx: ', approve_tx)
                    }

                    console.log(`Depositing ${price} ${token_symbol} into contract...`)
                    nonce = await new system.$commonFun.web3Init.eth.getTransactionCount(metaAddress.value).then()
                    tx_config["nonce"] = nonce
                    const deposit_tx = await space_contract.methods.deposit(String(price_in_wei)).send(tx_config)
                    console.log('deposit_tx:', deposit_tx)
                    hash = deposit_tx.transactionHash
                    console.log(`Deposit is completed. Tx Hash: https://hyperspace.filfox.info/en/message/${hash}`)
                }

                console.log(`purchasing space...`)
                loading.createText = 'Purchasing space...'
                nonce = await system.$commonFun.web3Init.eth.getTransactionCount(metaAddress.value).then()
                tx_config["nonce"] = nonce
                const tx = await space_contract.methods.buySpace(parseInt(ruleForm.hardware), parseInt(blocks)).send(tx_config)
                hash = tx.transactionHash
                console.log(`Purchasing Success. Tx Hash: https://hyperspace.filfox.info/en/message/${hash}`)
                return hash
            } catch (err) {
                console.error(err)
                loading.createLoad = false
                loading.createText = ''
                return false
            }
        }
        async function errFun (text) {
            system.$commonFun.messageTip('error', text)
            loading.createLoad = false
        }
        function toFixed (x) {
            if (Math.abs(x) < 1.0) {
                var e = parseInt(x.toString().split('e-')[1]);
                if (e) {
                    x *= Math.pow(10, e - 1);
                    x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
                }
            } else {
                var e = parseInt(x.toString().split('+')[1]);
                if (e > 20) {
                    e -= 20;
                    x /= Math.pow(10, e);
                    x += (new Array(e + 1)).join('0');
                }
            }
            return x;
        }
        function licenseSelect () {
            let list = []
            for (let key in licenseList) {
                // console.log(key, ',', licenseList[key]);
                list.push({
                    value: key,
                    label: licenseList[key]
                })
            }
            return list
        }
        onMounted(async () => {
            ruleFormRef.value.resetFields()
        })
        return {
            metaAddress,
            metaAddressEllipsis,
            navLogin,
            lagLogin,
            ruleFormRef,
            ruleForm,
            rules,
            loading,
            system,
            depostVisible,
            formLabelWidth,
            depostForm,
            dialogWidth,
            fileList,
            submitForm, radioChange, handleChange, ModelChangeSelect, handleRemove
        }
    },
});
</script>

<style lang="scss" scoped>
#space {
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.space_body) {
    display: flex;
    align-items: stretch;
    padding: 0 0.16rem;
    margin: auto;
    font-size: 14px;
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }
    .el-col {
      position: relative;
      padding: 1rem 3% 0.5rem 0;
      .text-center {
        width: 90%;
        max-width: 700px;
        margin: auto;
        svg,
        .img {
          width: 0.4rem;
          margin: 0 auto 8px;
          color: rgba(239, 68, 68, 1);
        }
        h1 {
          font-size: 0.32rem;
          font-weight: 600;
          line-height: 1.5;
        }
        p {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.5;
          color: #878c93;
          @media screen and (max-width: 1600px) {
            font-size: 16px;
          }
        }
      }
      .demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
        width: 95%;
        max-width: 640px;
        margin: 0.5rem auto 0.2rem;
        .el-form-item {
          width: calc(100% - 30px);
          margin: 0 auto 0.2rem;
          @media screen and (max-width: 441px) {
            width: 100%;
          }
          &.flex_pad {
            padding-bottom: 0;
          }
          &.flex_form {
            width: calc(50% - 30px);
            margin: 0 auto 0.2rem;
            @media screen and (max-width: 441px) {
              width: 100%;
            }
          }
          .el-form-item__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;
            text-align: left;
            .label {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              width: 100%;
              text-align: left;
              color: #606060;
              font-size: 16px;
              @media screen and (max-width: 1440px) {
                font-size: 14px;
              }
              @media screen and (max-width: 1024px) {
                font-size: 12px;
              }
              .span {
                margin-left: 0.05rem;
                color: #cccccc;
              }
              small {
                display: block;
                line-height: 1.5;
                color: #878c93;
                margin-bottom: 0.1rem;
              }

              .icon_media {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 0 0.07rem 0 0;
                @media screen and (min-width: 1800px) {
                  width: 23px;
                  height: 23px;
                }
              }
              .icon_github {
                background: url(../../../assets/images/icons/media_8.png)
                  no-repeat left center;
                background-size: 100%;
              }
              .icon_twitter {
                background: url(../../../assets/images/icons/media_9.png)
                  no-repeat left center;
                background-size: 100%;
              }
            }
            .flex-row {
              display: flex;
              width: 100%;
              .el-select,
              .el-input,
              .avatar-uploader {
                width: 100%;
                font-family: inherit;
                border-color: #cdcdcd;
                .el-input__inner {
                  height: auto;
                  padding: 0.1rem;
                  line-height: 1;
                  border-color: #cdcdcd;
                  border-radius: 0.07rem;
                }
              }
              .self-end {
                width: 30px;
                text-align: center;
              }
              .el-upload {
                width: 100%;
                .avatar-uploader-icon {
                  width: 100%;
                  height: auto;
                  padding: 0.1rem 0;
                  background: linear-gradient(180deg, #fefefe, #f0f0f0);
                  font-family: inherit;
                  border: 1px solid #e1e1e1;
                  border-radius: 0.07rem;
                  line-height: 1;
                }
              }
            }
            .el-radio-group {
              width: 100%;
              .el-radio {
                width: 100%;
                height: auto;
                margin: 0.1rem 0 0.3rem;
                .el-radio__label {
                  h5,
                  p {
                    text-align: left;
                    font-size: 18px;
                    color: #333;
                    line-height: 1.5;
                    word-break: break-word;
                    white-space: normal;
                    @media screen and (max-width: 1600px) {
                      font-size: 17px;
                    }
                    @media screen and (max-width: 1440px) {
                      font-size: 16px;
                    }
                    @media screen and (max-width: 1024px) {
                      font-size: 14px;
                    }
                  }
                  p {
                    font-size: 15px;
                    font-weight: 100;
                    color: #7e7e7e;
                    line-height: 1.3;
                    @media screen and (max-width: 1600px) {
                      font-size: 14px;
                    }
                    @media screen and (max-width: 1440px) {
                      font-size: 13px;
                    }
                    @media screen and (max-width: 1024px) {
                      font-size: 12px;
                    }
                  }
                }
              }
              &.radio_flex {
                display: flex;
                flex-wrap: wrap;
                .el-radio {
                  width: 23%;
                  height: 1.5rem;
                  margin: 0.05rem 1% 0;
                  background: linear-gradient(180deg, #fefefe, #f0f0f0);
                  border-width: 2px;
                  border-radius: 0.1rem;
                  border-color: #e1e1e1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  @media screen and (max-width: 1024px) {
                    width: 48%;
                  }
                  @media screen and (max-width: 320px) {
                    width: 98%;
                  }
                  .el-radio__input {
                    display: none;
                  }
                  .el-radio__label {
                    padding: 0;
                    text-align: center;
                    font-weight: bold;
                    svg {
                      display: block;
                      width: 25px;
                      height: 25px;
                      margin: auto;
                    }
                    .icon_Bacalhau {
                      display: block;
                      height: 17px;
                      margin: 4px auto;
                    }
                  }
                  &.is-checked {
                    border-color: #c37af9;
                    .el-radio__label {
                      color: inherit;
                    }
                  }
                  &:nth-child(4n + 1) {
                    .el-radio__label {
                      color: rgba(59, 130, 246, 1);
                    }
                  }
                  &:nth-child(4n + 2) {
                    .el-radio__label {
                      //   color: rgba(249, 115, 22, 1);
                      color: #000;
                    }
                  }
                  &:nth-child(4n + 3) {
                    .el-radio__label {
                      color: rgba(239, 68, 68, 1);
                    }
                  }
                  &:nth-child(4n + 4) {
                    .el-radio__label {
                      color: rgba(107, 114, 128, 1);
                    }
                  }
                }
              }
            }
            .create_btn {
              font-family: inherit;
              width: 100%;
              height: auto;
              padding: 0.12rem 0;
              margin-top: 0.2rem;
              background: linear-gradient(180deg, #fefefe, #f0f0f0);
              font-family: inherit;
              border: 1px solid #cdcdcd;
              border-radius: 0.07rem;
              line-height: 1;
              cursor: pointer;
              span {
                font-family: inherit;
                cursor: pointer;
              }
            }
          }
          .el-form-item__label {
            display: none;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.license_style {
  .el-select-dropdown__item {
    height: auto;
    padding: 8px 3%;
    line-height: 1;
    p {
      margin: 0 0 5px;
      font-size: 14px;
      color: #000;
      line-height: 1.2;
    }
    small {
      font-size: 13px;
      color: #979797;
      line-height: 1.2;
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
