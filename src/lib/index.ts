import { markRaw } from 'vue';
import type { Component } from 'vue';

import * as BROKE_ICONS from './icons-broke';
import * as FREE_ICONS from './icons-free';
import * as FIRE_ICONS from './icons-fire';
import * as MILLIONAIRE_ICONS from './icons-millionaire';
import type { Freedom } from './freedom';

export const ICONS: Record<Freedom, Component[]> = {
    broke: Object.values(BROKE_ICONS).map(markRaw),
    free: Object.values(FREE_ICONS).map(markRaw),
    fire: Object.values(FIRE_ICONS).map(markRaw),
    millionaire: Object.values(MILLIONAIRE_ICONS).map(markRaw),
};
