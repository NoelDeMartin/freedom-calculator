<template>
    <div class="relative inline py-1 px-2 pr-3 transition-[padding] focus-within:pr-6 motion-reduce:transition-none">
        <span class="invisible" aria-hidden="true">{{ model }}</span>
        <input
            v-model="model"
            :name
            type="number"
            class="absolute inset-0 rounded border border-dashed border-black/50 bg-white/50 pl-2"
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
input[type='number']:not(:focus) {
    appearance: textfield;
}

input[type='number']:not(:focus)::-webkit-outer-spin-button,
input[type='number']:not(:focus)::-webkit-inner-spin-button {
    appearance: none;
}
</style>
