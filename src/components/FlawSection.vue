<template>
    <div>
        <div>
            <h3 class="text-center">
                Flaws
                <v-btn icon color="primary"
                       @click="addDialog">
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </h3>
            <FlawListItem v-for="flaw in flaws" :key="flaw.id"
                          :flaw="flaw"
                          @deleteEntryEmit="deleteDialog($event)"
                          @updateEntryEmit="updateEntry($event)"></FlawListItem>
        </div>
        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Flaw
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Name"
                                          v-model="name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="amount"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-textarea label="Description"
                                        v-model="description"
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
    import FlawListItem from './FlawListItem.vue'

    export default {
        name: 'FlawSection',
        components: {
            FlawListItem
        },
        props: {
            flaws: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                amount: 1,
                description: '',
                name: '',
                flaw: {
                    amount: 1,
                    description: '',
                    id: '',
                    name: ''
                },
                // Input Fields End
                // Validation Start
                numberRules: [
                    v => !isNaN(parseInt(v)) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
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
                    this.flaw = {
                        amount: this.amount,
                        description: this.description,
                        id: null,
                        name: this.name
                    }
                    this.$emit('addEntryEmit', { arrayName: 'flaws', object: this.flaw })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'flaws', object: this.flaw })
            },
            updateEntry(flaw) {
                this.$emit('updateEntryEmit', { arrayName: 'flaws', object: flaw })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.flaw = {
                    amount: 1,
                    description: '',
                    id: '',
                    name: ''
                }
                this.setInputs(this.flaw)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(flaw) {
                this.flaw = this.flaws.find(x => { return x.id == flaw.id })
                this.setInputs(this.flaw)
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(flaw) {
                this.amount = flaw.amount
                this.description = flaw.description
                this.name = flaw.name
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>