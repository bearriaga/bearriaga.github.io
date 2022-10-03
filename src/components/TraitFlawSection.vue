<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            {{sectionHeader}}s
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <TraitFlawListItem v-for="item in items" :key="item.key"
                                           :item="item"
                                           @deleteEntryEmit="deleteDialog($event)"
                                           @updateEntryEmit="updateEntry($event)"></TraitFlawListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} {{sectionHeader}}
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Name"
                                          v-model="item.name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="item.amount"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-textarea label="Description"
                                        v-model="item.description"
                                        auto-grow outlined rows="1"></v-textarea>
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
    import TraitFlawListItem from './TraitFlawListItem.vue'

    export default {
        name: 'TraitFlawSection',
        components: {
            TraitFlawListItem
        },
        props: {
            isFlaw: Boolean,
            items: Array
        },
        computed: {
            arrayName() {
                return (this.isFlaw) ? 'flaws' : 'traits'
            },
            sectionHeader() {
                return (this.isFlaw) ? 'Flaw' : 'Trait'
            }
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearItem: {
                    amount: 1,
                    description: '',
                    id: '',
                    name: ''
                },
                item: {
                    amount: 1,
                    description: '',
                    id: '',
                    name: ''
                },
                // Input Fields End
                panel: 0,
                // Validation Start
                numberRules: [
                    v => !isNaN(+v) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
                ],
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
                    this.$emit('addEntryEmit', { arrayName: this.arrayName, object: this.item })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: this.arrayName, object: this.item })
            },
            updateEntry(item) {
                this.$emit('updateEntryEmit', { arrayName: this.arrayName, object: item })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.item = JSON.parse(JSON.stringify(this.clearItem))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(item) {
                this.item = item
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
        }
    }
</script>