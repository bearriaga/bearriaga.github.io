import { defineStore } from 'pinia';

import characters from '@/data/characters.json'

export const useCharacterStore = defineStore('CharacterStore', {
    state: () => {
        return {
            character: {},
            characters: []
        }
    },
    actions: {
        fill() {
            this.characters = characters;
            this.character = characters[0]
        }
    },
    getters: {
        getCharacter(state) {
            return state.character
        },
        getCharacterById: (state) => {
            return (id) => {
                state.character = state.characters.find((c) => c.id == id)
                return state.character
            }
        }
    }
})