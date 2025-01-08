import { ref } from 'vue';

import { FIRE_TIME, MILLIONAIRE_TIME, MONTH_TIME, YEAR_TIME } from '@/lib/constants';

function calculateFreedom(timeLeft: number, earning: boolean): Freedom {
    if (earning) {
        if (timeLeft < 5 * YEAR_TIME) {
            return 'fire';
        }

        return 'free';
    }

    if (timeLeft < MONTH_TIME) {
        return 'broke';
    }

    if (timeLeft < FIRE_TIME) {
        return 'free';
    }

    if (timeLeft < MILLIONAIRE_TIME) {
        return 'fire';
    }

    return 'millionaire';
}

export type Freedom = 'broke' | 'free' | 'fire' | 'millionaire';
export const freedom = ref<Freedom>();

export function updateFreedom(timeLeft: number, earning: boolean): void {
    freedom.value = calculateFreedom(timeLeft, earning);
}
