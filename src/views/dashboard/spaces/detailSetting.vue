<template>
  <section id="space">
    <el-row class="space_body flex-row" v-loading="listLoad">
      <space-hardware @handleHard="handleHard" :listdata="listdata" :renewButton="'setting'"></space-hardware>
      <div class="fileList" v-loading="renameLoad" v-if="nftdata.nft.status === 'not generated'">
        <div class="title">Rename or transfer this space</div>
        <!-- <div class="desc">New: Automatic Redirection</div> -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm flex-row" status-icon>
          <el-form-item prop="" class="flex_left">
            <label class="label" for="owner">
              New owner
              <div class="flex-row">
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
              <div class="flex-row">
                <el-input v-model="ruleForm.name" placeholder="New space name" />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="!ruleForm.name" @click="submitForm('ruleFormRef')">I understand the consequences, rename this space</el-button>
      </div>
      <div class="fileList" v-loading="doiLoad">
        <div class="title">
          {{ 'Space NFT (SNFT)' }}

          <el-button class="request_btn" v-if="nftdata.nft.status === 'success'" :disabled="!chainIdRes" @click="dataNFTRequest = true" :title="nftdata.chain_tip">Create new License</el-button>
          <el-button size="large" class="request_btn generateDOI" v-if="nftdata.nft.status === 'success'" :disabled="!chainIdRes" @click="requestInitData()">Refresh</el-button>
        </div>
        <div>
          <div class="tip">
            Generate a SNFT for this space.
            <br/> This action cannot be undone. It will no longer be possible to delete, rename, transfer, or change the visibility to private.
          </div>
          <div v-if="nftdata.nft.status === 'success' || (nftdata.nft.tokens && nftdata.nft.tokens.length>0)">
            <div class="contract tip flex-row">
              <div class="flex-left">Contract Address:
                <a :href="`${nftdata.chain_url}${nftdata.contract_address}`" target="_blank" class="link">{{ nftdata.contract_address }}</a>
              </div>
              <div class="flex-right flex-row">
                <i class="icon icon_star"></i>: Licenses owned by yourself
              </div>
            </div>
            <el-table :data="nftdata.nft.tokens" stripe style="width: 100%" class="nft_table">
              <el-table-column prop="chain_id" label="Chain ID">
                <template #default="scope">
                  <span>{{ scope.row.chain_name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="token_id" label="Token ID">
                <template #default="scope">
                  <a v-if="userGateway" :href="scope.row.ipfs_url" target="_blank" class="link">{{ scope.row.token_id }}</a>
                  <span v-else>{{ scope.row.token_id }}</span>
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
              <el-table-column label="Copy NFT" min-width="110">
                <template #default="scope">
                  <el-button size="large" class="generateDOI" @click="copyThisNFT(scope.row)">Copy</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="nftdata.nft.status === 'processing'" class="process_style flex-row">
            <el-button size="large" class="generateDOI" @click="refreshContract('refresh')">Refresh</el-button>
            <el-popover placement="top-start" :width="200" popper-style="word-break: break-word; text-align: left;" trigger="hover" content="Waiting for the Transaction hash complete">
              <template #reference>
                <el-icon>
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </div>
          <div v-else-if="nftdata.nft.status === 'waiting for oracle'" class="process_style flex-row">
            <el-button size="large" class="generateDOI" @click="refreshContract()">Refresh</el-button>
            <el-popover placement="top-start" :width="200" popper-style="word-break: break-word; text-align: left;" trigger="hover" content="Still waiting for the data oracle">
              <template #reference>
                <el-icon>
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </div>
          <el-button size="large" v-else class="generateDOI" @click="generateThisNFT">Generate SNFT</el-button>
        </div>
      </div>
      <div class="fileList" v-loading="doiLoad" v-if="nftdata.copy_nft && nftdata.copy_nft.length>0">
        <div class="title">
          {{ 'NFT Copy List' }}
        </div>
        <el-table :data="nftdata.copy_nft" stripe style="width: 100%" class="nft_table">
          <el-table-column prop="source_address" label="Source Network" min-width="130">
            <template #default="scope">
              <a v-if="scope.row.source && scope.row.source.url" :href="`${scope.row.source.url}${scope.row.source_address}`" target="_blank" class="link">{{ scope.row.source_address }}</a>
              <span v-else>{{ scope.row.source_address || scope.row.source_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="destination_address" label="Destination Network" min-width="130">
            <template #default="scope">
              <a v-if="scope.row.destination && scope.row.destination.url" :href="`${scope.row.destination.url}${scope.row.destination_address}`" target="_blank" class="link">{{ scope.row.destination_address }}</a>
              <span v-else>{{ scope.row.destination_address || scope.row.destination_id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="license_id" label="License ID">
            <template #default="scope">
              <a v-if="userGateway" :href="`${userGateway}/ipfs/${scope.row.license_cid}`" target="_blank" class="link">{{ scope.row.license_id }}</a>
              <span v-else>{{ scope.row.license_id }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="last_stop_reason" label="Error Messages" min-width="140">
            <template #default="scope">
              <span>{{scope.row.last_stop_reason || '-'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="copy_nft_status" label="Status">
            <template #default="scope">
              <span class="transform">{{scope.row.copy_nft_status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="" min-width="110">
            <template #default="scope">
              <el-button size="large" :disabled="scope.row.copy_nft_status.toLowerCase() === 'success'?true:false" @click="checkCopyInfo(scope.row)" class="generateDOI">Refresh</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fileList" v-loading="deleteLoad">
        <div class="title">Delete this space</div>
        <div class="tip">This action
          <b>cannot</b> be undone. This will permanently delete the
          <b class="b">{{route.params.name}}</b> space repository and all its files.</div>

        <el-form ref="ruleFormRefDelete" :model="ruleForm" :rules="rulesDelete" class="demo-ruleForm flex-row" status-icon>
          <el-form-item prop="delete" style="width:100%">
            <label class="label" for="dataname">
              Please type
              <b class="b">{{route.params.name}}</b> to confirm.
              <div class="flex-row">
                <el-input v-model="ruleForm.delete" placeholder=" " />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="ruleForm.delete && ruleForm.delete !== route.params.name" @click="submitDeleteForm('ruleFormRefDelete')">I understand the consequences, delete this space</el-button>
      </div>
    </el-row>

    <el-dialog v-model="nftVisible" title="Copy NFT" :show-close="false" :close-on-click-modal="false" custom-class="doi_body" @close="beforeClose">
      <el-form ref="" status-icon class="copt-nft">
        <el-form-item style="width:100%">
          <label class="label" for="dataname">
            Destination network
          </label>
          <div class="flex-row">
            <el-select v-model="ruleForm.destinationValue" disabled placeholder="Select">
              <el-option v-for="item in ruleForm.destinationOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" v-loading="copyLoad">
          <el-button @click="destinationNFT">
            Comform
          </el-button>
          <el-button @click="nftVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogDOIVisible" title="SNFT Agreement" :show-close="false" :close-on-click-modal="false" custom-class="doi_body" @close="beforeClose">
      <div v-if="manageDOI">
        <div class="tip">
          Generating a SNFT restricts certain features of the space: It will NOT be possible to
          <b>rename</b> or
          <b>transfer</b>.
        </div>
        <div class="tip_black">
          By using this feature, you agree to transfer metadata about your space and your name to
          <a href="https://www.multichain.storage" target="_blank">multichain.storage</a> For more information please contact
          <a :href="`mailto:${email_link}`">{{email_link}}</a>
        </div>
        <el-form ref="ruleFormRefDelete" status-icon @submit.native.prevent>
          <el-form-item prop="agreeDoi" style="width:100%">
            <label class="label" for="dataname">
              Type
              <b class="b">agree</b> to confirm
            </label>
            <div class="flex-row">
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
            Generate SNFT
          </el-button>
          <el-button @click="dialogDOIVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <data-nft v-if="dataNFTRequest" @handleChange="handleChange" :dataNFTRequest="dataNFTRequest" :createdAt="listdata.created_at" :updatedAt="listdata.updated_at" :contractAddress="nftdata.contract_address" :getNftID="nftdata.chain_id"></data-nft>
    <network-change v-if="networkC" :networkC="networkC" :netEnv="netEnv" @netChange="netChange"></network-change>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom, Warning, DocumentCopy
} from '@element-plus/icons-vue'
import dataNft from '@/components/dataNFT.vue'
import spaceHardware from '@/components/spaceHardware.vue'
import networkChange from '@/components/networkChange'
const FACTORY_ABI = require('@/utils/abi/DataNFTFactory.json')
const DATA_NFT_ABI = require('@/utils/abi/DataNFT.json')
const SourceMinterABI = require('@/utils/abi/SourceMinter.json')
const tokenLinkABI = require('@/utils/abi/tokenLink.json')
export default defineComponent({
  name: 'Spaces',
  components: {
    CaretBottom, Warning, DocumentCopy, dataNft, spaceHardware, networkChange
  },
  props: {
    // listdata: { type: Number, default: 1 },
    likesValue: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const metaAddress = computed(() => {
      let val = store.state.metaAddress || ''
      return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
    })
    const metaAddressFull = computed(() => (store.state.metaAddress))
    const userGateway = computed(() => (store.state.gateway))
    const accessSpace = computed(() => (store.state.accessSpace ? JSON.parse(store.state.accessSpace) : []))
    const ruleForm = reactive({
      name: '',
      delete: '',
      agreeDoi: '',
      sleepTime: '259200',
      sleepTimeOption: [
        {
          value: '-1',
          label: "Don't sleep",
        }, {
          value: '300',
          label: "5 minutes",
        }, {
          value: '900',
          label: "15 minutes",
        }, {
          value: '1800',
          label: "30 minutes",
        }, {
          value: '3600',
          label: "1 hour",
        }, {
          value: '36000',
          label: "10 hours",
        }, {
          value: '86400',
          label: "24 hours",
        }, {
          value: '259200',
          label: "72 hours",
        }, {
          value: '604800',
          label: "1 week",
        }
      ],
      pauseSpace: false,
      displayPrice: false,
      destinationCont: {},
      destinationValue: 'Sepolia',
      destinationOption: [
        {
          value: 'Sepolia',
          label: "Sepolia",
        }
      ]
    })
    const validateInput = (rule, value, callback) => {
      if ((/[^a-zA-Z0-9-]/g).test(value)) {
        callback(new Error("Only regular alphanumeric characters and '-' support"));
      } else {
        callback();
      }
    }
    const rules = reactive({
      name: [
        { required: true, message: ' ', trigger: 'blur' },
        { validator: validateInput, trigger: "blur" }
      ]
    })
    const rulesDelete = reactive({
      delete: [
        { required: true, message: ' ', trigger: 'blur' }
      ]
    })
    const ruleFormRef = ref(null)
    const listdata = ref({})
    const nftdata = ref({
      chain_url: '',
      chain_tip: '',
      contract_address: null,
      chain_id: null,
      nft: { tokens: [], status: 'not generated' },
      copy_nft: []
    })
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
    const nftVisible = ref(false)
    const copyLoad = ref(false)
    const dialogDOIVisible = ref(false)
    const dataNFTRequest = ref(false)
    const chainIdRes = ref(true)
    const eventArgs = reactive({
      owner: '',
      ipfs_url: ''
    })
    const settingIndex = ref(0)
    const gutterRow = ref(document.body.clientWidth < 992 ? '0' : '30')
    const email_link = process.env.VUE_APP_BASE_EMAIL
    const networkC = ref(false)
    const netEnv = ref([])
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const factory = new system.$commonFun.web3Init.eth.Contract(FACTORY_ABI, process.env.VUE_APP_DATANFT_ADDRESS)
    const chainSelector = process.env.VUE_APP_SEPOLIA_CHAIN
    const gaslimitValue = process.env.VUE_APP_SEPOLIA_GASLIMIT
    const uintValue = system.$commonFun.web3Init.utils.toWei(process.env.VUE_APP_UINT, 'ether')
    const tokenAddress = process.env.VUE_APP_LINK_ADDRESS
    const tokenContract = new system.$commonFun.web3Init.eth.Contract(tokenLinkABI, tokenAddress);
    const SourceMinterAddress = process.env.VUE_APP_SOURCEMINTER_ADDRESS
    const sourceMinterContract = new system.$commonFun.web3Init.eth.Contract(SourceMinterABI, SourceMinterAddress)

    const submitForm = async (formEl) => {
      if (!formEl) return;

      ruleFormRef.value.validate(async (valid, fields) => {
        if (!valid) {
          system.$commonFun.messageTip('error', 'Validation failed!');
          console.log('Validation errors:', fields);
          return;
        }

        renameLoad.value = true;

        try {
          const formData = new FormData();
          formData.append('name', route.params.name);
          formData.append('is_public', listdata.value.is_public); // public:1, private:0
          formData.append('new_name', ruleForm.name);

          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/update`, 'post', formData);
          await system.$commonFun.timeout(500);

          if (listRes && listRes.status === 'success') {
            if (listRes.data.space) {
              accessSpace.value.splice(settingIndex.value, 1, ruleForm.name);
              store.dispatch('setAccessSpace', JSON.stringify(accessSpace.value));
              system.$commonFun.messageTip('success', 'Update successfully!');
              router.push({ name: 'spaceDetail', params: { wallet_address: route.params.wallet_address, name: ruleForm.name, tabs: 'settings' } });
            } else {
              system.$commonFun.messageTip('error', listRes.data.message);
            }
          } else {
            system.$commonFun.messageTip('error', listRes ? listRes.message : 'Upload failed!');
          }

        } catch (error) {
          system.$commonFun.messageTip('error', error.message || 'An unexpected error occurred!');
        } finally {
          ruleForm.name = '';
          renameLoad.value = false;
        }
      });
    }

    const submitDeleteForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRefDelete.value.validate(async (valid, fields) => {
        if (valid) {
          deleteLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/delete`, 'post', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.space) system.$commonFun.messageTip('success', 'Delete successfully!')
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
          .claimDataNFT(1, route.params.name)
          .estimateGas({ from: store.state.metaAddress })

        // we will use estimated gas * 1.5
        let gasLimit = Math.floor(estimatedGas * 1.5)

        console.log('estimated gas:', estimatedGas)
        console.log('gas limit:', gasLimit)

        // call contract
        console.log('Deploying Data NFT...')
        const tx = await factory.methods
          .claimDataNFT(1, route.params.name)
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
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${store.state.metaAddress}/${route.params.name}/mint_hash`, 'post', fd)
    }

    async function beforeClose () {
      dialogDOIVisible.value = false
      await system.$commonFun.timeout(500)
      manageDOI.value = true
      ruleForm.destinationCont = {}
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
          .requestDataNFT(1, route.params.name)
          .estimateGas({ from: store.state.metaAddress })

        let gasLimit = Math.floor(estimatedGas * 1.5)

        await factory.methods
          .requestDataNFT(1, route.params.name)
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
      fd.append('space_name', route.params.name)
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/nft/request`, 'post', fd)
    }

    async function refreshContract (type) {
      listLoad.value = true
      if (type) {
        context.emit('handleValue', true, 'setting')
        requestInitData(type)
        return
      }
      try {
        const request = await factory.methods.requestData(1, route.params.wallet_address, route.params.name).call().then()
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
        list[token].chain_tip = ''
      }
      return list
    }
    async function mapCopyList (list) {
      const number = list ? list.length : 0
      for (let token = 0; token < number; token++) {
        list[token].destination = await system.$commonFun.getUnit(parseInt(list[token].destination_id), 16)
        list[token].source = await system.$commonFun.getUnit(parseInt(list[token].source_id), 16)
      }
      return list
    }
    async function requestInitData (type) {
      if (route.name !== 'spaceDetail') return
      listLoad.value = true
      listdata.value = {}
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}?requester=${store.state.metaAddress}`, 'get')
      if (listRes && listRes.status === 'success') listdata.value = listRes.data.space || { name: route.params.name, is_public: '1', created_at: "", updated_at: "", activeOrder: null, status: 'Created' }

      const listNftRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}spaces/${route.params.wallet_address}/${route.params.name}/nft`, 'get')
      if (listNftRes && listNftRes.status === 'success' && listNftRes.data) {
        if (listNftRes.data.nft && listNftRes.data.nft.status === 'processing' && type) system.$commonFun.messageTip('warning', 'Waiting for the Transaction hash complete')
        let contract_address = listNftRes.data.contract_address
        const getID = await system.$commonFun.web3Init.eth.net.getId()
        if (listNftRes.data.chain_id && getID.toString() !== listNftRes.data.chain_id) {
          // const { name } = await system.$commonFun.getUnit(Number(listNftRes.data.chain_id))
          //   await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
          let { url, name } = await system.$commonFun.getUnit(parseInt(listNftRes.data.chain_id), 16)
          listNftRes.data.chain_tip = 'Please switch to the network: ' + name
          listNftRes.data.chain_url = url
          listNftRes.data.nft.tokens = []
        } else if (contract_address) {
          let { url } = await system.$commonFun.getUnit(parseInt(listNftRes.data.chain_id), 16)
          const nft_contract = new system.$commonFun.web3Init.eth.Contract(DATA_NFT_ABI, contract_address)
          const tokens_list = await mapTokens(listNftRes.data.nft.tokens, nft_contract, contract_address)
          listNftRes.data.chain_url = url
          listNftRes.data.nft.tokens = tokens_list
        } else listNftRes.data.nft.tokens = []

        listNftRes.data.copy_nft = await mapCopyList(listNftRes.data.copy_nft)
        if (!listNftRes.data.hasOwnProperty('nft')) listNftRes.data.nft = listNftRes.data.nft || { tokens: [], status: 'not generated' }
        nftdata.value = listNftRes.data || { contract_address: null, copy_nft: [], chain_id: null, nft: { tokens: [], status: 'not generated' } }
      }
      // await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function spaceIndex () {
      let index = 0
      accessSpace.value.forEach((ele, i) => {
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
    function handleHard (val, refresh, net) {
      if (net) {
        netEnv.value = [{
          name: 'OpSwan',
          id: 8598668088
        },
        {
          name: 'Mumbai Testnet',
          id: 80001
        }]
        networkC.value = true
      } else if (refresh) {
        context.emit('handleValue', true, 'setting')
        requestInitData()
      }
    }

    async function networkEstimate () {
      let chainID = '80001'
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      if (getID.toString() !== chainID) {
        // const { name } = await system.$commonFun.getUnit(Number(chainID))
        // await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
        netEnv.value = [{
          name: 'Mumbai Testnet',
          id: 80001
        }]
        networkC.value = true
        return false
      }
      return true
    }

    async function copyThisNFT (row) {
      const net = await networkEstimate()
      if (!net) return
      ruleForm.destinationCont = row
      nftVisible.value = true
    }

    async function generateThisNFT () {
      const net = await networkEstimate()
      if (!net) return
      dialogDOIVisible.value = true
    }

    async function netChange (dialog, rows) {
      networkC.value = dialog
      if (rows) system.$commonFun.walletChain(Number(rows))
    }

    let copyTransaction
    async function destinationNFT () {
      copyLoad.value = true
      try {
        chainIdRes.value = await system.$commonFun.changeIDLogin()
        if (!chainIdRes.value) {
          copyLoad.value = false
          return false
        }

        // const uintValue = await sourceMinterContract.methods.latestMessageFee().call()
        let approveGasLimit = await tokenContract.methods
          .approve(SourceMinterAddress, uintValue)
          .estimateGas({ from: store.state.metaAddress })

        const approve_tx = await tokenContract.methods
          .approve(SourceMinterAddress, uintValue)
          .send({ from: store.state.metaAddress, gasLimit: approveGasLimit })

        console.log('copyNFT:', chainSelector, ruleForm.destinationCont.contract_address, ruleForm.destinationCont.token_id, gaslimitValue)


        let copyEstimatedGas = await sourceMinterContract.methods
          .copyNFT(chainSelector, ruleForm.destinationCont.contract_address, ruleForm.destinationCont.token_id, gaslimitValue)
          .estimateGas({ from: store.state.metaAddress })
        console.log('estimatedGas', copyEstimatedGas)

        copyTransaction = await sourceMinterContract.methods
          .copyNFT(chainSelector, ruleForm.destinationCont.contract_address, ruleForm.destinationCont.token_id, gaslimitValue)
          .send({ from: store.state.metaAddress, gasLimit: copyEstimatedGas })
          .on('transactionHash', async (transactionHash) => {
            console.log('copyNFT transactionHash:', transactionHash)
            await copyInfo(transactionHash)
            copyLoad.value = false
            nftVisible.value = false
            requestInitData()
          })
          .on('error', () => copyLoad.value = false)

        console.log('transaction.events:', copyTransaction)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        copyLoad.value = false
      }
    }

    async function copyInfo (tx_hash) {
      let fd = new FormData()
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      fd.append('is_deleted', 0)
      fd.append('license_id', ruleForm.destinationCont.token_id)
      fd.append('source_id', 80001)
      fd.append('source_address', process.env.VUE_APP_SOURCEMINTER_ADDRESS)
      fd.append('destination_id', 11155111)
      fd.append('destination_address', process.env.VUE_APP_SEPOLIA_ADDRESS)
      fd.append('wallet_address', store.state.metaAddress)
      fd.append('collection_address', ruleForm.destinationCont.contract_address) //ruleForm.destinationCont为tokens数组中，当前copy按钮对应的行数据

      const copyRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}copynft/request`, 'post', fd)
    }

    async function checkCopyInfo (row) {
      listLoad.value = true
      const checkCopyRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}copynft/status/${row.license_id}/${route.params.wallet_address}/${row.destination_id}/${nftdata.value.contract_address}`, 'get')
      requestInitData()
    }
    onMounted(async () => {
      window.scrollTo(0, 0)
      requestInitData()
      settingIndex.value = await spaceIndex()
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
      doiLoad,
      doiIndex,
      doiData,
      ruleForm,
      listdata,
      rules,
      rulesDelete,
      ruleFormRef,
      ruleFormRefDelete,
      listLoad,
      nftdata,
      dataNFTRequest,
      dialogDOIVisible,
      networkC,
      netEnv,
      system,
      gutterRow,
      route,
      router,
      generateLoad,
      manageDOI,
      eventArgs,
      chainIdRes,
      nftVisible, copyLoad, email_link,
      props, submitForm, submitDeleteForm, copyThisNFT, destinationNFT, checkCopyInfo,
      handleChange, requestInitData, beforeClose, requestNFT, refreshContract, handleHard, generateThisNFT, netChange
    }
  }
})
</script>

<style lang="scss" scoped>
#space {
  background: #fff;
  color: #333;
  font-size: 18px;
  text-align: left;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.space_body) {
    align-items: stretch;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin: auto;
    font-size: 14px;
    text-align: left;
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
      .tip,
      .el-row {
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
          justify-content: space-between;
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
                width: 100%;
                .el-select {
                  width: calc(100% - 30px);
                  @media screen and (max-width: 768px) {
                    width: 100%;
                  }
                }
                .el-form {
                  width: 100%;
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
        font-weight: 500;
        line-height: 1;
        color: #f85149;
        word-break: break-word;
        white-space: normal;
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
              font-size: 17px;
              color: #000;
              word-break: break-word;
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
              font-size: 15px;
              color: #606060;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 17px;
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
              .el-button {
                margin: 0;
              }
              .transform {
                text-transform: capitalize;
              }
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
        &.copt-nft {
          padding: 0.1rem 0.25rem;
        }
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
  :deep(.net_body) {
    width: 570px;
    margin: auto;
    border-radius: 0.23rem;
    text-align: left;
    color: #000;
    word-break: break-word;
    @media screen and (max-width: 600px) {
      width: 94%;
    }
    .el-dialog__header {
      padding: 0.25rem 0.6rem 0.1rem;
      font-size: 0.2rem;
      .el-dialog__headerbtn {
        right: 0.3rem;
        top: 0.28rem;
        font-size: 0.2rem;
        font-weight: 600;
        color: #000;
        cursor: pointer;
        i,
        svg,
        path {
          color: inherit;
          cursor: inherit;
        }
      }
    }

    .el-dialog__body {
      padding: 0 0 0.15rem;
    }

    .el-dialog__footer {
      padding: 0 0.6rem 0.5rem;
      text-align: left;
      .dialog-footer {
        justify-content: center;
      }
      .el-button {
        width: 60%;
        max-width: 204px;
        height: auto;
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

