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
<style>
@import "./assets/css/style.css";
</style>
