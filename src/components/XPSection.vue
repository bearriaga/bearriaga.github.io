<template>
    <div>
        <div>
            <h3 class="text-center">
                XP Entries
                <v-btn icon color="primary"
                       @click="addDialog">
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </h3>
            <XPEntryListItem v-for="entry in xpEntries" :key="entry.id"
                             :entry="entry"
                             @deleteEntryEmit="deleteDialog($event)"
                             @updateEntryEmit="updateEntry($event)"></XPEntryListItem>
        </div>
        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} XP Entry
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
                                <v-text-field label="Date"
                                              type="date"
                                              v-model="date"></v-text-field>
                                <v-text-field label="Description"
                                              v-model="description"></v-text-field>
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
    import XPEntryListItem from './XPEntryListItem.vue'

    export default {
        name: 'XPSection',
        components: {
            XPEntryListItem
        },
        props: {
            xp: Number,
            xpEarned: Number,
            xpTotal: Number,
            xpEntries: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                availableXP: this.xp,
                // Input Fields Start
                amount: 1,
                date: null,
                description: '',
                entry: {
                    amount: 1,
                    date: null,
                    description: '',
                    id: ''
                },
                // Input Fields End
                // Validation Start
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
                this.entry = {
                    amount: this.amount,
                    date: this.date,
                    description: this.description,
                    id: null
                }
                this.$emit('addEntryEmit', { arrayName: 'xpEntries', object: this.entry })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'xpEntries', object: this.entry })
            },
            updateEntry(entry) {
                this.$emit('updateEntryEmit', { arrayName: 'xpEntries', object: entry })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.entry = {
                    amount: 1,
                    date: null,
                    description: '',
                    id: ''
                }
                this.setInputs(this.entry)
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            deleteDialog(entry) {
                this.entry = this.xpEntries.find(x => { return x.id == entry.id })
                this.setInputs(this.entry)
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(entry) {
                this.amount = entry.amount
                this.date = entry.date
                this.description = entry.description
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>