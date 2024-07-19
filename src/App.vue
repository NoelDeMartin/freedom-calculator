<template>
    <div class="flex min-h-full w-full flex-col bg-[#e9f4f4] selection:bg-sky-200">
        <main class="flex flex-1 flex-col items-center justify-center p-6">
            <h1 class="font-titillium text-center text-xl text-sky-950">
                Freedom Calculator
            </h1>
            <p class="mt-2 text-center text-sm font-light italic text-gray-700">
                What's your runway? If your income drops to 0 right now, how long will you last?
            </p>
            <AppCalculator class="mt-8" />
        </main>

        <AppFooter />
    </div>
</template>
