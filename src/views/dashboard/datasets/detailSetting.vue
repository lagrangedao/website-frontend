<template>
  <section id="dataset">
    <el-row class="dataset_body" v-loading="listLoad">
      <div class="fileList" v-loading="renameLoad" v-if="nftdata.status === 'not generated'">
        <div class="title">Rename or transfer this dataset</div>
        <!-- <div class="desc">New: Automatic Redirection</div> -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
          <el-form-item prop="" class="flex_left">
            <label class="label" for="owner">
              New owner
              <div class="flex flex-row">
                <el-select v-model="metaAddress" placeholder="">
                  <el-option :label="metaAddress" :value="metaAddress" />
                </el-select>
                <span class="text-2xl text-gray-400 self-end pb-2">/</span>
              </div>
            </label>
          </el-form-item>
          <el-form-item prop="name" class="flex_right">
            <label class="label" for="dataname">
              New name
              <div class="flex flex-row">
                <el-input v-model="ruleForm.name" placeholder="New dataset name" />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="!ruleForm.name" @click="submitForm('ruleFormRef')">I understand the consequences, rename this dataset
        </el-button>
      </div>
      <div class="fileList" v-loading="doiLoad">
        <div class="title">
          {{ 'Data NFT (DNFT)' }}

          <el-button class="request_btn" v-if="nftdata.status === 'success'" :disabled="!chainIdRes" @click="dataNFTRequest = true">Create new License</el-button>
          <el-button size="large" class="request_btn generateDOI" v-if="nftdata.status === 'success'" :disabled="!chainIdRes" @click="requestInitData()">Refresh</el-button>
        </div>
        <div>
          <div class="tip">
            Generate a DNFT for this dataset. Learn more about Data NFT
            <br/> This action cannot be undone. It will no longer be possible to delete, rename, transfer, or change the visibility to private.
          </div>
          <div v-if="nftdata.status === 'success' || (nftdata.tokens && nftdata.tokens.length>0)">
            <div class="contract tip">
              <div class="flex-left">Contract Address:
                <a :href="`${nftdata.chain_url}${nftdata.contract_address}`" target="_blank" class="link">{{ nftdata.contract_address }}</a>
              </div>
              <div class="flex-right">
                <i class="icon icon_star"></i>: Licenses owned by yourself
              </div>
            </div>
            <el-table :data="nftdata.tokens" stripe style="width: 100%" class="nft_table">
              <el-table-column prop="chain_id" label="Chain ID">
                <template #default="scope">
                  <span>{{ scope.row.chain_name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="token_id" label="Token ID">
                <template #default="scope">
                  <a v-if="userGateway" :href="scope.row.ipfs_url" target="_blank" class="link">{{ scope.row.token_id }}</a>
                  <span v-else>{{scope.row.token_id}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="owner_address" label="Owner Address" min-width="140">
                <template #default="scope">
                  <i class="icon" :class="{'icon_star':scope.row.owner_address === route.params.wallet_address}"></i>
                  <span>{{scope.row.owner_address}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status" />
              <el-table-column label="Share License Info" min-width="110">
                <template #default="scope">
                  <el-button size="large" class="generateDOI" :disabled="scope.row.cid && scope.row.cid !== 'undefined' && userGateway?false:true" @click="system.$commonFun.copyContent(scope.row.ipfs_url, 'Copied')">Get shared link</el-button>
                  <!-- <a :href="scope.row.ipfs_uri" target="_blank" class="link">{{ scope.row.ipfs_uri }}</a> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="nftdata.status === 'processing'" class="process_style">
            <el-button size="large" class="generateDOI" @click="refreshContract('refresh')">Refresh</el-button>
            <el-popover placement="top-start" :width="200" popper-style="word-break: break-word; text-align: left;" trigger="hover" content="Waiting for the Transaction hash complete">
              <template #reference>
                <el-icon>
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </div>
          <div v-else-if="nftdata.status === 'waiting for oracle'" class="process_style">
            <el-button size="large" class="generateDOI" @click="refreshContract()">Refresh</el-button>
            <el-popover placement="top-start" :width="200" popper-style="word-break: break-word; text-align: left;" trigger="hover" content="Still waiting for the data oracle">
              <template #reference>
                <el-icon>
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </div>
          <el-button size="large" v-else class="generateDOI" @click="dialogDOIVisible = true">Generate DNFT</el-button>
        </div>
      </div>
      <div class="fileList" v-loading="deleteLoad">
        <div class="title">Delete this dataset</div>
        <div class="tip">This action
          <b>cannot</b> be undone. This will permanently delete the
          <b class="b">{{ route.params.name }}</b> dataset repository and all its files.
        </div>

        <el-form ref="ruleFormRefDelete" :model="ruleForm" :rules="rulesDelete" class="demo-ruleForm" status-icon>
          <el-form-item prop="delete" style="width:100%">
            <label class="label" for="dataname">
              Please type
              <b class="b">{{ route.params.name }}</b> to confirm.
              <div class="flex flex-row">
                <el-input v-model="ruleForm.delete" placeholder=" " />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="ruleForm.delete && ruleForm.delete !== route.params.name" @click="submitDeleteForm('ruleFormRefDelete')">I understand the consequences, delete this dataset
        </el-button>
      </div>
    </el-row>

    <el-dialog v-model="dialogDOIVisible" title="DNFT Agreement" :show-close="false" :close-on-click-modal="false" custom-class="doi_body" @close="beforeClose">
      <div v-if="manageDOI">
        <div class="tip">
          Generating a DNFT restricts certain features of the dataset: It will NOT be possible to
          <b>rename</b> or
          <b>transfer</b>.
        </div>
        <div class="tip_black">
          By using this feature, you agree to transfer metadata about your dataset and your name to
          <a href="https://www.multichain.storage" target="_blank">multichain.storage</a> For more information please contact
          <a href="mailto:team@filswan.com">team@filswan.com</a>
        </div>
        <el-form ref="ruleFormRefDelete" status-icon>
          <el-form-item prop="agreeDoi" style="width:100%">
            <label class="label" for="dataname">
              Type
              <b class="b">agree</b> to confirm
            </label>
            <div class="flex flex-row">
              <el-input v-model="ruleForm.agreeDoi" placeholder=" " />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <div class="tip_text" v-loading="moreLoad">
          <p>
            <label>Owner:</label>
            {{ eventArgs.owner }}
            <el-icon v-if="eventArgs.owner" @click="system.$commonFun.copyContent(eventArgs.owner, 'Copied')">
              <DocumentCopy />
            </el-icon>
          </p>
          <p>
            <label>IPFS URL:</label>
            {{ eventArgs.ipfs_url }}
            <el-icon v-if="eventArgs.ipfs_url" @click="system.$commonFun.copyContent(eventArgs.ipfs_url, 'Copied')">
              <DocumentCopy />
            </el-icon>
          </p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer" v-loading="generateLoad">
          <el-button type="primary" v-if="manageDOI" :disabled="ruleForm.agreeDoi && ruleForm.agreeDoi !== 'agree'" @click="requestNFT">
            Generate DNFT
          </el-button>
          <el-button @click="dialogDOIVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <data-nft v-if="dataNFTRequest" @handleChange="handleChange" :dataNFTRequest="dataNFTRequest" :createdAt="listdata.created_at" :updatedAt="listdata.updated_at" :contractAddress="nftdata.contract_address" :getNftID="nftdata.chain_id"></data-nft>
  </section>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  onActivated,
  onDeactivated,
  watch,
  ref,
  reactive,
  getCurrentInstance
} from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom, Warning, DocumentCopy
} from '@element-plus/icons-vue'
import dataNft from '@/components/dataNFT.vue'
const FACTORY_ABI = require('@/utils/abi/DataNFTFactory.json')
const DATA_NFT_ABI = require('@/utils/abi/DataNFT.json')
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom, Warning, DocumentCopy, dataNft
  },
  props: {
    // listdata: { type: Number, default: 1 },
    likesValue: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const lagLogin = computed(() => {
      return String(store.state.lagLogin) === 'true'
    })
    const metaAddress = computed(() => {
      let val = store.state.metaAddress || ''
      return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
    })
    const userGateway = computed(() => (store.state.gateway))
    const accessDataset = computed(() => (store.state.accessDataset ? JSON.parse(store.state.accessDataset) : []))
    const ruleForm = reactive({
      name: '',
      delete: '',
      agreeDoi: ''
    })
    const rules = reactive({
      name: [
        { required: true, message: ' ', trigger: 'blur' }
      ]
    })
    const rulesDelete = reactive({
      delete: [
        { required: true, message: ' ', trigger: 'blur' }
      ]
    })
    const eventArgs = reactive({
      owner: '',
      ipfs_url: ''
    })
    const ruleFormRef = ref(null)
    const listdata = ref({})
    const nftdata = ref({})
    const ruleFormRefDelete = ref(null)
    const renameLoad = ref(false)
    const deleteLoad = ref(false)
    const generateLoad = ref(false)
    const manageDOI = ref(true)
    const doiLoad = ref(false)
    const doiIndex = ref(1)
    const doiData = ref([
      {
        doi: '10.574654/hf/12587',
        version: '1046541'
      }
    ])
    const listLoad = ref(false)
    const dialogDOIVisible = ref(false)
    const settingIndex = ref(0)
    const dataNFTRequest = ref(false)
    const chainIdRes = ref(true)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const refreshExecutable = ref(false)
    const moreLoad = ref(false)
    const factory = new system.$commonFun.web3Init.eth.Contract(FACTORY_ABI, process.env.VUE_APP_DATANFT_ADDRESS)

    const submitForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          renameLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          formData.append('is_public', listdata.value.is_public) // public:1, private:0
          formData.append('new_name', ruleForm.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/update`, 'post', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.dataset) {
              accessDataset.value.splice(settingIndex.value, 1, ruleForm.name)
              store.dispatch('setAccessDataset', JSON.stringify(accessDataset.value))
              system.$commonFun.messageTip('success', 'Update successfully!')
              router.push({
                name: 'datasetDetail',
                params: { wallet_address: route.params.wallet_address, name: ruleForm.name, tabs: 'settings' }
              })
            } else system.$commonFun.messageTip('error', listRes.data.message)
          } else system.$commonFun.messageTip('error', 'Upload failed!')
          ruleForm.name = ''
          renameLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    const submitDeleteForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRefDelete.value.validate(async (valid, fields) => {
        if (valid) {
          deleteLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/delete`, 'post', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.dataset) system.$commonFun.messageTip('success', 'Delete successfully!')
            else system.$commonFun.messageTip('error', listRes.data.message)
            router.push({ name: 'personalCenter' })
          } else system.$commonFun.messageTip('error', 'Delete failed!')
          ruleForm.name = ''
          ruleForm.delete = ''
          deleteLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }

    async function claimDataNFT () {
      try {
        chainIdRes.value = await system.$commonFun.changeIDLogin()
        if (!chainIdRes.value) {
          generateLoad.value = false
          return false
        }
        // estimate gas
        let estimatedGas = await factory.methods
          .claimDataNFT(0, route.params.name)
          .estimateGas({ from: store.state.metaAddress })

        // we will use estimated gas * 1.5
        let gasLimit = Math.floor(estimatedGas * 1.5)

        console.log('estimated gas:', estimatedGas)
        console.log('gas limit:', gasLimit)

        // call contract
        console.log('Deploying Data NFT...')
        const tx = await factory.methods
          .claimDataNFT(0, route.params.name)
          .send({ from: store.state.metaAddress, gasLimit: gasLimit })
          .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash:', transactionHash)
            await generateMintHash(transactionHash)
            generateLoad.value = false
            dialogDOIVisible.value = false
            context.emit('handleValue', true, 'setting')
            requestInitData()
          })
          .on('error', () => generateLoad.value = false)

        // display results
        console.log('tx hash:', tx.transactionHash)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        generateLoad.value = false
      }
    }

    async function generateMintHash (tx_hash) {
      let fd = new FormData()
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}/mint_hash`, 'post', fd)
    }

    async function beforeClose () {
      dialogDOIVisible.value = false
      await system.$commonFun.timeout(500)
      manageDOI.value = true
      ruleForm.agreeDoi = ''
      eventArgs.owner = ''
      eventArgs.ipfs_url = ''
    }

    async function requestNFT () {
      generateLoad.value = true
      try {
        chainIdRes.value = await system.$commonFun.changeIDLogin()
        if (!chainIdRes.value) {
          generateLoad.value = false
          return false
        }

        let estimatedGas = await factory.methods
          .requestDataNFT(0, route.params.name)
          .estimateGas({ from: store.state.metaAddress })

        let gasLimit = Math.floor(estimatedGas * 1.5)

        await factory.methods
          .requestDataNFT(0, route.params.name)
          .send({ from: store.state.metaAddress, gasLimit: gasLimit })
          .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash:', transactionHash)
            await requestDataInfo(transactionHash)
            generateLoad.value = false
            dialogDOIVisible.value = false
            context.emit('handleValue', true, 'setting')
            requestInitData()
          })
          .on('error', () => generateLoad.value = false)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        generateLoad.value = false
      }
    }

    async function requestDataInfo (tx_hash) {
      let fd = new FormData()
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      fd.append('wallet_address', store.state.metaAddress)
      fd.append('dataset_name', route.params.name)
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/request_datanft`, 'post', fd)
    }

    async function refreshContract (type) {
      listLoad.value = true
      if (type) {
        context.emit('handleValue', true, 'setting')
        requestInitData(type)
        return
      }
      try {
        const request = await factory.methods.requestData(0, route.params.wallet_address, route.params.name).call().then()
        console.log('request:', request)
        if (request.fulfilled && request.claimable) {
          claimDataNFT()
          return
        } else {
          system.$commonFun.messageTip('warning', 'Still waiting for the data oracle')
        }
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
      }
      listLoad.value = false
    }

    async function getTokenURI (nft_contract, contractAddress, chainID) {
      // create contract obj
      try {
        let tokens = []
        // get total supply
        let totalSupply = await nft_contract.methods.totalSupply().call()
        let { name, url } = await system.$commonFun.getUnit(parseInt(chainID), 16)
        let token = {
          token_id: 1,
          contract_address: contractAddress,
          chain_id: chainID,
          chain_name: name,
          chain_url: url,
          owner_address: await nft_contract.methods.ownerOf(1).call(),
          ipfs_uri: await nft_contract.methods.tokenURI(1).call(),
          status: 'Success'
        }
        tokens.push(token)
        return tokens
      } catch (err) {
        system.$commonFun.messageTip('error', "Returned values aren't valid error")
        console.log('err:', err)
        return []
      }
    }

    async function ownerAddress (nft_contract, index) {
      try {
        const owner = await nft_contract.methods.ownerOf(index).call().then()
        return owner
      } catch  {
        return ''
      }
    }
    async function mapTokens (list, nft_contract, contract_address) {
      const number = list ? list.length : 0
      for (let token = 0; token < number; token++) {
        let { name, url } = await system.$commonFun.getUnit(parseInt(list[token].chain_id), 16)
        list[token].contract_address = contract_address
        list[token].owner_address = list[token].token_id && list[token].token_id !== null ? await ownerAddress(nft_contract, list[token].token_id) : ''
        list[token].chain_name = name
        list[token].chain_url = url
        list[token].ipfs_url = userGateway.value ? `${userGateway.value}/ipfs/${list[token].cid}` : ''
      }
      return list
    }

    async function requestInitData (type) {
      if (route.name !== 'datasetDetail') return
      listLoad.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        listdata.value = listRes.data.dataset || { name: route.params.name, is_public: '1', created_at: "", updated_at: "" }
        if (listRes.data.nft) {
          if (listRes.data.nft.status === 'processing' && type) system.$commonFun.messageTip('warning', 'Waiting for the Transaction hash complete')
          let contract_address = listRes.data.nft.contract_address
          const getID = await system.$commonFun.web3Init.eth.net.getId()
          if (listRes.data.nft.chain_id && getID.toString() !== listRes.data.nft.chain_id) {
            const { name } = await system.$commonFun.getUnit(Number(listRes.data.nft.chain_id))
            await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
            listRes.data.nft.tokens = []
          } else if (contract_address) {
            let { url } = await system.$commonFun.getUnit(parseInt(listRes.data.nft.chain_id), 16)
            const nft_contract = new system.$commonFun.web3Init.eth.Contract(DATA_NFT_ABI, contract_address)
            // const tokens_contact = await getTokenURI(nft_contract, contract_address, listRes.data.nft.chain_id)
            const tokens_list = await mapTokens(listRes.data.nft.tokens, nft_contract, contract_address)
            // listRes.data.nft.tokens = tokens_contact.concat(tokens_list)
            listRes.data.nft.chain_url = url
            listRes.data.nft.tokens = tokens_list
          }
        }
        nftdata.value = listRes.data.nft || { contract_address: null, tokens: [], status: 'not generated' }
      }
      listLoad.value = false
    }

    async function datasetIndex () {
      let index = 0
      accessDataset.value.forEach((ele, i) => {
        if (ele === route.params.name) index = i
      })
      return index
    }

    function handleChange (val, refresh) {
      dataNFTRequest.value = val
      if (refresh) {
        context.emit('handleValue', true, 'setting')
        requestInitData()
      }
    }
    onMounted(async () => {
      window.scrollTo(0, 0)
      requestInitData()
      settingIndex.value = await datasetIndex()
      chainIdRes.value = await system.$commonFun.changeIDLogin(1)
    })
    onDeactivated(() => {
      ruleForm.name = ''
      ruleForm.delete = ''
    })
    // watch(() => props.likesValue, () => {
    //   requestInitData()
    // })
    return {
      lagLogin,
      metaAddress,
      userGateway,
      renameLoad,
      deleteLoad,
      generateLoad,
      manageDOI,
      doiLoad,
      doiIndex,
      doiData,
      ruleForm,
      listdata,
      nftdata,
      eventArgs,
      rules,
      rulesDelete,
      ruleFormRef,
      ruleFormRefDelete,
      listLoad,
      dialogDOIVisible,
      dataNFTRequest,
      system,
      route,
      router,
      moreLoad,
      chainIdRes,
      props, submitForm, submitDeleteForm, beforeClose,
      handleChange, requestInitData, requestNFT, refreshContract
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  background: #fff;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }

  :deep(.dataset_body) {
    display: flex;
    align-items: stretch;
    padding: 0.4rem 0 0.6rem;
    margin: auto;
    font-size: 14px;
    text-align: left;
    @media screen and (max-width: 1600px) {
      padding: 0.4rem 0.16rem;
    }
    @media screen and (min-width: 1280px) {
      max-width: 1280px;
    }
    @media screen and (min-width: 1536px) {
      max-width: 1536px;
    }

    .fileList {
      width: 100%;
      margin: 0.15rem 0;
      font-family: "Helvetica-light";
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      overflow: hidden;

      .title {
        padding: 0.2rem 0.2rem 0;
        margin: 0 0 0.2rem;
        font-size: 17px;
        font-weight: 600;
        color: #000;
        @media screen and (max-width: 768px) {
          font-size: 15px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 18px;
        }
      }

      .desc,
      .tip {
        padding: 0 0.2rem;
        font-size: 15px;
        color: #606060;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }

      .tip {
        margin: 0 0 0.15rem;
        font-weight: normal;
        color: #666;
        line-height: 1.5;
        &.contract {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .flex-right {
            display: flex;
            align-items: center;
          }
        }
      }

      .tip_new {
        padding-top: 0.2rem;
        color: #562683;
      }

      .b {
        // padding: 3px 5px;
        // background-color: #f7f7f7;
        color: #000;
        // border-radius: 3px;
        font-weight: bold;
      }

      .demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.2rem;
        margin: 0;

        .el-form-item {
          &.flex_left {
            width: 225px;
            @media screen and (max-width: 768px) {
              width: 100%;
            }
          }

          &.flex_right {
            width: calc(100% - 225px);
            @media screen and (max-width: 768px) {
              width: 100%;
            }
          }

          @media screen and (max-width: 768px) {
            width: 100% !important;
          }

          .el-form-item__content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;

            .label {
              width: 100%;
              text-align: left;
              font-size: 15px;
              color: #666;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }

              .flex-row {
                display: flex;
                width: 100%;

                .el-select {
                  width: calc(100% - 30px);
                  @media screen and (max-width: 768px) {
                    width: 100%;
                  }
                }

                .self-end {
                  width: 30px;
                  text-align: center;
                  @media screen and (max-width: 768px) {
                    display: none;
                  }
                }
              }
            }

            .el-input {
              font-size: inherit;

              .el-input__inner {
                height: auto;
                padding: 0.03rem 0.1rem;
                font-size: inherit;
              }
            }
          }

          .el-form-item__label {
            display: none;
          }

          &.is-error {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  border-color: #c37af9;
                }

                .el-input__validateIcon {
                  color: #c37af9;
                }
              }
            }
          }
        }
      }
      .link {
        color: #606060;
        text-decoration: underline;
        &:hover {
          color: #c37af9;
        }
      }

      .el-button {
        width: calc(100% - 0.4rem);
        height: auto;
        padding: 0.1rem;
        margin: 0 0.2rem 0.2rem;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-family: inherit;
        font-size: 16px;
        line-height: 1;
        color: #f85149;
        word-break: break-word;
        white-space: normal;
        border-color: rgb(220, 223, 230);
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }
        &.request_btn {
          width: auto;
          margin: 0 0.2rem;
        }
        &:hover {
          opacity: 0.9;
          background: #fff;
          border-color: #f85149;
          span {
            cursor: inherit;
          }
        }

        &.is-disabled {
          opacity: 0.5;
          &:hover {
            background: linear-gradient(180deg, #fefefe, #f0f0f0);
            border-color: rgb(220, 223, 230);
          }
        }
      }

      .generateDOI {
        width: auto;
        color: #606060;
        &:hover {
          border-color: #dcdfe6;
        }
      }
      .process_style {
        display: flex;
        align-items: center;
        i {
          margin: 0 0 0.2rem -0.1rem;
          font-size: 18px;
          color: #9c9c9c;
          svg {
            cursor: pointer;
          }
        }
      }
      .icon {
        display: block;
        width: 16px;
        height: 16px;
        margin: 0 0.07rem 0 0;
      }
      .icon_star {
        background: url(../../../assets/images/icons/owner_star.png) no-repeat
          left center;
        background-size: 100%;
      }
      .el-table {
        text-align: left;
        // border-top: 1px solid #e4e4e4;
        tr {
          th {
            padding: 0.05rem 0.2rem;

            .cell {
              padding: 0;
              font-family: "FIRACODE-BOLD";
              font-size: 16px;
              color: #000;
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 18px;
              }
            }
          }

          td {
            padding: 0;

            .cell {
              display: flex;
              align-items: center;
              padding: 0.2rem;
              font-family: "FIRACODE-REGULAR";
              font-size: 14px;
              color: #606060;
              word-break: break-word;
              line-height: 1.3;
              @media screen and (max-width: 768px) {
                font-size: 13px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }
              .icon {
                margin-top: -3px;
              }

              .el-button {
                width: auto;
                margin: 0;
              }

              .current {
                padding: 0.03rem 0.07rem;
                background-color: #c37af9;
                color: #fff;
                border: 1px solid #8842fe;
                border-radius: 0.05rem;
                text-transform: uppercase;
                font-family: "Helvetica-Neue";
                font-size: 14px;
                line-height: 1;
                @media screen and (max-width: 768px) {
                  font-size: 13px;
                }
                @media screen and (min-width: 1800px) {
                  font-size: 16px;
                }
              }
            }
          }
        }
        &.nft_table {
          padding-top: 0.1rem;
          tr {
            th {
              border-top: 1px solid #ebeef5;
            }
          }
        }
      }
    }
  }

  :deep(.doi_body) {
    width: 40%;
    max-width: 770px;
    min-width: 300px;
    border-radius: 0.13rem;

    .el-dialog__header {
      padding: 0.17rem 0.25rem 0.1rem;
      font-size: 17px;
      color: #000;
      @media screen and (max-width: 768px) {
        font-size: 15px;
      }
      @media screen and (min-width: 1800px) {
        font-size: 18px;
      }
    }

    .el-dialog__body {
      padding: 0;

      .tip,
      .tip_black,
      .tip_text {
        padding: 0.1rem 0.25rem;
        background-color: #f3f1ff;
        color: #562683;
        font-size: 14px;
        word-break: break-word;
        line-height: 1.3;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }

      .tip_black,
      .tip_text {
        background-color: transparent;
        color: #000;

        a {
          text-decoration: underline;
        }

        p {
          padding: 0.05rem 0;

          label {
            display: inline-block;
            width: 85px;
          }
          i,
          svg {
            cursor: pointer;
          }
        }
      }

      .tip {
        color: red;
        b {
          text-transform: uppercase;
        }
      }

      .el-form {
        padding: 0 0.25rem;

        .el-form-item {
          .el-form-item__content {
            .label {
              color: #000;
              font-size: 15px;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
              }
            }

            .flex-row {
              width: 100%;
            }

            .el-input {
              .el-input__inner {
                background: linear-gradient(180deg, #fefefe, #f0f0f0);
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 0 0.25rem 0.25rem;
      text-align: left;

      .dialog-footer {
        display: flex;
      }

      .el-button {
        width: auto;
        height: auto;
        padding: 0.07rem 0.15rem;
        margin: 0 0.15rem 0 0;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-family: inherit;
        font-size: 16px;
        line-height: 1;
        color: #000;
        border-radius: 0.07rem;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }

        &:hover {
          opacity: 0.9;

          span {
            cursor: inherit;
          }
        }

        &.is-disabled {
          opacity: 0.5;
          border-color: #e3e6eb;
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
