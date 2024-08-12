<template>
    <div class="relative inline-block h-8 min-w-8 pr-3 pl-2 sm:h-12 sm:min-w-12 sm:pr-4 sm:pl-3">
        <span class="invisible" aria-hidden="true">{{ rawValue }}</span>
        <input
            :value="rawValue"
            :name
            type="number"
            class="absolute inset-0 rounded-full border-0 bg-white text-center focus:bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-0 focus:ring-inset"
            @input="update"
        >
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    name: {
        type: String,
        default: null,
    },
    modelValue: {
        type: Number,
        default: null,
    },
});

let emittingUpdate = false;
const rawValue = ref(props.modelValue.toString());

function update(event: Event) {
    const $input = event.target as HTMLInputElement;

    if (isNaN($input.valueAsNumber)) {
        updateValue('0', 0);

        return;
    }

    updateValue($input.value, $input.valueAsNumber);
}

function updateValue(raw: string, asNumber: number): void {
    emittingUpdate = true;

    rawValue.value = raw;
    emit('update:modelValue', asNumber);

    nextTick(() => (emittingUpdate = false));
}

watchEffect(() => {
    if (emittingUpdate) {
        return;
    }

    rawValue.value = props.modelValue.toString();
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
