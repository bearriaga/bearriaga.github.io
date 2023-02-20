<template>
    <div>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Passives
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form>
                        <v-switch label="Luck Favored" inset v-model="luckFavored"></v-switch>
                        <v-switch label="Luck Ill Favored" inset v-model="luckIllFavored"></v-switch>
                        <v-switch label="Luck Loved by Luck" inset v-model="luckLovedByLuck"></v-switch>
                        <v-switch label="Luck Nothing to Chance" inset v-model="luckNothingToChance"></v-switch>
                    </v-form>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
    export default {
        name: 'PassivesSection',
        props: {
            characterSheet: Object
        },
        data() {
            return {
                luckFavored: this.characterSheet.luckFavored,
                luckIllFavored: this.characterSheet.luckIllFavored,
                luckLovedByLuck: this.characterSheet.luckLovedByLuck,
                luckNothingToChance: this.characterSheet.luckNothingToChance
            }
        },
        methods: {
            updateProp(name, type, value) {
                this.$emit('updatePropEmit', { propName: name, type: type, value: value })
            }
        },
        watch: {
            luckFavored() { this.updateProp('luckFavored', 'bool', this.luckFavored) },
            luckIllFavored() { this.updateProp('luckIllFavored', 'bool', this.luckIllFavored) },
            luckLovedByLuck() { this.updateProp('luckLovedByLuck', 'bool', this.luckLovedByLuck) },
            luckNothingToChance() { this.updateProp('luckNothingToChance', 'bool', this.luckNothingToChance) }
        }
    }
</script>