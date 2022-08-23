<template>
    <div>
        <template>
            <v-expansion-panels>
                <v-expansion-panel v-for="(item,i) in 1" :key="i">
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
                                      v-model="selectedStatus"
                                      ref="status"
                                      :rules="notNull"
                                      required>
                            </v-autocomplete>
                            <v-textarea label="Effect"
                                        v-model="selectedStatus.effect"
                                        :disabled="selectedStatus.name != 'Other'"
                                        auto-grow outlined rows="1"></v-textarea>
                            <v-text-field label="Type"
                                          v-model="selectedStatus.type"
                                          :disabled="selectedStatus.name != 'Other'"></v-text-field>
                            <v-text-field label="Ranks"
                                          v-model="ranks"
                                          type="number"
                                          min="0"
                                          v-if="selectedStatus.name.includes('{rank}')"
                                          required></v-text-field>
                            <v-text-field label="Duration (Rounds)"
                                          v-model="duration"
                                          type="number"
                                          min="0"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" required></v-textarea>
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
            statuses: Array,
            characterStatuses: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                description: '',
                duration: 0,
                isActive: true,
                ranks: 0,
                selectedStatus: {
                    cost: '',
                    effect: '',
                    name: '',
                    type: ''
                },
                status: {
                    description: '',
                    duration: 1,
                    isActive: true,
                    ranks: 1,
                    status: {}
                },
                // Input Fields End
                notNull: [
                    v => !!v.name || 'Field may not be empty'
                ],
                valid: false
            }
        },
        methods: {
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.status = {
                        description: this.description,
                        duration: this.duration,
                        id: null,
                        isActive: this.isActive,
                        ranks: this.ranks,
                        status: {
                            cost: this.selectedStatus.cost,
                            effect: this.selectedStatus.effect,
                            name: this.selectedStatus.name,
                            type: this.selectedStatus.type
                        }
                    }
                    this.$emit('addEntryEmit', { arrayName: 'statuses', object: this.status })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'statuses', object: this.status })
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'statuses', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.status = {
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
                }
                this.setInputs(this.status)
                setTimeout(() => {
                    this.$refs.status.focus()
                }, 200)
            },
            deleteDialog(status) {
                this.status = this.characterStatuses.find(x => { return x.id == status.id })
                this.setInputs(this.status)
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(status) {
                this.description = status.description
                this.duration = status.duration
                this.isActive = status.isActive
                this.ranks = status.ranks
                this.selectedStatus = status.status
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>