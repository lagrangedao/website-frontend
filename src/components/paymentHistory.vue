<template>
    <div class="payment-history">
        <div class="title">Payment history</div>
        <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%">
            <el-table-column prop="transaction_hash" label="transaction hash" />
            <el-table-column prop="chain_id" label="chain id" width="100" />
            <el-table-column prop="token" label="token" />
            <el-table-column prop="space_name" label="space name" />
            <el-table-column prop="amount" label="amount" />
            <el-table-column prop="status" label="status" width="120">
                <template #default="scope">
                    <el-button type="primary" v-if="scope.row.status === 'refundable'" plain @click="refundFun(scope.row)">Refund</el-button>
                    <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    name: 'footer_page',
    setup () {
        const store = useStore()
        const logo_small = require("@/assets/images/icons/logo_small.png")
        const system = getCurrentInstance().appContext.config.globalProperties
        const route = useRoute()
        const router = useRouter()
        const paymentData = ref([])
        const paymentLoad = ref(false)

        async function refundFun (row) {
            paymentLoad.value = true
            let formData = new FormData()
            formData.append('tx_hash', row.transaction_hash)
            formData.append('chain_id', row.chain_id)
            const refundRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/refund`, 'post', formData)
            if (!refundRes || refundRes.status !== 'success') if (refundRes.message) system.$commonFun.messageTip('error', refundRes.message)
            init()
        }
        async function init (params) {
            paymentLoad.value = true
            const paymentsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/payments`, 'get')
            if (paymentsRes && paymentsRes.status === 'success') paymentData.value = paymentsRes.data.payments || []
            else if (paymentsRes.message) system.$commonFun.messageTip('error', paymentsRes.message)
            paymentLoad.value = false
        }
        onMounted(() => { init() })
        return {
            paymentData,
            paymentLoad,
            system,
            route,
            router,
            refundFun
        }
    },
})
</script>
<style  lang="scss" scoped>
.payment-history {
  width: 96%;
  height: calc(100% - 1.2rem);
  padding: 0.6rem 0.16rem;
  max-width: 768px;
  margin: 0 auto;
  box-sizing: border-box;
  word-break: break-word;
  text-transform: capitalize;
  color: #606060;
  font-size: 14px;
  text-align: left;
  @media screen and (min-width: 1024px) {
    max-width: 1024px;
  }
  @media screen and (min-width: 1280px) {
    max-width: 1280px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1536px;
  }
  .title {
    margin: 0 0 0.4rem;
    font-weight: bold;
    font-size: 0.24rem;
    color: rgb(55, 65, 81);
  }
  :deep(.el-table) {
    border: 1px solid #e4e4e4;
    border-radius: 0.1rem;
    tr {
      th,
      td {
        padding: 0.1rem 0;
        font-size: 15px;
        color: #878c93;
        @media screen and (max-width: 1600px) {
          font-size: 13px;
        }
        @media screen and (max-width: 768px) {
          font-size: 12px;
        }
        .cell {
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.5;
          word-break: break-word;
          text-align: center;
          a {
            color: inherit;
            &:hover {
              text-decoration: underline;
            }
          }
          .el-button {
            height: auto;
            padding: 6px 0.1rem;
            background-color: transparent;
            font-family: inherit;
            border-color: #c37af9;
            border-radius: 1rem;
            line-height: 1;
            color: #c37af9;
            &:hover {
              background-color: #c37af9;
              color: #fff;
            }
          }
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        background: linear-gradient(180deg, #fefefe, #f0f0f0);
        text-transform: uppercase;
        color: #606060;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }
        @media screen and (max-width: 768px) {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
