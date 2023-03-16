<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Statuses
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <StatusListItem v-for="s in characterStatuses" :key="s.key"
                                        @deleteEntryEmit="deleteDialog($event)"
                                        @updateBuffEntryEmit="updateBuffEntry($event)"
                                        @updateEntryEmit="updateEntry($event)"
                                        :status="s"
                                        :statuses="statuses"></StatusListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Status
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-autocomplete label="Status"
                                            :items="statuses.map((x) => ({ value: x, text: x.name }))"
                                            v-model="status.status"
                                            ref="status"
                                            :rules="statusNotNull"
                                            required>
                            </v-autocomplete>
                            <v-textarea label="Effect"
                                        v-model="status.status.effect"
                                        :disabled="status.status.name != 'Other'"
                                        auto-grow outlined rows="1"></v-textarea>
                            <v-text-field label="Type"
                                          v-model="status.status.type"
                                          :disabled="status.status.name != 'Other'"></v-text-field>
                            <v-select label="Characteristic"
                                      v-model="status.characteristic"
                                      :items="characteristics"
                                      v-if="status.status.name.includes('{CHAR}')"
                                      :rules="notNull"
                                      required></v-select>
                            <v-autocomplete label="Damage Type"
                                            v-model="status.damageType"
                                            :items="damageTypes"
                                            v-if="status.status.name.includes('{Group}') || status.status.name.includes('{Type}')"
                                            :rules="notNull"
                                            required></v-autocomplete>
                            <v-text-field v-if="status.status.ranked"
                                          label="Ranks"
                                          v-model="status.ranks"
                                          type="number"
                                          min="0"
                                          required></v-text-field>
                            <v-text-field label="Duration (Rounds)"
                                          v-model="status.duration"
                                          type="number"
                                          min="0"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="status.description" auto-grow outlined rows="1" required></v-textarea>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
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
    import StatusListItem from './StatusListItem.vue'
    
    export default {
        name: 'StatusSection',
        components: {
            StatusListItem
        },
        props: {
            characterStatuses: Array,
            characteristics: Array,
            damageTypes: Array,
            panelProp: Number,
            statuses: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearStatus: {
                    characteristic: '',
                    damageType: '',
                    description: '',
                    duration: 0,
                    id: '',
                    isActive: true,
                    ranks: 0,
                    status: {
                        cost: '',
                        effect: '',
                        name: '',
                        type: ''
                    }
                },
                status: {
                    characteristic: '',
                    damageType: '',
                    description: '',
                    duration: 1,
                    id: '',
                    isActive: true,
                    ranks: 1,
                    status: {
                        cost: '',
                        effect: '',
                        name: '',
                        type: ''
                    }
                },
                // Input Fields End
                panel: this.panelProp,
                // Validation Start
                notNull: [
                    v => !!v || 'Field may not be empty'
                ],
                statusNotNull: [
                    v => !!v.name || 'Field may not be empty'
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
                    this.$emit('addEntryEmit', { arrayName: 'statuses', object: this.status })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'statuses', object: this.status })
            },
            updateBuffEntry(object) {
                this.$emit('updateBuffEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'statuses', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.status = JSON.parse(JSON.stringify(this.clearStatus))
                setTimeout(() => {
                    this.$refs.status.focus()
                }, 200)
            },
            deleteDialog(status) {
                this.status = status
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'statusPanel', value: this.panel })
            }
        }
    }
</script>