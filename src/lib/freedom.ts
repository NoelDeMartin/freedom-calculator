import { ref } from 'vue';

export type Freedom = 'broke' | 'free' | 'rich' | 'millionaire';
export const freedom = ref<Freedom>();
