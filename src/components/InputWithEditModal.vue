<template>
    <div>
        <div @click="wrapperClick" :class="wrapperClass">
            <v-progress-linear :value="bar"
                               v-if="propertyObject.bar"
                               height="25"
                               :color="propertyObject.color">
                {{value}}/{{propertyObject.valueMax}}
            </v-progress-linear>
            <v-text-field :label="propertyObject.label"
                          :type="propertyObject.type"
                          v-model="value"
                          :disabled="propertyObject.disabled"
                          :readonly="propertyObject.disabled">
                <TooltipComponent slot="prepend" :text="propertyObject.infoText" v-if="propertyObject.infoText"></TooltipComponent>
                <template v-if="propertyObject.valueName == 'bp'">
                    <v-icon color="brown"
                            slot="append"
                            :disabled="propertyObject.value < 1"
                            @click="specialButton">mdi-hospital-box</v-icon>
                </template>
                <template v-if="propertyObject.valueName == 'ap'">
                    <v-icon color="success"
                            slot="append"
                            @click="specialButton">mdi-clock-plus-outline</v-icon>
                </template>
                <template v-if="propertyObject.valueName == 'dc'">
                    <v-icon slot="append">mdi-shield</v-icon>
                </template>
                <template v-if="propertyObject.valueName == 'initiative'">
                    <v-icon slot="append"
                            @click="specialButton">mdi-dice-6</v-icon>
                </template>
                <template v-if="!propertyObject.disabled">
                    <v-icon color="success"
                            slot="append"
                            v-if="propertyObject.plus"
                            @click="add">mdi-plus</v-icon>
                    <v-icon color="error"
                            slot="append"
                            v-if="propertyObject.minus"
                            @click="subtract">mdi-minus</v-icon>
                    <v-icon color="primary"
                            slot="append"
                            v-if="!propertyObject.disabled"
                            @click="openDialog">mdi-pen</v-icon>
                </template>
            </v-text-field>
        </div>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{propertyObject.label}} Edit
                        <v-spacer></v-spacer>
                        Available XP: {{xp}}
                    </v-card-title>

                    <v-card-text>
                        <div>
                            {{propertyObject.dialogText}}
                        </div>

                        <v-form>
                            <v-text-field v-if="propertyObject.valueIncreasesType == 'number'"
                                          :label="propertyObject.valueIncreasesLabel"
                                          :type="propertyObject.valueIncreasesType"
                                          v-model="valueIncreases"
                                          @keyup.enter="updateProp">
                                <TooltipComponent slot="append" :text="propertyObject.dialogInfoText" v-if="propertyObject.dialogInfoText"></TooltipComponent>
                            </v-text-field>
                            <v-switch v-else-if="propertyObject.valueIncreasesType == 'bool'" inset
                                      :label="propertyObject.valueIncreasesLabel"
                                      v-model="valueIncreases"></v-switch>
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
    </div>
</template>

<script>
    import RefundedXP from './RefundedXP.vue'
    import TooltipComponent from './TooltipComponent.vue'

    export default {
        name: 'InputWithEditModal',
        components: {
            RefundedXP,
            TooltipComponent
        },
        props: {
            hastened: Number,
            hp: Number,
            propertyObject: Object,
            tier: Number,
            xp: Number
        },
        computed: {
            bar() {
                return this.value * 100 / this.propertyObject.valueMax
            },
            wrapperClass() {
                let wrapperClass = ''

                if (this.propertyObject.disabled)
                    wrapperClass = 'cursorPointer'

                return wrapperClass
            },
            xpCost() {
                let cost = 0

                if (this.propertyObject.valueName == 'ap' && this.valueIncreases)
                    cost = 50
                else {
                    let vi = Math.abs(this.valueIncreases)
                    if (this.propertyObject.valueName == 'bp')
                        cost = 60 * (vi * (+vi + 1) / 2)
                    if (this.propertyObject.valueName == 'dc')
                        cost = (Math.pow(2, vi) - 1) * 160
                    if (this.propertyObject.valueName == 'hp')
                        cost = 5 * (vi * (+vi + 1) / 2)
                    if (this.propertyObject.valueName == 'initiative')
                        cost = 30 * (vi * (+vi + 1) / 2)
                    if (this.propertyObject.valueName == 'rerolls')
                        cost = 60 * vi
                    cost = Math.floor(cost)

                    if (this.valueIncreases < 0)
                        cost = cost * -1
                }

                return cost
            }
        },
        data() {
            return {
                showDialog: false,
                value: Number(this.propertyObject.value),
                valueIncreases: Number(this.propertyObject.valueIncreases)
            }
        },
        methods: {
            add() {
                this.value = +this.value + 1;
            },
            openDialog() {
                this.showDialog = true
                this.valueIncreases = Number(this.propertyObject.valueIncreases)
            },
            specialButton() {
                if (this.propertyObject.valueName == 'ap') {
                    let apGain = (this.propertyObject.valueIncreases) ? this.propertyObject.valueMax / 3 : this.propertyObject.valueMax / 2
                    if (this.hp <= 0)
                        apGain = Math.floor(apGain / 2)
                    this.value = +this.value + apGain + this.hastened
                    this.$emit('apGainEmit')
                }
                if (this.propertyObject.valueName == 'initiative') {
                    this.$emit('specialInputWithEditModalEmit', this.propertyObject.valueName)
                }
                if (this.propertyObject.valueName == 'bp') {
                    this.$emit('specialInputWithEditModalEmit', this.propertyObject.valueName)
                }
            },
            subtract() {
                this.value = +this.value - 1;
            },
            updateProp() {
                this.showDialog = false
                this.$emit('updatePropEmit', {
                    propName: this.propertyObject.valueIncreasesName,
                    type: this.propertyObject.valueIncreasesType,
                    value: this.valueIncreases
                })
            },
            wrapperClick() {
                if (this.propertyObject.disabled)
                    this.openDialog()
            }
        },
        watch: {
            value() {
                this.$emit('updatePropEmit', {
                    propName: this.propertyObject.valueName,
                    type: 'number',
                    value: this.value
                })
            }
        }
    }
</script>