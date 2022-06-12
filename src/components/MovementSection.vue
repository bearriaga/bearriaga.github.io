<template>
    <div>
        <div>
            <h3 class="text-center">
                Additional Movements
                <v-btn icon color="primary"
                       @click="showDialog = true">
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </h3>
            <MovementListItem v-for="entry in characterMovements" :key="entry.id"
                              :movement="entry"
                              :movementTypes="movementTypes"
                              @deleteEntryEmit="deleteEntry($event)"
                              @updateEntryEmit="updateEntry($event)">
            </MovementListItem>
        </div>
        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add Movement
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-text-field label="Amount" type="number" v-model="amount"></v-text-field>
                            <v-select label="Type" v-model="type" :items="movementTypes"></v-select>
                            <v-text-field label="Description" type="text" v-model="description"></v-text-field>
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
    import MovementListItem from './MovementListItem.vue'

    export default {
        name: 'MovementSection',
        components: {
            MovementListItem
        },
        props: {
            characterMovements: Array,
            movementTypes: Array

        },
        data() {
            return {
                amount: 0,
                description: '',
                type: '',
                showDialog: false
            }
        },
        methods: {
            addEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    id: null,
                    type: this.type
                }
                this.amount = 0
                this.description = ''
                this.type = ''
                this.showDialog = false
                this.$emit('addEntryEmit', { arrayName: 'movements', object: object })
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