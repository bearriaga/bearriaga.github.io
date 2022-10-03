<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            XP Entries
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <XPEntryListItem v-for="entry in xpEntries" :key="entry.key"
                                         :entry="entry"
                                         @deleteEntryEmit="deleteDialog($event)"
                                         @updateEntryEmit="updateEntry($event)"></XPEntryListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} XP Entry
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Amount"
                                                  type="number"
                                                  v-model="xpEntry.amount"
                                                  ref="amount"
                                                  :rules="numberRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Date"
                                                  type="date"
                                                  v-model="xpEntry.date"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-switch label="Class XP" inset v-model="xpEntry.classXP"></v-switch>
                            <v-text-field label="Description"
                                          v-model="xpEntry.description"></v-text-field>
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
                clearXpEntry: {
                    amount: 1,
                    classXP: false,
                    date: null,
                    description: '',
                    id: '',
                },
                xpEntry: {
                    amount: 1,
                    classXP: false,
                    date: null,
                    description: '',
                    id: ''
                },
                // Input Fields End
                panel: 0,
                // Validation Start
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
                    this.$emit('addEntryEmit', { arrayName: 'xpEntries', object: this.xpEntry })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'xpEntries', object: this.xpEntry })
            },
            updateEntry(xpEntry) {
                this.$emit('updateEntryEmit', { arrayName: 'xpEntries', object: xpEntry })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.xpEntry = JSON.parse(JSON.stringify(this.clearXpEntry))
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            deleteDialog(xpEntry) {
                this.xpEntry = xpEntry 
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>