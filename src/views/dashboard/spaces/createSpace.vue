<template>
    <section id="space">
        <el-row class="space_body" v-loading="loading.createLoad" :element-loading-text="loading.createText">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="text-center">
                    <img src="@/assets/images/icons/icon_2_3.png" class="img" alt="">
                    <h1 class="text-xl md:text-3xl font-semibold">Create a new Space</h1>
                    <p class="text-lg text-gray-500">A Space is a special kind of repository that hosts application code for Machine Learning demos Those applications can be written using Python libraries like Streamlit or Gradio</p>
                </div>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon scroll-to-error>
                    <el-form-item prop="" class="flex_form">
                        <label class="label" for="owner">
                            Owner
                            <div class="flex flex-row">
                                <el-select v-model="metaAddressEllipsis" placeholder="">
                                    <el-option :label="metaAddressEllipsis" :value="metaAddressEllipsis" />
                                </el-select>
                                <span class="text-2xl text-gray-400 self-end pb-2">/</span>
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="name" class="flex_form">
                        <label class="label" for="dataname">
                            Space name
                            <div class="flex flex-row">
                                <el-input v-model="ruleForm.name" placeholder="New Space name" title="Only regular alphanumeric characters, '-', '.' and '_' supported" />
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="license">
                        <label class="label" for="license">
                            License
                            <div class="flex flex-row">
                                <el-select v-model="ruleForm.license" filterable :filter-method="licenseQuery" allow-create default-first-option popper-class="license_style" placeholder="License" @blur="ModelChangeSelect" @change="licenseChange">
                                    <el-option v-for="item in ruleForm.licenseOptions" :key="item.value" :label="item.value" :value="item.value">
                                        <p>{{ item.value }}</p>
                                        <small>{{ item.label }}</small>
                                    </el-option>
                                </el-select>
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="SDK">
                        <label class="label" for="SDK">
                            Select the Space SDK
                            <small>
                                You can chose between Streamlit, Gradio and Static for your Space. Or pick Docker to host any other app.
                            </small>
                            <div class="flex flex-row">
                                <!-- <el-radio-group v-model="ruleForm.sdk" size="large">
                                    <el-radio-button label="Streamlit" />
                                    <el-radio-button label="Gradio" />
                                    <el-radio-button label="Docker" />
                                    <el-radio-button label="Static" />
                                </el-radio-group> -->
                                <el-radio-group v-model="ruleForm.sdk" class="radio_flex">
                                    <el-radio label="Docker" size="large" border>
                                        <svg class="h-6 w-6 w-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 12">
                                            <path d="M2.91013 5.125H1.50107C1.43433 5.125 1.38242 5.07308 1.375 4.99892L1.375 3.73806C1.375 3.66389 1.43433 3.61198 1.50107 3.61198L2.91013 3.61198C2.98429 3.61198 3.0362 3.67131 3.0362 3.73806V4.99892C3.0362 5.07308 2.97687 5.125 2.91013 5.125ZM4.85314 5.125L3.44409 5.125C3.37734 5.125 3.32543 5.07308 3.31801 4.99892V3.73806C3.31801 3.66389 3.37734 3.61198 3.44409 3.61198H4.85314C4.9273 3.61198 4.97922 3.67131 4.97922 3.73806V4.99892C4.97922 5.07308 4.91989 5.125 4.85314 5.125ZM6.83324 5.125H5.42418C5.35002 5.125 5.29811 5.07308 5.29811 4.99892L5.29811 3.73806C5.29811 3.66389 5.35744 3.61198 5.42418 3.61198L6.83324 3.61198C6.9074 3.61198 6.95931 3.67131 6.95931 3.73806V4.99892C6.95931 5.07308 6.89998 5.125 6.83324 5.125ZM8.78367 5.125H7.37461C7.30787 5.125 7.24854 5.07308 7.24854 4.99892V3.73806C7.24854 3.66389 7.30787 3.61198 7.37461 3.61198L8.78366 3.61198C8.85783 3.61198 8.90974 3.67131 8.90974 3.73806V4.99892C8.90974 5.07308 8.85041 5.125 8.78367 5.125ZM4.85314 3.32272H3.44409C3.37734 3.32272 3.32543 3.26339 3.31801 3.19664L3.31801 1.93578C3.31801 1.86162 3.37734 1.8097 3.44409 1.8097L4.85314 1.8097C4.9273 1.8097 4.97922 1.86903 4.97922 1.93578V3.19664C4.97922 3.26339 4.91989 3.32272 4.85314 3.32272ZM6.83324 3.32272L5.42418 3.32272C5.35002 3.32272 5.29811 3.26339 5.29811 3.19664V1.93578C5.29811 1.86162 5.35744 1.8097 5.42418 1.8097L6.83324 1.8097C6.9074 1.8097 6.95931 1.86903 6.95931 1.93578V3.19664C6.95931 3.26339 6.89998 3.32272 6.83324 3.32272ZM8.78366 3.32272L7.37461 3.32272C7.30787 3.32272 7.24854 3.26339 7.24854 3.19664V1.93578C7.24854 1.86161 7.30787 1.8097 7.37461 1.8097L8.78366 1.8097C8.85041 1.8097 8.90974 1.86903 8.90974 1.93578V3.19664C8.90974 3.26339 8.85041 3.32272 8.78366 3.32272ZM8.78366 1.51302L7.37461 1.51302C7.30787 1.51302 7.24854 1.45369 7.24854 1.38694L7.24854 0.126086C7.24854 0.0519186 7.30786 1.29019e-07 7.37461 1.23184e-07L8.78366 0C8.85041 -5.83504e-09 8.90974 0.0593352 8.90974 0.126086V1.38694C8.90974 1.46111 8.85041 1.51302 8.78366 1.51302ZM10.7489 5.125L9.33987 5.125C9.27313 5.125 9.22121 5.07308 9.2138 4.99892L9.2138 3.73806C9.2138 3.66389 9.27313 3.61198 9.33987 3.61198H10.7489C10.8231 3.61198 10.875 3.67131 10.875 3.73806L10.875 4.99892C10.875 5.07308 10.8157 5.125 10.7489 5.125ZM14.5381 3.98439C15.3989 3.98439 15.7996 4.29008 15.8442 4.32736L16 4.4392L15.9332 4.63306C15.8219 4.90147 15.6661 5.14006 15.4583 5.33392C15.1466 5.64707 14.5826 6.01241 13.6699 6.01241L13.5215 6.01241C13.1579 6.95186 12.6607 8.01061 11.8221 8.95752C11.325 9.52417 10.7387 10.0088 10.0857 10.3891C9.29169 10.8439 8.43089 11.157 7.53298 11.3211C6.88738 11.4404 6.23436 11.5 5.58134 11.5C4.1343 11.5 2.85052 11.2241 2.06392 10.7395C1.36638 10.307 0.824667 9.59873 0.461052 8.64437C0.141962 7.77202 -0.0138728 6.84748 0.000968518 5.92294C0.000968494 5.64707 0.22359 5.42339 0.498155 5.42339L11.0356 5.42339C11.1691 5.41593 11.8073 5.36374 12.2006 5.14006C11.8741 4.61814 11.7776 4.00676 11.9335 3.35809C12.0151 3.02257 12.1561 2.69451 12.3416 2.40372L12.49 2.1875L12.7201 2.32171C12.7225 2.32369 12.729 2.32796 12.7389 2.33455C12.8788 2.42733 13.7104 2.97895 13.8628 4.04404C14.0855 4.00676 14.3155 3.98439 14.5381 3.98439Z"
                                                fill="currentColor"></path>
                                        </svg>
                                        Docker
                                    </el-radio>
                                    <el-radio label="Gradio" size="large" border>
                                        <img src="@/assets/images/dashboard/spaces/Bacalhau.jpg" class="icon_Bacalhau" alt=""> Bacalhau
                                    </el-radio>
                                    <el-radio label="Streamlit" size="large" border>
                                        <svg class="h-6 w-6 w-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="32" height="18" preserveAspectRatio="xMidYMid meet" viewBox="0 0 301 165">
                                            <path d="M150.731 101.547l-52.592-27.8-91.292-48.25c-.084-.083-.25-.083-.334-.083-3.333-1.584-6.75 1.75-5.5 5.083L47.53 149.139l.008.025c.05.117.092.233.142.35 1.909 4.425 6.075 7.158 10.609 8.233.383.084.657.159 1.117.251.459.102 1.1.241 1.65.283.09.008.174.008.266.016h.067c.066.009.133.009.2.017h.091c.059.008.125.008.184.008h.108c.067.009.133.009.2.009a817.728 817.728 0 00177.259 0c.708 0 1.4-.034 2.066-.1l.634-.075c.025-.009.058-.009.083-.017.142-.017.283-.042.425-.067.208-.025.417-.066.625-.108.417-.092.606-.158 1.172-.353.565-.194 1.504-.534 2.091-.817.588-.283.995-.555 1.487-.863a26.566 26.566 0 001.774-1.216c.253-.194.426-.318.609-.493l-.1-.058-99.566-52.617z"
                                                fill="#FF4B4B"></path>
                                            <path d="M294.766 25.498h-.083l-91.326 48.25 50.767 75.609 46.4-118.859v-.167c1.167-3.5-2.416-6.666-5.758-4.833" fill="#7D353B"></path>
                                            <path d="M155.598 2.556c-2.334-3.409-7.417-3.409-9.667 0L98.139 73.748l52.592 27.8 99.667 52.674c.626-.613 1.128-1.21 1.658-1.841a20.98 20.98 0 002.067-3.025l-50.767-75.608-47.758-71.192z" fill="#BD4043"></path>
                                        </svg>
                                        Streamlit
                                    </el-radio>
                                    <el-radio label="Static" size="large" border>
                                        <svg class="h-6 w-6 w-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path d="M12 17.56l4.07-1.13l.55-6.1H9.38L9.2 8.3h7.6l.2-1.99H7l.56 6.01h6.89l-.23 2.58l-2.22.6l-2.22-.6l-.14-1.66h-2l.29 3.19L12 17.56M4.07 3h15.86L18.5 19.2L12 21l-6.5-1.8L4.07 3z" fill="currentColor"></path>
                                        </svg>
                                        Static
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="hardware">
                        <label class="label" for="hardware">
                            Select the Space Hardware
                            <small>
                                You can switch to a different hardware at any time in your Space settings.
                                <br /> You will be billed for every minute of uptime on a paid hardware.
                            </small>
                            <div class="flex flex-row">
                                <el-select v-model="ruleForm.hardware" placeholder="Select a hardware" @change="radioChange">
                                    <el-option-group v-for="group in hardwareOptions" :key="group.label" :label="group.label">
                                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-option-group>
                                </el-select>
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="resource" class="flex_pad">
                        <el-radio-group v-model="ruleForm.resource" disabled>
                            <el-radio label="1">
                                <h5>Public</h5>
                                <p>Anyone on the internet can see this space. Only you (personal space) or members of your organization (organization space) can commit.</p>
                            </el-radio>
                            <el-radio label="0">
                                <h5>Private</h5>
                                <p>Only you (personal space) or members of your organization (organization space) can see and commit to this space.</p>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="flex_form">
                        <el-button size="large" @click="submitForm('ruleFormRef')">Create Space</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog custom-class="depost_body" v-model="depostVisible" title="Deposit" :width="dialogWidth" :close-on-click-modal="false" destroy-on-close center>
            <el-form :model="depostForm" label-position="top">
                <el-form-item label="Amount / asset" :label-width="formLabelWidth">
                    <el-input-number v-model="depostForm.num" :min="1" :max="10" controls-position="right" size="large" @change="handleChange" /> LAD
                </el-form-item>
                <el-form-item>
                    <p class="tips">You should frstly unlock selected tokenin order to authorize deposits for LAD</p>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="depostVisible = false">
                        <el-icon class="icon">
                            <Unlock />
                        </el-icon>
                        Unlock
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
    name: "Create Space",
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
            license: '',
            resource: '1',
            hardware: '0',
            sdk: 'Docker',
            hours: '336',
            payment_hash: '',
            licenseOptions: [],
            oldOptions: []
        })
        const hardwareOptions = ref([])
        const validateInput = (rule, value, callback) => {
            if ((/[^a-zA-Z0-9-]/g).test(value)) {
                callback(new Error("Only regular alphanumeric characters and '-' support"));
            } else {
                callback();
            }
        }
        const rules = reactive({
            name: [
                { required: true, message: 'Please fill in this field', trigger: 'blur' },
                { validator: validateInput, trigger: "blur" }
            ],
            license: [
                { required: true, message: 'Please fill in this field', trigger: 'blur' }
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
                "[~!#$^&*()=_|{}':;'\\[\\],<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
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
        const handleChange = (value) => {
            // console.log(value)
        }
        const licenseChange = (value) => {
            // console.log(value)
        }
        function ModelChangeSelect (e) {
            let value = e.target.value
            if (value) ruleForm.license = value
        }
        async function licenseQuery (value) {
            let result = await ruleForm.oldOptions.filter(item => {
                if (item.label.indexOf(value) > -1 || item.value.indexOf(value) > -1) return item
            })
            ruleForm.licenseOptions = result
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
            hardwareOptions.value = hardwareList
            ruleForm.licenseOptions = await licenseSelect()
            ruleForm.oldOptions = await licenseSelect()
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
            hardwareOptions,
            submitForm, radioChange, handleChange, licenseChange, licenseQuery, ModelChangeSelect
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
          width: 100%;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #eee;
          &.flex_pad {
            padding-bottom: 0;
          }
          &.flex_form {
            width: 50%;
            padding-bottom: 0;
            border-bottom: 0;
            .el-select {
              width: calc(100% - 30px);
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
              small {
                display: block;
                line-height: 1.5;
                color: #878c93;
                margin-bottom: 0.1rem;
              }
              .flex-row {
                display: flex;
                width: 100%;
                .el-select {
                  width: 100%;
                }
                .self-end {
                  width: 30px;
                  text-align: center;
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
            .el-button {
              font-family: inherit;
              cursor: pointer;
              span {
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
