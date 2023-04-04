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
                        <v-spacer></v-spacer>
                        Available XP: {{xp}}
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
                                          max="5"
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
                            <v-switch label="Specific Skill (Requires GM Approval)" inset
                                      v-model="skill.isSpecific" v-if="!skill.default">
                            </v-switch>
                        </v-form>
                        <div v-if="xpCost">
                            <v-text-field label="XP Cost" v-model="xpCost" disabled readonly></v-text-field>
                            <RefundedXP v-if="tier && xpCost > 0" :tier="tier" :xp-cost="xpCost"></RefundedXP>
                        </div>
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
    import RefundedXP from './RefundedXP.vue'
    import SkillListItem from './SkillListItem.vue'

    export default {
        name: 'SkillSection',
        components: {
            RefundedXP,
            SkillListItem
        },
        props: {
            characteristics: Array,
            panelProp: Number,
            skills: Array,
            tier: Number,
            xp: Number
        },
        computed: {
            xpCost() {
                let cost = 0

                if (this.skill.skillIncreases > 0 && !this.skill.isSpecific)
                    cost = +cost + +Math.floor(50 * (Math.abs(this.skill.skillIncreases) * (+this.skill.skillIncreases + 1) / 2))
                if (this.skill.skillIncreases > 0 && this.skill.isSpecific)
                    cost = +cost + +(30 * this.skill.skillIncreases)
                if (this.skill.skillIncreases < 0)
                    cost = +cost + +(this.skill.skillIncreases * 30)
                if (this.skill.successes > 0)
                    cost = +cost + +Math.floor(80 * (Math.abs(this.skill.successes) * (+this.skill.successes + 1) / 2))
                if (this.skill.successes < 0)
                    cost = +cost + +(this.skill.successes * 120)

                return cost
            }
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
                    isSpecific: false,
                    name: '',
                    skillIncreases: 0,
                    successes: 0,
                    value: 0
                },
                skill: {
                    characteristic: '',
                    default: false,
                    id: '',
                    isSpecific: false,
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