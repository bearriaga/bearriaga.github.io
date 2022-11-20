<template>
    <div>
        <v-text-field :label="adjustedAmountLabel"
                      v-model="adjustedAmount"
                      v-if="characteristic.adjustment != 0"
                      :class="adjustedAmountClass"
                      disabled></v-text-field>
        <v-text-field :label="characteristic.abbreviation"
                      type="number"
                      min="0"
                      :max="characteristic.valueMax"
                      v-model="value"
                      @keyup.enter="rollCharCheck">
            <v-icon slot="append"
                    color="yellow accent-4"
                    v-if="characteristic.characteristic">mdi-star</v-icon>
            <v-icon slot="append" @click="rollCharCheck">mdi-dice-6</v-icon>
            <v-icon slot="append" @click="rollSaveCheck">mdi-shield</v-icon>
            <v-icon slot="append" @click="rollSkillCheck">mdi-alpha-s-circle</v-icon>
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
                let amount = +this.value + +this.characteristic.adjustment
                return (amount > this.characteristic.valueMax) ? this.characteristic.valueMax : (amount < 0) ? 0 : amount
            },
            adjustedAmountClass() {
                let amountClass = ''

                if (this.characteristic.adjustment > 0)
                    amountClass = 'text-green'
                if (this.characteristic.adjustment < 0)
                    amountClass = 'text-red'

                return amountClass
            },
            adjustedAmountLabel() {
                let label = ''

                if (this.characteristic.adjustment > 0)
                    label = 'Buffed '
                if (this.characteristic.adjustment < 0)
                    label = 'Debuffed '

                label += this.characteristic.abbreviation

                return label
            }
        },
        data() {
            return {
                value: +this.characteristic.value
            }
        },
        methods: {
            rollCharCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.adjustedAmount, isSkill: false, name: this.characteristic.abbreviation, successes: 0 })
            },
            rollSaveCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.adjustedAmount, isSkill: false, name: this.characteristic.abbreviation + ' Save', successes: 0 })
            },
            rollSkillCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.adjustedAmount, isSkill: true, name: this.characteristic.abbreviation + ' Skill', successes: 0 })
            },
            updateProp() {
                if (this.value < 0)
                    this.value = 0
                if (this.value > this.characteristic.valueMax)
                    this.value = this.characteristic.valueMax

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