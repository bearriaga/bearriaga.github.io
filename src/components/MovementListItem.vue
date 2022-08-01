<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-text-field label="Amount" v-model="amount" type="number">
                    <v-icon color="error"
                            slot="append"
                            @click="subtractAP()">mdi-clock-minus-outline</v-icon>
                    <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-select label="Type" :items="movementTypes" v-model="type"></v-select>
            </v-col>
            <v-col cols="12">
                <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>
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
                var object = {
                    amount: this.amount,
                    description: this.description,
                    id: this.movement.id,
                    type: this.type
                }
                this.$emit('updateEntryEmit', object)
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