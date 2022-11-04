<template>
    <div>
        <v-text-field :label="adjustedAmountLabel"
                      v-model="adjustedAmount"
                      v-if="skill.adjustment != 0"
                      :class="adjustedAmountClass"
                      disabled></v-text-field>
        <v-text-field :label="skill.name + ' (' + skill.characteristic + ')'"
                      type="number"
                      min="0"
                      max="10"
                      v-model="value"
                      @keyup.enter="rollDiceCheck">
            <v-icon slot="append" @click="rollDiceCheck">mdi-dice-6</v-icon>
            <v-icon color="primary" 
                    slot="append" 
                    @click="updateEntry"
                    v-if="!skill.isBuff">mdi-pen</v-icon>
            <v-icon color="error" 
                    slot="append" 
                    @click="deleteEntry" 
                    v-if="!skill.default && !skill.isBuff">mdi-delete</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'SkillListItem',
        props: {
            skill: Object
        },
        computed: {
            adjustedAmount() {
                let amount = +this.value + +this.skill.adjustment
                return (amount > 10) ? 10 : (amount < 0) ? 0 : amount
            },
            adjustedAmountClass() {
                let amountClass = ''

                if (this.skill.adjustment > 0)
                    amountClass = 'text-green'
                if (this.skill.adjustment < 0)
                    amountClass = 'text-red'

                return amountClass
            },
            adjustedAmountLabel() {
                let label = ''

                if (this.skill.adjustment > 0)
                    label = 'Buffed '
                if (this.skill.adjustment < 0)
                    label = 'Debuffed '

                label += this.skill.name

                return label
            }
        },
        data() {
            return {
                value: this.skill.value
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.skill)
            },
            updateEntry() {
                this.$emit('updateEntryEmit', JSON.parse(JSON.stringify(this.skill)))
            },
            rollDiceCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.adjustedAmount, isSkill: true, name: this.skill.name, successes: 0 })
            }
        }
    }
</script>