import { defineStore } from 'pinia';

import damageGroups from '@/data/damageGroups.json'
import effects from '@/data/effects.json'
import hitLocations from '@/data/hitLocations.json'
import statuses from '@/data/statuses.json'
import universalEffects from '@/data/universalEffects.json'

export const useGameDataStore = defineStore('GameDataStore', {
    state: () => {
        return {
            damageGroups: [],
            effects: [],
            hitLocations: [],
            statuses: [],
            universalEffects: []
        }
    },
    actions: {
        fill() {
            this.damageGroups = damageGroups;
            this.effects = effects;
            this.hitLocations = hitLocations;
            this.statuses = statuses;
            this.universalEffects = universalEffects;
        }
    },
    getters: {
        getdamageGroups(state) {
            return state.damageGroups
        },
        getEffects(state) {
            return state.effects
        },
        getHitLocations(state) {
            return state.hitLocations
        },
        getStatuses(state) {
            return state.statuses
        },
        getUniversalEffects(state) {
            return state.universalEffects
        }
    }
})