<template>
    <div class="flex min-h-full w-full flex-col bg-sky-50">
        <main class="flex flex-1 flex-col items-center justify-center p-4">
            <h1 class="font-titillium text-center text-5xl md:text-7xl">
                Freedom Calculator
            </h1>
            <p class="mt-2 text-center text-lg font-light italic text-gray-700 md:text-2xl">
                What's your runway? If your income drops to 0 right now, how long will you last?
            </p>
            <AppCalculator class="mt-6 md:mt-8" />
        </main>

        <AppFooter />
    </div>
</template>
