<template>
    <div class="flex min-h-full w-full flex-col bg-[#caf3fd] selection:bg-sky-200">
        <EmojiRain />
        <main class="z-10 flex flex-1 flex-col items-center justify-center p-6">
            <h1 class="font-titillium text-center text-xl font-semibold text-sky-950">
                Freedom Calculator
            </h1>
            <p class="mt-4 text-balance text-center text-base font-light italic text-gray-700">
                What's your runway? If your income drops to 0 right now, how long will you last?
            </p>
            <AppCalculator class="mt-8" />
        </main>

        <AppFooter />
    </div>
</template>
