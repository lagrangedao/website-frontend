<template>
  <div class="netchange-pop">
    <el-dialog v-model="props.networkC" title="Please switch to our supported network environment. Network Env List:" :close-on-click-modal="false" :show-close="true" custom-class="net_body" @close="beforeClose">
      <div class="upload_form">
        <button class="listCont" v-for="(netItem, index) in props.netEnv" :key="index" @click="mainnetChange(netItem.id)">
          <div class="ePHqjy">
            <div class="jaQBhE">
              <div class="left">
                <div class="fHDDin">
                  <img :src="metamaskImg">
                </div>
                <div id="chain_list_name_1" class="cMfoPw">
                  <div class="dXIEwo">
                    <!-- <div class="feVFfA">
                      <div class="bmDlFW">
                        <div></div>
                      </div>
                    </div> -->
                    {{netItem.name}}
                  </div>
                </div>
                <div id="chain_list_url_1" class="dqwsCT">
                  <input id="chain_list_input_1" class="bZSSTA" value="https://ethmainnet.anyswap.exchange"></div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'Change Network',
  components: {},
  props: {
    networkC: { type: Boolean, default: false },
    netEnv: { type: Array, default: [] }
  },
  setup (props, context) {
    const store = useStore()
    const metaAddress = computed(() => store.state.metaAddress)
    const lagLogin = computed(() => { return String(store.state.lagLogin) === 'true' })
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const metamaskImg = require('@/assets/images/icons/metamask.png')

    function beforeClose () {
      context.emit('netChange', false)
    }
    function mainnetChange (id) {
      context.emit('netChange', false, id)
    }
    onMounted(() => { })
    return {
      metamaskImg,
      system,
      props,
      beforeClose, mainnetChange
    }
  }
})
</script>
<style lang="scss">
.netchange-pop .el-overlay {
  background-color: rgba(0, 0, 0, 0.2);
  .el-overlay-dialog {
    display: flex;
    .net_body {
      overflow: hidden;
      .upload_form {
        .listCont {
          background-color: #fff;
          outline: none;
          border-width: 0.01rem;
          border-style: solid;
          border-color: #f0f0f0 transparent transparent;
          border-image: initial;
          border: 0;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          justify-content: space-between;
          padding: 0px;
          margin-top: 0px;
          opacity: 1;
          width: 100% !important;
          &:hover,
          &.active {
            background-color: rgba(116, 5, 255, 0.03);
            .dXIEwo {
              text-decoration: underline;
            }
          }
          .ePHqjy {
            width: 100%;
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            align-items: center;
            .jaQBhE {
              width: 100%;
              display: flex;
              -webkit-box-pack: justify;
              justify-content: space-between;
              -webkit-box-align: center;
              align-items: center;
              .left {
                display: flex;
                -webkit-box-pack: start;
                justify-content: flex-start;
                -webkit-box-align: center;
                align-items: center;
                width: 80%;
                padding: 0.15rem 0.6rem;
                .fHDDin {
                  display: flex;
                  flex-flow: column nowrap;
                  -webkit-box-align: center;
                  align-items: center;
                  -webkit-box-pack: center;
                  justify-content: center;
                  margin-right: 0.15rem;
                  width: 26px;
                  height: 26px;
                  img {
                    width: 26px;
                    height: 26px;
                  }
                }
                .cMfoPw {
                  display: flex;
                  flex-flow: column nowrap;
                  -webkit-box-pack: center;
                  justify-content: center;
                  height: 100%;
                  width: 100%;
                  .dXIEwo {
                    display: flex;
                    flex-flow: row nowrap;
                    color: #333;
                    font-size: 0.17rem;
                    font-weight: 500;
                    .feVFfA {
                      color: rgb(39, 174, 96);
                      display: flex;
                      -webkit-box-pack: center;
                      justify-content: center;
                      -webkit-box-align: center;
                      align-items: center;
                      .bmDlFW {
                        display: flex;
                        flex-flow: row nowrap;
                        -webkit-box-pack: center;
                        justify-content: center;
                        -webkit-box-align: center;
                        align-items: center;
                        &:first-child {
                          height: 8px;
                          width: 8px;
                          margin-right: 8px;
                          background-color: rgb(39, 174, 96);
                          border-radius: 50%;
                        }
                      }
                    }
                  }
                }
                .dqwsCT {
                  flex-flow: column nowrap;
                  -webkit-box-pack: center;
                  justify-content: center;
                  height: 100%;
                  width: 100%;
                  display: none;
                  .bZSSTA {
                    outline: none;
                    border-top: none;
                    border-right: none;
                    border-left: none;
                    border-image: initial;
                    flex: 1 1 auto;
                    height: 45px;
                    width: 100%;
                    background-color: transparent;
                    border-bottom: 0.0625rem solid rgb(92, 103, 125);
                    color: rgb(255, 255, 255);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1;
                    letter-spacing: -0.0625rem;
                    padding: 8px 0.75rem;
                  }
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

