<template>
    <div>
        <v-row>
            <v-col>
                <v-text-field :label="characteristic.abbreviation"
                              type="number"
                              v-model="value"
                              @keyup.enter="rollDiceCheck">
                    <v-icon slot="append"
                            color="yellow accent-4"
                            v-if="characteristic.primaryCharacteristic">mdi-star</v-icon>
                    <v-icon slot="append" @click="rollDiceCheck">mdi-dice-6</v-icon>
                </v-text-field>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import type { PropType } from 'vue'

    export default Vue.extend({
        name: 'CharacteristicViewItem',
        props: {
            characteristic: Object as PropType<Characteristic>
        },
        data() {
            return {
                value: this.characteristic.value as number
            }
        },
        methods: {
            updateProp() {
                this.$emit('updatePropEmit', { propName: this.characteristic.name, type: 'number', value: this.value })
            },
            rollDiceCheck() {
                this.$emit('rollDiceCheckEmit', this.value)
            }
        },
        watch: {
            value() {
                this.updateProp()
            }
        }
    })

    interface Characteristic {
        abbreviation: string,
        key: string,
        name: string,
        value: number,
        primaryCharacteristic: boolean
    }
</script>