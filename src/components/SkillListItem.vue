<template>
    <div>
        <v-form disabled>
            <v-text-field :label="skill.name + ' (' + skill.characteristic + ')'"
                          :class="adjustedAmountClass"
                          type="number"
                          min="0"
                          max="10"
                          v-model="value"
                          @keyup.enter="rollDiceCheckEmit"
                          readonly>
                <v-icon slot="append" @click="rollDiceCheckEmit">mdi-dice-6</v-icon>
                <v-icon color="primary"
                        slot="append"
                        @click="updateEntry"
                        v-if="!skill.isBuff">mdi-pen</v-icon>
                <v-icon color="error"
                        slot="append"
                        @click="deleteEntry"
                        v-if="!skill.default && !skill.isBuff">mdi-delete</v-icon>
            </v-text-field>
        </v-form>
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

                if (this.skill.adjustment > 0 || this.skill.isBuff)
                    amountClass = 'text-green'
                if (this.skill.adjustment < 0)
                    amountClass = 'text-red'

                return amountClass
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
            rollDiceCheckEmit() {
                this.$emit('rollDiceCheckEmit', {
                    chars: [this.skill.characteristic],
                    diceToRoll: this.value,
                    isSave: false,
                    name: this.skill.name,
                    successes: (this.skill.successes) ? this.skill.successes : 0
                })
            }
        }
    }
</script>