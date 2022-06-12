<template>
    <div>
        <div>
            <h3 class="text-center">
                XP Entries
                <v-btn icon color="primary"
                       @click="showDialog = true">
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </h3>
            <XPEntryListItem v-for="entry in xpEntries" :key="entry.id"
                             :entry="entry"
                             @deleteEntryEmit="deleteEntry($event)"
                             @updateEntryEmit="updateEntry($event)">
            </XPEntryListItem>
        </div>
        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add XP Entry
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field label="Amount" type="number" v-model="amount"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field label="Date" type="date" v-model="date"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Description" type="text" v-model="description"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary"
                               @click="addEntry()">Add</v-btn>
                        <v-btn color="secondary"
                               @click="showDialog = false">Close</v-btn>
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
                amount: 0,
                availableXP: this.xp,
                date: null,
                description: '',
                showDialog: false
            }
        },
        methods: {
            addEntry() {
                var object = {
                    amount: this.amount,
                    date: this.date,
                    description: this.description,
                    id: null
                }
                this.amount = 0
                this.date = null
                this.description = ''
                this.showDialog = false
                this.$emit('addEntryEmit', { arrayName: 'xpEntries', object: object })
            },
            deleteEntry(entry) {
                this.$emit('deleteEntryEmit', entry)
            },
            updateEntry(entry) {
                this.$emit('updateEntryEmit', entry)
            }
        }
    }
</script>