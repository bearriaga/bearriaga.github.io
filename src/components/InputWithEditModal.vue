<template>
    <div>
        <div @click="openDialog">
            <v-progress-linear :value="bar"
                               v-if="propertyObject.bar"
                               height="25"
                               :color="propertyObject.color">
                {{value}}/{{propertyObject.valueMax}}
            </v-progress-linear>
            <v-text-field :label="propertyObject.label"
                          :type="propertyObject.type"
                          v-model="value"
                          :disabled="propertyObject.disabled">
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
                            @click="showDialog = true">mdi-pen</v-icon>
                </template>
            </v-text-field>
        </div>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{propertyObject.label}} Edit
                    </v-card-title>

                    <v-card-text>
                        {{propertyObject.dialogText}}
                    </v-card-text>

                    <v-card-text>
                        <v-form>
                            <v-text-field v-if="propertyObject.valueIncreasesType == 'number' || propertyObject.valueIncreasesType == 'text'"
                                          :label="propertyObject.valueIncreasesLabel"
                                          :type="propertyObject.valueIncreasesType"
                                          v-model="valueIncreases"
                                          @keyup.enter="updateProp"></v-text-field>
                            <v-checkbox v-else-if="propertyObject.valueIncreasesType == 'bool'"
                                        :label="propertyObject.valueIncreasesLabel"
                                        v-model="valueIncreases"></v-checkbox>
                        </v-form>
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
    export default {
        name: 'InputWithEditModal',
        props: {
            propertyObject: Object
        },
        computed: {
            bar() {
                return this.value * 100 / this.propertyObject.valueMax
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
                if (this.propertyObject.disabled)
                    this.showDialog = true
            },
            specialButton() {
                if (this.propertyObject.valueName == 'ap') {
                    let apGain = (this.propertyObject.valueIncreases) ? this.propertyObject.valueMax / 3 : this.propertyObject.valueMax / 2
                    this.value = +this.value + apGain
                    this.$emit('apGainEmit')
                }
                if (this.propertyObject.valueName == 'initiative') {
                    this.$emit('specialInputWithEditModalEmit')                    
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