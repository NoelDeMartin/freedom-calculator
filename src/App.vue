<template>
    <div class="bg-primary-light flex min-h-full w-full flex-col selection:bg-sky-200">
        <EmojiRain />

        <main class="z-10 flex flex-1 flex-col items-center justify-center p-6">
            <h1 class="font-titillium text-primary-dark text-title text-center font-semibold">
                Freedom Calculator
            </h1>
            <p class="text-primary-gray text-subtitle mt-4 text-balance text-center font-light italic">
                What's your runway? How long until retirement? Are you broke? Or rich?
            </p>
            <FreedomCalculator class="mt-8" />
        </main>

        <AppFooter />
    </div>
</template>
