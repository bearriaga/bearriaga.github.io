<template>
    <div>
        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Journal
                        <v-btn icon color="primary"
                               @click.stop="addDialog">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <JournalListItem v-for="entry in journalEntries" :key="entry.key"
                                     :entry="entry"
                                     @deleteEntryEmit="deleteDialog($event)"
                                     @moneyAddSubtractEmit="moneyAddSubtract($event)"
                                     @updateEntryEmit="updateEntry($event)"></JournalListItem>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Journal Entry
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Title" v-model="journalEntry.name"></v-text-field>
                            <v-row>
                                <v-col cols="6" sm="3">
                                    <v-text-field label="XP"
                                                  type="number"
                                                  v-model="journalEntry.xp"
                                                  ref="xp"></v-text-field>
                                </v-col>
                                <v-col cols="6" sm="3">
                                    <v-switch label="Class XP" inset v-model="journalEntry.classXP"></v-switch>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field label="Money"
                                                  type="number"
                                                  v-model="journalEntry.money">
                                        <TooltipComponent slot="append" :text="'Automatically Added/Subtracted'"></TooltipComponent>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field label="Date" type="date" v-model="journalEntry.date"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field label="Game Date" placeholder="Ex: Stardate 46635.2" v-model="journalEntry.gameDate"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-textarea label="Notes" v-model="journalEntry.description"
                                        auto-grow outlined rows="1"></v-textarea>
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
    import JournalListItem from './JournalListItem.vue'
    import TooltipComponent from './TooltipComponent.vue'

    export default {
        name: 'XPSection',
        components: {
            JournalListItem,
            TooltipComponent
        },
        props: {
            journalEntries: Array,
            panelProp: Number,
            xp: Number,
            xpEarned: Number,
            xpTotal: Number,
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                availableXP: this.xp,
                // Input Fields Start
                clearJournalEntry: {
                    classXP: false,
                    date: null,
                    description: '',
                    gameDate: '',
                    id: '',
                    money: 0,
                    name: '',
                    xp: 0,
                },
                journalEntry: {
                    classXP: false,
                    date: null,
                    description: '',
                    gameDate: '',
                    id: '',
                    money: 0,
                    name: '',
                    xp: 0,
                },
                // Input Fields End
                panel: null,
                // Validation Start
                //numberRules: [
                //    v => !isNaN(+v) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
                //],
                valid: false
                // Validation End
            }
        },
        methods: {
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('addEntryEmit', { arrayName: 'journalEntries', object: this.journalEntry })
                    this.moneyAddSubtract({ add: true, amount: this.journalEntry.money })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'journalEntries', object: this.journalEntry })
            },
            updateEntry(journalEntry) {
                this.$emit('updateEntryEmit', { arrayName: 'journalEntries', object: journalEntry })
            },
            // CRUD Functions End
            moneyAddSubtract(moneyObj) {
                moneyObj.emit = true
                this.$emit('moneyAddSubtractEmit', moneyObj)
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.journalEntry = JSON.parse(JSON.stringify(this.clearJournalEntry))
                setTimeout(() => {
                    this.$refs.xp.focus()
                }, 200)
            },
            deleteDialog(journalEntry) {
                this.journalEntry = journalEntry
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
        },
        watch: {
            panel() {
                this.$emit('journalPanel', { name: 'journalPanel', value: this.panel })
            }
        }
    }
</script>