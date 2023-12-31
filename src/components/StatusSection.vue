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
                        <StatusListItem v-for="s, i in characterStatuses" :key="key(s, i)"
                                        @deleteEntryEmit="deleteDialog($event)"
                                        @moveEntryEmit="moveEntry($event, i)"
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
                            <v-select label="Status"
                                            :items="statuses.map((x) => ({ value: x, text: x.name }))"
                                            v-model="status.status"
                                            ref="status"
                                            :rules="statusNotNull"
                                            required>
                            </v-select>
                            <v-textarea label="Effect"
                                        v-model="status.status.effect"
                                        :disabled="status.status.name != 'Other'"
                                        auto-grow outlined rows="1"></v-textarea>
                            <v-text-field label="Type"
                                          v-model="status.status.type"
                                          :disabled="status.status.name != 'Other'"></v-text-field>
                            <v-autocomplete label="Damage Type"
                                            v-model="status.damageType"
                                            :items="damageTypes"
                                            v-if="status.status.name.includes('Damage') || status.status.name.includes('Invulnerable') || status.status.name.includes('Pacified') || status.status.name.includes('Vulnerable')"
                                            :rules="notNull"
                                            required></v-autocomplete>
                            <v-text-field v-if="status.status.ranked"
                                          label="Ranks"
                                          v-model="status.ranks"
                                          type="number"
                                          min="0"
                                          required></v-text-field>
                            <v-row>
                                <v-col cols="4">
                                    <v-switch label="Indefinite" inset v-model="status.indefinite"></v-switch>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field label="Duration (Rounds)"
                                                  v-if="!status.indefinite"
                                                  v-model="status.duration"
                                                  type="number"
                                                  min="0"
                                                  required></v-text-field>
                                </v-col>
                            </v-row>
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
            damageTypes: Array,
            panelProp: Number,
            statuses: Array,
            updateCharacter: Number,
            updateStatus: Number
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearStatus: {
                    damageType: '',
                    description: '',
                    duration: 0,
                    id: '',
                    indefinite: false,
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
                    damageType: '',
                    description: '',
                    duration: 1,
                    id: '',
                    indefinite: false,
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
            moveEntry(direction, index) {
                this.$emit('moveEntryEmit', { arrayName: 'statuses', index: index, direction: direction })
            },
            updateBuffEntry(object) {
                this.$emit('updateBuffEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'statuses', object: object })
            },
            // CRUD Functions End
            key(status, i) {
                let key = status.id + JSON.stringify(status.status) + status.isActive.toString() + i + this.updateCharacter + this.updateStatus

                if (status.description.includes(' Buff Status'))
                    key += status.description
                if (status.buffId)
                    key += status.buffId

                return key
            },
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