<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Damage Modifications
                            <v-btn icon color="primary"
                                   @click.stop="addDialog"
                                   v-if="canEdit">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="6" v-for="damageModification in damageModifications" :key="damageModification.key">
                                <DamageModificationListItem :can-edit="canEdit"
                                                            :damage-groups="damageGroups"
                                                            :damage-types="damageTypes"
                                                            :damage-modification="damageModification"
                                                            @updateDialogEmit="updateDialog($event)"></DamageModificationListItem>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Damage Modification
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid">
                            <v-autocomplete label="Type"
                                            :items="damageTypes"
                                            v-model="type"
                                            :rules="textRules"
                                            required></v-autocomplete>
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="amount"
                                          ref="amount"
                                          required></v-text-field>
                            <v-row>
                                <v-col>
                                    <v-switch label="Resistance" inset
                                                v-model="isResistance"></v-switch>
                                </v-col>
                                <v-col>
                                    <v-switch label="Vulnerability" inset
                                                v-model="isVulnerability"></v-switch>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry">Save</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Edit'"
                               @click="deleteEntry">Delete</v-btn>
                        <v-btn color="secondary"
                               @click="dialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import DamageModificationListItem from './DamageModificationListItem.vue'

    export default {
        name: 'DamageModificationSection',
        components: {
            DamageModificationListItem
        },
        props: {
            canEdit: Boolean,
            damageModifications: Array,
            damageGroups: Array,
            damageTypes: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                amount: 1,
                isVulnerability: false,
                isResistance: false,
                type: '',
                damageModification: {
                    amount: 1,
                    id: '',
                    isVulnerability: false,
                    isResistance: false,
                    type: ''
                },
                // Input Fields End
                panel: null,
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.damageModification = {
                        amount: this.amount,
                        id: null,
                        isVulnerability: this.isVulnerability,
                        isResistance: this.isResistance,
                        type: this.type
                    }
                    this.$emit('addEntryEmit', { arrayName: 'damageModifications', object: this.damageModification })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'damageModifications', object: this.damageModification })
            },
            updateEntry() {
                let damageModification = {
                    amount: this.amount,
                    id: this.damageModification.id,
                    isVulnerability: this.isVulnerability,
                    isResistance: this.isResistance,
                    type: this.type
                }
                this.dialog.show = false
                this.$emit('updateEntryEmit', { arrayName: 'damageModifications', object: damageModification })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.damageModification = {
                    amount: 1,
                    id: '',
                    isVulnerability: false,
                    isResistance: false,
                    type: ''
                }
                this.setInputs(this.damageModification)
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            updateDialog(damageModification) {
                this.damageModification = this.damageModifications.find(x => { return x.id == damageModification.id })
                this.setInputs(this.damageModification)
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(damageModification) {
                this.amount = damageModification.amount
                this.type = damageModification.type
                this.isVulnerability = damageModification.isVulnerability
                this.isResistance = damageModification.isResistance
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>