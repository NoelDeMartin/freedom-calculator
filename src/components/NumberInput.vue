<template>
    <div class="relative inline-block h-8 min-w-8 pr-3 pl-2 sm:h-12 sm:min-w-12 sm:pr-4 sm:pl-3">
        <span class="invisible" aria-hidden="true">{{ rawValue }}</span>
        <input
            :value="rawValue"
            :name
            type="text"
            inputmode="numeric"
            class="absolute inset-0 rounded-full border-0 bg-white text-center focus:bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-0 focus:ring-inset"
            @keypress="filterNumeric"
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
const numberRegEx = /\d/;
const notNumberRegEx = /[^0-9]/g;
const numberFormat = new Intl.NumberFormat();
const rawValue = ref(props.modelValue.toString());

function filterNumeric(event: KeyboardEvent) {
    if (numberRegEx.test(event.key)) {
        return;
    }

    event.preventDefault();
}

function update(event: Event) {
    const $input = event.target as HTMLInputElement;
    const valueAsString = $input.value.replace(notNumberRegEx, '');
    const valueAsNumber = parseInt(valueAsString);

    if (isNaN(valueAsNumber)) {
        updateValue('0', 0);

        return;
    }

    if (valueAsString.startsWith('0') && valueAsString.length > 2) {
        updateValue(numberFormat.format(parseInt(`1${valueAsString}`)).slice(1), valueAsNumber);

        return;
    }

    updateValue(numberFormat.format(valueAsNumber), valueAsNumber);
}

function updateValue(asString: string, asNumber: number): void {
    emittingUpdate = true;

    rawValue.value = asString;
    emit('update:modelValue', asNumber);

    nextTick(() => (emittingUpdate = false));
}

watchEffect(() => {
    if (emittingUpdate) {
        return;
    }

    rawValue.value = numberFormat.format(props.modelValue);
});
</script>
