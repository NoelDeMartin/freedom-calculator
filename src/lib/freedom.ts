import { ref } from 'vue';

import { FIRE_TIME, MILLIONAIRE_TIME, MONTH_TIME } from '@/lib/constants';

function calculateFreedom(runway: number): Freedom {
    if (runway < MONTH_TIME) {
        return 'broke';
    }

    if (runway < FIRE_TIME) {
        return 'free';
    }

    if (runway < MILLIONAIRE_TIME) {
        return 'fire';
    }

    return 'millionaire';
}

export type Freedom = 'broke' | 'free' | 'fire' | 'millionaire';
export const freedom = ref<Freedom>();

export function updateFreedom(runway: number): void {
    freedom.value = calculateFreedom(runway);
}
