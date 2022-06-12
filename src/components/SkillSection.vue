<template>
    <div>
        <h3 class="text-center">
            Skills
            <v-btn icon color="primary"
                   @click="openAddDialog">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <div>
            <SkillListItem v-for="skill in skills" :key="skill.key"
                           :characteristics="characteristics"
                           :skill="skill"
                           @deleteEntryEmit="deleteEntry($event)"
                           @updateEntryEmit="updateEntry($event)"
                           @rollDiceCheckEmit="rollDiceCheck($event)"></SkillListItem>
        </div>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.title}}
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-form ref="form"
                                    v-model="valid">
                                <v-text-field label="Name"
                                              v-model="name"
                                              ref="name"
                                              :rules="textRules"
                                              required></v-text-field>
                                <v-text-field label="Skill Purchases"
                                              type="number"
                                              v-model="skillIncreases"
                                              :rules="numberRules"
                                              required></v-text-field>
                                <v-select label="Characteristic"
                                          v-model="characteristic"
                                          :items="characteristics"
                                          :rules="textRules"
                                          required></v-select>
                            </v-form>

                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary"
                               v-if="dialog.type == 'add'"
                               :disabled="!valid"
                               @click="addEntry">Add</v-btn>
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
            skills: Array
        },
        data() {
            return {
                characteristic: '',
                dialog: {
                    show: false,
                    title: '',
                    type: ''
                },
                name: '',
                skillIncreases: 0,
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(parseInt(v)) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
                ],
                valid: false
            }
        },
        methods: {
            addEntry() {
                if (this.validate()) {
                    var object = {
                        characteristic: this.characteristic,
                        default: false,
                        id: null,
                        name: this.name,
                        skillIncreases: this.skillIncreases,
                        value: this.amount
                    }
                    this.dialog.show = false
                    this.reset()
                    this.$emit('addEntryEmit', { arrayName: 'skills', object: object })
                }
            },
            deleteEntry(object) {
                this.$emit('deleteEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', object)
            },
            rollDiceCheck(value) {
                this.$emit('rollDiceCheckEmit', value)
            },
            // Open Dialog Functions
            openAddDialog() {
                this.dialog = {
                    show: true,
                    title: "Add Skill",
                    type: 'add',
                    skill: {}
                }

                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            },
            reset() {
                this.$refs.form.reset()
            },
            resetValidation() {
                this.$refs.form.resetValidation()
            }
        }
    }
</script>