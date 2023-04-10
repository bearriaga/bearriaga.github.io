<template>
    <v-form disabled>
        <v-text-field :label="movement.type"
                      v-model="amount"
                      v-if="movement.isUnique"
                      disabled readonly>
            <v-icon :color="movementApIconColor"
                    slot="append"
                    @click="subtractAP()">{{movementApIcon}}</v-icon>
        </v-text-field>
        <v-row v-if="!movement.isUnique">
            <v-col cols="12">
                <v-text-field :label="movement.type" v-model="amount" type="number" readonly>
                    <v-icon :color="movementApIconColor"
                            slot="append"
                            @click="subtractAP()">{{movementApIcon}}</v-icon>
                    <v-icon color="primary"
                            slot="append"
                            @click="updateEntry"
                            v-if="movement.canEdit">mdi-pen</v-icon>
                    <v-icon color="error"
                            slot="append"
                            @click="deleteEntry"
                            v-if="movement.canEdit">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-textarea label="Description" v-model="description" v-if="description" auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
    export default {
        name: 'MovementListItem',
        props: {
            movementApIcon: String,
            movementApIconColor: String,
            movement: Object
        },
        data() {
            return {
                amount: this.movement.amount,
                description: this.movement.description
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.movement.id)
            },
            subtractAP() {
                this.$emit('subtractAP', 1)
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.movement.id)
            }
        }
    }
</script>