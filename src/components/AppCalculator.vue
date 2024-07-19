<template>
    <div class="rounded-lg bg-gray-200 p-2">
        <div class="flex flex-col space-y-2 p-8">
            <p class="space-x-1">
                <span class="mr-2 text-xl">How much do you have?</span>
                <NumberInput v-model="savings" name="savings" class="text-base font-light" />
                <span class="text-base font-light">(euros, dollars, berries, etc.)</span>
            </p>
            <p class="space-x-1">
                <span class="mr-2 text-xl">How much do you spend?</span>
                <NumberInput v-model="expenses" name="expenses" class="text-base font-light" />
                <span class="text-base font-light">every</span>
                <select
                    v-model="expensesRate"
                    name="expensesRate"
                    class="rounded border border-dashed border-black/50 bg-white/50 py-1 px-2"
                >
                    <option v-for="rate of EXPENSES_RATES" :key="rate" :value="rate">
                        {{ rate }}
                    </option>
                </select>
            </p>
        </div>

        <div
            class="overflow-hidden transition-[height] motion-reduce:transition-none"
            :style="`height: ${resultHeight}px`"
        >
            <div
                ref="$result"
                class="flex items-center justify-center rounded bg-white py-8 px-2 text-2xl"
                aria-live="polite"
            >
                <p v-if="deadline" class="font-light">
                    You are free until
                    <strong class="font-medium">
                        {{
                            deadline.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                        }}
                    </strong>
                </p>
                <p v-else class="font-light">
                    You are free <strong class="font-medium">forever</strong>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const EXPENSES_RATES = ['month', 'week', 'day'];
const EXPENSES_RATES_DAYS: Partial<Record<string, number>> = {
    month: 30,
    week: 7,
};

const $result = ref<HTMLElement>();
const savings = ref(0);
const expenses = ref(0);
const expensesRate = ref(EXPENSES_RATES[0]);
const deadline = computed(() => {
    const dailyBurn = expenses.value / (EXPENSES_RATES_DAYS[expensesRate.value] ?? 1);
    const daysLeft = savings.value / dailyBurn;

    if (isNaN(daysLeft) || daysLeft === Infinity) {
        return;
    }

    const date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * daysLeft);

    return isNaN(date.getTime()) ? null : date;
});
const resultHeight = computed(() => {
    if (savings.value === 0 || expenses.value === 0 || !$result.value) {
        return 0;
    }

    return $result.value.clientHeight;
});
</script>
