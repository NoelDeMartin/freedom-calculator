<template>
    <div class="flex min-h-full w-full flex-col bg-sky-50">
        <main class="flex flex-1 flex-col items-center justify-center p-4">
            <h1 class="font-titillium text-center text-7xl">
                Freedom Calculator
            </h1>
            <p class="mt-2 text-center text-2xl font-light italic text-gray-700">
                What's your runway? If your income drops to 0 right now, how long will you last?
            </p>
            <AppCalculator class="mt-8" />
        </main>

        <AppFooter />
    </div>
</template>
