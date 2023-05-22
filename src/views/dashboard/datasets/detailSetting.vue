<template>
  <section id="dataset">
    <el-row class="dataset_body" v-loading="listLoad">
      <div class="fileList" v-loading="renameLoad">
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
        <el-button size="large" :disabled="!ruleForm.name" @click="submitForm('ruleFormRef')">I understand the consequences, rename this dataset</el-button>
      </div>
      <div class="fileList" v-loading="doiLoad">
        <div class="title">{{doiIndex === 3?'DNFT':'Data NFT (DNFT)'}}</div>
        <div v-if="doiIndex === 1">
          <div class="tip">
            Generate a DNFT for this dataset. Learn more about Data NFT
            <br /> This action cannot be undone. It will no longer be possible to delete, rename, transfer, or change the visibility to private.</div>
          <el-button size="large" class="generateDOI" @click="dialogDOIVisible = true">Generate DNFT</el-button>
        </div>
        <div v-if="doiIndex === 2">
          <div class="tip">
            DNFT is active for this dataset. Learn more about Data NFT
          </div>
          <el-table :data="doiData" border stripe style="width: 100%">
            <el-table-column prop="doi" label="DNFT">
              <template #default="scope">
                {{scope.row.doi}}
                <span class="current">CURRENT</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="doiIndex === 3">
          <div class="tip">
            DNFT is active for this dataset.
          </div>
          <el-table :data="doiData" border stripe style="width: 100%">
            <el-table-column prop="doi" label="DNFT">
              <template #default="scope">
                {{scope.row.doi}}
                <span class="current">CURRENT</span>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="Version">
              <template #default="scope">
                {{scope.row.version}}
              </template>
            </el-table-column>
          </el-table>
          <div class="tip tip_new">
            Your dataset has been updated, do you want to generate a new DNFT?
          </div>
          <el-button size="large" class="generateDOI" @click="dialogDOIVisible = true">Generate DNFT</el-button>
        </div>
      </div>
      <div class="fileList" v-loading="deleteLoad">
        <div class="title">Delete this dataset</div>
        <div class="tip">This action
          <b>cannot</b> be undone. This will permanently delete the
          <b class="b">{{route.params.name}}</b> dataset repository and all its files.</div>

        <el-form ref="ruleFormRefDelete" :model="ruleForm" :rules="rulesDelete" class="demo-ruleForm" status-icon>
          <el-form-item prop="delete" style="width:100%">
            <label class="label" for="dataname">
              Please type
              <b class="b">{{route.params.name}}</b> to confirm.
              <div class="flex flex-row">
                <el-input v-model="ruleForm.delete" placeholder=" " />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="ruleForm.delete && ruleForm.delete !== route.params.name" @click="submitDeleteForm('ruleFormRefDelete')">I understand the consequences, delete this dataset</el-button>
      </div>
    </el-row>

    <el-dialog v-model="dialogDOIVisible" title="DNFT Agreement" :show-close="false" custom-class="doi_body" @close="beforeClose">
      <div v-if="manageDOI">
        <div class="tip">
          Generating a DNFT restricts certain features of the dataset: it will no longer be possible to rename, transfer, delete or change the visibility to private.
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
        <div class="tip_text">
          <p>
            <label>owner:</label> {{eventArgs.owner}}</p>
          <p>
            <label>dataset name:</label> {{eventArgs.datasetName}} </p>
          <p>
            <label>dataNFT address:</label> {{eventArgs.dataNFTAddress}}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer" v-loading="generateLoad">
          <el-button type="primary" v-if="manageDOI" :disabled="ruleForm.agreeDoi && ruleForm.agreeDoi !== 'agree'" @click="generateSub">
            Generate DNFT
          </el-button>
          <el-button @click="dialogDOIVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom
} from '@element-plus/icons-vue'
const FACTORY_ABI = require('@/utils/abi/DataNFTFactory.json')
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom
  },
  props: {
    // listdata: { type: Number, default: 1 }
  },
  setup (props) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const metaAddress = computed(() => {
      let val = store.state.metaAddress || ''
      return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
    })
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
    const eventArgs = reactive({})
    const ruleFormRef = ref(null)
    const listdata = ref({})
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
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    function momentFilter (dateItem) {
      return system.$commonFun.momentFun(dateItem)
    }
    const submitForm = async (formEl) => {
      if (!formEl) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          renameLoad.value = true
          let formData = new FormData()
          formData.append('name', route.params.name)
          formData.append('is_public', listdata.value.is_public) // public:1, private:0
          formData.append('new_name', ruleForm.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets`, 'put', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.dataset) {
              accessDataset.value.splice(settingIndex.value, 1, ruleForm.name)
              store.dispatch('setAccessDataset', JSON.stringify(accessDataset.value))
              system.$commonFun.messageTip('success', 'Update successfully!')
              router.push({ name: 'datasetDetail', params: { wallet_address: route.params.wallet_address, name: ruleForm.name, tabs: 'settings' } })
            }
            else system.$commonFun.messageTip('error', listRes.data.message)
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
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets`, 'delete', formData)
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
    async function generateSub () {
      generateLoad.value = true
      const generateRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${store.state.metaAddress}/${route.params.name}/generate_metadata`, 'post', {})
      console.log(generateRes)
      if (generateRes && generateRes.status === 'success') {
        claimDataNFT(generateRes.ipfs_url)
        return
      } else system.$commonFun.messageTip('error', generateRes.message ? generateRes.message : 'Failed!')
      generateLoad.value = false
      // dialogDOIVisible.value = false
    }
    async function claimDataNFT (uri) {
      const factory = new system.$commonFun.web3Init.eth.Contract(FACTORY_ABI, process.env.VUE_APP_FACTORY_ADDRESS)
      // estimate gas
      let estimatedGas = await factory.methods
        .claimDataNFT(route.params.name, uri)
        .estimateGas({ from: store.state.metaAddress })

      // we will use estimated gas * 1.5
      let gasLimit = Math.floor(estimatedGas * 1.5)

      console.log('estimated gas:', estimatedGas)
      console.log('gas limit:', gasLimit)

      // call contract
      console.log('Deploying Data NFT...')
      const tx = await factory.methods
        .claimDataNFT(route.params.name, uri)
        .send({ from: store.state.metaAddress, gasLimit: gasLimit })
        .on('transactionHash', async (transactionHash) => console.log('transactionHash:', transactionHash))
        .on('error', () => generateLoad.value = false)

      // display results
      console.log('tx hash:', tx.transactionHash)

      let eventArgsList = tx.events.CreateDataNFT.returnValues
      console.log('owner:', eventArgsList.owner)
      console.log('dataset name:', eventArgsList.datasetName)
      console.log('dataNFT address:', eventArgsList.dataNFTAddress)
      eventArgs.owner = eventArgsList.owner
      eventArgs.datasetName = eventArgsList.datasetName
      eventArgs.dataNFTAddress = eventArgsList.dataNFTAddress
      generateLoad.value = false
      manageDOI.value = false
      generateMintHash(tx.transactionHash)
    }
    async function generateMintHash (tx_hash) {
      let fd = new FormData()
      const getID = await system.$commonFun.web3Init.eth.net.getId()
      fd.append('tx_hash', tx_hash)
      fd.append('chain_id', getID)
      const minthashRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${store.state.metaAddress}/${route.params.name}/mint_hash`, 'post', fd)
    }
    function beforeClose () {
      manageDOI.value = true
    }
    async function init () {
      if (route.name !== 'datasetDetail') return
      listLoad.value = true
      listdata.value = {}
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets/${route.params.wallet_address}/${route.params.name}`, 'get')
      if (listRes && listRes.status === 'success') {
        listdata.value = listRes.data.dataset || { name: route.params.name, is_public: '1' }
      }
      await system.$commonFun.timeout(500)
      listLoad.value = false
    }
    async function datasetIndex () {
      let index = 0
      accessDataset.value.forEach((ele, i) => {
        if (ele === route.params.name) index = i
      })
      return index
    }
    onMounted(async () => {
      window.scrollTo(0, 0)
      init()
      settingIndex.value = await datasetIndex()
    })
    onDeactivated(() => {
      ruleForm.name = ''
      ruleForm.delete = ''
    })
    return {
      lagLogin,
      metaAddress,
      renameLoad,
      deleteLoad,
      generateLoad,
      manageDOI,
      doiLoad,
      doiIndex,
      doiData,
      ruleForm,
      listdata,
      eventArgs,
      rules,
      rulesDelete,
      ruleFormRef,
      ruleFormRefDelete,
      listLoad,
      dialogDOIVisible,
      system,
      route,
      router,
      props, submitForm, submitDeleteForm, momentFilter, generateSub, beforeClose
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
      .el-button {
        width: calc(100% - 0.4rem);
        height: auto;
        padding: 0.1rem;
        margin: 0 0.2rem 0.2rem;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-family: inherit;
        font-size: 16px;
        line-height: 1;
        color: #c37af9;
        word-break: break-word;
        white-space: normal;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }
        &:hover {
          opacity: 0.9;
          border-color: #e3e6eb;
          span {
            cursor: pointer;
          }
        }
        &.is-disabled {
          opacity: 0.7;
        }
      }
      .generateDOI {
        width: auto;
        color: #606060;
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
        font-size: 15px;
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
            width: 135px;
          }
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
            cursor: pointer;
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
