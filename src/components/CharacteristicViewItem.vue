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
            rollDiceCheck() {
                this.$emit('rollDiceCheckEmit', this.value)
            }
        },
        watch: {
            value() {
                this.updateProp()
            }
        }
    }
</script>