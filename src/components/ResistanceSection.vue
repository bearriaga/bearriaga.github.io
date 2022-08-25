<template>
    <div>
        <template>
            <v-expansion-panels>
                <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Damage Resistances
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="6" v-for="resistance in resistances" :key="resistance.key">
                                <ResistanceListItem :damage-groups="damageGroups"
                                                    :damage-types="damageTypes"
                                                    :resistance="resistance"
                                                    @updateEntryEmit="updateDialog($event)"></ResistanceListItem>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Resistance
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid">
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="amount"
                                          ref="amount"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-autocomplete label="Type"
                                            :items="damageTypes"
                                            v-model="type"
                                            :rules="textRules"
                                            required></v-autocomplete>
                        </v-form>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Update'" :disabled="!valid"
                               @click="updateEntry">Save</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Update'"
                               @click="deleteEntry">Delete</v-btn>
                        <v-btn color="secondary"
                               @click="dialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import ResistanceListItem from './ResistanceListItem.vue'

    export default {
        name: 'ResistanceSection',
        components: {
            ResistanceListItem
        },
        props: {
            resistances: Array,
            damageGroups: Array,
            damageTypes: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                amount: 1,
                type: '',
                resistance: {
                    amount: 1,
                    id: '',
                    type: ''
                },
                // Input Fields End
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) && v != 0 || 'Field may not be empty and value must not be 0'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.resistance = {
                        amount: this.amount,
                        id: null,
                        type: this.type
                    }
                    this.$emit('addEntryEmit', { arrayName: 'resistances', object: this.resistance })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'resistances', object: this.resistance })
            },
            updateEntry() {
                let resistance = {
                    amount: this.amount,
                    id: this.resistance.id,
                    type: this.type
                }
                this.dialog.show = false
                this.$emit('updateEntryEmit', { arrayName: 'resistances', object: resistance })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.resistance = {
                    amount: 1,
                    id: '',
                    type: ''
                }
                this.setInputs(this.resistance)
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            updateDialog(resistance) {
                this.resistance = this.resistances.find(x => { return x.id == resistance.id })
                this.setInputs(this.resistance)
                this.setDialog('Update')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(resistance) {
                this.amount = resistance.amount
                this.type = resistance.type
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>