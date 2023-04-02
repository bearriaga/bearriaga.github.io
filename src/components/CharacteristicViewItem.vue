<template>
    <div>
        <v-text-field :label="characteristic.abbreviation"
                      v-model="adjustedAmount"
                      @click="inputClick"
                      :class="adjustedAmountClass"
                      v-if="!isGenericRoller"
                      readonly>
            <v-icon slot="append" @click="rollCharCheck">mdi-dice-6</v-icon>
            <v-icon slot="append" @click="rollSaveCheck">mdi-shield</v-icon>
            <v-icon slot="append" @click="rollSkillCheck">mdi-alpha-s-circle</v-icon>
        </v-text-field>
        <v-text-field :label="characteristic.abbreviation"
                      type="number"
                      min="0"
                      :max="characteristic.valueMax"
                      v-model="value"
                      @keyup.enter="rollCharCheck"
                      v-if="isGenericRoller">
            <v-icon slot="append" @click="rollCharCheck">mdi-dice-6</v-icon>
            <v-icon slot="append" @click="rollSaveCheck">mdi-shield</v-icon>
            <v-icon slot="append" @click="rollSkillCheck">mdi-alpha-s-circle</v-icon>
        </v-text-field>

        <v-dialog v-model="showDialog" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{characteristic.abbreviation}}
                    <v-spacer></v-spacer>
                    Available XP: {{xp}}
                </v-card-title>

                <v-card-text>
                    <v-form>
                        <v-text-field :label="initialAmountLabel"
                                      type="number"
                                      min="0"
                                      :max="characteristic.valueMax"
                                      v-model="value"
                                      @keyup.enter="rollCharCheck">
                            <v-icon slot="append"
                                    color="yellow accent-4"
                                    v-if="characteristic.primary">mdi-star</v-icon>
                        </v-text-field>
                        <div>200 xp * the number you are raising the CHAR to, awarding a 20% discount to primary characteristics</div>
                        <v-text-field :label="characteristic.valueIncreasesLabel"
                                      type="number"
                                      :max="+characteristic.valueMax - +value"
                                      :min="(value * -1)"
                                      v-model="valueIncreases"
                                      @keyup.enter="updateProp"></v-text-field>
                    </v-form>
                    <div v-if="xpCost">
                        <v-text-field label="XP Cost" v-model="xpCost" disabled readonly></v-text-field>
                        <RefundedXP v-if="tier && xpCost > 0" :tier="tier" :xp-cost="xpCost"></RefundedXP>
                    </div>
                </v-card-text>


                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="primary"
                           @click="updateProp">Save</v-btn>
                    <v-btn color="secondary"
                           @click="showDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import RefundedXP from './RefundedXP.vue'

    export default {
        name: 'CharacteristicViewItem',
        components: {
            RefundedXP
        },
        props: {
            characteristic: Object,
            tier: Number,
            xp: Number
        },
        computed: {
            adjustedAmount() {
                let amount = (!this.isGenericRoller) ? +this.characteristic.value : +this.value
                amount += +this.characteristic.valueIncreases + +this.characteristic.adjustment
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
            initialAmountLabel() {
                let label = 'Initial ' + this.characteristic.abbreviation
                if (this.characteristic.primary)
                    label += ' (Primary Characteristic)'
                return label
            },
            xpCost() {
                let cost = 0

                if (this.valueIncreases > 0) {
                    for (var i = +this.value + 1; i <= +this.value + +this.valueIncreases; i++) {
                        cost += +(200 * i)
                    }

                    if (this.characteristic.primary)
                        cost *= .8
                } else {
                    for (var j = +this.value; j > +this.value + +this.valueIncreases; j--) {
                        cost -= +(200 * j)
                    }
                }

                return cost
            }
        },
        data() {
            return {
                isGenericRoller: (this.characteristic.abbreviation == 'Generic Roller'),
                value: +this.characteristic.value,
                valueIncreases: this.characteristic.valueIncreases,
                showDialog: false
            }
        },
        methods: {
            inputClick() {
                if (!this.isGenericRoller)
                    this.showDialog = true
            },
            rollCharCheck() {
                this.$emit('rollDiceCheckEmit', { chars: [this.characteristic.name], diceToRoll: this.adjustedAmount, isSave: false, name: this.characteristic.abbreviation, successes: 0 })
            },
            rollSaveCheck() {
                this.$emit('rollDiceCheckEmit', { chars: [this.characteristic.name], diceToRoll: this.adjustedAmount, isSave: true, name: this.characteristic.abbreviation + ' Save', successes: 0 })
            },
            rollSkillCheck() {
                this.$emit('rollDiceCheckEmit', { chars: [this.characteristic.name], diceToRoll: this.adjustedAmount, isSave: false, name: this.characteristic.abbreviation + ' Skill', successes: 0 })
            },
            updateProp() {
                if (this.value < 0)
                    this.value = 0
                if (this.value > this.characteristic.valueMax)
                    this.value = this.characteristic.valueMax

                this.$emit('updatePropEmit', { propName: this.characteristic.name, type: 'number', value: this.value })
                this.$emit('updatePropEmit', { propName: this.characteristic.valueIncreasesName, type: 'number', value: this.valueIncreases })

                this.showDialog = false
            }
        }
    }
</script>