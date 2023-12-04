<template>
  <div id="payment">
    <div class="payment-history container-landing">
      <div class="title">{{paymentType.toLowerCase() === 'provider'?'provider Payment history':'user Payment history'}}</div>
      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%" v-if="paymentType.toLowerCase() !== 'provider'">
        <el-table-column prop="transaction_hash" label="transaction hash" min-width="120">
          <template #default="scope">
            <a :href="`${scope.row.url_tx}${scope.row.transaction_hash}`" target="_blank">{{scope.row.transaction_hash}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="chain_id" label="chain id" width="110" />
        <el-table-column prop="token" label="token">
          <template #default="scope">
            <!--            <span>{{scope.row.chain_id === 80001 ? 'PUSDC': 'SUSDC'}}</span>-->
            <span>USDC</span>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="refund/Denied reason" min-width="120">
          <template #default="scope">
            <span>{{scope.row.refund_reason ||scope.row.denied_reason || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="space name">
          <template #default="scope">
            <span>{{scope.row.order.space_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="amount" />
        <el-table-column prop="status" label="status" width="135">
          <template #default="scope">
            <div>
              <span v-if="scope.row.chain_id === 80001 && scope.row.order.updated_at < 1700508000 && scope.row.status.toLowerCase() === 'refundable'">Pending</span>
              <el-button type="primary" v-else-if="scope.row.status.toLowerCase() === 'accepted' || scope.row.status.toLowerCase() === 'refundable'" plain @click="refundFun(scope.row)">Refund</el-button>
              <el-button type="primary" v-else-if="scope.row.status.toLowerCase() === 'reviewable'" plain @click="reviewFun(scope.row)">Claim Review</el-button>
              <span v-else>{{scope.row.status}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%" v-else>
        <!-- <el-table-column prop="transaction_hash" label="transaction hash" min-width="120">
          <template #default="scope">
            <a :href="`${scope.row.url_tx}${scope.row.transaction_hash}`" target="_blank">{{scope.row.transaction_hash}}</a>
          </template>
        </el-table-column> -->
        <el-table-column prop="chain_id" label="chain id" width="100" />
        <el-table-column prop="amount" label="amount" />
        <el-table-column prop="status" label="status" width="120">
          <template #default="scope">
            <div>
              <el-button type="primary" v-if="scope.row.claimed === false" plain @click="refundFun(scope.row, 'claim')">Claim</el-button>
              <span v-else>Claimed</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
const ethereum = window.ethereum;
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import SpaceHardwareABI from '@/utils/abi/SpacePaymentV6.json'
import SpaceTokenABI from '@/utils/abi/SpacePaymentV6.json'
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
    const paymentType = ref(route.query.type || 'user')
    const prevType = ref(true)
    let paymentContractAddress = process.env.VUE_APP_HARDWARE_ADDRESS
    let paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceHardwareABI, paymentContractAddress)

    async function reviewFun (row) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const reviewRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}claim_review`, 'post', formData)
      if (reviewRes) {
        ElMessageBox.alert(
          `Status: ${reviewRes.status}<br />Message: ${reviewRes.message}`,
          'Review Detail',
          {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true,
            callback: (action) => {
              init()
            }
          }
        )
      }
    }
    async function refundFun (row, type) {
      if (row.chain_id.toString() !== getnetID.toString()) {
        await system.$commonFun.walletChain(Number(row.chain_id))
        return
      }
      paymentLoad.value = true
      try {
        if (type) {
          console.log('task_uuid:', row.job.uuid)
          let gasLimit = await paymentContract.methods
            .claimReward(String(row.job.uuid))
            .estimateGas({ from: store.state.metaAddress })

          const tx = await paymentContract.methods
            .claimReward(String(row.job.uuid))
            .send({ from: store.state.metaAddress, gasLimit: gasLimit })
            .on('transactionHash', async (transactionHash) => {
              console.log('claim transactionHash:', transactionHash)
              claimStatus(row, transactionHash)
            })
            .on('error', () => paymentLoad.value = false)
        } else {
          console.log('refund id:', row.transaction_hash)
          let gasLimit = await paymentContract.methods
            .claimRefund(String(row.transaction_hash))
            .estimateGas({ from: store.state.metaAddress })

          const tx = await paymentContract.methods
            .claimRefund(String(row.transaction_hash))
            .send({ from: store.state.metaAddress, gasLimit: gasLimit })
            .on('transactionHash', async (transactionHash) => {
              console.log('refund transactionHash:', transactionHash)
              refundStatus(row, transactionHash)
            })
            .on('error', () => paymentLoad.value = false)
        }
      } catch (err) {
        console.log('err', err)
        paymentLoad.value = false
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
      }
    }
    async function refundStatus (row, transactionHash) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const refundRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/refund`, 'post', formData)
      if (!refundRes || refundRes.status !== 'success') if (refundRes.message) system.$commonFun.messageTip('error', refundRes.message)
      init()
    }
    async function claimStatus (row, transactionHash) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', transactionHash)
      formData.append('chain_id', row.chain_id)
      formData.append('uuid', row.uuid)
      const claimRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/provider/payments`, 'post', formData)
      if (!claimRes || claimRes.status !== 'success') if (claimRes.message) system.$commonFun.messageTip('error', claimRes.message)
      init()
    }
    async function init (params) {
      paymentLoad.value = true
      paymentType.value = route.query.type || 'user'
      const requestURL = paymentType.value.toLowerCase() === 'provider' ? `${process.env.VUE_APP_BASEAPI}user/provider/payments` : `${process.env.VUE_APP_BASEAPI}user/space/payments`
      const paymentsRes = await system.$commonFun.sendRequest(requestURL, 'get')
      if (paymentsRes && paymentsRes.status === 'success') {
        for (let p = 0; p < paymentsRes.data.payments.length; p++) {
          let { url_tx } = await system.$commonFun.getUnit(parseInt(paymentsRes.data.payments[p].chain_id), 16)
          paymentsRes.data.payments[p].url_tx = url_tx
        }
        paymentData.value = paymentsRes.data.payments || []
      } else if (paymentsRes.message) system.$commonFun.messageTip('error', paymentsRes.message)
      paymentLoad.value = false
    }
    async function paymentEnv () {
      if (getnetID !== 80001) {
        paymentContractAddress = process.env.VUE_APP_OPSWAN_ADDRESS
        paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, paymentContractAddress)
      }
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      ethereum.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        console.log('payment')
        system.$commonFun.signOutFun()
      })
    }
    let getnetID = NaN
    onMounted(async () => {
      fn()
    })
    onActivated(async () => {
      getnetID = await system.$commonFun.web3Init.eth.net.getId()
      paymentEnv()
      init()
    })
    watch(route, (to, from) => {
      if (to.name === "paymentHistory") init()
    })
    return {
      paymentData,
      paymentLoad,
      system,
      route,
      router,
      paymentType,
      refundFun, reviewFun
    }
  },
})
</script>
<style  lang="scss" scoped>
#payment {
  width: 100%;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
  .payment-history {
    height: calc(100% - 1.2rem);
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin: 0 auto;
    box-sizing: border-box;
    word-break: break-word;
    text-transform: capitalize;
    color: #606060;
    font-size: 14px;
    text-align: left;
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
              font-size: inherit;
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
}
</style>