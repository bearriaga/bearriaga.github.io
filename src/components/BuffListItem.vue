<template>
    <div>
        <v-form>
            <v-checkbox label="Is Active"
                        v-model="isActive"></v-checkbox>
            <v-text-field label="Name" v-model="name">
                <v-icon slot="append" color="primary"
                        @click="updateDialog">mdi-pen</v-icon>
                <v-icon slot="append" color="error"
                        @click="deleteEntry">mdi-delete</v-icon>
            </v-text-field>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            <h3 class="text-center">Adjustments</h3>
            <div v-for="a, index in adjustments" :key="index">
                <v-text-field :label="returnLabel(a)"
                              v-model="a.amount"
                              v-if="a.type != 'Status'"
                              type="number"
                              disabled></v-text-field>
                <v-text-field :label="returnLabel(a)"
                              v-model="a.status.duration"
                              v-if="a.type == 'Status'"
                              type="number"
                              disabled></v-text-field>
            </div>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'BuffListItem',
        props: {
            buff: Object
        },
        data() {
            return {
                description: this.buff.description,
                isActive: this.buff.isActive,
                name: this.buff.name,
                adjustments: this.buff.adjustments
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.buff)
            },
            returnLabel(adjustment) {
                let label = adjustment.type

                if (adjustment.type == 'CHAR')
                    label += ' - ' + adjustment.characteristic
                if (adjustment.type == 'Damage Resistance')
                    label += ' - ' + adjustment.resistanceType
                if (adjustment.type == 'Status') {
                    label += ' - ' + adjustment.status.status.name
                    if (adjustment.status.status.name.includes('{rank}'))
                        label += ' ' + adjustment.status.ranks + ' Duration'
                }

                return label
            },
            updateDialog() {
                let buff = {
                    description: this.description,
                    isActive: this.isActive,
                    id: this.buff.id,
                    name: this.name,
                    adjustments: JSON.parse(JSON.stringify(this.adjustments)),
                }
                this.$emit('updateDialogEmit', buff)
            },
            updateEntry() {
                let buff = {
                    description: this.description,
                    isActive: this.isActive,
                    id: this.buff.id,
                    name: this.name,
                    adjustments: JSON.parse(JSON.stringify(this.adjustments)),
                }
                this.$emit('updateEntryEmit', buff)
            }
        },
        watch: {
            description() {
                this.updateEntry()
            },
            isActive() {
                this.updateEntry()
            },
            name() {
                this.updateEntry()
            }
        }
    }
</script>