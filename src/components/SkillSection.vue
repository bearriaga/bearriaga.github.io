<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Skills
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>                        
                        <SkillListItem v-for="skill in skills" :key="skill.key"
                                       :skill="skill"
                                       @deleteEntryEmit="deleteDialog($event)"
                                       @updateEntryEmit="updateDialog($event)"
                                       @rollDiceCheckEmit="rollDiceCheckEmit($event)"></SkillListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Skill
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Name"
                                          v-model="skill.name"
                                          v-if="!skill.default"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Skill Dice Purchases"
                                          type="number"
                                          v-model="skill.skillIncreases"
                                          ref="skillIncreases"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-text-field label="Skill Successes"
                                          type="number"
                                          v-model="skill.successes"
                                          ref="skillIncreases"
                                          :rules="numberRules"
                                          required></v-text-field>
                            <v-select label="Characteristic"
                                      v-model="skill.characteristic"
                                      v-if="!skill.default"
                                      :items="characteristics"
                                      :rules="textRules"
                                      required></v-select>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
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
    import SkillListItem from './SkillListItem.vue'

    export default {
        name: 'SkillSection',
        components: {
            SkillListItem
        },
        props: {
            characteristics: Array,
            panelProp: Number,
            skills: Array
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearSkill: {
                    characteristic: '',
                    default: false,
                    id: '',
                    name: '',
                    skillIncreases: 0,
                    successes: 0,
                    value: 0
                },
                skill: {
                    characteristic: '',
                    default: false,
                    id: '',
                    name: '',
                    skillIncreases: 0,
                    successes: 0,
                    value: 0
                },
                // Input Fields End
               panel: this.panelProp,
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) || 'Field may not be empty'
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
                    this.$emit('addEntryEmit', { arrayName: 'skills', object: this.skill })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'skills', object: this.skill })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('updateEntryEmit', { arrayName: 'skills', object: this.skill })
                }
            },
            // CRUD Functions End
            rollDiceCheckEmit(value) {
                this.$emit('rollDiceCheckEmit', value)
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.skill = JSON.parse(JSON.stringify(this.clearSkill))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(skill) {
                this.skill = skill
                this.setDialog('Delete')
            },
            updateDialog(skill) {
                this.skill = skill
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
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'skillPanel', value: this.panel })
            }
        }
    }
</script>