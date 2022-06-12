<template>
    <div>
        <h3 class="text-center">
            Skills
            <v-btn icon color="primary"
                   @click="showDialog = true">
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
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add Skill
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Name" v-model="name"></v-text-field>
                                    <v-text-field label="Skill Purchases" type="number" v-model="skillIncreases"></v-text-field>
                                    <v-select label="Characteristic" v-model="characteristic" :items="characteristics"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary"
                               @click="addEntry()">Add</v-btn>
                        <v-btn color="secondary"
                               @click="showDialog = false">Close</v-btn>
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
                name: '',
                skillIncreases: 0,
                showDialog: false
            }
        },
        methods: {
            addEntry() {
                var object = {
                    characteristic: this.characteristic,
                    default: false,
                    id: null,
                    name: this.name,
                    skillIncreases: this.skillIncreases,
                    value: this.amount
                }
                this.showDialog = false
                this.characteristic = ''
                this.name = ''
                this.skillIncreases = 0
                this.$emit('addEntryEmit', { arrayName: 'skills', object: object })
            },
            deleteEntry(object) {
                this.$emit('deleteEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', object)
            },
            rollDiceCheck(value) {
                this.$emit('rollDiceCheckEmit', value)
            }
        }
    }
</script>