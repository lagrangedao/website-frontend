<template>
  <div class="dataNFT_pop">
    <el-dialog v-model="dataNFTShow" title="Generate Metadata License" :close-on-click-modal="false" :show-close="false" custom-class="doi_body" @close="beforeClose">
      <div>
        <el-form ref="dataNFTRef" :model="dataNFTForm" label-width="120px" :rules="rulesDataNFT" status-icon>
          <el-form-item prop="type" label="Type">
            <div class="flex flex-row">
              <el-input v-model="dataNFTForm.type" placeholder=" " disabled readonly />
            </div>
          </el-form-item>
          <el-form-item prop="author" label="Author">
            <div class="flex flex-row">
              <el-input v-model="dataNFTForm.author" placeholder=" " disabled readonly />
            </div>
          </el-form-item>
          <el-form-item prop="recipient" label="Recipient">
            <div class="flex flex-row">
              <el-input v-model="dataNFTForm.recipient" placeholder=" " />
            </div>
          </el-form-item>
          <el-form-item prop="tags" label="Tags">
            <div class="flex flex-row">
              <el-tag v-for="tag in dataNFTForm.tags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="handleClose(tag, 'tags')">
                {{ tag }}
              </el-tag>
              <el-input v-if="dataNFTForm.inputVisible" ref="InputRef" v-model="dataNFTForm.inputValue" class="ml-1 w-20" size="small" @keyup.enter="handleInputConfirm('tags')" @blur="handleInputConfirm('tags')" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput('tags')">
                +
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="description" label="Description">
            <div class="flex flex-row">
              <el-input v-model="dataNFTForm.description" placeholder=" " />
            </div>
          </el-form-item>
          <el-form-item prop="links" label="Links">
            <div class="flex flex-row">
              <el-tag v-for="link in dataNFTForm.links" :key="link" class="mx-1" closable :disable-transitions="false" @close="handleClose(link, 'links')">
                {{ link }}
              </el-tag>
              <el-input v-if="dataNFTForm.linksVisible" ref="LinksRef" v-model="dataNFTForm.linksValue" class="ml-1 w-20" size="small" @keyup.enter="handleInputConfirm('links')" @blur="handleInputConfirm('links')" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput('links')">
                +
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-for="(info, index) in dataNFTForm.additionalInformation" :key="index" :label="index===0?'Additional Info':''" :prop="'additionalInformation.' + index + '.value'" class="form-flex">
            <el-input v-model="info.key" />
            <span class="m">:</span>
            <el-input v-model="info.value" />
            <span class="m"></span>
            <el-button @click="addInfo">+</el-button>
            <el-button class="mt-2" :disabled="index===0" @click.prevent="removeInfo(info)">-</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer" v-loading="generateLoad">
          <el-button @click="generateLicense('dataNFTRef')">
            Create License
          </el-button>
          <el-button @click="beforeClose">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
