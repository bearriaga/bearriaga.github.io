<template>
    <div>
        <v-text-field label="Amount" v-model="amount" type="number">
            <v-icon color="error" slot="append" @click="showDialog = true">mdi-delete</v-icon>
        </v-text-field>
        <v-select label="Type" :items="damageResistances" v-model="type"></v-select>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Delete Resistance
                    </v-card-title>

                    <v-card-text>
                        Are you sure you want to delete this resistance?
                        <v-text-field label="Amount" v-model="amount" type="number" disabled></v-text-field>
                        <v-select label="Type" :items="damageResistances" v-model="type" disabled></v-select>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="error"
                               @click="deleteEntry()">Delete</v-btn>
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
        name: 'ResistanceListItem',
        props: {
            damageResistances: Array,
            resistance: Object
        },
        data() {
            return {
                amount: this.resistance.amount,
                showDialog: false,
                type: this.resistance.type
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', { arrayName: 'damageResistances', object: this.resistance })
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    id: this.resistance.id,
                    type: this.type
                }
                this.$emit('updateEntryEmit', { arrayName: 'damageResistances', object: object })
            }
        },
        watch: {
            amount() {
                this.updateEntry()
            },
            type() {
                this.updateEntry()
            }
        }
    }
</script>