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
                                                  v-model="name"
                                                  ref="name"
                                                  :rules="textRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="XP Cost *"
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
                                    <v-select label="Characteristic Check"
                                              :items="characteristics"
                                              v-model="characteristic"
                                              clearable>
                                        <TooltipComponent slot="prepend" :text="'CHAR used to make check and gets added to damage.'"></TooltipComponent>
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-checkbox label="Target Saves"
                                                v-model="save"></v-checkbox>
                                </v-col>
                                <template v-if="save">
                                    <v-col cols="6">
                                        <v-text-field label="Save Amount"
                                                      v-model="saveAmount"
                                                      type="number">
                                            <TooltipComponent slot="prepend" :text="'INT/3 automatically added to save amount.'"></TooltipComponent>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select label="Save Characteristic"
                                                  :items="characteristics"
                                                  v-model="saveCharacteristic"
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
                                            <v-text-field label="Dice" type="number" v-model="damage.dice"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field label="Flat" type="number" v-model="damage.flat"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-select label="Damage Types"
                                                      :items="damageTypes"
                                                      v-model="damage.types"
                                                      multiple
                                                      :rules="textRules"
                                                      required></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="AP Cost" type="number" v-model="apCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Class Resource"
                                              :items="resources.map((x) => ({ value: x.id, text: x.name }))"
                                              v-model="classResource"
                                              clearable></v-select>
                                </v-col>
                                <v-col cols="6" md="4" v-if="classResource">
                                    <v-text-field label="Class Resource Cost" type="number" v-model="crCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Duration" v-model="duration"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="Is Melee Attack" v-model="isMeleeAttack"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Range" type="number" v-model="range"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Area of Effect" v-model="areaOfEffect"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-checkbox label="In Class" v-model="inClass"></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Physical/Meta *"
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
                                                    <v-row v-for="(s, index) in subEffects" :key="index">
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
                                                                    v-model="color"></v-color-picker>
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
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                filterText: '',
                panel: null,
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
                this.components.push({
                    name: ''
                })
            },
            addSubEffect() {
                this.subEffectPanel = 0
                this.subEffects.push({
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
                    id: new Date().getTime().toString(),
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
                    xpCost: 10,
                    components: [],
                    subEffects: []
                })
            },
            deleteSubEffect(i) {
                this.subEffects.splice(i, 1)
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
            updateEntryBypass(ability) {
                this.ability = ability
                this.setInputs(this.ability)
                this.setObject()
                this.$emit('updateEntryEmit', { arrayName: 'abilities', object: this.ability })
            },
            setObject() {
                this.ability.apCost = this.apCost
                this.ability.areaOfEffect = this.areaOfEffect
                this.ability.boughtForFree = this.boughtForFree
                this.ability.color = this.color
                this.ability.classResource = this.classResource
                this.ability.crCost = this.crCost
                this.ability.characteristic = this.characteristic
                this.ability.damage = this.damage
                this.ability.description = this.description
                this.ability.duration = this.duration
                this.ability.handedness = this.handedness
                this.ability.id = this.id
                this.ability.inClass = this.inClass
                this.ability.isAbilityArray = this.isAbilityArray
                this.ability.isMeleeAttack = this.isMeleeAttack
                this.ability.maxSizeCategoryOfMass = this.maxSizeCategoryOfMass
                this.ability.name = this.name
                this.ability.physMeta = this.physMeta
                this.ability.range = this.range
                this.ability.save = this.save
                this.ability.saveAmount = this.saveAmount
                this.ability.saveCharacteristic = this.saveCharacteristic
                this.ability.successes = this.successes
                this.ability.xpCost = this.xpCost
                this.ability.components = this.components
                this.ability.subEffects = this.subEffects
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
                this.ability = {
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
                    xpCost: 10,
                    components: [],
                    subEffects: []
                }
                this.setInputs(this.ability)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(ability) {
                this.ability = ability
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
                this.color = ability.color
                this.classResource = ability.classResource
                this.crCost = ability.crCost
                this.characteristic = ability.characteristic
                this.damage = ability.damage
                this.description = ability.description
                this.duration = ability.duration
                this.handedness = ability.handedness
                this.id = ability.id
                this.inClass = ability.inClass
                this.isAbilityArray = ability.isAbilityArray
                this.isMeleeAttack = ability.isMeleeAttack
                this.maxSizeCategoryOfMass = ability.maxSizeCategoryOfMass
                this.name = ability.name
                this.physMeta = ability.physMeta
                this.range = ability.range
                this.save = ability.save
                this.saveAmount = ability.saveAmount
                this.saveCharacteristic = ability.saveCharacteristic
                this.successes = ability.successes
                this.xpCost = ability.xpCost
                this.components = ability.components
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