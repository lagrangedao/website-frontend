<template>
  <div class="pricing_body">
    <div class="pricing-cont">
      <h1 class="text_h3">Pricing</h1>
      <h2 class="text_h1">The simplest way to access compute for AI</h2>
      <h4 class="text_h2">Users and organizations already use the Hub as a collaboration platform, <br />we’re making it easy to seamlessly and scalably launch ML compute directly from the Hub.</h4>
      <el-row class="bid flex-row">
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="logo-style flex-row">
                  <img src="@/assets/images/icons/logo_lagrange.png" alt=""> Lagrange
                </div>
                <p>Collaborate on Machine Learning</p>
              </div>
            </template>
            <div class="grid-content">
              <div class="introduce" v-for="(o, oIndex) in introduce.free" :key="oIndex">
                <div class="cont flex-row">
                  <el-icon>
                    <Check />
                  </el-icon>
                  {{o.title}}
                </div>
              </div>
              <div class="price">
                <div class="tit">Forever</div>
                <b>Free</b>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="logo-style flex-row">
                  <span class="pro">PRO</span> Pro Account
                </div>
                <p>Show your support for the best ML community</p>
              </div>
            </template>
            <div class="grid-content">
              <div class="introduce" v-for="(o, oIndex) in introduce.pro" :key="oIndex">
                <div class="cont flex-row">
                  <el-icon>
                    <Check />
                  </el-icon>
                  {{o.title}}
                </div>
              </div>
              <div class="price">
                <div class="tit">Subscribe for</div>
                <b>$9</b> /month
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="pricing-space">
      <div class="top_text">
        <h2 class=" flex-row">Spaces Hardware
          <span>Starting at $0</span>
        </h2>
        <div class="space flex-row">
          <p>Spaces are one of the most popular ways to share ML applications and demos with the world.
            <br /> Upgrade your Spaces with our selection of custom on-demand hardware:</p>
          <router-link to="/spaces" class=" flex-row">
            <el-icon>
              <Right />
            </el-icon>
            Get started with Spaces
          </router-link>
        </div>
      </div>
      <el-table v-loading="machinesLoad" :data="hardwareOptions" :table-layout="'fixed'" stripe style="width: 100%">
        <el-table-column prop="hardware_name" label="Hardware Name" min-width="120">
          <template #default="scope">
            <span>{{scope.row.hardware_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hardware_description" label="Hardware Description" min-width="120" />
        <el-table-column prop="hardware_type" label="Type" />
        <el-table-column prop="hardware_status" label="Status">
          <template #default="scope">
            <span class="capitalize" :style="{'color': scope.row.hardware_status === 'available' ? '#4caf50': '#E91E63'}">{{scope.row.hardware_status || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hardware_price" label="Rrice" align="right">
          <template #default="scope">
            <span>{{scope.row.hardware_price || '-'}} LAG per hour</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, onActivated, onDeactivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import {
  Check, Right
} from '@element-plus/icons-vue'
export default defineComponent({
  name: 'Pricing',
  components: {
    Check, Right
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const introduce = reactive({
      free: [
        {
          title: 'Host unlimited models, datasets, and Spaces'
        },
        {
          title: 'Create unlimited orgs and private repos'
        },
        {
          title: 'Access the latest ML tools and open source'
        },
        {
          title: 'Community support'
        }
      ],
      pro: [
        {
          title: 'Get a PRO badge on your profile'
        },
        {
          title: 'Early access to new features'
        },
        {
          title: 'Higher tier for the Free Inference API'
        },
        {
          title: 'Higher tier for AutoTrain'
        },
      ]
    })
    const machinesLoad = ref(false)
    const hardwareOptions = ref([])
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    async function listArray (arrayList) {
      let listArr = [
        {
          label: 'CPU',
          list: []
        },
        {
          label: 'GPU',
          list: []
        }
      ]
      // arrayList.sort((a, b) => a['hardware_name'].localeCompare(b['hardware_name']))
      arrayList.forEach(async hard => {
        hard.regionOption = await regionList(hard.region)
        hard.regionValue = hard.region && hard.region[0] ? hard.region[0] : ''
        if (hard.hardware_type.toLowerCase() === 'cpu') listArr[0].list.push(hard)
        else listArr[1].list.push(hard)
      })
      return listArr
    }
    async function init () {
      machinesLoad.value = true
      const machinesRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/machines`, 'get')
      if (machinesRes && machinesRes.status === 'success') hardwareOptions.value = machinesRes.data.hardware || []
      else if (machinesRes.message) system.$commonFun.messageTip('error', machinesRes.message)
      machinesLoad.value = false
    }
    onMounted(() => { })
    onActivated(() => init())
    return {
      metaAddress,
      introduce,
      machinesLoad,
      hardwareOptions,
      system
    }
  }
})
</script>

<style scoped lang="scss">
.pricing_body {
  position: relative;
  width: 100%;
  // max-width: 1440px;
  min-width: 300px;
  margin: 0 auto 0.1rem;
  padding: 0.8rem 0;
  background-color: #fff;
  font-family: "Helvetica-light";
  font-size: 16px;
  word-break: break-word;
  color: #010102;
  line-height: 1.3;
  text-align: left;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
  @media screen and (max-width: 992px) {
    padding: 0.8rem 0 0.25rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
  @media screen and (max-width: 441px) {
    padding: 0.3rem 0;
  }
  .pricing-cont {
    padding: 0 0 0.5rem;
    background: url(../../../assets/images/dashboard/bg-pricing.png) no-repeat;
    background-size: cover;
    background-position: 50%;
    border-bottom: 1px solid rgb(243, 244, 246);
    @media screen and (max-width: 768px) {
      padding: 0 0.2rem 0.5rem;
    }
    .text_h3 {
      font-size: 0.2rem;
      font-weight: 100;
      text-align: center;
      color: #3e3e3e;
    }
    .text_h1 {
      padding: 0.1rem 0 0.2rem;
      font-family: "Helvetica-Bold";
      font-size: 0.4rem;
      font-weight: bold;
      text-align: center;
      @media screen and (max-width: 768px) {
        font-size: 0.34rem;
      }
      @media screen and (max-width: 441px) {
        font-size: 0.28rem;
      }
    }
    .text_h2,
    .contact {
      display: block;
      max-width: 800px;
      margin: auto;
      font-family: inherit;
      font-size: 0.18rem;
      font-weight: 500;
      text-align: center;
      color: #797979;
      line-height: 1.5;
      @media screen and (max-width: 768px) {
        font-size: 15px;
      }
      &.contact {
        padding: 0;
      }
    }
    :deep(.bid) {
      align-items: stretch;
      flex-wrap: wrap;
      width: 95%;
      max-width: 1140px;
      margin: 0.5rem auto 0;
      .el-col {
        padding: 0.5rem;
        @media screen and (max-width: 768px) {
          padding: 0.3rem;
        }
        @media screen and (max-width: 600px) {
          padding: 0.2rem 0;
        }
        .el-card {
          border-color: rgb(243, 244, 246);
          border-radius: 0.2rem;
          text-align: left;
          // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          .el-card__header {
            padding: 0.25rem;
            border-color: rgb(243, 244, 246);
            .logo-style {
              margin: 0 0 0.15rem;
              font-size: 0.224rem;
              font-weight: bold;
              img {
                width: 28px;
                height: 28px;
                margin: 0 0.12rem 0 0;
              }
              .pro {
                padding: 2px 0.1rem;
                margin: 0 0.12rem 0 0;
                background-image: linear-gradient(
                  to bottom right,
                  #f9a8d4,
                  #a7f3d0,
                  #fde68a
                );
                font-family: "Helvetica-Bold";
                font-size: 0.18rem;
                border: 1px solid rgba(229, 231, 235, 1);
                border-radius: 0.08rem;
                color: #000;
                box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1),
                  0 4px 6px -4px rgba(16, 185, 129, 0.1);
                transform: translate(0, 0) rotate(0) skewX(-12deg) skewY(0)
                  scaleX(1) scaleY(1);
              }
            }
            p {
              font-size: 0.18rem;
              color: rgb(156, 163, 175);
            }
          }
          .el-card__body {
            padding: 0.25rem;
            .introduce {
              padding: 0.1rem 0;
              .cont {
                font-size: 0.18rem;
                line-height: 1.3;
                i {
                  display: block;
                  width: 20px;
                  height: 20px;
                  margin-right: 0.12rem;
                  font-size: 20px;
                  color: rgba(156, 163, 175, 0.7);
                }
              }
            }
            .price {
              margin: 0.4rem 0 0;
              font-size: 0.18rem;
              color: rgb(156, 163, 175);
              .tit {
                font-size: 14px;
                line-height: 2;
              }
              b {
                margin: 0 0.07rem 0 0;
                font-size: 0.3rem;
                color: #000;
              }
            }
          }
        }
      }
    }
  }
  .pricing-space {
    width: 90%;
    max-width: 1140px;
    padding: 0.5rem 0 0;
    margin: 0.5rem auto 0;
    @media screen and (max-width: 768px) {
      padding: 0.3rem 0 0;
    }
    @media screen and (max-width: 600px) {
      padding: 0;
    }
    .top_text {
      h2 {
        padding: 0 0 0 0.6rem;
        background: url(../../../assets/images/icons/icon_15.png) no-repeat left
          center;
        background-size: auto 100%;
        font-family: "Helvetica-Bold";
        font-size: 0.3rem;
        font-weight: bold;
        color: #000;
        text-align: left;
        @media screen and (max-width: 441px) {
          padding: 0 0 0 0.65rem;
          font-size: 0.24rem;
        }
        span {
          padding: 3px 0.08rem;
          margin: 0 0 0 0.16rem;
          background-color: rgba(239, 239, 239, 0.44);
          font-family: "Helvetica-light";
          font-size: 0.16rem;
          font-weight: 100;
          border-radius: 0.08rem;
          color: #666;
        }
      }
      .space {
        justify-content: space-between;
        margin: 0.3rem 0;
        @media screen and (max-width: 768px) {
          flex-wrap: wrap;
        }
        p {
          font-size: 0.18rem;
          color: #9ca3b1;
          line-height: 1.5;
        }
        a {
          padding: 0.08rem 0.12rem;
          margin: 0.15rem 0;
          background-color: rgba(239, 239, 239, 0.44);
          font-family: "Helvetica-light";
          font-size: 0.16rem;
          font-weight: 100;
          border-radius: 0.08rem;
          color: #666;
          i {
            margin: 0 0.1rem 0 0;
          }
          &:hover {
            background-color: rgba(239, 239, 239, 0.84);
          }
        }
      }
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
            .capitalize {
              white-space: nowrap;
              text-transform: capitalize;
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
