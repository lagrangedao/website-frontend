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
      <div class="fileList" v-loading="deleteLoad">
        <div class="title">Delete this dataset</div>
        <div class="tip">This action
          <b>cannot</b> be undone. This will permanently delete the
          <b>{{route.params.name}}</b> dataset repository and all its files.</div>

        <el-form ref="ruleFormRefDelete" :model="ruleForm" :rules="rulesDelete" class="demo-ruleForm" status-icon>
          <el-form-item prop="delete" style="width:100%">
            <label class="label" for="dataname">
              Please type
              <b>{{route.params.name}}</b> to confirm.
              <div class="flex flex-row">
                <el-input v-model="ruleForm.delete" placeholder=" " />
              </div>
            </label>
          </el-form-item>
        </el-form>
        <el-button size="large" :disabled="ruleForm.delete && ruleForm.delete !== route.params.name" @click="submitDeleteForm('ruleFormRefDelete')">I understand the consequences, delete this dataset</el-button>
      </div>
    </el-row>
  </section>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CaretBottom
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Datasets',
  components: {
    CaretBottom
  },
  props: {
    listdata: { type: Number, default: 1 }
  },
  setup (props) {
    const store = useStore()
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const metaAddress = computed(() => {
      let val = store.state.metaAddress || ''
      return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
    })
    const ruleForm = reactive({
      name: '',
      delete: ''
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
    const ruleFormRef = ref(null)
    const ruleFormRefDelete = ref(null)
    const renameLoad = ref(false)
    const deleteLoad = ref(false)
    const listLoad = ref(false)
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
          formData.append('is_public', props.listdata) // public:1, private:0
          formData.append('new_name', ruleForm.name)
          const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets`, 'put', formData)
          await system.$commonFun.timeout(500)
          if (listRes && listRes.status === 'success') {
            if (listRes.data.dataset) {
              system.$commonFun.messageTip('success', 'Update successfully!')
              router.push({ name: 'datasetDetail', params: { name: ruleForm.name, tabs: 'settings' } })
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
            router.push({ name: 'datasets' })
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
    onMounted(() => { })
    watch(route, (to, from) => {
      ruleForm.name = ''
      ruleForm.delete = ''
      window.scrollTo(0, 0)
    })
    return {
      lagLogin,
      metaAddress,
      renameLoad,
      deleteLoad,
      ruleForm,
      rules,
      rulesDelete,
      ruleFormRef,
      ruleFormRefDelete,
      listLoad,
      system,
      route,
      router,
      props, submitForm, submitDeleteForm, momentFilter
    }
  }
})
</script>

<style lang="scss" scoped>
#dataset {
  background: #fff;
  color: #333;
  font-size: 18px;
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
      padding: 0.2rem;
      margin: 0.15rem 0;
      border: 1px solid #e4e4e4;
      border-radius: 0.1rem;
      color: #606060;
      overflow: hidden;
      .title {
        margin: 0 0 0.2rem;
        font-size: 15px;
        font-weight: bold;
        color: #333;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 17px;
        }
      }
      .desc,
      .tip {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        @media screen and (max-width: 768px) {
          font-size: 13px;
        }
        @media screen and (min-width: 1800px) {
          font-size: 16px;
        }
      }
      .tip {
        margin: 0 0 0.2rem;
        font-weight: normal;
      }
      .demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
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
              font-size: 14px;
              color: #333;
              @media screen and (max-width: 768px) {
                font-size: 13px;
              }
              @media screen and (min-width: 1800px) {
                font-size: 16px;
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
        width: 100%;
        height: auto;
        padding: 0.1rem;
        margin: 0 0.15rem 0 0;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        font-size: 18px;
        line-height: 1;
        color: #c37af9;
        @media screen and (max-width: 1600px) {
          font-size: 16px;
        }
        &:hover {
          opacity: 0.9;
          span {
            cursor: pointer;
          }
        }
        &.is-disabled {
          opacity: 0.7;
          &:hover {
            opacity: 0.7;
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
