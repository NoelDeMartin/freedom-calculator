<template>
    <select
        v-model="model"
        class="h-8 appearance-none rounded-full border-0 bg-white pr-6 pl-2 focus:bg-sky-50 focus:ring-2 focus:ring-sky-400 focus:outline-0 focus:ring-inset sm:h-12 sm:pr-10 sm:pl-3.5"
    >
        <option v-for="option of options" :key="option" :value="option">
            {{ option }}
        </option>
    </select>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    options: {
        type: Array as PropType<string[]>,
        required: true,
    },
});

const model = defineModel<string>();
</script>

<style>
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.25rem center;
    background-repeat: no-repeat;
    background-size: 1.25em 1.25em;
}

@media (width >= 50rem) {
    select {
        background-position: right 0.5rem center;
    }
}
</style>
