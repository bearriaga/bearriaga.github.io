<template>
    <div>
        <template>
            <v-expansion-panels>
                <v-expansion-panel v-for="(item,i) in 1" :key="i">
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Abilities
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
                            <v-col cols="12" :md="mediumColumns(ability)" v-for="ability in abilities" :key="ability.key">
                                <AbilityListItem :ability="ability"
                                                 @deleteEntryEmit="deleteDialog($event)"                                                 
                                                 @rollAbilityEmit="rollAbility($event)"
                                                 @rollDamageEmit="rollDamage($event)"
                                                 @subtractAP="subtractAP($event)"
                                                 @updateEntryEmit="updateDialog($event)"></AbilityListItem>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>


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
                                                  v-model="name"
                                                  ref="name"
                                                  :rules="textRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="XP Cost"
                                                  v-model="xpCost"
                                                  type="number"
                                                  :rules="numberRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-checkbox label="Bought For Free" v-model="boughtForFree"></v-checkbox>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Characteristic"
                                              :items="characteristics"
                                              v-model="characteristic"></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <h3 class="text-center">
                                        Damage
                                        <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                               @click.stop="addDamage">
                                            <v-icon>
                                                mdi-plus
                                            </v-icon>
                                        </v-btn>
                                    </h3>
                                    <v-row v-for="(d, index) in damage" :key="index">
                                        <v-col cols="12" md="4">
                                            <v-text-field label="Dice" placeholder="ex: 1d6" v-model="d.dice" :rules="diceRules"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field label="Flat" type="number" v-model="d.flat"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field label="Percentage" type="number" v-model="d.percentage"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select label="Type"
                                                      :items="damageTypes"
                                                      v-model="d.type"
                                                      :rules="textRules"
                                                      required>
                                                <v-icon color="error" slot="append" @click="deleteDamage(index)">mdi-delete</v-icon>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Action Points" type="number" v-model="apCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Class Resource" type="number" v-model="crCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Duration" v-model="duration"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Range" v-model="range"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Area of Effect" v-model="areaOfEffect"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="In Class" v-model="inClass"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Physical/Meta"
                                              :items="physMetaOptions"
                                              v-model="physMeta"
                                              :rules="textRules"
                                              required></v-select>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Successes" type="number" v-model="successes"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Handedness" type="number" v-model="handedness"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="Ability Array" v-model="isAbilityArray"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Max Size Category Of Mass" type="number" v-model="maxSizeCategoryOfMass"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <h3 class="text-center">
                                        Components
                                        <v-btn icon color="primary"
                                               @click.stop="addComponent">
                                            <v-icon>
                                                mdi-plus
                                            </v-icon>
                                        </v-btn>
                                    </h3>
                                    <v-row v-for="(c, index) in components" :key="index">
                                        <v-col cols="12" md="4">
                                            <v-text-field label="Name" v-model="c.name"></v-text-field>
                                        </v-col>
                                    </v-row>
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
            abilities: Array,
            characteristics: Array,
            damageTypes: Array
        },
        data() {
            return {
                // Input Fields Start
                ability: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    crCost: 0,
                    characteristic: '',
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
                apCost: 3,
                areaOfEffect: 'Single Target',
                boughtForFree: false,
                crCost: 0,
                characteristic: '',
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
                subEffects: [],
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                // Validation Start
                diceRules: [                    
                    v => !v || /^(\d+)d(\d+)$/ig.test(v) || 'Field must be in proper format {number}d{number}'
                ],
                numberRules: [
                    v => !isNaN(+v) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
                ],
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            addComponent() {
                this.components.push({
                    name: ''
                })
            },
            addDamage() {
                this.damage.push({
                    dice: '',
                    flat: 0,
                    percentage: 0,
                    type: ''
                });
            },
            deleteDamage(i) {
                this.damage.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.setObject()
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
                    this.setObject()
                    this.$emit('updateEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            setObject() {
                this.ability.apCost = this.apCost
                this.ability.areaOfEffect = this.areaOfEffect
                this.ability.boughtForFree = this.boughtForFree
                this.ability.crCost = this.crCost
                this.ability.characteristic = this.characteristic
                this.ability.description = this.description
                this.ability.duration = this.duration
                this.ability.handedness = this.handedness
                this.ability.id = this.id
                this.ability.inClass = this.inClass
                this.ability.isAbilityArray = this.isAbilityArray
                this.ability.maxSizeCategoryOfMass = this.maxSizeCategoryOfMass
                this.ability.name = this.name
                this.ability.physMeta = this.physMeta
                this.ability.range = this.range
                this.ability.successes = this.successes
                this.ability.xpCost = this.xpCost
                this.ability.components = this.components
                this.ability.damage = this.damage
                this.ability.subEffects = this.subEffects
            },
            // CRUD Functions End
            mediumColumns(ability) {
                if (ability.subEffects.length)
                    return 6
                else return 3
            },
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.ability = {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    crCost: 0,
                    characteristic: '',
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
                this.setInputs(this.ability)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(ability) {
                this.ability = this.abilities.find(x => { return x.id == ability.id })
                this.setInputs(this.ability)
                this.setDialog('Delete')
            },
            updateDialog(ability) {
                this.ability = ability
                this.setInputs(this.ability)
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(ability) {
                this.apCost = ability.apCost
                this.areaOfEffect = ability.areaOfEffect
                this.boughtForFree = ability.boughtForFree
                this.crCost = ability.crCost
                this.characteristic = ability.characteristic
                this.description = ability.description
                this.duration = ability.duration
                this.handedness = ability.handedness
                this.id = ability.id
                this.inClass = ability.inClass
                this.isAbilityArray = ability.isAbilityArray
                this.maxSizeCategoryOfMass = ability.maxSizeCategoryOfMass
                this.name = ability.name
                this.physMeta = ability.physMeta
                this.range = ability.range
                this.successes = ability.successes
                this.xpCost = ability.xpCost
                this.components = ability.components
                this.damage = ability.damage
                this.subEffects = ability.subEffects
            },
            // Open Dialog Functions End
            rollAbility(ability) {
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>