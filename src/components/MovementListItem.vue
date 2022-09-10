<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-text-field label="Amount" v-model="amount" type="number" :disabled="movement.isBuff" :readonly="movement.isBuff">
                    <v-icon :color="movementApIconColor"
                            slot="append"
                            @click="subtractAP()">{{movementApIcon}}</v-icon>
                    <v-icon color="error"
                            slot="append"
                            @click="deleteEntry"
                            v-if="!movement.isBuff">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-autocomplete label="Type"
                                :items="movementTypes"
                                v-model="type"
                                :disabled="movement.isBuff"></v-autocomplete>
            </v-col>
            <v-col cols="12">
                <v-textarea label="Description"
                            v-model="description"
                            :disabled="movement.isBuff"
                            auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'MovementListItem',
        props: {
            ap: Number,
            movementApIcon: String,
            movementApIconColor: String,
            movementTypes: Array,
            movement: Object
        },
        data() {
            return {
                amount: this.movement.amount,
                description: this.movement.description,
                type: this.movement.type
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.movement)
            },
            subtractAP() {
                this.$emit('subtractAP', 1)
            },
            updateEntry() {
                if (!this.movement.isBuff) {
                    var object = {
                        amount: this.amount,
                        description: this.description,
                        id: this.movement.id,
                        type: this.type
                    }
                    this.$emit('updateEntryEmit', object)
                }
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