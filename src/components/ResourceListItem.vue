<template>
    <div>
        <v-progress-linear :value="bar"
                           height="25">
            {{amount}}/{{resource.amountMax}}
        </v-progress-linear>
        <v-text-field :label="resource.name"
                      type="number"
                      min="0"
                      v-model="amount">
            <v-icon color="green" slot="append" @click="add">mdi-plus</v-icon>
            <v-icon color="red" slot="append" @click="subtract">mdi-minus</v-icon>
            <v-icon color="primary" slot="append" @click="updateDialog">mdi-pen</v-icon>
            <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'ResourceListItem',
        props: {
            resource: Object
        },
        computed: {
            bar() {
                return this.amount * 100 / this.resource.amountMax
            }
        },
        data() {
            return {
                amount: this.resource.amount
            }
        },
        methods: {
            add() {
                this.amount = +this.amount + 1
            },
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.resource)
            },
            subtract() {
                if (this.amount > 0)
                    this.amount = +this.amount - 1
            },
            updateEntry() {
                let resource = JSON.parse(JSON.stringify(this.resource))
                resource.amount = +this.amount
                this.$emit('updateEntryEmit', resource)
            },
            updateDialog() {
                this.$emit('updateDialogEmit', this.resource)
            }
        },
        watch: {
            amount() { this.updateEntry() }
        }
    }
</script>