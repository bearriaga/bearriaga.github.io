<template>
    <div>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Equipment/Items
                        <v-btn icon color="primary"
                               @click.stop="addDialog">
                            <v-icon>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="equipmentExpansionContent">
                    <EquipmentListItem v-for="e in characterEquipment" :key="e.key"
                                       :ap="ap"
                                       :characteristics="characteristics"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       :equipment="e"
                                       :resources="resources"
                                       :slots="slots"
                                       @deleteDialogEmit="deleteDialog($event)"
                                       @rollAbilityEmit="rollAbility($event)"
                                       @rollDamageEmit="rollDamage($event)"
                                       @subtractAPEmit="subtractAP($event)"
                                       @subtractCREmit="subtractCR($event)"
                                       @updateDialogEmit="updateDialog($event)"
                                       @updateEntryEmit="updateEntryBypass($event)"></EquipmentListItem>
                    <v-row>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500" scrollable>
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Equipment
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid">
                            <v-text-field label="Name"
                                          v-model="name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="amount"
                                          min="0"
                                          required></v-text-field>
                            <v-checkbox label="Is Item"
                                        v-model="isItem">
                                <v-tooltip top slot="prepend">
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" color="primary" dark>
                                            mdi-information
                                        </v-icon>
                                    </template>
                                    <span>Limits fields and hides ability section</span>
                                </v-tooltip>
                            </v-checkbox>
                            <template v-if="!isItem">
                                <v-text-field label="AP Cost"
                                              type="number"
                                              v-model="ability.apCost"></v-text-field>
                                <v-select label="Characteristic"
                                          v-model="ability.characteristic"
                                          :items="characteristics"></v-select>
                                <!-- Armor Inputs -->
                                <v-checkbox label="Is Armor/Shield" v-model="isArmorShied"></v-checkbox>
                                <v-text-field label="DC to Hit" v-model="dcToHit" type="number" v-if="isArmorShied"></v-text-field>
                                <!-- Armor Inputs End -->
                                <!-- Damage Modification Inputs -->
                                <template>
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>
                                                <h3 class="text-center">
                                                    Damage Modifications
                                                    <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                                           @click.stop="addDamageModification">
                                                        <v-icon>
                                                            mdi-plus
                                                        </v-icon>
                                                    </v-btn>
                                                </h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <div v-for="(dm, index) in damageModifications" :key="index">
                                                    <v-autocomplete label="Damage Modification Type"
                                                                    v-model="dm.type"
                                                                    :items="damageTypes"
                                                                    :rules="notNull"
                                                                    required>
                                                        <v-icon color="error" slot="append" @click="deleteDamageModification(index)">mdi-delete</v-icon>
                                                    </v-autocomplete>
                                                    <v-text-field label="Amount"
                                                                  type="number"
                                                                  v-model="dm.amount"
                                                                  ref="amount"
                                                                  required></v-text-field>
                                                    <v-checkbox label="Resistance"
                                                                v-model="dm.isResistance"></v-checkbox>
                                                    <v-checkbox label="Vulnerability"
                                                                v-model="dm.isVulnerability"></v-checkbox>
                                                </div>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </template>
                                <!-- Damage Modification Inputs End -->
                                <!-- Weapon Inputs -->
                                <v-checkbox label="Is Weapon" v-model="isWeapon"></v-checkbox>
                                <v-text-field label="Range"
                                              v-model="ability.range"
                                              type="number"
                                              v-if="isWeapon"></v-text-field>
                                <template v-if="isWeapon">
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>
                                                <h3 class="text-center">
                                                    Damage
                                                    <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                                           @click.stop="addDamage">
                                                        <v-icon>
                                                            mdi-plus
                                                        </v-icon>
                                                    </v-btn>
                                                </h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field label="Dice" type="number" v-model="ability.damage.dice"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="6">
                                                        <v-text-field label="Flat" type="number" v-model="ability.damage.flat"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-autocomplete label="Type *"
                                                                        :items="damageTypes"
                                                                        v-model="ability.damage.types"
                                                                        multiple
                                                                        :rules="textRules"
                                                                        required></v-autocomplete>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </template>
                                <!-- Additional Ability Inputs -->
                                <template>
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>
                                                <h3 class="text-center">Additional Ability Inputs</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>

                                                <v-select label="Class Resource"
                                                          :items="resources.map((x) => ({ value: x, text: x.name }))"
                                                          v-model="ability.classResource"
                                                          clearable></v-select>
                                                <v-text-field label="Class Resource Cost" type="number" v-model="ability.crCost"></v-text-field>
                                                <v-text-field label="Duration" v-model="ability.duration"></v-text-field>
                                                <v-checkbox label="Is Melee Attack" v-model="ability.isMeleeAttack"></v-checkbox>
                                                <v-text-field label="Area of Effect" v-model="ability.areaOfEffect"></v-text-field>
                                                <v-select label="Physical/Meta *"
                                                          :items="physMetaOptions"
                                                          v-model="ability.physMeta"
                                                          :rules="textRules"
                                                          required></v-select>
                                                <v-text-field label="Successes" type="number" v-model="ability.successes"></v-text-field>
                                                <v-text-field label="Handedness"
                                                              type="number"
                                                              v-model="ability.handedness"></v-text-field>

                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </template>
                                <!-- Additional Ability Inputs End -->
                                <!-- Weapon Inputs End -->
                                <v-combobox label="Body Slot"
                                            :items="slots"
                                            v-model="slot"></v-combobox>
                                <v-text-field label="Attunement Slots"
                                              v-model="attunementSlots"
                                              type="number"></v-text-field>
                            </template>
                            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry">Save</v-btn>
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
    import EquipmentListItem from './EquipmentListItem.vue'

    export default {
        name: 'EquipmentSection',
        components: {
            EquipmentListItem
        },
        props: {
            ap: Number,
            characteristics: Array,
            characterEquipment: Array,
            damageGroups: Array,
            damageTypes: Array,
            resources: Array
        },
        data() {
            return {
                // Input Fields Start
                equipment: {
                    amount: 1,
                    attunementSlots: 0,
                    dcToHit: 1,
                    description: '',
                    isActive: true,
                    isArmorShield: false,
                    isItem: false,
                    isWeapon: false,
                    name: '',
                    slot: '',
                    ability: {
                        apCost: 3,
                        areaOfEffect: 'Single Target',
                        boughtForFree: true,
                        color: {},
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
                        successes: 0,
                        xpCost: 0,
                        components: [],
                        subEffects: []
                    },
                    damageModifications: []
                },
                amount: 1,
                attunementSlots: 0,
                dcToHit: 1,
                description: '',
                id: null,
                isActive: true,
                isArmorShied: false,
                isItem: false,
                isWeapon: false,
                name: '',
                slot: '',
                ability: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: true,
                    color: {},
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
                    successes: 0,
                    xpCost: 0,
                    components: [],
                    subEffects: []
                },
                damageModifications: [],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                rollAbility(ability) {
                    this.$emit('rollAbilityEmit', ability)
                },
                rollDamage(ability) {
                    this.$emit('rollDamageEmit', ability)
                },
                slots: ['Head', 'Body', 'Arms', 'Legs', 'Boots', 'Clothes'],
                subtractAP(apCost) {
                    this.$emit('subtractAPEmit', apCost)
                },
                subtractCR(crCost) {
                    this.$emit('subtractCREmit', crCost)
                },
                // Validation Start
                numberRules: [
                    v => !isNaN(+v) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
                ],
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                notNull: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            addChar(index) {
                this.ability.damage.forEach((damage) => {
                    damage.addChar = false
                })
                this.ability.damage[index].addChar = true
            },
            addDamageModification() {
                this.damageModifications.push({
                    amount: 0,
                    isEquipment: true,
                    isVulnerability: false,
                    isResistance: false,
                    type: '',
                })
            },
            deleteDamageModification(i) {
                this.damageModifications.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.isActive = !this.isItem
                    this.setObject()
                    this.$emit('addEntryEmit', { arrayName: 'equipment', object: this.equipment })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'equipment', object: this.equipment })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.setObject()
                    this.$emit('updateEntryEmit', { arrayName: 'equipment', object: this.equipment })
                }
            },
            updateEntryBypass(object) {
                this.$emit('updateEntryBypassEmit', { arrayName: 'equipment', object: object })
            },
            setObject() {
                this.equipment = {
                    amount: this.amount,
                    attunementSlots: this.attunementSlots,
                    dcToHit: this.dcToHit,
                    description: this.description,
                    id: this.id,
                    isActive: this.isActive,
                    isArmorShied: this.isArmorShied,
                    isItem: this.isItem,
                    isWeapon: this.isWeapon,
                    name: this.name,
                    slot: this.slot,
                    ability: this.ability,
                    damageModifications: this.damageModifications
                }
                this.equipment.ability.name = this.name
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.equipment = {
                    amount: 1,
                    attunementSlots: 0,
                    dcToHit: 1,
                    description: '',
                    isActive: true,
                    isArmorShied: false,
                    isItem: false,
                    isWeapon: false,
                    name: '',
                    slot: '',
                    ability: {
                        apCost: 3,
                        areaOfEffect: 'Single Target',
                        boughtForFree: true,
                        color: {},
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
                        successes: 0,
                        xpCost: 0,
                        components: [],
                        subEffects: []
                    },
                    damageModifications: []
                }
                this.setInputs(this.equipment)
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(equipment) {
                this.equipment = this.characterEquipment.find(x => { return x.id == equipment.id })
                this.setInputs(this.equipment)
                this.setDialog('Delete')
            },
            updateDialog(equipment) {
                this.setInputs(equipment)
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            setInputs(equipment) {
                this.amount = equipment.amount
                this.attunementSlots = equipment.attunementSlots
                this.dcToHit = equipment.dcToHit
                this.description = equipment.description
                this.id = equipment.id
                this.isActive = equipment.isActive
                this.isArmorShied = equipment.isArmorShied
                this.isItem = equipment.isItem
                this.isWeapon = equipment.isWeapon
                this.name = equipment.name
                this.slot = equipment.slot
                this.ability = equipment.ability
                this.damageModifications = equipment.damageModifications
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>