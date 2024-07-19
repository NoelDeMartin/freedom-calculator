<template>
    <div class="rounded-lg bg-gray-200 p-2">
        <div class="flex flex-col space-y-2 p-8">
            <p class="space-x-1 text-center md:text-start">
                <span class="mr-0 text-xl md:mr-2">How much do you have?</span>
                <br class="mb-3 md:hidden">
                <NumberInput v-model="wealth" name="wealth" class="text-base font-light" />
                <span class="text-base font-light text-gray-500">(euros, dollars, berries, etc.)</span>
            </p>
            <p class="mt-2 space-x-1 text-center md:text-start">
                <span class="mr-0 text-xl md:mr-2">How much do you spend?</span>
                <br class="mb-3 md:hidden">
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
            class="overflow-hidden motion-reduce:transition-none"
            :style="`height: ${resultHeight}px`"
            :class="{ 'transition-[height]': ready }"
            aria-live="polite"
        >
            <div
                ref="$result"
                class="relative flex items-center justify-center rounded bg-white py-8 px-2 text-2xl"
                :aria-hidden="resultHeight ? undefined : true"
            >
                <p v-if="deadline" class="text-center font-light">
                    <span class="md:mr-1.5">You are free until</span>
                    <br class="md:hidden">
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
                <p v-else class="text-center font-light">
                    <span class="md:mr-1.5">You are free</span>
                    <br class="md:hidden">
                    <strong class="font-medium">forever</strong>
                </p>
                <a
                    v-if="resultHeight"
                    :href="permalink"
                    target="_blank"
                    class="absolute right-2 bottom-1 text-xs text-gray-700 opacity-50 hover:underline hover:opacity-100"
                >
                    Save this result
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { after, getLocationQueryParameters } from '@noeldemartin/utils';
import { computed, onMounted, ref } from 'vue';

const EXPENSES_RATES = ['month', 'week', 'day'];
const EXPENSES_RATES_DAYS: Partial<Record<string, number>> = {
    month: 30,
    week: 7,
};

const $result = ref<HTMLElement>();
const ready = ref(false);
const wealth = ref(0);
const expenses = ref(0);
const expensesRate = ref(EXPENSES_RATES[0]);
const deadline = computed(() => {
    const dailyBurn = expenses.value / (EXPENSES_RATES_DAYS[expensesRate.value] ?? 1);
    const daysLeft = wealth.value / dailyBurn;

    if (isNaN(daysLeft) || daysLeft === Infinity) {
        return;
    }

    const date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * daysLeft);

    return isNaN(date.getTime()) ? null : date;
});
const resultHeight = computed(() => {
    if (wealth.value === 0 || expenses.value === 0 || !$result.value) {
        return 0;
    }

    return $result.value.clientHeight;
});
const permalink = computed(() => {
    const url = new URL(location.href);

    wealth.value === 0 ? url.searchParams.delete('wealth') : url.searchParams.set('wealth', wealth.value.toString());

    expenses.value === 0
        ? url.searchParams.delete('expenses')
        : url.searchParams.set('expenses', expenses.value.toString());

    url.searchParams.set('expenses-rate', expensesRate.value.toString());

    return url.href;
});

onMounted(async () => {
    const params = getLocationQueryParameters();

    wealth.value = parseInt(params.wealth ?? wealth.value.toString());
    expenses.value = parseInt(params.expenses ?? expenses.value.toString());
    expensesRate.value = params['expenses-rate'] ?? expensesRate.value;

    // Wait for result to render without height transition.
    await after({ seconds: 1 });

    ready.value = true;
});
</script>
