<template>
  <div class="dataAdd-pop">
    <el-dialog v-model="dataAddShow" title="Add Custom Network" :close-on-click-modal="false" :show-close="false" custom-class="doi_body" @close="beforeClose">
      <div>
        <el-form ref="dataAddRef" class="flex-row" :model="dataAddForm" label-position="top" :rules="rulesData" status-icon>
          <el-form-item prop="name" label="Network name *">
            <div class="flex-row">
              <el-input v-model="dataAddForm.name" placeholder="e.g. My Network" />
            </div>
          </el-form-item>
          <el-form-item prop="ethereum" label="Network ID *">
            <div class="flex-row">
              <el-input v-model="dataAddForm.ethereum" placeholder="e.g. ethereum" />
            </div>
          </el-form-item>
          <el-form-item prop="chain_id" label="Chain ID *" class="item-half">
            <div class="flex-row">
              <el-input v-model="dataAddForm.chain_id" placeholder="e.g. 152" />
            </div>
          </el-form-item>
          <el-form-item prop="currency" label="Currency Symbol *" class="item-half">
            <div class="flex-row">
              <el-input v-model="dataAddForm.currency" placeholder="e.g. ETH" />
            </div>
          </el-form-item>
          <el-form-item prop="type" label="Network type" class="item-half">
            <div class="flex-row">
              <el-radio-group v-model="dataAddForm.type" class="ml-4">
                <el-radio label="Mainnet" size="large">Mainnet</el-radio>
                <el-radio label="Testent" size="large">Testent </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item prop="icon" label="Icon" class="item-half">
            <div class="flex-row">
              <el-upload action="customize" v-model:file-list="fileList" :http-request="uploadFileRequest" :on-change="handlePictureCardChange" :on-remove="handleRemove" list-type="picture-card" :auto-upload="false">
                <el-button>Upload Icon</el-button>
                <!-- <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  </div>
                </template> -->
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item prop="rpc" label="RPC URL *">
            <div class="flex-row">
              <el-input v-model="dataAddForm.rpc" placeholder="https: //" />
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex-row info-tip">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" xml:space="preserve" data-v-ea893728="">
                <path d="M928.99 755.83 574.6 203.25c-12.89-20.16-36.76-32.58-62.6-32.58s-49.71 12.43-62.6 32.58L95.01 755.83c-12.91 20.12-12.9 44.91.01 65.03 12.92 20.12 36.78 32.51 62.59 32.49h708.78c25.82.01 49.68-12.37 62.59-32.49 12.91-20.12 12.92-44.91.01-65.03zM554.67 768h-85.33v-85.33h85.33V768zm0-426.67v298.66h-85.33V341.32l85.33.01z"
                  fill="currentColor"></path>
              </svg>
              <p>
                Only add custom networks that you trust.<br /> Malicious RPCs can record activity and lie about the state of the network.
              </p>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer flex-row" v-loading="addLoad">
          <el-button @click="submitAdd('dataAddRef')">
            Add Network
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, nextTick, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Add Network',
  components: {
    Delete, Plus, ZoomIn
  },
  props: {
    dataShow: { type: Boolean, default: false }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => store.state.metaAddress)
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const dataAddShow = props.dataShow
    const dataAddRef = ref(null)
    const addLoad = ref(false)
    const dataAddForm = reactive({
      name: '',
      ethereum: '',
      chain_id: '',
      currency: '',
      type: 'Mainnet',
      icon: '',
      rpc: ''
    })
    const rulesData = reactive({
      name: [
        { required: true, message: ' ', trigger: 'blur' }
      ],
      ethereum: [
        { required: true, message: ' ', trigger: 'blur' }
      ],
      chain_id: [
        { required: true, message: ' ', trigger: 'blur' }
      ],
      currency: [
        { required: true, message: ' ', trigger: 'blur' }
      ],
      rpc: [
        { required: true, message: ' ', trigger: 'blur' }
      ]
    })
    const disabled = ref(false)
    const fileList = ref([])

    async function uploadFun () {
      let fd = new FormData()
      fileList.value.forEach(file => {
        let namepath = file.name || file.raw.name
        let fileNew = new File([file.raw], namepath)
        fd.append('file', fileNew, namepath)
      })
      const uploadRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}files`, 'post', fd)
      if (uploadRes && String(uploadRes.code) === '0') {
        const url = uploadRes.url || ''
        return url
      } else if (uploadRes.msg) system.$commonFun.messageTip('error', uploadRes.msg)
      return ''
    }
    async function submitAdd (formEl) {
      if (!formEl) return
      await dataAddRef.value.validate(async (valid, fields) => {
        if (valid) {
          addLoad.value = true
          const fileIcon = fileList.value.length > 0 ? await uploadFun() : ''
          const params = {
            "name": dataAddForm.name,
            "chain": dataAddForm.ethereum,
            "chain_id": dataAddForm.chain_id,
            "currency": dataAddForm.currency,
            "network": dataAddForm.type,
            "url": dataAddForm.rpc,
            "icon": fileIcon
          }
          const addNetRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}nodes`, 'post', params)
          if (addNetRes && String(addNetRes.code) === '0') {
            context.emit('handleChange', false, true)
            return false
          } else if (addNetRes.msg) system.$commonFun.messageTip('error', addNetRes.msg)
          addLoad.value = false
        } else {
          console.log('error submit!', fields)
          return false
        }
      })
    }
    async function handleRemove (uploadFile, uploadFiles) {
      fileList.value = []
    }
    async function uploadFileRequest (params) {
      console.log('params', params)
    }
    async function handlePictureCardChange (uploadFile) {
      fileList.value = [].concat(uploadFile)
    }
    function beforeClose () {
      context.emit('handleChange', false)
    }
    onMounted(() => { })
    return {
      bodyWidth,
      system,
      props,
      addLoad,
      dataAddForm,
      dataAddShow,
      dataAddRef,
      rulesData,
      disabled,
      fileList,
      submitAdd, beforeClose, uploadFileRequest, handleRemove, handlePictureCardChange
    }
  }
})
</script>
<style lang="scss">
.dataAdd-pop .el-overlay {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

