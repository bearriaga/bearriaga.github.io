<template>
    <div>
        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        {{sectionTitle}}
                        <v-btn icon color="primary"
                               @click.stop="addDialog">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <ClassListItem v-for="c, i in classes" :key="c.id"
                                   @updateEntryEmit="updateEntry($event)"
                                   @deleteEntryEmit="deleteDialog($event)"
                                   @moveEntryEmit="moveEntry($event, i)"
                                   :characteristics="characteristics"
                                   :class-obj="c"></ClassListItem>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

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
                                          v-model="classObj.name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="classObj.description" auto-grow outlined rows="1"></v-textarea>
                            <v-select label="Primary Characteristic"
                                      :items="characteristics"
                                      v-model="classObj.characteristic"
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
            characteristics: Array,
            classes: Array,
            panelProp: Number,
            unlocked: Boolean
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
                classObj: {
                    active: !this.unlocked,
                    description: '',
                    id: '',
                    name: '',
                    characteristic: '',
                    unlocked: this.unlocked
                },
                clearClassObj: {
                    active: !this.unlocked,
                    description: '',
                    id: '',
                    name: '',
                    characteristic: '',
                    unlocked: this.unlocked
                },
                // Input Fields End
                panel: this.panelProp,
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
                    this.$emit('addEntryEmit', { arrayName: 'classes', object: this.classObj })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'classes', object: this.classObj })
            },
            moveEntry(direction, index) {
                this.$emit('moveEntryEmit', { arrayName: 'classes', index: index, direction: direction })
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'classes', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.classObj = JSON.parse(JSON.stringify(this.clearClassObj))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(classObj) {
                this.classObj = classObj
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
                this.$emit('updatePanelEmit', { name: (this.unlocked) ? 'classUnlockedPanel' : 'classPanel', value: this.panel })
            }
        }
    }
</script>