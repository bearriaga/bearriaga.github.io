<template>
    <div>
        <v-row>
            <v-col>
                <v-text-field :label="propertyObject.label"
                              :type="propertyObject.type"
                              v-model="value"
                              :disabled="propertyObject.disabled">
                    <v-icon v-if="propertyObject.valueMax != null" slot="append">/{{propertyObject.valueMax}} </v-icon>
                    <v-icon color="primary" slot="append" @click="showDialog = true">mdi-pen</v-icon>
                </v-text-field>
            </v-col>
        </v-row>

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
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-if="propertyObject.valueIncreasesType == 'number' || propertyObject.valueIncreasesType == 'text'"
                                                  :label="propertyObject.valueIncreasesLabel"
                                                  :type="propertyObject.valueIncreasesType"
                                                  v-model="valueIncreases"
                                                  @keyup.enter="updateProp(propertyObject.valueIncreasesName, valueIncreases)"></v-text-field>
                                    <v-checkbox v-else-if="propertyObject.valueIncreasesType == 'bool'"
                                                :label="propertyObject.valueIncreasesLabel"
                                                v-model="valueIncreases"></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary"
                               @click="updateProp(propertyObject.valueIncreasesName, valueIncreases)">Save</v-btn>
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
        data() {
            return {
                showDialog: false,
                value: Number(this.propertyObject.value),
                valueIncreases: Number(this.propertyObject.valueIncreases)
            }
        },
        methods: {
            updateProp(propName, value) {
                this.showDialog = false
                this.$emit('updatePropEmit', { propName, value })
            }
        },
        watch: {
            value() {
                this.updateProp(this.propertyObject.valueName, this.value)
            }
        }
    }
</script>