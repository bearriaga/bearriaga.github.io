<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-text-field label="Amount" v-model="amount" type="number">
                    <v-icon color="error" slot="append" @click="showDialog = true">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field label="Date" v-model="date" type="date"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Delete XP Entry
                    </v-card-title>

                    <v-card-text>
                        Are you sure you want to delete this entry?
                        <v-row>
                            <v-col cols="6">
                                <v-text-field label="Amount" v-model="amount" type="number" disabled></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field label="Date" v-model="date" type="date" disabled></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" disabled></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="error"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn class="secondary"
                               @click="showDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'XPEntryListItem',
        props: {
            entry: Object
        },
        data() {
            return {
                amount: this.entry.amount,
                description: this.entry.description,
                date: this.entry.date,
                id: this.entry.id,
                showDialog: false
            }
        },
        methods: {
            deleteEntry() {
                this.showDialog = false
                this.$emit('deleteEntryEmit', { arrayName: 'xpEntries', object: this.entry })
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    date: this.date,
                    id: this.entry.id
                }
                this.$emit('updateEntryEmit', { arrayName: 'xpEntries', object: object })
            }
        },
        watch: {
            amount() {
                this.updateEntry()
            },
            description() {
                this.updateEntry()
            },
            date() {
                this.updateEntry()
            }
        }
    }
</script>