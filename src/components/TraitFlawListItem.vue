<template>
    <div>
        <v-row>
            <v-col>
                <v-text-field label="Name" v-model="name">
                    <v-icon slot="append" color="primary" @click="moveEntry('down')">
                        mdi-arrow-down-bold
                    </v-icon>
                    <v-icon slot="append" color="primary" @click="moveEntry('up')">
                        mdi-arrow-up-bold
                    </v-icon>
                    <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
            <v-col>
                <v-text-field label="Amount" v-model="amount" type="number" min="1"></v-text-field>
            </v-col>
        </v-row>
        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
    </div>
</template>

<script>
    export default {
        name: 'TraitFlawListItem',
        props: {
            item: Object
        },
        data() {
            return {
                amount: this.item.amount,
                description: this.item.description,
                name: this.item.name
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.item)
            },
            moveEntry(direction) {
                this.$emit('moveEntryEmit', direction)
            },
            updateEntry() {
                var object = {
                    amount: this.amount,
                    description: this.description,
                    id: this.item.id,
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