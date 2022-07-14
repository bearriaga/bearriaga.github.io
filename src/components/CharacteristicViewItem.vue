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
                            v-if="characteristic.characteristic">mdi-star</v-icon>
                    <v-icon slot="append" @click="rollCharCheck">mdi-dice-6</v-icon>
                    <v-icon slot="append" @click="rollSaveCheck">mdi-shield</v-icon>
                </v-text-field>                
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'CharacteristicViewItem',
        props: {
            characteristic: Object
        },
        data() {
            return {
                value: Number(this.characteristic.value)
            }
        },
        methods: {
            updateProp() {
                this.$emit('updatePropEmit', { propName: this.characteristic.name, type: 'number', value: this.value })
            },
            rollCharCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.value, isSave: false, successes: 0 })
            },
            rollSaveCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.value, isSave: true, successes: 0 })
            }
        },
        watch: {
            value() {
                this.updateProp()
            }
        }
    }
</script>