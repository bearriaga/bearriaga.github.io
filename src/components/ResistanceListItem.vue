<template>
    <!-- Update to be like the AC in DND Beyond to have the color of the matching damage, a small label on top,and the resistance amount below -->
    <div>
        <v-text-field label="Amount" v-model="amount" type="number">
            <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
        </v-text-field>
        <v-select label="Type" :items="damageTypes" v-model="type"></v-select>        
    </div>
</template>

<script>
    export default {
        name: 'ResistanceListItem',
        props: {
            damageTypes: Array,
            resistance: Object
        },
        data() {
            return {
                amount: this.resistance.amount,
                type: this.resistance.type
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.resistance)
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    id: this.resistance.id,
                    type: this.type
                }
                this.$emit('updateEntryEmit', object)
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