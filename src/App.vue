<template>
    <div class="landing">
        <router-view/>
    </div>
</template>
<script setup>
import * as echarts from "echarts";
import { provide } from "vue";
provide("echarts", echarts);
</script>
<style>
@import "./assets/css/style.css";
</style>