const DATA_NFT_ABI = require('@/utils/abi/DataNFT.json')
export default defineComponent({
  name: 'Data NFT',
  components: {},
  props: {
    dataNFTRequest: { type: Boolean, default: false },
    createdAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
    contractAddress: { type: String, default: "" }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => store.state.metaAddress)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const dataNFTShow = props.dataNFTRequest
    const dataNFTRef = ref(null)
    const generateLoad = ref(false)
    const dataNFTForm = reactive({
      type: typeName(),
      author: metaAddress.value,
      recipient: metaAddress.value,
      tags: [],
      description: '',
      links: [],
      additionalInformation: [
        {
          key: '',
          value: '',
        },
      ],
      inputValue: '',
      inputVisible: false,
      linksValue: '',
      linksVisible: false
    })
    const validateRec = (rule, value, callback) => {
      if (!system.$commonFun.web3Init.utils.isAddress(value)) {
        callback(new Error("Please enter a valid wallet address"));
      } else {
        callback();
      }
    }
    const rulesDataNFT = reactive({
      recipient: [
        { required: true, message: ' ', trigger: 'blur' },
        { validator: validateRec, trigger: "blur" }
      ]
    })
    const InputRef = ref()
    const LinksRef = ref()

    const handleClose = (tag, type) => {
      if (type === 'tags') dataNFTForm.tags.splice(dataNFTForm.tags.indexOf(tag), 1)
      else dataNFTForm.links.splice(dataNFTForm.links.indexOf(tag), 1)
    }

    const showInput = (type) => {
      if (type === 'tags') {
        dataNFTForm.inputVisible = true
        nextTick(() => InputRef.value.focus())
      } else {
        dataNFTForm.linksVisible = true
        nextTick(() => LinksRef.value.focus())
      }
    }

    const handleInputConfirm = (type) => {
      if (type === 'tags') {
        if (dataNFTForm.inputValue) dataNFTForm.tags.push(dataNFTForm.inputValue)
        dataNFTForm.inputVisible = false
        dataNFTForm.inputValue = ''
      } else {
        if (dataNFTForm.linksValue) dataNFTForm.links.push(dataNFTForm.linksValue)
        dataNFTForm.linksVisible = false
        dataNFTForm.linksValue = ''
      }
    }

    const removeInfo = (item) => {
      const index = dataNFTForm.additionalInformation.indexOf(item)
      if (index !== -1) {
        dataNFTForm.additionalInformation.splice(index, 1)
      }
    }

    const addInfo = () => {
      dataNFTForm.additionalInformation.push({
        key: '',
        value: '',
      })
    }

    function typeName () {
      let type = 'dataset'
      switch (route.name) {
        case 'spaceDetail':
          type = 'space'
          break;
        case 'modelsDetail':
          type = 'model'
          break;
        case 'datasetDetail':
          type = 'dataset'
          break;
      }
      return type
    }

    function beforeClose () {
      context.emit('handleChange', false)
    }
    async function infoList () {
      let list = {}
      dataNFTForm.additionalInformation.forEach(info => {
        list[info.key] = info.value
      })
      return list
    }
    async function generateLicense (formEl) {
      if (!formEl) return
      await dataNFTRef.value.validate(async (valid, fields) => {
        if (valid) {
          const loginJudg = await system.$commonFun.changeIDLogin()
          if (!loginJudg) {
            generateLoad.value = false
            return false
          }
          generateLoad.value = true
          const additionalInformation = await infoList()
          const params = {
            "created_at": props.createdAt,
            "updated_at": props.updatedAt,
            "description": dataNFTForm.description,
            "type": dataNFTForm.type,
            "author": dataNFTForm.author,
            "links": dataNFTForm.links,
            "tags": dataNFTForm.tags,
            "additionalInformation": additionalInformation
          }
          const getID = await system.$commonFun.web3Init.eth.net.getId()
          const getNftID = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${store.state.metaAddress}/${route.params.name}`, 'get')

          if (getID.toString() !== getNftID.data.nft.chain_id) {
            const { name } = await system.$commonFun.getUnit(Number(getNftID.data.nft.chain_id))
            await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
            generateLoad.value = false
            return
          }
          const licenseRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}/license/metadata/generate`, 'post', params)
          if (licenseRes && licenseRes.status === "success") {
            if (licenseRes.data && licenseRes.data.ipfs_url) createLicense(licenseRes.data.ipfs_url)
            else generateLoad.value = false
            return
          }
          system.$commonFun.messageTip('error', licenseRes.message ? licenseRes.message : 'Failed!')
          generateLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    async function createLicense (ipfsURL) {
      try {
        const factory = new system.$commonFun.web3Init.eth.Contract(DATA_NFT_ABI, props.contractAddress)
        let estimatedGas = await factory.methods
          .createLicense(dataNFTForm.recipient, ipfsURL)
          .estimateGas({ from: store.state.metaAddress })

        let gasLimit = Math.floor(estimatedGas * 1.5)
        const tx = await factory.methods
          .createLicense(dataNFTForm.recipient, ipfsURL)
          .send({ from: store.state.metaAddress, gasLimit: gasLimit })
          .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash:', transactionHash)
            await generateMintHash(transactionHash)
            generateLoad.value = false
            context.emit('handleChange', false, true)
          })
          .on('error', () => generateLoad.value = false)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        generateLoad.value = false
      }
    }

    async function generateMintHash (tx_hash) {
      let fd = new FormData()
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      const getNftID = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${store.state.metaAddress}/${route.params.name}`, 'get')
      if (getID.toString() !== getNftID.data.nft.chain_id) {
        const { name } = await system.$commonFun.getUnit(Number(getNftID.data.nft.chain_id))
        await system.$commonFun.messageTip('error', 'Please switch to the network: ' + name)
        return
      }
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      fd.append('contract_address', props.contractAddress)
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${store.state.metaAddress}/${route.params.name}/license/mint_hash`, 'post', fd)
      const createRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/create_license`, 'post', fd)
    }

    onMounted(() => { })
    watch(() => props.dataNFTRequest, (newValue, oldValue) => {
      dataNFTShow.value = props.dataNFTRequest
    })
    return {
      bodyWidth,
      system,
      props,
      generateLoad,
      dataNFTShow,
      dataNFTRef,
      dataNFTForm,
      rulesDataNFT,
      LinksRef,
      InputRef,
      generateLicense,
      beforeClose, handleClose, showInput, handleInputConfirm, removeInfo, addInfo
    }
  }
})
</script>
<style lang="scss" scoped>
.dataNFT_pop {
  @media screen and (max-width: 1024px) {
  }
  :deep(.doi_body) {
    .el-dialog__body {
      .el-form {
        padding: 0.05rem 0.25rem 0.15rem !important;
        .el-form-item {
          margin: 12px 0;
          .el-tag {
            margin-right: 5px;
            background-color: #f3f1ff;
            color: #562683;
            border-color: #f1f1f2;
            .el-tag__close {
              color: inherit;
            }
          }
          .button-new-tag {
            &:hover,
            &:focus {
              background-color: #f3f1ff;
              color: #562683;
              border-color: #f1f1f2;
            }
          }
          &.form-flex {
            .el-form-item__content {
              flex-wrap: inherit;
              .m {
                padding: 0 5px;
              }
              .el-button {
                &:hover,
                &:focus {
                  background-color: #f3f1ff;
                  color: #562683;
                  border-color: #f1f1f2;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

