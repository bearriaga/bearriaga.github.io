<template>
    <div>
        <template>
            <v-expansion-panels>
                <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Movements
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <MovementListItem v-for="entry in movements" :key="entry.key"
                                          :ap="ap"
                                          :movement="entry"
                                          :movement-types="movementTypes"
                                          :movement-ap-icon="movementApIcon"
                                          :movement-ap-icon-color="movementApIconColor"
                                          @deleteEntryEmit="deleteDialog($event)"
                                          @subtractAP="subtractAP($event)"
                                          @updateEntryEmit="updateEntry($event)"> </MovementListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Movement
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="amount"
                                          ref="amount"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-autocomplete label="Type"
                                            v-model="type"
                                            :items="movementTypes"
                                            :rules="textRules"
                                            required></v-autocomplete>
                            <v-text-field label="Description"
                                          v-model="description"></v-text-field>
                        </v-form>
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
    import MovementListItem from './MovementListItem.vue'

    export default {
        name: 'MovementSection',
        components: {
            MovementListItem
        },
        props: {
            ap: Number,
            movementApIcon: String,
            movementApIconColor: String,
            movements: Array,
            movementTypes: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                amount: 0,
                description: '',
                type: '',
                movement: {
                    amount: 1,
                    description: '',
                    id: '',
                    type: ''
                },
                // Input Fields End
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
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
                    this.movement = {
                        amount: this.amount,
                        description: this.description,
                        id: null,
                        type: this.type
                    }
                    this.$emit('addEntryEmit', { arrayName: 'movements', object: this.movement })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'movements', object: this.movement })
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'movements', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.movement = {
                    amount: 1,
                    description: '',
                    id: '',
                    type: ''
                }
                this.setInputs(this.movement)
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            deleteDialog(movement) {
                this.movement = this.movements.find(x => { return x.id == movement.id })
                this.setInputs(this.movement)
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(movement) {
                this.amount = movement.amount
                this.description = movement.description
                this.type = movement.type
            },
            // Open Dialog Functions End
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>