<template>
    <div>
        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Minions
                        <v-btn icon color="primary"
                               @click.stop="addDialog">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="6" v-for="(m, i) in minions" :key="m.key">
                            <v-row>
                                <v-col>
                                    <v-btn icon color="primary" @click.stop="moveEntry(i, 'up')">
                                        <v-icon>mdi-arrow-left-bold</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col class="text-center">
                                    <v-btn color="primary" @click="updateDialog(m)">
                                        <v-icon>mdi-pen</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col class="text-center">
                                    <v-btn color="primary" @click="duplicateEntry(m)">
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col class="text-center">
                                    <v-btn color="error" @click="deleteDialog(m)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn icon color="primary" @click.stop="moveEntry(i, 'down')">
                                        <v-icon>mdi-arrow-right-bold</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <CharacterComponent :character="m"
                                                :layout="'Minion'"
                                                :options="options"
                                                :key="characterString(m)"
                                                @updateCharacterSheetEmit=updateEntryBypass($event)></CharacterComponent>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Minion
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Minion Name"
                                          v-model="minion.name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field label="CUN" type="number"
                                                  v-model="minion.cunning"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="FIT" type="number"
                                                  v-model="minion.fitness"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="INT" type="number"
                                                  v-model="minion.intelligence"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="LCK" type="number"
                                                  v-model="minion.luck"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="RES" type="number"
                                                  v-model="minion.resistance"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="SPD" type="number"
                                                  v-model="minion.speed"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-text-field label="HP Purchases" type="number"
                                          v-model="minion.hpIncreases"></v-text-field>
                            <v-switch label="Speed: Preperation is Key" inset
                                      v-model="minion.speedPreperationIsKey"></v-switch>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry(minion)">Save</v-btn>
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

    export default {
        name: 'MinionSection',
        props: {
            clearCharacter: Object,
            minions: Array,
            panelProp: Number
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                minion: JSON.parse(JSON.stringify(this.clearCharacter)),
                // Input Fields End
                options: {
                    abilityPanel: 0,
                    buffPanel: 0,
                    classPanel: 0,
                    classUnlockedPanel: 0,
                    damageModificationPanel: 0,
                    equipmentPanel: 0,
                    flawPanel: 0,
                    journalPanel: 0,
                    layout: 'Condensed',
                    minionPanel: 0,
                    movementPanel: 0,
                    resourcePanel: 0,
                    skillPanel: 0,
                    statusPanel: 0,
                    traitPanel: 0,
                },
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
                    this.$emit('addEntryEmit', { arrayName: 'minions', object: this.minion })
                }
            },
            duplicateEntry(minion) {
                this.$emit('addEntryEmit', { arrayName: 'minions', object: JSON.parse(JSON.stringify(minion)) })
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'minions', object: this.minion })
            },
            moveEntry(index, direction) {
                if (!(index == 0 && direction == 'up') && !(index == (+this.minions.length - 1) && direction == 'down'))
                    this.$emit('moveEntryEmit', { arrayName: 'minions', index: index, direction: direction })
            },
            updateEntry(object) {
                this.dialog.show = false
                this.$emit('updateEntryEmit', { arrayName: 'minions', object: object })
            },
            updateEntryBypass(object) {
                this.$emit('updateEntryBypassEmit', { arrayName: 'minions', object: object })
            },
            // CRUD Functions End
            characterString(minion) {
                return JSON.stringify(minion)
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.minion = JSON.parse(JSON.stringify(this.clearCharacter))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(minionObj) {
                this.minion = this.minions.find(x => { return x.id == minionObj.id })
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            updateDialog(minionObj) {
                this.minion = JSON.parse(JSON.stringify(minionObj))
                this.setDialog('Edit')
            },
            // Open Dialog Functions End
            //Not currently used, fix when fixing journal
            //rollDiceCheck(object) {
            //    this.$emit('rollDiceCheckEmit', object)
            //},
            validate() {
                return this.$refs.form.validate()
            }
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'minionPanel', value: this.panel })
            }
        }
    }
</script>