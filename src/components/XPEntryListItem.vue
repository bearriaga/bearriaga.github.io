<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-text-field label="Amount" v-model="amount" type="number">
                    <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field label="Date" v-model="date" type="date"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-checkbox label="Class XP" v-model="classXP"></v-checkbox>
            </v-col>
            <v-col cols="12">
                <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>        
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
                classXP: this.entry.classXP,
                description: this.entry.description,
                date: this.entry.date
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.entry)
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    date: this.date,
                    id: this.entry.id
                }
                this.$emit('updateEntryEmit', object)
            }
        },
        watch: {
            amount() {
                this.updateEntry()
            },
            classXP() {
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