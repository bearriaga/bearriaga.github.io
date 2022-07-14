<template>
    <div>
        <h3 class="text-center">
            {{sectionTitle}}
            <v-btn icon color="primary"
                   @click="addDialog">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <ClassListItem v-for="c in classes" :key="c.id"
                       @updateEntryEmit="updateEntry($event)"
                       @deleteEntryEmit="deleteDialog($event)"
                       :characteristics="characteristics"
                       :class-obj="c"></ClassListItem>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Class
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Class Name"
                                          v-model="name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                            <v-select label="Primary Characteristic"
                                      :items="characteristics"
                                      v-model="characteristic"
                                      :rules="textRules"
                                      required></v-select>
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
    import ClassListItem from './ClassListItem.vue'

    export default {
        name: 'ClassSection',
        components: {
            ClassListItem
        },
        props: {
            unlocked: Boolean,
            characteristics: Array,
            classes: Array
        },
        computed: {
            sectionTitle() {
                return (this.unlocked) ? 'Unlocked Classes' : 'Classes'
            }
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                active: !this.unlocked,
                advanceRank: 0,
                description: '',
                name: '',
                characteristic: '',
                classObj: {
                    active: this.active,
                    advanceRank: 0,
                    description: '',
                    id: '',
                    name: '',
                    characteristic: '',
                    unlocked: this.unlocked
                },
                // Input Fields End
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
                    this.classObj = {
                        active: this.active,
                        advanceRank: this.advanceRank,
                        description: this.description,
                        id: null,
                        name: this.name,
                        characteristic: this.characteristic,
                        unlocked: this.unlocked
                    }
                    this.$emit('addEntryEmit', { arrayName: 'classes', object: this.classObj })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'classes', object: this.classObj })
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'classes', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.classObj = {
                    active: this.active,
                    advanceRank: 0,
                    description: '',
                    id: '',
                    name: '',
                    characteristic: '',
                    unlocked: this.unlocked
                }
                this.setInputs(this.classObj)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(classObj) {
                this.classObj = this.classes.find(x => { return x.id == classObj.id })
                this.setInputs(this.classObj)
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(classObj) {
                this.description = classObj.description
                this.name = classObj.name
                this.characteristic = classObj.characteristic
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>