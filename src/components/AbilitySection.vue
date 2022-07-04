<template>
    <div>
        <h3 class="text-center">
            Abilities
            <v-btn icon color="primary"
                   @click.stop="addDialog">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <v-row>
            <v-col cols="12" md="4" v-for="ability in abilities" :key="ability.key">
                <AbilityListItem :ability="ability"
                                 @updateEntryEmit="updateDialog($event)"
                                 @deleteEntryEmit="deleteDialog($event)"
                                 @subtractAP="subtractAP($event)"></AbilityListItem>
            </v-col>
        </v-row>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Ability
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Name"
                                                  v-model="ability.name"
                                                  ref="name"
                                                  :rules="textRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="XP Cost"
                                                  v-model="ability.xpCost"
                                                  type="number"
                                                  :rules="numberRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-checkbox label="Bought For Free" v-model="ability.boughtForFree"></v-checkbox>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Description" v-model="ability.description" auto-grow outlined rows="1"></v-textarea>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Action Points" type="number" v-model="ability.apCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Class Resource" type="number" v-model="ability.crCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Duration" v-model="ability.duration"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Range" v-model="ability.range"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Area of Effect" v-model="ability.areaOfEffect"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="In Class" v-model="ability.inClass"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Physical/Meta"
                                              :items="physMetaOptions"
                                              v-model="ability.physMeta"
                                              :rules="textRules"
                                              required></v-select>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Successes" type="number" v-model="ability.successes"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Handedness" type="number" v-model="ability.handedness"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="Ability Array" v-model="ability.isAbilityArray"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Max Size Category Of Mass" type="number" v-model="ability.maxSizeCategoryOfMass"></v-text-field>
                                </v-col>
                            </v-row>
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
    import AbilityListItem from './AbilityListItem.vue'

    export default {
        name: 'AbilitySection',
        components: {
            AbilityListItem
        },
        props: {
            abilities: Array
        },
        data() {
            return {
                // Input Fields Start
                ability: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    crCost: 0,
                    description: '',
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: '',
                    range: 'Melee',
                    successes: 0,
                    xpCost: 0,
                    components: [],
                    damage: [],
                    subEffects: []
                },
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {// CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    //this.setObject()
                    this.$emit('addEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'abilities', object: this.ability })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    //this.setObject()
                    this.$emit('updateEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            setObject() {
                this.skill.characteristic = this.characteristic
                this.skill.name = this.name
                this.skill.skillIncreases = this.skillIncreases
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.ability = {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    crCost: 0,
                    description: '',
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: '',
                    range: 'Melee',
                    successes: 0,
                    xpCost: 10,
                    components: [],
                    damage: [],
                    subEffects: []
                }
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(ability) {
                this.ability = this.abilities.find(x => { return x.id == ability.id })
                this.setDialog('Delete')
            },
            updateDialog(ability) {
                this.ability = ability
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            // Open Dialog Functions End
            subtractAP(apCost) {
                this.$emit('subtractAP', apCost)
            },
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>