<template>
    <div>
        <v-expansion-panels v-model="panel">
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
                    <v-text-field label="Filter Equipment" v-model="filterText" clearable></v-text-field>
                    <v-data-table :headers="headers"
                                  :items="characterEquipment"
                                  :search="filterText"
                                  item-key="key"
                                  show-expand
                                  dense>
                        <template v-slot:[`item.use`]="{ item }">
                            <v-btn :color="useButtonColor(item.ability)" @click="useAbility(item.ability)" x-small v-if="showUseButton(item)">
                                Use
                            </v-btn>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small
                                    color="primary"
                                    class="mr-2"
                                    @click="updateDialog(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small
                                    color="error"
                                    @click="deleteDialog(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:[`expanded-item`]=" { item }">
                            <td :colspan="headers.length">
                                <EquipmentListItem :ap="ap"
                                                   :characteristics="characteristics"
                                                   :damage-groups="damageGroups"
                                                   :damage-types="damageTypes"
                                                   :equipment="item"
                                                   :movement-ap-icon="movementApIcon"
                                                   :movement-ap-icon-color="movementApIconColor"
                                                   :movement-types="movementTypes"
                                                   :resources="resources"
                                                   :slots="slots"
                                                   :successes-from-intelligence="successesFromIntelligence"
                                                   @rollAbilityEmit="rollAbility($event)"
                                                   @rollDamageEmit="rollDamage($event)"
                                                   @subtractAPEmit="subtractAP($event)"
                                                   @subtractCREmit="subtractCR($event)"
                                                   @updateEntryEmit="updateEntryBypass($event)"
                                                   @useAbility="useAbility($event)"></EquipmentListItem>
                            </td>
                        </template>
                    </v-data-table>
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
                                          v-model="equipment.name"
                                          ref="name"
                                          :rules="textRules"
                                          required></v-text-field>
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="equipment.amount"
                                          min="0"
                                          required></v-text-field>
                            <v-switch label="Is Item" inset
                                      v-model="equipment.isItem">
                                <TooltipComponent slot="prepend" :text="'Limits fields to Name, Amount, and Description and hides ability section'"></TooltipComponent>
                            </v-switch>
                            <template v-if="!equipment.isItem">
                                <v-text-field label="AP Cost"
                                              type="number"
                                              v-model="equipment.ability.apCost"></v-text-field>
                                <v-select label="Characteristic"
                                          v-model="equipment.ability.characteristic"
                                          :items="characteristics"
                                          clearable>
                                    <TooltipComponent slot="prepend" :text="'CHAR used to make check and gets added to damage.'"></TooltipComponent>
                                </v-select>
                                <v-row>
                                    <v-col cols="12">
                                        <v-switch label="Target Saves" inset
                                                  v-model="equipment.ability.save"></v-switch>
                                    </v-col>
                                    <template v-if="equipment.ability.save">
                                        <v-col cols="6">
                                            <v-text-field label="Save Amount"
                                                          v-model="equipment.ability.saveAmount"
                                                          type="number">
                                                <TooltipComponent slot="prepend" :text="'INT/3 automatically added to save amount.'"></TooltipComponent>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-select label="Save Characteristic"
                                                      :items="characteristics"
                                                      v-model="equipment.ability.saveCharacteristic"
                                                      clearable></v-select>
                                        </v-col>
                                    </template>
                                </v-row>
                                <!-- Armor Inputs -->
                                <v-row>
                                    <v-col>
                                        <v-switch label="Is Armor/Shield" inset v-model="equipment.isArmorShield"></v-switch>
                                    </v-col>
                                    <v-col>
                                        <v-text-field label="DC to Hit" v-model="equipment.dcToHit" type="number" v-if="equipment.isArmorShield"></v-text-field>
                                    </v-col>
                                </v-row>
                                <!-- Armor Inputs End -->
                                <!-- Damage Modification Inputs -->
                                <v-expansion-panels v-model="damageModificationsPanel">
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
                                            <div v-for="(dm, index) in equipment.damageModifications" :key="index">
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
                                                <v-row>
                                                    <v-col>
                                                        <v-switch label="Immunity" inset
                                                                  v-model="dm.isImmunity"></v-switch>
                                                    </v-col>
                                                    <v-col>
                                                        <v-switch label="Resistance" inset
                                                                  v-model="dm.isResistance"></v-switch>
                                                    </v-col>
                                                    <v-col>
                                                        <v-switch label="Vulnerability" inset
                                                                  v-model="dm.isVulnerability"></v-switch>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <!-- Damage Modification Inputs End -->
                                <!-- Weapon Inputs -->
                                <v-switch label="Is Weapon" inset v-model="equipment.isWeapon" @click="toggleAdditionalPanel"></v-switch>
                                <v-row v-if="equipment.isWeapon">
                                    <v-col cols="6">
                                        <v-text-field label="Range"
                                                      v-model="equipment.ability.range"
                                                      type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <h3 class="text-center">
                                            Damage
                                        </h3>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Dice" type="number" v-model="equipment.ability.damage.dice"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Flat" type="number" v-model="equipment.ability.damage.flat"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Crit Dice" type="number" v-model="equipment.ability.damage.critDice"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-select label="Damage Characteristic"
                                                  :items="characteristics"
                                                  v-model="equipment.ability.damage.characteristic"
                                                  clearable>
                                            <TooltipComponent slot="prepend" :text="'CHAR added to damage, overrides Characteristic Check value.'"></TooltipComponent>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch label="Is Melee Attack" inset v-model="equipment.ability.isMeleeAttack"></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch label="Flat Damage to Crit" inset v-model="equipment.ability.damage.critFlat"></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch label="Max Crit" inset v-model="equipment.ability.damage.critMax"></v-switch>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-autocomplete label="Damage Types"
                                                        :items="damageTypes"
                                                        v-model="equipment.ability.damage.types"
                                                        multiple
                                                        :rules="textRules"
                                                        required></v-autocomplete>
                                    </v-col>
                                </v-row>
                                <!-- Weapon Inputs End -->
                                <!-- Additional Ability Inputs -->
                                <v-expansion-panels v-model="additionalAbilityInputsPanel">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <h3 class="text-center">Additional Ability Inputs</h3>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>

                                            <v-select label="Class Resource"
                                                      :items="resources.map((x) => ({ value: x, text: x.name }))"
                                                      v-model="equipment.ability.classResource"
                                                      clearable></v-select>
                                            <v-text-field label="Class Resource Cost" type="number" v-model="equipment.ability.crCost"></v-text-field>
                                            <v-text-field label="Duration" v-model="equipment.ability.duration"></v-text-field>
                                            <v-text-field label="Area of Effect" v-model="equipment.ability.areaOfEffect"></v-text-field>
                                            <v-select label="Physical/Meta *"
                                                      :items="physMetaOptions"
                                                      v-model="equipment.ability.physMeta"
                                                      :rules="textRules"
                                                      required></v-select>
                                            <v-text-field label="Successes" type="number" v-model="equipment.ability.successes"></v-text-field>
                                            <v-text-field label="Handedness"
                                                          type="number"
                                                          v-model="equipment.ability.handedness"></v-text-field>

                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <!-- Additional Ability Inputs End -->
                                <!-- Movement Inputs -->
                                <v-expansion-panels v-model="movementsPanel">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <h3 class="text-center">
                                                Movements
                                                <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                                       @click.stop="addMovement">
                                                    <v-icon>
                                                        mdi-plus
                                                    </v-icon>
                                                </v-btn>
                                            </h3>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <div v-for="(m, index) in equipment.movements" :key="index">
                                                <v-row>
                                                    <v-col>
                                                        <v-autocomplete label="Type"
                                                                        v-model="m.type"
                                                                        :items="movementTypes"
                                                                        :rules="notNull"
                                                                        required>
                                                            <v-icon color="error" slot="append" @click="deleteMovement(index)">mdi-delete</v-icon>
                                                        </v-autocomplete>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field label="Amount"
                                                                      type="number"
                                                                      v-model="m.amount"
                                                                      required></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <!-- Movement Inputs End -->
                                <v-combobox label="Body Slot"
                                            :items="slots"
                                            v-model="equipment.slot"></v-combobox>
                                <v-text-field label="Attunement Slots"
                                              v-model="equipment.attunementSlots"
                                              type="number"></v-text-field>
                            </template>
                            <v-textarea label="Description" v-model="equipment.description" auto-grow outlined rows="1"></v-textarea>
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
    import TooltipComponent from './TooltipComponent.vue'

    export default {
        name: 'EquipmentSection',
        components: {
            EquipmentListItem,
            TooltipComponent
        },
        props: {
            ap: Number,
            characteristics: Array,
            characterEquipment: Array,
            damageGroups: Array,
            damageTypes: Array,
            movementApIcon: String,
            movementApIconColor: String,
            movementTypes: Array,
            panelProp: Number,
            resources: Array,
            successesFromIntelligence: Number
        },
        data() {
            return {
                // Input Fields Start
                equipment: {
                    amount: 1,
                    attunementSlots: 0,
                    dcToHit: 1,
                    description: '',
                    id: null,
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
                        canEdit: false,
                        classResource: '',
                        color: {},
                        crCost: 0,
                        characteristic: '',
                        damage: {
                            characteristic: '',
                            critDice: 0,
                            critFlat: false,
                            critMax: false,
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
                    damageModifications: [],
                    movements: []
                },
                clearEquipment: {
                    amount: 1,
                    attunementSlots: 0,
                    dcToHit: 1,
                    description: '',
                    id: null,
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
                        canEdit: false,
                        classResource: '',
                        color: {},
                        crCost: 0,
                        characteristic: '',
                        damage: {
                            characteristic: '',
                            critDice: 0,
                            critFlat: false,
                            critMax: false,
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
                    damageModifications: [],
                    movements: []
                },
                // Input Fields End
                additionalAbilityInputsPanel: null,
                damageModificationsPanel: null,
                dialog: {
                    show: false,
                    type: ''
                },
                filterText: '',
                headers: [
                    {
                        text: 'Equipped',
                        value: 'isActive'
                    },
                    {
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        text: 'Qt',
                        value: 'amount'
                    },
                    {
                        text: 'Use',
                        value: 'use',
                        sortable: false
                    },
                    {
                        text: 'Actions',
                        value: 'actions',
                        sortable: false
                    },
                    {
                        text: '',
                        value: 'data-table-expand'
                    }
                ],
                movementsPanel: null,
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                rollAbility(ability) {
                    this.$emit('rollAbilityEmit', ability)
                },
                rollDamage(ability) {
                    this.$emit('rollDamageEmit', ability)
                },
                panel: this.panelProp,
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
                this.equipment.ability.damage.forEach((damage) => {
                    damage.addChar = false
                })
                this.equipment.ability.damage[index].addChar = true
            },
            addDamageModification() {
                this.damageModificationsPanel = 0
                this.equipment.damageModifications.push({
                    amount: 0,
                    isEquipment: true,
                    isImmunity: false,
                    isVulnerability: false,
                    isResistance: false,
                    type: '',
                })
            },
            addMovement() {
                this.movementsPanel = 0
                this.equipment.movements.push({
                    amount: 1,
                    description: `${this.name} Movement`,
                    type: ''
                })
            },
            deleteDamageModification(i) {
                this.equipment.damageModifications.splice(i, 1)
            },
            deleteMovement(i) {
                this.equipment.movements.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.equipment.isActive = !this.equipment.isItem
                    this.equipment.ability.name = this.equipment.name
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
                    this.equipment.ability.name = this.equipment.name
                    this.$emit('updateEntryEmit', { arrayName: 'equipment', object: this.equipment })
                }
            },
            updateEntryBypass(object) {
                this.$emit('updateEntryBypassEmit', { arrayName: 'equipment', object: object })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.equipment = JSON.parse(JSON.stringify(this.clearEquipment))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(equipment) {
                this.equipment = JSON.parse(JSON.stringify(equipment))
                this.setDialog('Delete')
            },
            updateDialog(equipment) {
                this.equipment = JSON.parse(JSON.stringify(equipment))
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            // Open Dialog Functions End
            showUseButton(item) {
                return (item.isActive && (                    
                    item.ability.apCost != 0 ||
                    item.ability.characteristic ||
                    item.ability.classResource ||
                    item.ability.damage.dice > 0 ||
                    item.ability.damage.flat > 0 ||
                    item.ability.dice ||
                    (item.ability.save && item.ability.saveAmount && item.ability.saveCharacteristic)))
            },
            toggleAdditionalPanel() {
                if (this.equipment.isWeapon)
                    this.additionalAbilityInputsPanel = 0
            },
            useButtonColor(ability) {
                let color = ''

                let apColor = ''
                if (ability.apCost > 0) {
                    if (ability.apCost < this.ap)
                        apColor = 'primary'
                    else if (ability.apCost == this.ap)
                        apColor = 'warning'
                    else if (ability.apCost > this.ap)
                        apColor = 'error'
                }

                let crColor = ''
                if (this.crCost > 0) {
                    let resource = this.resources.find(x => { return x.id == ability.classResource })
                    if (resource) {
                        if (ability.crCost < resource.amount)
                            crColor = 'primary'
                        if (ability.crCost == resource.amount)
                            crColor = 'warning'
                        if (ability.crCost > resource.amount)
                            crColor = 'error'
                    }
                }

                if (crColor == 'error' || apColor == 'error')
                    color = 'error'
                else if (crColor == 'warning' || apColor == 'warning')
                    color = 'warning'
                else
                    color = 'primary'

                return color
            },
            useAbility(ability) {
                this.$emit('useAbilityEmit', ability)
            },
            validate() {
                return this.$refs.form.validate()
            }
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'equipmentPanel', value: this.panel })
            }
        }
    }
</script>