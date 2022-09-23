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
                        <v-col cols="3" v-for="m in minions" :key="m.id + m.name">
                            <MinionListItem @deleteEntryEmit="deleteDialog($event)"
                                            @rollDiceCheckEmit="rollDiceCheck($event)"
                                            @updateEntryEmit="updateEntry($event)"
                                            :minion="m"></MinionListItem>
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
                            <v-text-field label="CUN" type="number"
                                          v-model="minion.cunning"></v-text-field>
                            <v-text-field label="FIT" type="number"
                                          v-model="minion.fitness"></v-text-field>
                            <v-text-field label="INT" type="number"
                                          v-model="minion.intelligence"></v-text-field>
                            <v-text-field label="LCK" type="number"
                                          v-model="minion.luck"></v-text-field>
                            <v-text-field label="RES" type="number"
                                          v-model="minion.resistance"></v-text-field>
                            <v-text-field label="SPD" type="number"
                                          v-model="minion.speed"></v-text-field>
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
    import MinionListItem from './MinionListItem.vue'

    export default {
        name: 'MinionSection',
        components: {
            MinionListItem
        },
        props: {
            clearCharacter: Object,
            minions: Array
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
                panel: 0,
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
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'classes', object: this.minion })
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', { arrayName: 'classes', object: object })
            },
            // CRUD Functions End
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
            // Open Dialog Functions End
            rollDiceCheck(object) {
                this.$emit('rollDiceCheckEmit', object)
            },
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>