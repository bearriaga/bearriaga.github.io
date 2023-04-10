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
                    <TooltipComponent slot="append" v-if="movement.description" :text="movement.description"></TooltipComponent>
                    <v-icon slot="append" color="primary" @click="moveEntry('down')" v-if="movement.canEdit">
                        mdi-arrow-down-bold
                    </v-icon>
                    <v-icon slot="append" color="primary" @click="moveEntry('up')" v-if="movement.canEdit">
                        mdi-arrow-up-bold
                    </v-icon>
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
        </v-row>
    </v-form>
</template>

<script>
    import TooltipComponent from './TooltipComponent.vue'
    export default {
        name: 'MovementListItem',
        components: {
            TooltipComponent
        },
        props: {
            movementApIcon: String,
            movementApIconColor: String,
            movement: Object
        },
        data() {
            return {
                amount: this.movement.amount
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.movement.id)
            },
            moveEntry(direction) {
                this.$emit('moveEntryEmit', direction)
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