<template>
    <div class="landing" :class="{'landing-app':(route.name === 'spaceDetail' && route.params.tabs === 'app')}">
        <router-view/>
    </div>
</template>
<script>
import { provide } from "vue"
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
    setup () {
        const route = useRoute()
        const router = useRouter()

        return {
            route,
            router
        }
    }
})
</script>
<style lang="scss">
@import "./assets/css/style.css";
.black-color {
  color: #000 !important;
}
.weight-6 {
  font-weight: 600;
  color: #000 !important;
}
</style>
