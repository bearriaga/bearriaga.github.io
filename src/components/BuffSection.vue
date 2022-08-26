<template>
    <div>
        <template>
            <v-expansion-panels>
                <v-expansion-panel v-for="(item,i) in 1" :key="i">
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
                                      @deleteEntryEmit="deleteDialog($event)"
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
                                          v-model="name"
                                          ref="name"
                                          :rules="notNull"
                                          required></v-text-field>
                            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" required></v-textarea>
                            <h3 class="text-center">
                                Adjustments
                                <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                       @click="addAdjustment">
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </h3>
                            <div v-for="a, index in adjustments" :key="index">
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
                                          v-if="a.type == 'CHAR'"
                                          :rules="notNull"
                                          required></v-select>
                                <v-autocomplete label="Movement Type"
                                                v-model="a.movementType"
                                                :items="movementTypes"
                                                v-if="a.type == 'Movement'"
                                                :rules="notNull"
                                                required></v-autocomplete>
                                <v-autocomplete label="Resistance Type"
                                                v-model="a.resistanceType"
                                                :items="damageTypes"
                                                v-if="a.type == 'Damage Resistance'"
                                                :rules="notNull"
                                                required></v-autocomplete>
                                <v-text-field label="Amount"
                                              v-model="a.amount"
                                              v-if="a.type != 'Status'"
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
                                <hr v-if="index != (adjustments.length - 1)" />
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
            statuses: Array
        },
        data() {
            return {
                buffOptions: ['CHAR', 'Damage Resistance', 'DC to Hit', 'Health', 'Initiative', 'Movement', 'Skill', 'Status', 'Other'],
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                description: '',
                id: '',
                isActive: true,
                name: '',
                adjustments: [
                    {
                        amount: 0,
                        characteristic: '',
                        movementType: '',
                        resistanceType: '',
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
                ],
                buff: {
                    description: '',
                    id: null,
                    isActive: true,
                    name: '',
                    adjustments: [
                        {
                            amount: 0,
                            characteristic: '',
                            movementType: '',
                            resistanceType: '',
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
                notNull: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
            }
        },
        methods: {
            // Adjustment Functions Start
            addAdjustment() {
                this.adjustments.push({
                    amount: 0,
                    characteristic: '',
                    movementType: '',
                    id: new Date().getTime().toString() + 0,
                    resistanceType: '',
                    status: {
                        currentDuration: 1,
                        currentIsActive: true,
                        currentRanks: 1,
                        description: '',
                        duration: 1,
                        id: new Date().getTime().toString() + 1,
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
                this.adjustments.splice(i, 1)
            },
            // Adjustment Functions End
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.setObject()
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
                    this.setObject()
                    this.$emit('updateEntryEmit', { arrayName: 'buffs', object: this.buff })
                }
            },
            updateEntryBypass(buff) {
                this.buff = buff
                this.setInputs(this.buff)
                this.setObject()
                this.$emit('updateEntryBypassEmit', { arrayName: 'buffs', object: this.buff })
            },
            setObject() {
                this.buff.description = this.description
                this.buff.id = this.id
                this.buff.isActive = this.isActive
                this.buff.name = this.name
                let adjustments = JSON.parse(JSON.stringify(this.adjustments))
                adjustments.forEach(a => {
                    if (a.type == 'Status') {
                        a.status.currentDuration = a.status.duration
                        a.status.currentIsActive = a.status.isActive
                        a.status.currentRanks = a.status.ranks
                    }
                })
                this.buff.adjustments = adjustments
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.buff = {
                    description: '',
                    id: '',
                    isActive: true,
                    name: '',
                    adjustments: [
                        {
                            amount: 0,
                            characteristic: '',
                            movementType: '',
                            id: new Date().getTime().toString() + 0,
                            resistanceType: '',
                            status: {
                                currentDuration: 1,
                                currentIsActive: true,
                                currentRanks: 1,
                                description: '',
                                duration: 1,
                                id: new Date().getTime().toString() + 1,
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
                }
                this.setInputs(this.buff)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(buff) {
                this.buff = this.buffs.find(x => { return x.id == buff.id })
                this.setInputs(this.buff)
                this.setDialog('Delete')
            },
            updateDialog(buff) {
                this.buff = buff
                this.setInputs(this.buff)
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(buff) {
                this.description = buff.description
                this.id = buff.id
                this.isActive = buff.isActive
                this.name = buff.name
                this.adjustments = buff.adjustments
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>