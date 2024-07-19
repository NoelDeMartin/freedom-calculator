<template>
    <div
        class="rounded-[--border-radius] bg-[#353535] p-[--border-size] shadow-2xl [--border-radius:1rem] [--border-size:.5rem]"
    >
        <div class="rounded-[calc(var(--border-radius)-var(--border-size))] bg-gray-200 p-1">
            <div class="flex min-w-[80vw] flex-col space-y-2 py-4 px-2 sm:min-w-0 sm:p-6 md:p-10">
                <p class="flex flex-col items-center space-x-2 text-center sm:flex-row sm:text-start">
                    <span class="mr-0 text-base sm:mr-4">How much do you have?</span>
                    <span class="mt-2 flex items-center space-x-2 sm:mt-0">
                        <NumberInput v-model="wealth" name="wealth" class="text-sm font-light" />
                        <span class="text-sm font-light text-gray-500">(euros, dollars, berries, etc.)</span>
                    </span>
                </p>
                <p class="mt-2 flex flex-col items-center space-x-2 text-center sm:flex-row sm:text-start">
                    <span class="mr-0 text-base sm:mr-4">How much do you spend?</span>
                    <span class="mt-2 flex items-center space-x-2 sm:mt-0">
                        <NumberInput v-model="expenses" name="expenses" class="text-sm font-light" />
                        <span class="text-sm font-light">every</span>
                        <SelectInput
                            v-model="expensesRate"
                            name="expensesRate"
                            class="text-sm"
                            :options="EXPENSES_RATES"
                        />
                    </span>
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
                    class="group relative flex items-center justify-center rounded-[calc(var(--border-radius)-var(--border-size)-.25rem)] bg-white pt-4 px-2 pb-8 text-2xl has-[a:focus]:bg-sky-50 has-[a:hover]:bg-sky-50 sm:py-8"
                    :aria-hidden="resultHeight ? undefined : true"
                >
                    <p
                        class="flex flex-col text-center font-light transition-transform sm:flex-row sm:group-has-[a:focus]:scale-125 sm:group-has-[a:hover]:scale-125"
                    >
                        <template v-if="deadline">
                            <span class="mr-1.5">You are free until</span>
                            <strong class="font-medium">
                                {{ deadline }}
                            </strong>
                        </template>
                        <template v-else>
                            <span class="mr-1.5">You are free</span>
                            <strong class="font-medium">forever</strong>
                        </template>
                    </p>
                    <a
                        v-if="resultHeight"
                        :href="permalink"
                        target="_blank"
                        class="absolute right-0.5 bottom-0.5 rounded-full py-0.5 px-1 text-xs text-gray-700 opacity-50 hover:opacity-100 focus:opacity-100 focus-visible:bg-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-0 focus-visible:ring-inset sm:right-1 sm:bottom-1 sm:py-1 sm:px-3"
                    >
                        Save this result
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { after, getLocationQueryParameters } from '@noeldemartin/utils';
import { computed, onMounted, ref, watchEffect } from 'vue';

const EXPENSES_RATES = ['month', 'week', 'day'];
const EXPENSES_RATES_DAYS: Partial<Record<string, number>> = {
    month: 30,
    week: 7,
};

const $result = ref<HTMLElement>();
const ready = ref(false);
const initialized = ref(false);
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

    return isNaN(date.getTime())
        ? null
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
});
const resultHeight = computed(() => {
    if (!initialized.value || !$result.value) {
        return 0;
    }

    return $result.value.clientHeight;
});
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

    initialized.value = true;
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
