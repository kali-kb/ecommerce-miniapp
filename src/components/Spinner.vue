<template>
    <div class="spinner" v-if="loading">
        <div class="loader"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    loading: {
        type: Boolean,
        required: true,
    },
});
</script>

<style scoped>
.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100vh; */
    /* Full height for centering */
}

.loader {
    border: 2px solid darkgray;
    /* Light grey */
    border-top: 2px solid #fdfdfd;
    /* Blue */
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 500ms linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>