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
                <v-expansion-panel-content>
                    <EquipmentListItem v-for="e in characterEquipment" :key="e.key"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       :equipment="e"
                                       :slots="slots"
                                       @deleteDialogEmit="deleteDialog($event)"
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
                            <v-text-field label="AP Cost"
                                          type="number"
                                          v-model="ap"></v-text-field>
                            <v-select label="Characteristic"
                                      v-model="characteristic"
                                      :items="characteristics"></v-select>
                            <!-- Armor Inputs -->
                            <v-radio-group v-model="armorType">
                                <v-radio label="Not armor/shield" value=""></v-radio>
                                <v-radio label="Is Armor" value="armor"></v-radio>
                                <v-radio label="Is Shield" value="shield"></v-radio>
                            </v-radio-group>
                            <v-text-field label="DC to Hit" v-model="dcToHit" type="number" v-if="armorType"></v-text-field>
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
                                            <v-row v-for="(d, index) in damage" :key="index">
                                                <v-col cols="12">
                                                    <v-autocomplete label="Type *"
                                                                    :items="damageTypes"
                                                                    v-model="d.type"
                                                                    :rules="textRules"
                                                                    required>
                                                        <v-icon color="error" slot="append" @click="deleteDamage(index)">mdi-delete</v-icon>
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field label="Dice" type="number" v-model="d.dice"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field label="Flat" type="number" v-model="d.flat"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </template>
                            <!-- Weapon Inputs End -->
                            <v-text-field label="Handedness"
                                          type="number"
                                          v-model="handedness"></v-text-field>
                            <v-combobox label="Body Slot"
                                        :items="slots"
                                        v-model="slot"></v-combobox>
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
            characteristics: Array,
            characterEquipment: Array,
            damageGroups: Array,
            damageTypes: Array
        },
        data() {
            return {
                // Input Fields Start
                equipment: {
                    amount: 1,
                    armorType: '',
                    ap: 0,
                    characteristic: '',
                    dcToHit: 1,
                    description: '',
                    handedness: 0,
                    isActive: true,
                    isWeapon: false,
                    name: '',
                    range: 0,
                    slot: '',
                    damage: [],
                    damageModifications: []
                },
                amount: 1,
                armorType: '',
                ap: 0,
                characteristic: '',
                dcToHit: 1,
                description: '',
                handedness: 0,
                id: null,
                isActive: true,
                isWeapon: false,
                name: '',
                range: 0,
                slot: '',
                damage: [],
                damageModifications: [],
                // Input Fields End
                dialog: {
                    show: false,
                    type: ''
                },
                slots: ['Head', 'Body', 'Arms', 'Legs', 'Boots', 'Clothes'],
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
            addDamage() {
                this.damage.push({
                    dice: 0,
                    flat: 0,
                    type: ''
                });
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
            deleteDamage(i) {
                this.damage.splice(i, 1)
            },
            deleteDamageModification(i) {
                this.damageModifications.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
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
                    armorType: this.armorType,
                    ap: this.ap,
                    characteristic: this.characteristic,
                    dcToHit: this.dcToHit,
                    description: this.description,
                    handedness: this.handedness,
                    id: this.id,
                    isActive: this.isActive,
                    isWeapon: this.isWeapon,
                    name: this.name,
                    range: this.range,
                    slot: this.slot,
                    damage: this.damage,
                    damageModifications: this.damageModifications
                }
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.setDialog('Add')
                this.equipment = {
                    amount: 1,
                    armorType: '',
                    ap: 0,
                    characteristic: '',
                    dcToHit: 1,
                    description: '',
                    handedness: 0,
                    isActive: true,
                    isWeapon: false,
                    name: '',
                    range: 0,
                    slot: '',
                    damage: [],
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
                this.armorType = equipment.armorType
                this.ap = equipment.ap
                this.characteristic = equipment.characteristic,
                this.dcToHit = equipment.dcToHit
                this.description = equipment.description
                this.handedness = equipment.handedness
                this.id = equipment.id
                this.isActive = equipment.isActive
                this.isWeapon = equipment.isWeapon
                this.name = equipment.name
                this.range = equipment.range
                this.slot = equipment.slot
                this.damage = equipment.damage
                this.damageModifications = equipment.damageModifications
            },
            // Open Dialog Functions End
            validate() {
                return this.$refs.form.validate()
            }
        }
    }
</script>