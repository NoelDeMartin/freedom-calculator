<template>
    <div
        class="bg-primary-dark rounded-[--border-radius] p-[--border-size] shadow-2xl [--border-radius:1rem] [--border-size:.5rem]"
    >
        <div class="bg-primary rounded-[calc(var(--border-radius)-var(--border-size))] p-1">
            <div class="flex min-w-[80vw] flex-col space-y-2 py-6 px-2 sm:min-w-0 sm:p-6 sm:p-10">
                <p class="flex flex-col items-center space-x-2 text-center sm:flex-row sm:text-start">
                    <label for="wealth" class="text-questions mr-0 sm:mr-4">How much do you have?</label>
                    <span
                        class="text-answers text-primary-gray mt-1 flex items-center space-x-1 font-light sm:mt-0 sm:space-x-2"
                    >
                        <NumberInput id="wealth" v-model="wealth" name="wealth" />
                        <span class="text-balance">(euros, dollars, berries, etc.)</span>
                    </span>
                </p>
                <p class="mt-4 flex flex-col items-center space-x-2 text-center sm:mt-2 sm:flex-row sm:text-start">
                    <label for="expenses" class="text-questions mr-0 sm:mr-4">How much do you spend?</label>
                    <span
                        class="text-answers text-primary-gray mt-1 flex items-center space-x-1.5 font-light sm:mt-0 sm:space-x-2"
                    >
                        <NumberInput id="expenses" v-model="expenses" name="expenses" />
                        <span>every</span>
                        <SelectInput v-model="expensesRate" name="expensesRate" :options="RATES" />
                    </span>
                </p>
                <p class="mt-4 flex flex-col items-center space-x-2 text-center sm:mt-2 sm:flex-row sm:text-start">
                    <label for="income" class="text-questions mr-0 sm:mr-4">How much do you earn?</label>
                    <span
                        class="text-answers text-primary-gray mt-1 flex items-center space-x-1.5 font-light sm:mt-0 sm:space-x-2"
                    >
                        <NumberInput id="income" v-model="income" name="income" />
                        <span>every</span>
                        <SelectInput v-model="incomeRate" name="incomeRate" :options="RATES" />
                    </span>
                </p>
            </div>
            <div
                class="overflow-hidden will-change-[height] motion-reduce:transition-none"
                :class="{
                    'transition-[height]': ready,
                    'h-0': !showResult,
                    'h-24': showResult && !showFIRE,
                    'h-32': showResult && showFIRE,
                }"
                aria-live="polite"
            >
                <div
                    ref="$result"
                    class="group relative flex items-center justify-center rounded-[calc(var(--border-radius)-var(--border-size)-.25rem)] bg-white p-2 text-2xl sm:py-8"
                    :class="{
                        'h-24': !showFIRE,
                        'h-32': showFIRE,
                    }"
                    :aria-hidden="showResult ? undefined : true"
                >
                    <div class="text-center">
                        <p
                            class="text-result flex flex-col text-center font-light transition-transform motion-reduce:transition-none sm:flex-row sm:justify-center"
                        >
                            <template v-if="timeLeft < DAY_TIME">
                                <span v-if="earning">Congratulations, you can retire <strong class="font-medium">today</strong>!</span>
                                <span v-else>Sorry, you are broke</span>
                            </template>
                            <template v-else-if="renderedDeadline">
                                <span v-if="earning" class="mr-1.5">You can retire on</span>
                                <span v-else class="mr-1.5">You are free until</span>
                                <strong class="font-medium">
                                    {{ renderedDeadline }}
                                </strong>
                            </template>
                            <template v-else>
                                <span class="mr-1.5">You are free</span>
                                <strong class="font-medium">forever</strong>
                            </template>
                        </p>
                        <p
                            v-if="showWealthToScale"
                            class="text-fire text-primary-gray mt-0.5 opacity-50 focus-within:opacity-100 has-[a:hover]:opacity-100"
                        >
                            (congrats on saving so much, but
                            <a
                                href="https://eattherichtextformat.github.io/1-pixel-wealth/"
                                target="_blank"
                                class="clickable-target underline hover:text-sky-900 focus-visible:bg-sky-100 focus-visible:text-sky-900 focus-visible:decoration-sky-400 focus-visible:decoration-2 focus-visible:outline-0"
                            >you've still got a long way to go</a>)
                        </p>
                        <p
                            v-else-if="showFIRE"
                            class="text-fire text-primary-gray mt-0.5 opacity-50 focus-within:opacity-100 has-[a:hover]:opacity-100"
                        >
                            <span v-if="earning">
                                <a
                                    href="https://en.wikipedia.org/wiki/FIRE_movement"
                                    target="_blank"
                                    class="clickable-target underline hover:text-sky-900 focus-visible:bg-sky-100 focus-visible:text-sky-900 focus-visible:decoration-sky-400 focus-visible:decoration-2 focus-visible:outline-0"
                                >learn how</a>
                            </span>
                            <span v-else>
                                (or
                                <a
                                    href="https://en.wikipedia.org/wiki/FIRE_movement"
                                    target="_blank"
                                    class="clickable-target underline hover:text-sky-900 focus-visible:bg-sky-100 focus-visible:text-sky-900 focus-visible:decoration-sky-400 focus-visible:decoration-2 focus-visible:outline-0"
                                >maybe forever</a>)
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { after, debounce, getLocationQueryParameters } from '@noeldemartin/utils';
import { computed, onMounted, ref, watchEffect } from 'vue';

import { DAY_TIME, FIRE_TIME, JEFF_WEALTH, MILLIONAIRE_TIME } from '@/lib/constants';
import { updateFreedom } from '@/lib/freedom';

const RATES = ['month', 'week', 'day'];
const RATES_DAYS: Partial<Record<string, number>> = {
    month: 30,
    week: 7,
};

const $result = ref<HTMLElement>();
const ready = ref(false);
const initialized = ref(false);
const initialize = debounce(() => (initialized.value = true), 600);
const wealth = ref(0);
const expenses = ref(0);
const income = ref(0);
const expensesRate = ref(RATES[0]);
const incomeRate = ref(RATES[0]);
const dailyBurn = computed(() => expenses.value / (RATES_DAYS[expensesRate.value] ?? 1));
const dailyGain = computed(() => income.value / (RATES_DAYS[incomeRate.value] ?? 1));
const dailyBalance = computed(() => dailyGain.value - dailyBurn.value);
const earning = computed(() => dailyBalance.value > 0);
const deadline = computed(() => {
    // TODO keep into account savings
    // TODO daily balance === 0
    const daysLeft = earning.value
        ? (FIRE_TIME - (wealth.value * DAY_TIME) / dailyBurn.value) /
          ((dailyBalance.value / dailyBurn.value) * DAY_TIME)
        : wealth.value / -dailyBalance.value;

    if (isNaN(daysLeft) || daysLeft === Infinity) {
        return;
    }

    const date = new Date(Date.now() + DAY_TIME * daysLeft);

    return isNaN(date.getTime()) ? null : date;
});
const timeLeft = computed(() => (deadline.value?.getTime() ?? Infinity) - Date.now());
const renderedDeadline = computed(() =>
    deadline.value?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }));
const showResult = computed(() => initialized.value && !!$result.value);
const showFIRE = computed(
    () => earning.value || (wealth.value < JEFF_WEALTH && timeLeft.value > FIRE_TIME && !!renderedDeadline.value),
);
const showWealthToScale = computed(
    () => wealth.value < JEFF_WEALTH && timeLeft.value > MILLIONAIRE_TIME && !!renderedDeadline.value,
);

watchEffect(() => {
    if (initialized.value || (wealth.value === 0 && income.value === 0) || expenses.value === 0) {
        return;
    }

    initialize();
});

watchEffect(() => {
    if (!initialized.value) {
        return;
    }

    updateFreedom(timeLeft.value, earning.value);
});

onMounted(async () => {
    const params = getLocationQueryParameters();

    wealth.value = parseInt(params.wealth ?? wealth.value.toString());
    expenses.value = parseInt(params.expenses ?? expenses.value.toString());
    expensesRate.value = params['expenses-rate'] ?? expensesRate.value;
    initialized.value = 'expenses' in params && ('wealth' in params || 'income' in params);

    // Wait for result to render without height transition.
    await after({ seconds: 1 });

    ready.value = true;
});
</script>
