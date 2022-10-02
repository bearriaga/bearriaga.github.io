<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Buffs
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <BuffListItem v-for="b in buffs" :key="b.key"
                                      :buff="b"
                                      :resources="resources"
                                      @deleteDialogEmit="deleteDialog($event)"
                                      @updateDialogEmit="updateDialog($event)"
                                      @updateEntryEmit="updateEntryBypass($event)"></BuffListItem>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Buff
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Name"
                                          v-model="buff.name"
                                          ref="name"
                                          :rules="notNull"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="buff.description" auto-grow outlined rows="1" required></v-textarea>
                            <h3 class="text-center">
                                Adjustments
                                <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                       @click="addAdjustment">
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </h3>
                            <div v-for="a, index in buff.adjustments" :key="index">
                                <v-autocomplete label="Type"
                                                :items="buffOptions"
                                                v-model="a.type"
                                                :rules="notNull"
                                                required>
                                    <v-icon color="error" slot="append" @click="deleteAdjustment(index)">mdi-delete</v-icon>
                                </v-autocomplete>
                                <v-select label="Characteristic"
                                          v-model="a.characteristic"
                                          :items="characteristics"
                                          v-if="a.type == 'CHAR' || a.type == 'Skill'"
                                          :rules="notNull"
                                          required></v-select>
                                <v-select label="Class Resource"
                                          :items="resources.map((x) => ({ value: x.id, text: x.name }))"
                                          v-model="a.classResource"
                                          v-if="a.type == 'Class Resource: Commited'"></v-select>
                                <v-autocomplete label="Movement Type"
                                                v-model="a.movementType"
                                                :items="movementTypes"
                                                v-if="a.type == 'Movement'"
                                                :rules="notNull"
                                                required></v-autocomplete>
                                <!-- Damage Modification Fields -->
                                <v-autocomplete label="Damage Modification Type"
                                                v-model="a.damageModification.type"
                                                :items="damageTypes"
                                                v-if="a.type == 'Damage Modification'"
                                                :rules="notNull"
                                                required></v-autocomplete>
                                <v-row>
                                    <v-col>
                                        <v-switch label="Resistance" inset
                                                  v-model="a.damageModification.isResistance"
                                                  v-if="a.type == 'Damage Modification'"></v-switch>
                                    </v-col>
                                    <v-col>
                                        <v-switch label="Vulnerability" inset
                                                  v-model="a.damageModification.isVulnerability"
                                                  v-if="a.type == 'Damage Modification'"></v-switch>
                                    </v-col>
                                </v-row>
                                <!-- Damage Modification Fields End -->
                                <v-combobox label="Skill"
                                            v-model="a.skill"
                                            :items="skills.map((x) => (x.name))"
                                            v-if="a.type == 'Skill'"></v-combobox>
                                <v-text-field label="Amount"
                                              v-model="a.amount"
                                              v-if="a.type != 'Status' && a.type != 'Other'"
                                              type="number"></v-text-field>
                                <!-- Status Fields -->
                                <v-autocomplete label="Status"
                                                :items="statuses.map((x) => ({ value: x, text: x.name }))"
                                                v-model="a.status.status"
                                                v-if="a.type == 'Status'"
                                                :rules="notNull"
                                                required>
                                </v-autocomplete>
                                <v-text-field label="Ranks"
                                              v-model="a.status.ranks"
                                              type="number"
                                              min="0"
                                              v-if="a.type == 'Status' && a.status.status.name.includes('{rank}')"
                                              required></v-text-field>
                                <v-text-field label="Duration (Rounds)"
                                              v-model="a.status.duration"
                                              v-if="a.type == 'Status'"
                                              type="number"
                                              min="0"
                                              required></v-text-field>
                                <!-- Status Fields End -->
                                <v-textarea label="Description"
                                            v-model="a.description"
                                            v-if="a.type == 'Other'"
                                            auto-grow outlined rows="1" required></v-textarea>
                                <hr v-if="index != (buff.adjustments.length - 1)" />
                            </div>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
                               @click="deleteEntry">Delete</v-btn>
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
    import BuffListItem from './BuffListItem.vue'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'BuffSection',
        components: {
            BuffListItem
        },
        props: {
            buffs: Array,
            characteristics: Array,
            damageTypes: Array,
            movementTypes: Array,
            skills: Array,
            statuses: Array,
            resources: Array
        },
        data() {
            return {
                buffOptions: ['CHAR', 'Class Resource: Commited', 'Damage Modification', 'DC to Hit', 'Health', 'Initiative', 'Movement', 'Skill', 'Status', 'Other'],
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                buff: {
                    description: '',
                    id: null,
                    isActive: true,
                    name: '',
                    adjustments: [
                        {
                            amount: 0,
                            characteristic: '',
                            classResource: '',
                            description: '',
                            movementType: '',
                            damageModificationType: '',
                            skill: '',
                            status: {
                                currentDuration: 1,
                                currentIsActive: true,
                                currentRanks: 1,
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
                            },
                            type: ''
                        }
                    ]
                },
                clearBuff: {
                    description: '',
                    id: null,
                    isActive: true,
                    name: '',
                    adjustments: [
                        {
                            amount: 0,
                            characteristic: '',
                            classResource: '',
                            description: '',
                            movementType: '',
                            damageModificationType: '',
                            skill: '',
                            status: {
                                currentDuration: 1,
                                currentIsActive: true,
                                currentRanks: 1,
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
                            },
                            type: ''
                        }
                    ]
                },
                // Input Fields End
                panel: 0,
                // Validation Start
                notNull: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            // Adjustment Functions Start
            addAdjustment() {
                this.buff.adjustments.push({
                    amount: 0,
                    characteristic: '',
                    classResource: '',
                    description: '',
                    movementType: '',
                    id: uuidv4(),
                    damageModificationType: '',
                    skill: '',
                    status: {
                        currentDuration: 1,
                        currentIsActive: true,
                        currentRanks: 1,
                        description: '',
                        duration: 1,
                        id: uuidv4(),
                        isActive: true,
                        ranks: 1,
                        status: {
                            cost: '',
                            effect: '',
                            name: '',
                            type: ''
                        }
                    },
                    type: ''
                })
            },
            deleteAdjustment(i) {
                this.buff.adjustments.splice(i, 1)
            },
            // Adjustment Functions End
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('addEntryEmit', { arrayName: 'buffs', object: this.buff })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'buffs', object: this.buff })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('updateEntryEmit', { arrayName: 'buffs', object: this.buff })
                }
            },
            updateEntryBypass(object) {
                this.$emit('updateEntryBypassEmit', { arrayName: 'buffs', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.buff = JSON.parse(JSON.stringify(this.clearBuff))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(buff) {
                this.buff = buff
                this.setDialog('Delete')
            },
            updateDialog(buff) {
                this.buff = buff
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