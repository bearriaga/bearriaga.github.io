<template>
    <div>
        <h3 class="text-center">
            Damage Resistances
            <v-btn icon color="primary"
                   @click="addDialog">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <ResistanceListItem v-for="resistance in resistances" :key="resistance.id"
                            :resistance="resistance"
                            :damage-types="damageTypes"
                            @deleteEntryEmit="deleteDialog($event)"
                            @updateEntryEmit="updateEntry($event)"></ResistanceListItem>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Resistance
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-form ref="form"
                                    v-model="valid"
                                    :disabled="dialog.type == 'Delete'">
                                <v-text-field label="Amount"
                                              type="number"
                                              v-model="amount"
                                              ref="amount"
                                              :rules="numberRules"
                                              required></v-text-field>
                                <v-select label="Type"
                                          :items="damageTypes"
                                          v-model="type"
                                          :rules="textRules"
                                          required></v-select>
                            </v-form>

                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
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
                    v => !isNaN(parseInt(v)) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
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
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'resistances', object: object })
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
            deleteDialog(resistance) {
                this.resistance = this.resistances.find(x => { return x.id == resistance.id })
                this.setInputs(this.resistance)
                this.setDialog('Delete')
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