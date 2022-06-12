<template>
    <div>
        <v-text-field label="Amount" v-model="amount" type="number">
            <v-icon color="error" slot="append" @click="showDialog = true">mdi-delete</v-icon>
        </v-text-field>
        <v-select label="Type" :items="movementTypes" v-model="type"></v-select>
        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Delete Movement
                    </v-card-title>

                    <v-card-text>
                        Are you sure you want to delete this movement?
                        <v-text-field label="Amount" v-model="amount" type="number" disabled></v-text-field>
                        <v-select label="Type" :items="movementTypes" v-model="type" disabled></v-select>
                        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" disabled></v-textarea>
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
        name: 'MovementListItem',
        props: {
            movementTypes: Array,
            movement: Object
        },
        data() {
            return {
                amount: this.movement.amount,
                description: this.movement.description,
                showDialog: false,
                type: this.movement.type
            }
        },
        methods: {
            deleteEntry() {
                this.showDialog = false
                this.$emit('deleteEntryEmit', { arrayName: 'movements', object: this.movement })
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    id: this.movement.id,
                    type: this.type
                }
                this.$emit('updateEntryEmit', { arrayName: 'movements', object: object })
            }
        },
        watch: {
            amount() {
                this.updateEntry()
            },
            description() {
                this.updateEntry()
            },
            type() {
                this.updateEntry()
            }
        }
    }
</script>