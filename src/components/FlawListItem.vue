<template>
    <div>
        <v-text-field label="Name" v-model="name">
            <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
        </v-text-field>
        <v-text-field label="Amount" v-model="amount" type="number"></v-text-field>
        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
    </div>
</template>

<script>
    export default {
        name: 'FlawListItem',
        props: {
            flaw: Object
        },
        data() {
            return {
                amount: this.flaw.amount,
                description: this.flaw.description,
                name: this.flaw.name
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.flaw)
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    id: this.flaw.id,
                    name: this.name
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
            date() {
                this.updateEntry()
            }
        }
    }
</script>