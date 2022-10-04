import { defineStore } from 'pinia';

import statuses from '@/data/statuses.json'
import effects from '@/data/effects.json'

export const useGameDataStore = defineStore('GameDataStore', {
    state: () => {
        return {
            effects: [],
            statuses: []
        }
    },
    actions: {
        fill() {
            this.effects = effects;
            this.statuses = statuses;
        }
    },
    getters: {
        getEffects(state) {
            return state.effects
        },
        getStatuses(state) {
            return state.statuses
        }
    }
})