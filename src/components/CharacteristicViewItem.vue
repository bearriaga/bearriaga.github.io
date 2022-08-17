<template>
    <div>
        <v-text-field :label="adjustedAmountLabel()"
                      v-model="adjustedAmount"
                      v-if="characteristic.adjustment != 0"
                      :class="adjustedAmountClass()"
                      disabled></v-text-field>
        <v-text-field :label="characteristic.abbreviation"
                      type="number"
                      v-model="value"
                      @keyup.enter="rollCharCheck">
            <v-icon slot="append"
                    color="yellow accent-4"
                    v-if="characteristic.characteristic">mdi-star</v-icon>
            <v-icon slot="append" @click="rollCharCheck">mdi-dice-6</v-icon>
            <v-icon slot="append" @click="rollSaveCheck">mdi-shield</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'CharacteristicViewItem',
        props: {
            characteristic: Object
        },
        computed: {
            adjustedAmount() {
                let amount = +this.characteristic.value + +this.characteristic.adjustment
                return (amount > 0) ? amount : 0
            }
        },
        data() {
            return {                
                value: +this.characteristic.value
            }
        },
        methods: {
            adjustedAmountClass() {
                if (this.characteristic.adjustment > 0)
                    return 'text-green'
                if (this.characteristic.adjustment < 0)
                    return 'text-red'
            },
            adjustedAmountLabel() {
                let label = ''

                if (this.characteristic.adjustment > 0)
                    label = 'Buffed '
                if (this.characteristic.adjustment < 0)
                    label = 'Debuffed '

                label += this.characteristic.abbreviation

                return label
            },
            rollCharCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: +this.value + +this.characteristic.adjustment, isSave: false, successes: 0 })
            },
            rollSaveCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: +this.value + +this.characteristic.adjustment, isSave: true, successes: 0 })
            },
            updateProp() {
                this.$emit('updatePropEmit', { propName: this.characteristic.name, type: 'number', value: this.value })
            }
        },
        watch: {
            value() {
                this.updateProp()
            }
        }
    }
</script>