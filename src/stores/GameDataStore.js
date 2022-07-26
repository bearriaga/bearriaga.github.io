import { defineStore } from 'pinia';

import statuses from '@/data/statuses.json'

export const useGameDataStore = defineStore('GameDataStore', {
    state: () => {
        return {
            statuses: []
        }
    },
    actions: {
        fill() {
            this.statuses = statuses;
        }
    },
    getters: {
        getStatuses(state) {
            return state.statuses
        }
    }
})