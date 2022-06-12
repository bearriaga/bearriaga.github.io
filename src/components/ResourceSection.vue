<template>
    <div>
        <h3 class="text-center">
            Class Resources
            <v-btn icon color="primary"
                   @click="addDialog">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <ResourceListItem v-for="resource in resources" :key="resource.key"
                          :resource="resource"
                          @deleteEntryEmit="deleteDialog($event)"
                          @updateEntryEmit="updateDialog($event)"></ResourceListItem>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Class Resource
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-form ref="form"
                                    v-model="valid"
                                    :disabled="dialog.type == 'Delete'">
                                <v-text-field label="Name"
                                              v-model="name"
                                              ref="name"
                                              :rules="textRules"
                                              required></v-text-field>
                                <v-text-field label="Resoure Purchases"
                                              type="number"
                                              v-model="resourceIncreases"
                                              :rules="numberRules"
                                              required></v-text-field>
                                <v-select label="Characteristic"
                                          v-model="primaryCharacteristic"
                                          :items="characteristics"
                                          :rules="textRules"
                                          required></v-select>
                            </v-form>
                        </v-container>
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
                name: '',
                primaryCharacteristic: '',
                resourceIncreases: 0,
                resource: {
                    amount: 0,
                    amountMax: 0,
                    id: '',
                    name: '',
                    primaryCharacteristic: '',
                    resourceIncreases: 0
                },
                // Input Fields End
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(parseInt(v)) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
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
                    this.setObject()
                    this.$emit('addEntryEmit', { arrayName: 'resources', object: this.resource })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'resources', object: this.resource })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.setObject()
                    this.$emit('updateEntryEmit', { arrayName: 'resources', object: this.resource })
                }
            },
            setObject() {
                this.resource.name = this.name
                this.resource.primaryCharacteristic = this.primaryCharacteristic
                this.resource.resourceIncreases = this.resourceIncreases
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.resource = {
                    amount: 0,
                    amountMax: 0,
                    id: '',
                    name: '',
                    primaryCharacteristic: '',
                    resourceIncreases: 0
                }
                this.setInputs(this.resource)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(resource) {
                this.resource = resource
                this.setInputs(this.resource)
                this.setDialog('Delete')
            },
            updateDialog(resource) {
                this.resource = resource
                this.setInputs(this.resource)
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(resource) {
                this.primaryCharacteristic = resource.primaryCharacteristic
                this.name = resource.name
                this.resourceIncreases = resource.resourceIncreases
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>