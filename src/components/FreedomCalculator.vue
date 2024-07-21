<template>
    <div
        class="bg-primary-dark rounded-[--border-radius] p-[--border-size] shadow-2xl [--border-radius:1rem] [--border-size:.5rem]"
    >
        <div class="bg-primary rounded-[calc(var(--border-radius)-var(--border-size))] p-1">
            <div class="flex min-w-[80vw] flex-col space-y-2 py-6 px-2 sm:min-w-0 sm:p-6 sm:p-10">
                <p class="flex flex-col items-center space-x-2 text-center sm:flex-row sm:text-start">
                    <span class="text-questions mr-0 sm:mr-4">How much do you have?</span>
                    <span
                        class="text-answers text-primary-gray mt-1 flex items-center space-x-1 font-light sm:mt-0 sm:space-x-2"
                    >
                        <NumberInput v-model="wealth" name="wealth" />
                        <span>(euros, dollars, berries, etc.)</span>
                    </span>
                </p>
                <p class="mt-4 flex flex-col items-center space-x-2 text-center sm:mt-2 sm:flex-row sm:text-start">
                    <span class="text-questions mr-0 sm:mr-4">How much do you spend?</span>
                    <span
                        class="text-answers text-primary-gray mt-1 flex items-center space-x-1.5 font-light sm:mt-0 sm:space-x-2"
                    >
                        <NumberInput v-model="expenses" name="expenses" />
                        <span>every</span>
                        <SelectInput v-model="expensesRate" name="expensesRate" :options="EXPENSES_RATES" />
                    </span>
                </p>
            </div>
            <div
                class="overflow-hidden will-change-[height] motion-reduce:transition-none"
                :class="{ 'transition-[height]': ready, 'h-0': !showResult, 'h-24': showResult }"
                aria-live="polite"
            >
                <div
                    ref="$result"
                    class="group has-[a:focus]:bg-primary-light has-[a:hover]:bg-primary-light relative flex h-24 items-center justify-center rounded-[calc(var(--border-radius)-var(--border-size)-.25rem)] bg-white p-2 text-2xl sm:py-8"
                    :aria-hidden="showResult ? undefined : true"
                >
                    <p
                        class="text-result flex flex-col text-center font-light transition-transform motion-reduce:transition-none sm:flex-row sm:group-has-[a:focus]:scale-125 sm:group-has-[a:hover]:scale-125"
                    >
                        <template v-if="runway < DAY_TIME">
                            Sorry, you are broke
                        </template>
                        <template v-else-if="renderedDeadline">
                            <span class="mr-1.5">You are free until</span>
                            <strong class="font-medium">
                                {{ renderedDeadline }}
                            </strong>
                        </template>
                        <template v-else>
                            <span class="mr-1.5">You are free</span>
                            <strong class="font-medium">forever</strong>
                        </template>
                    </p>
                    <a
                        v-if="showResult"
                        :href="permalink"
                        target="_blank"
                        class="clickable-target text-primary-gray text-footers !absolute right-0.5 bottom-0.5 rounded-full py-0.5 px-1 opacity-50 hover:opacity-100 focus:opacity-100 focus-visible:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-0 focus-visible:ring-inset sm:right-1 sm:bottom-1 sm:py-1 sm:px-3"
                    >
                        Save this result
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { after, debounce, getLocationQueryParameters } from '@noeldemartin/utils';
import { computed, onMounted, ref, watchEffect } from 'vue';

import { DAY_TIME } from '@/lib/time';
import { updateFreedom } from '@/lib/freedom';

const EXPENSES_RATES = ['month', 'week', 'day'];
const EXPENSES_RATES_DAYS: Partial<Record<string, number>> = {
    month: 30,
    week: 7,
};

const $result = ref<HTMLElement>();
const ready = ref(false);
const initialized = ref(false);
const initialize = debounce(() => (initialized.value = true), 600);
const wealth = ref(0);
const expenses = ref(0);
const expensesRate = ref(EXPENSES_RATES[0]);
const deadline = computed(() => {
    const dailyBurn = expenses.value / (EXPENSES_RATES_DAYS[expensesRate.value] ?? 1);
    const daysLeft = wealth.value / dailyBurn;

    if (isNaN(daysLeft) || daysLeft === Infinity) {
        return;
    }

    const date = new Date(Date.now() + DAY_TIME * daysLeft);

    return isNaN(date.getTime()) ? null : date;
});
const runway = computed(() => (deadline.value?.getTime() ?? Infinity) - Date.now());
const renderedDeadline = computed(() =>
    deadline.value?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
const showResult = computed(() => initialized.value && !!$result.value);
const permalink = computed(() => {
    const url = new URL(location.href);

    url.searchParams.set('wealth', wealth.value.toString());
    url.searchParams.set('expenses', expenses.value.toString());
    url.searchParams.set('expenses-rate', expensesRate.value);

    return url.href;
});

watchEffect(() => {
    if (initialized.value || wealth.value === 0 || expenses.value === 0) {
        return;
    }

    initialize();
});

watchEffect(() => {
    if (!initialized.value) {
        return;
    }

    updateFreedom(runway.value);
});

onMounted(async () => {
    const params = getLocationQueryParameters();

    wealth.value = parseInt(params.wealth ?? wealth.value.toString());
    expenses.value = parseInt(params.expenses ?? expenses.value.toString());
    expensesRate.value = params['expenses-rate'] ?? expensesRate.value;
    initialized.value = 'wealth' in params && 'expenses' in params;

    // Wait for result to render without height transition.
    await after({ seconds: 1 });

    ready.value = true;
});
</script>
