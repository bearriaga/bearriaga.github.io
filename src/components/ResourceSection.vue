<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            <v-icon color="purple">mdi-battery-50</v-icon>
                            Class Resources
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                            <v-btn icon color="primary"
                                   @click.stop="fillResources">
                                <v-icon>
                                    mdi-battery-sync
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <ResourceListItem v-for="resource in resources" :key="resource.key"
                                          :resource="resource"
                                          @deleteEntryEmit="deleteDialog($event)"
                                          @updateEntryEmit="updateEntryBypass($event)"
                                          @updateDialogEmit="updateDialog($event)"></ResourceListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Class Resource
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Name"
                                          v-model="resource.name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Resoure Purchases"
                                          type="number"
                                          v-model="resource.resourceIncreases"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-select label="Characteristic"
                                      v-model="resource.characteristic"
                                      :items="characteristics"
                                      :rules="textRules"
                                      required></v-select>
                        </v-form>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry()">Add</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry()">Save</v-btn>
                        <v-btn color="secondary"
                               @click="dialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import ResourceListItem from './ResourceListItem.vue'


    export default {
        name: 'ResourceSection',
        components: {
            ResourceListItem
        },
        props: {
            characteristics: Array,
            resources: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearResource: {
                    amount: 0,
                    amountMax: 0,
                    id: '',
                    name: '',
                    characteristic: '',
                    resourceIncreases: 0,
                },
                resource: {
                    amount: 0,
                    amountMax: 0,
                    id: '',
                    name: '',
                    characteristic: '',
                    resourceIncreases: 0
                },
                // Input Fields End
                panel: 0,
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
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
                    this.$emit('addEntryEmit', { arrayName: 'resources', object: this.resource })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'resources', object: this.resource })
            },
            updateEntryBypass(resource) {
                this.$emit('updateEntryEmit', { arrayName: 'resources', object: resource })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('updateEntryEmit', { arrayName: 'resources', object: this.resource })
                }
            },
            // CRUD Functions End
            fillResources() {
                this.$emit('fillResourcesEmit')
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.resource = JSON.parse(JSON.stringify(this.clearResource))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(resource) {
                this.resource = resource
                this.setDialog('Delete')
            },
            updateDialog(resource) {
                this.resource = resource
                this.setDialog('Edit')
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
        }
    }
</script>