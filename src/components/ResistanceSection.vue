<template>
    <div>
        <h3 class="text-center">
            Damage Resistances
            <v-btn icon color="primary"
                   @click="showDialog = true">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <div>
            <ResistanceListItem v-for="resistance in characterResistances" :key="resistance.id"
                                :resistance="resistance"
                                :damageResistances="damageResistances"
                                @deleteEntryEmit="deleteEntry($event)"
                                @updateEntryEmit="updateEntry($event)"></ResistanceListItem>
        </div>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add Resistance
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Amount" type="number" v-model="amount"></v-text-field>
                                    <v-select label="Type" :items="damageResistances" v-model="type"></v-select>
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
    import ResistanceListItem from './ResistanceListItem.vue'

    export default {
        name: 'ResistanceSection',
        components: {
            ResistanceListItem
        },
        props: {
            characterResistances: Array,
            damageResistances: Array
        },
        data() {
            return {
                amount: 0,
                showDialog: false,
                type: ''
            }
        },
        methods: {
            addEntry() {
                var object = {
                    amount: this.amount,
                    id: null,
                    type: this.type
                }
                this.amount = 0
                this.showDialog = false
                this.type = ''
                this.$emit('addEntryEmit', { arrayName: 'damageResistances', object: object })
            },
            deleteEntry(object) {
                this.$emit('deleteEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', object)
            }
        }
    }
</script>