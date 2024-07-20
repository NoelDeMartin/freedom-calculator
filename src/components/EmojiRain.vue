<template>
    <div class="pointer-events-none fixed opacity-25">
        <EmojiRainDrop
            v-for="drop of drops"
            :key="drop.id"
            :icon="drop.icon"
            @dropped="drops.delete(drop)"
        />
    </div>
</template>

<script setup lang="ts">
import IconAlien from '~icons/twemoji/alien';
import { arrayRandomItem, clamp, uuid } from '@noeldemartin/utils';
import { markRaw, onMounted, onUnmounted, ref } from 'vue';
import type { Component } from 'vue';

import { ICONS } from '@/lib';
import { freedom } from '@/lib/freedom';

interface Drop {
    id: string;
    icon: Component;
}

let interval: number | null = null;
const drops = ref<Set<Drop>>(new Set());

onMounted(() => {
    interval = setInterval(
        () => {
            if (!freedom.value) {
                return;
            }

            drops.value.add({
                id: uuid(),
                icon:
                    Math.random() < 1 / 1000
                        ? markRaw(IconAlien)
                        : (arrayRandomItem(ICONS[freedom.value]) as Component),
            });
        },
        250 + clamp(1350 - window.innerWidth, 0, 750),
    );
});

onUnmounted(() => interval && clearInterval(interval));
</script>
