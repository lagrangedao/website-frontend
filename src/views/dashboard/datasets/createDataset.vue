<template>
    <section id="dataset">
        <el-row class="dataset_body container-landing flex-row" v-loading="createLoad">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="text-center">
                    <!-- <svg class="w-12 h-12 mx-auto text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
                        <ellipse cx="12.5" cy="5" fill="currentColor" fill-opacity="0.25" rx="7.5" ry="2"></ellipse>
                        <path d="M12.5 15C16.6421 15 20 14.1046 20 13V20C20 21.1046 16.6421 22 12.5 22C8.35786 22 5 21.1046 5 20V13C5 14.1046 8.35786 15 12.5 15Z" fill="currentColor" opacity="0.5"></path>
                        <path d="M12.5 7C16.6421 7 20 6.10457 20 5V11.5C20 12.6046 16.6421 13.5 12.5 13.5C8.35786 13.5 5 12.6046 5 11.5V5C5 6.10457 8.35786 7 12.5 7Z" fill="currentColor" opacity="0.5"></path>
                        <path d="M5.23628 12C5.08204 12.1598 5 12.8273 5 13C5 14.1046 8.35786 15 12.5 15C16.6421 15 20 14.1046 20 13C20 12.8273 19.918 12.1598 19.7637 12C18.9311 12.8626 15.9947 13.5 12.5 13.5C9.0053 13.5 6.06886 12.8626 5.23628 12Z" fill="currentColor"></path>
                    </svg> -->
                    <img src="@/assets/images/icons/icon_19_1.png" class="img" alt="">
                    <h1 class="text-xl md:text-3xl font-semibold">Create a new dataset repository</h1>
                    <p class="text-lg text-gray-500">A repository contains all dataset files, including the revision history.</p>
                </div>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm flex-row" status-icon>
                    <el-form-item prop="" class="flex_form">
                        <label class="label" for="owner">
                            Owner
                            <div class="flex flex-row">
                                <el-select v-model="metaAddress" placeholder="">
                                    <el-option :label="metaAddress" :value="metaAddress" />
                                </el-select>
                                <span class="text-2xl text-gray-400 self-end pb-2">/</span>
                            </div>
                        </label>
                    </el-form-item>
                    <el-form-item prop="name" class="flex_form">
                        <label class="label" for="dataname">
                            Dataset name
                            <div class="flex flex-row">
                                <el-input v-model="ruleForm.name" maxlength="80" show-word-limit placeholder="New dataset name" title="Only regular alphanumeric characters, '-', '.' and '_' supported" />
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
                    <el-form-item prop="resource">
                        <el-radio-group v-model="ruleForm.resource" disabled>
                            <el-radio label="1">
                                <h5>Public</h5>
                                <p>Anyone on the internet can see this dataset. Only you (personal dataset) or members of your organization (organization dataset) can commit.</p>
                            </el-radio>
                            <el-radio label="0">
                                <h5>Private</h5>
                                <p>Only you (personal dataset) or members of your organization (organization dataset) can see and commit to this dataset.</p>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="large" @click="submitForm('ruleFormRef')">Create dataset</el-button>
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
import licenseList from '@/utils/License-list.js'
export default defineComponent({
    name: "Create Dataset",
    setup () {
        const store = useStore()
        const metaAddress = computed(() => {
            let val = store.state.metaAddress || ''
            return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`
        })
        const navLogin = computed(() => { return String(store.state.navLogin) === 'true' })
        const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
        const ruleForm = reactive({
            name: '',
            license: '',
            resource: '1',
            licenseOptions: [],
            oldOptions: []
        })
        const validateInput = (rule, value, callback) => {
            if ((/[^a-zA-Z0-9-._]/g).test(value)) {
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
            license: [
                { required: true, message: 'Please fill in this field', trigger: 'blur' }
            ]
        })
        const ruleFormRef = ref(null)
        const createLoad = ref(false)
        const system = getCurrentInstance().appContext.config.globalProperties
        const route = useRoute()
        const router = useRouter()

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
                    createLoad.value = true
                    let formData = new FormData()
                    formData.append('name', ruleForm.name)
                    formData.append('is_public', ruleForm.resource) // public:1, private:0
                    formData.append('license', ruleForm.license)
                    const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}datasets`, 'post', formData)
                    await system.$commonFun.timeout(500)
                    if (listRes && listRes.data) system.$commonFun.messageTip('success', 'Created Dataset successfully!')
                    else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Created Failed!')
                    ruleForm.name = ''
                    ruleForm.license = ''
                    router.push({ name: 'personalCenter' })
                    createLoad.value = false
                } else {
                    console.log('error submit!', fields)
                    return false
                }
            })
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
            ruleForm.licenseOptions = await licenseSelect()
            ruleForm.oldOptions = await licenseSelect()
        })
        return {
            metaAddress,
            navLogin,
            lagLogin,
            ruleFormRef,
            ruleForm,
            rules,
            createLoad,
            system,
            submitForm, licenseChange, licenseQuery, ModelChangeSelect
        }
    },
});
</script>

<style lang="scss" scoped>
#dataset {
  color: #333;
  font-size: 18px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  :deep(.dataset_body) {
    align-items: stretch;
    margin: auto;
    font-size: 14px;
    .el-col {
      position: relative;
      padding: 1rem 3% 0.5rem 0;
      .text-center {
        width: 90%;
        max-width: 600px;
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
        flex-wrap: wrap;
        width: 95%;
        max-width: 640px;
        margin: 0.5rem auto 0.2rem;
        .el-form-item {
          width: 100%;
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
              .flex-row {
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
              margin: 0.2rem 0 0;
              border-top: 1px solid #eee;
              border-bottom: 1px solid #eee;
              .el-radio {
                width: 100%;
                height: auto;
                margin: 0.2rem 0;
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
