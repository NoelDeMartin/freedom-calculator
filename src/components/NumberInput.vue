<template>
    <div class="relative inline-block h-8 min-w-8 pr-3 pl-2 sm:h-12 sm:min-w-12 sm:pr-4 sm:pl-3">
        <span class="invisible" aria-hidden="true">{{ model }}</span>
        <input
            v-model="model"
            :name
            type="number"
            class="absolute inset-0 rounded-full border-0 bg-white text-center focus:bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-0 focus:ring-inset"
        >
    </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

defineProps({
    name: {
        type: String,
        default: null,
    },
});

const model = defineModel<number>();

watchEffect(() => {
    if (model.value && model.value >= 0) {
        return;
    }

    model.value = 0;
});
</script>

<style>
input[type='number'] {
    appearance: textfield;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
    appearance: none;
}
</style>
