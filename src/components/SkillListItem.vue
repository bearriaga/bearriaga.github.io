<template>
    <div>
        <v-row>
            <v-col>
                <v-text-field :label="skill.name"
                              type="number"
                              v-model="value"
                              @keyup.enter="rollDiceCheck">
                    <v-icon slot="append" @click="rollDiceCheck">mdi-dice-6</v-icon>
                    <v-icon color="primary" slot="append" @click="updateDialog">mdi-pen</v-icon>
                    <v-icon color="error" slot="append" @click="deleteDialog" v-if="!skill.default">mdi-delete</v-icon>
                </v-text-field>
            </v-col>
        </v-row>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialogTitle}}
                    </v-card-title>

                    <v-card-text v-if="dialogType == 'delete'">
                        Are you sure you want to delete the {{skill.name}} skill?
                    </v-card-text>

                    <v-card-text v-if="dialogType == 'edit'">
                        <v-text-field label="Name" v-model="name" v-if="!skill.default"></v-text-field>
                        <v-select label="Characteristic" v-model="characteristic" :items="characteristics" v-if="!skill.default"></v-select>
                        <v-text-field label="Skill Purchases" type="number" v-model="skillIncreases"></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="error" v-if="dialogType == 'delete'"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn color="primary" v-if="dialogType == 'edit'"
                               @click="updateEntry()">Save</v-btn>
                        <v-btn color="secondary"
                               @click="showDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SkillListItem',
        props: {
            characteristics: Array,
            skill: Object
        },
        data() {
            return {
                characteristic: this.skill.characteristic,
                dialogTitle: '',
                dialogType: '',
                name: this.skill.name,
                skillIncreases: this.skill.skillIncreases,
                showDialog: false,
                value: this.skill.value
            }
        },
        methods: {
            deleteDialog() {
                this.dialogTitle = 'Delete Skill'
                this.dialogType = 'delete'
                this.showDialog = true
            },
            deleteEntry() {
                this.showDialog = false
                this.$emit('deleteEntryEmit', { arrayName: 'skills', object: this.skill })
            },
            updateDialog() {
                this.dialogTitle = 'Edit Skill'
                this.dialogType = 'edit'
                this.showDialog = true

            },
            updateEntry() {
                var object = {
                    characteristic: this.characteristic,
                    default: this.skill.default,
                    id: this.skill.id,
                    name: this.name,
                    skillIncreases: this.skillIncreases,
                    value: this.skill.value
                }
                this.showDialog = false
                this.$emit('updateEntryEmit', { arrayName: 'skills', object: object })
            },
            rollDiceCheck() {
                this.$emit('rollDiceCheckEmit', this.value)
            }
        }
    }
</script>