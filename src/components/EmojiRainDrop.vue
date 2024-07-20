<template>
    <component
        :is="icon"
        class="absolute top-0 size-8 transition-transform ease-in will-change-transform motion-reduce:transition-none"
        :style="style"
    />
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';
import { computed, onMounted, ref } from 'vue';
import type { Component, PropType } from 'vue';

defineProps({ icon: { type: Object as PropType<Component>, required: true } });

const SIZE = 32;
const left = window.innerWidth * Math.random();
const duration = 2 + 4 * Math.random();
const scale = 1 + 5 * Math.random();
const emit = defineEmits(['dropped']);
const translate = ref(-SIZE * scale);
const style = computed(() =>
    [
        `left: ${left}px;`,
        `transform: translateY(${translate.value}px) scale(${scale});`,
        `transition-duration: ${duration}s;`,
    ].join(''));

onMounted(async () => {
    await after({ ms: 100 });

    translate.value = window.innerHeight + SIZE * 6;

    await after({ seconds: duration });

    emit('dropped');
});
</script>
