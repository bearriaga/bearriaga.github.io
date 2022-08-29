<template>
    <div>
        <h3 class="text-center">{{name}}</h3>
        <v-row>
            <v-col class="text-center">
                <v-btn color="primary" @click="updateDialog">
                    <v-icon>mdi-pen</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center">
                <v-btn color="error" @click="deleteDialog">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-checkbox label="Is Equipped"
                    v-model="isActive"></v-checkbox>
        <v-text-field label="Amount"
                      type="number"
                      v-model="amount"
                      min="0"></v-text-field>
        <v-form disabled>
            <v-text-field label="AP Cost"
                          type="number"
                          v-model="ap"
                          v-if="ap"></v-text-field>
            <v-text-field label="Characteristic"
                          v-model="characteristic"
                          v-if="characteristic"></v-text-field>
            <v-text-field :label="dcToHitLabel" v-model="dcToHit" type="number" v-if="armorType">
                <v-icon slot="append">mdi-shield</v-icon>
            </v-text-field>
            <DamageModificationSection v-if="damageModifications.length > 0"
                                       :can-edit="false"
                                       :damage-modifications="damageModifications"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       @addEntryEmit="addEntry($event)"
                                       @deleteEntryEmit="deleteEntry($event)"
                                       @updateEntryEmit="updateEntry($event)"></DamageModificationSection>

            <template v-if="damage.length > 0 && isWeapon">
                <v-expansion-panels>
                    <v-expansion-panel v-for="(item,i) in 1" :key="i">
                        <v-expansion-panel-header>
                            <h3 class="text-center">
                                Damage
                            </h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div v-for="d in damage" :key="d.dice + d.flat + d.type">
                                <v-row>
                                    <v-col cols="12" md="6" v-if="d.dice > 0">
                                        <v-text-field label="Dice" v-model="d.dice" disabled></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6" v-if="d.flat > 0">
                                        <v-text-field label="Flat" type="for" v-model="d.flat" disabled></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="Type" v-model="d.type"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </template>

            <v-text-field label="Handedness"
                          type="number"
                          v-model="handedness"
                          v-if="handedness"></v-text-field>
            <v-combobox label="Body Slot"
                        :items="slots"
                        v-model="slot"
                        v-if="slot"></v-combobox>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
        </v-form>
    </div>
</template>

<script>
    import DamageModificationSection from './DamageModificationSection.vue'

    export default {
        name: 'EquipmentListItem',
        components: {
            DamageModificationSection
        },
        props: {
            damageGroups: Array,
            damageTypes: Array,
            equipment: Object,
            slots: Array
        },
        computed: {
            dcToHitLabel() {
                let label = ''
                if (this.equipment.armorType)
                    if (this.equipment.armorType == 'armor')
                        label = 'Armor'
                if (this.equipment.armorType == 'shield')
                    label = 'Shield'
                return label + ' - DC to Hit'
            }
        },
        data() {
            return {
                amount: this.equipment.amount,
                armorType: this.equipment.armorType,
                ap: this.equipment.ap,
                characteristic: this.equipment.characteristic,
                dcToHit: this.equipment.dcToHit,
                description: this.equipment.description,
                handedness: this.equipment.handedness,
                isActive: this.equipment.isActive,
                isWeapon: this.equipment.isWeapon,
                name: this.equipment.name,
                range: this.equipment.range,
                slot: this.equipment.slot,
                damage: this.equipment.damage,
                damageModifications: this.equipment.damageModifications,
            }
        },
        methods: {
            deleteDialog() {
                this.$emit('deleteDialogEmit', this.equipment)
            },
            setObject() {
                let equipment = {
                    amount: this.amount,
                    armorType: this.armorType,
                    ap: this.ap,
                    characteristic: this.characteristic,
                    dcToHit: this.dcToHit,
                    description: this.description,
                    handedness: this.handedness,
                    id: this.equipment.id,
                    isActive: this.isActive,
                    isWeapon: this.isWeapon,
                    name: this.name,
                    range: this.range,
                    slot: this.slot,
                    damage: JSON.parse(JSON.stringify(this.damage)),
                    damageModifications: JSON.parse(JSON.stringify(this.damageModifications))
                }
                return equipment
            },
            updateDialog() {                
                this.$emit('updateDialogEmit', this.setObject())
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.setObject())
            }
        },
        watch: {
            amount() {
                this.updateEntry()
            },
            isActive() {
                this.updateEntry()
            }
        }
    }
</script>