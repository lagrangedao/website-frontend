<template>
  <section id="terms">
    <div class="terms_body container-landing">
      <div class="tabs">
        <router-link to="/terms_of_service" :class="{'is-active': route.name==='termsOfService'}">
          Terms of Service
        </router-link>
        <router-link to="/privacy" :class="{'is-active': route.name==='privacy'}">
          Privacy Policy
        </router-link>
        <router-link to="/content_guidelines" :class="{'is-active': route.name==='contentGuidelines'}">
          Content Policy
        </router-link>
        <router-link to="/code_of_conduct" :class="{'is-active': route.name==='codeOfConduct'}">
          Code of Conduct
        </router-link>
      </div>
      <terms-lab v-if="route.name==='termsOfService'"></terms-lab>
      <privacy-lab v-else-if="route.name==='privacy'"></privacy-lab>
      <content-guidelines v-else-if="route.name==='contentGuidelines'"></content-guidelines>
      <code-of-conduct v-else-if="route.name==='codeOfConduct'"></code-of-conduct>
    </div>
  </section>
</template>

<script>
import termsLab from './terms.vue'
import privacyLab from './privacy.vue'
import contentGuidelines from './contentGuidelines.vue'
import codeOfConduct from './codeOfConduct.vue'
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'terms',
  components: {
    termsLab, privacyLab, contentGuidelines, codeOfConduct
  },
  setup () {
    const store = useStore()
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()

    onMounted(() => { })
    return {
      route
    }
  }
})
</script>

<style lang="scss" scoped>
#terms {
  width: 100%;
  color: rgb(75, 85, 99);
  font-size: 18px;
  text-align: left;
  line-height: 1.8;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
  }
  :deep(.terms_body) {
    width: 90%;
    padding: 0.7rem 5% 1rem;
    margin: 0 auto;
    box-sizing: border-box;
    word-break: break-word;
    .title {
      margin: 0.2rem 0 0.4rem;
      font-weight: bold;
      font-size: 48px;
      color: rgb(55, 65, 81);
      @media screen and (max-width: 768px) {
        font-size: 38px;
      }
    }
    h1,
    h2,
    h3 {
      display: flex;
      margin: 0.55rem 0 0.4rem;
      font-size: 30px;
      font-weight: 500;
      @media screen and (max-width: 768px) {
        font-size: 26px;
      }
    }
    p {
      margin-bottom: 0.25rem;
      color: rgb(75, 85, 99);
    }
    ul {
      margin: 0 0 24px;
      padding: 0 0 0 40px;
      list-style-type: disc;
      li {
        margin-bottom: 12px;
        font-size: inherit;
        list-style: disc;
      }
      &.und {
        list-style: decimal;
        li {
          list-style: decimal;
        }
      }
    }
    a {
      text-decoration: underline;
      font-size: inherit;
      color: rgb(17, 24, 39);
      &:hover {
        color: #c37af9;
      }
    }
    strong {
      font-weight: 600;
      color: rgb(31, 41, 55);
    }
    .tabs {
      .el-button,
      a {
        height: auto;
        padding: 5px 13px;
        margin: 0 0.15rem 0 0;
        background-color: rgb(243, 244, 246);
        border-color: rgb(229, 231, 235);
        border-radius: 10px;
        line-height: 1.2;
        color: rgb(75, 85, 99);
        text-decoration: none;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        span {
          cursor: inherit;
        }
        &:hover {
          color: rgb(75, 85, 99);
          opacity: 0.7;
        }
        &.is-active {
          background-color: #c37af9;
          color: #fff;
        }
      }
    }
    table {
      margin-bottom: 2em;
      margin-top: 2em;
      table-layout: auto;
      text-align: left;
      width: 100%;
      tr {
        font-size: 15px;
        line-height: 1.5;
        color: rgb(17, 24, 39);
        @media screen and (max-width: 1200px) {
          font-size: 13px;
        }
        th {
          padding-bottom: 0.75em;
          padding-left: 0.75em;
          padding-right: 0.75em;
          border-bottom: 1px solid #e5e7eb;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            padding-right: 0;
          }
        }
        td {
          padding: 0.75em;
          vertical-align: text-top;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>


