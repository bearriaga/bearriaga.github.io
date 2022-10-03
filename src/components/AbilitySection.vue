<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
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
                            <v-col cols="12">
                                <v-text-field label="Filter Abilities"
                                              v-model="filterText"
                                              clearable>
                                    <TooltipComponent slot="prepend" :text="'Filter Abilities based on Name and Description.'"></TooltipComponent>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" :xl="extraLargeColumns(ability)" :md="mediumColumns(ability)" v-for="ability in filteredAbilities" :key="ability.key">
                                <AbilityListItem :ability="ability"
                                                 :ap="ap"
                                                 :can-edit="true"
                                                 :characteristics="characteristics"
                                                 :damage-types="damageTypes"
                                                 :resources="resources"
                                                 :successes-from-intelligence="successesFromIntelligence"
                                                 @deleteEntryEmit="deleteDialog($event)"
                                                 @rollAbilityEmit="rollAbility($event)"
                                                 @rollDamageEmit="rollDamage($event)"
                                                 @subtractAP="subtractAP($event)"
                                                 @subtractCR="subtractCR($event)"
                                                 @updateDialogEmit="updateDialog($event)"
                                                 @updateEntryEmit="updateEntryBypass($event)"
                                                 @useAbility="useAbility($event)"></AbilityListItem>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500"
                      scrollable>
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
                                    <v-text-field label="Name *"
                                                  v-model="ability.name"
                                                  ref="name"
                                                  :rules="textRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="XP Cost *"
                                                  v-model="ability.xpCost"
                                                  type="number"
                                                  :rules="numberRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-switch label="Bought For Free" inset v-model="ability.boughtForFree"></v-switch>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Description" v-model="ability.description" auto-grow outlined rows="1"></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Characteristic Check"
                                              :items="characteristics"
                                              v-model="ability.characteristic"
                                              clearable>
                                        <TooltipComponent slot="prepend" :text="'CHAR used to make check and gets added to damage.'"></TooltipComponent>
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-switch label="Target Saves" inset
                                              v-model="ability.save"></v-switch>
                                </v-col>
                                <template v-if="ability.save">
                                    <v-col cols="6">
                                        <v-text-field label="Save Amount"
                                                      v-model="ability.saveAmount"
                                                      type="number">
                                            <TooltipComponent slot="prepend" :text="'INT/3 automatically added to save amount.'"></TooltipComponent>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select label="Save Characteristic"
                                                  :items="characteristics"
                                                  v-model="ability.saveCharacteristic"
                                                  clearable></v-select>
                                    </v-col>
                                </template>
                                <v-col cols="12">
                                    <v-row>
                                        <v-col cols="12">
                                            <h3 class="text-center">
                                                Damage
                                            </h3>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Dice" type="number" v-model="ability.damage.dice"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Flat" type="number" v-model="ability.damage.flat"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select label="Damage Types"
                                                      :items="damageTypes"
                                                      v-model="ability.damage.types"
                                                      multiple
                                                      :rules="textRules"
                                                      required></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="AP Cost" type="number" v-model="ability.apCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Class Resource"
                                              :items="resources.map((x) => ({ value: x.id, text: x.name }))"
                                              v-model="ability.classResource"
                                              clearable></v-select>
                                </v-col>
                                <v-col cols="6" md="4" v-if="ability.classResource">
                                    <v-text-field label="Class Resource Cost" type="number" v-model="ability.crCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Duration" v-model="ability.duration"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-switch label="Is Melee Attack" inset v-model="ability.isMeleeAttack"></v-switch>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Range" type="number" v-model="ability.range"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Area of Effect" v-model="ability.areaOfEffect"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-switch label="In Class" inset v-model="ability.inClass"></v-switch>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Physical/Meta *"
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
                                    <v-switch label="Ability Array" inset v-model="ability.isAbilityArray"></v-switch>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Max Size Category Of Mass" type="number" v-model="ability.maxSizeCategoryOfMass"></v-text-field>
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
                                    <v-row v-for="(c, index) in ability.components" :key="index">
                                        <v-col cols="12" md="4">
                                            <v-text-field label="Name" v-model="c.name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12">
                                    <template>
                                        <v-expansion-panels v-model="subEffectPanel">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">
                                                        <!-- Have section name change based on isAbilityArray field -->
                                                        Sub Effects/Array Element
                                                        <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                                               @click.stop="addSubEffect">
                                                            <v-icon>
                                                                mdi-plus
                                                            </v-icon>
                                                        </v-btn>
                                                    </h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-row v-for="(s, index) in ability.subEffects" :key="index">
                                                        <v-col cols="12">
                                                            <v-text-field label="Name *" v-model="s.name" :rules="textRules" required>
                                                                <TooltipComponent slot="prepend" :text="'Sub Effect can be edited in Parent once it is saved.'"></TooltipComponent>
                                                                <v-icon color="error" slot="append" @click="deleteSubEffect(index)">mdi-delete</v-icon>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <template>
                                        <v-expansion-panels>
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">
                                                        Border Color
                                                    </h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-color-picker dot-size="15"
                                                                    hide-inputs
                                                                    v-model="ability.color"></v-color-picker>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
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
    import TooltipComponent from './TooltipComponent.vue'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'AbilitySection',
        components: {
            AbilityListItem,
            TooltipComponent
        },
        props: {
            abilities: Array,
            ap: Number,
            characteristics: Array,
            damageTypes: Array,
            resources: Array,
            successesFromIntelligence: Number
        },
        computed: {
            filteredAbilities() {
                let abilities = this.abilities

                if (this.filterText && this.filterText.trim().length != 0)
                    abilities = abilities.filter(x => {
                        return (
                            x.name.toUpperCase().includes(this.filterText.toUpperCase()) ||
                            x.description.toUpperCase().includes(this.filterText.toUpperCase())
                        )
                    })

                return abilities
            }
        },
        data() {
            return {
                // Input Fields Start
                ability: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    color: { alpha: 1, hex: "#000000", hexa: "#000000FF", hsla: { h: 0, s: 0, l: 0, a: 1 }, hsva: { h: 0, s: 0, v: 0, a: 1 }, hue: 0, rgba: { r: 0, g: 0, b: 0, a: 1 } },
                    classResource: '',
                    crCost: 0,
                    characteristic: '',
                    damage: {
                        dice: 0,
                        flat: 0,
                        types: []
                    },
                    description: '',
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    isMeleeAttack: true,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: 'Physical',
                    range: 0,
                    save: false,
                    saveAmount: 3,
                    saveCharacteristic: '',
                    successes: 0,
                    xpCost: 0,
                    components: [],
                    subEffects: []
                },
                clearAbility: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    color: { alpha: 1, hex: "#000000", hexa: "#000000FF", hsla: { h: 0, s: 0, l: 0, a: 1 }, hsva: { h: 0, s: 0, v: 0, a: 1 }, hue: 0, rgba: { r: 0, g: 0, b: 0, a: 1 } },
                    classResource: '',
                    crCost: 0,
                    characteristic: '',
                    damage: {
                        dice: 0,
                        flat: 0,
                        types: []
                    },
                    description: '',
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    isMeleeAttack: true,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: 'Physical',
                    range: 0,
                    save: false,
                    saveAmount: 3,
                    saveCharacteristic: '',
                    successes: 0,
                    xpCost: 0,
                    components: [],
                    subEffects: [],
                },
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                filterText: '',
                panel: 0,
                subEffectPanel: null,
                // Validation Start
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
                this.ability.components.push({
                    name: ''
                })
            },
            addSubEffect() {
                this.ability.subEffectPanel = 0
                let ability = JSON.parse(JSON.stringify(this.clearAbility))
                ability.id = uuidv4()
                this.ability.subEffects.push(ability)
            },
            deleteSubEffect(i) {
                this.ability.subEffects.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
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
                    this.$emit('updateEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            updateEntryBypass(ability) {
                this.$emit('updateEntryEmit', { arrayName: 'abilities', object: ability })
            },
            // CRUD Functions End
            extraLargeColumns(ability) {
                if (ability.subEffects.length)
                    return 6
                else return 3
            },
            mediumColumns(ability) {
                if (ability.subEffects.length)
                    return 12
                else return 6
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.ability = JSON.parse(JSON.stringify(this.clearAbility))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(ability) {
                this.ability = ability
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
            rollAbility(ability) {
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            subtractCR(crCost) {
                this.$emit('subtractCREmit', crCost)
            },
            useAbility(ability) {
                this.$emit('useAbilityEmit', ability)
            },
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>