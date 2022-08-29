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
            <v-text-field label="DC to Hit" v-model="dcToHit" type="number" v-if="isArmorShied">
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

            <v-text-field label="Handedness"
                          type="number"
                          v-model="handedness"
                          v-if="handedness"></v-text-field>
            <v-combobox label="Body Slot"
                        :items="slots"
                        v-model="slot"
                        v-if="slot"></v-combobox>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            <AbilityLIstItem :ability="ability"
                             :ap="ap"
                             :can-edit="false"
                             :characteristics="characteristics"
                             :resources="resources"
                             @rollAbilityEmit="rollAbility($event)"
                             @rollDamageEmit="rollDamage($event)"
                             @subtractAP="subtractAP($event)"
                             @subtractCR="subtractCR($event)"></AbilityLIstItem>
        </v-form>
    </div>
</template>

<script>
    import AbilityLIstItem from './AbilityListItem.vue'
    import DamageModificationSection from './DamageModificationSection.vue'

    export default {
        name: 'EquipmentListItem',
        components: {
            AbilityLIstItem,
            DamageModificationSection
        },
        props: {
            ap: Number,
            characteristics: Array,
            damageGroups: Array,
            damageTypes: Array,
            equipment: Object,
            resources: Array,
            slots: Array
        },
        computed: {},
        data() {
            return {
                ability: {
                    apCost: this.equipment.apCost,
                    areaOfEffect: '',
                    boughtForFree: true,
                    color: {},
                    classResource: '',
                    crCost: 0,
                    characteristic: this.equipment.characteristic,
                    description: '',
                    duration: '',
                    handedness: this.equipment.handedness,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    isMeleeAttack: true,
                    maxSizeCategoryOfMass: 0,
                    name: this.equipment.name,
                    physMeta: 'Physical',
                    range: this.equipment.range,
                    successes: 0,
                    xpCost: 0,
                    components: [],
                    damage: this.equipment.damage,
                    subEffects: []
                },
                amount: this.equipment.amount,
                apCost: this.equipment.apCost,
                characteristic: this.equipment.characteristic,
                dcToHit: this.equipment.dcToHit,
                description: this.equipment.description,
                handedness: this.equipment.handedness,
                isActive: this.equipment.isActive,
                isArmorShied: this.equipment.isArmorShied,
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
            rollAbility(ability) {
                console.log(ability)
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            setObject() {
                let equipment = {
                    amount: this.amount,
                    apCost: this.apCost,
                    characteristic: this.characteristic,
                    dcToHit: this.dcToHit,
                    description: this.description,
                    handedness: this.handedness,
                    id: this.equipment.id,
                    isActive: this.isActive,
                    isArmorShied: this.isArmorShied,
                    isWeapon: this.isWeapon,
                    name: this.name,
                    range: this.range,
                    slot: this.slot,
                    damage: JSON.parse(JSON.stringify(this.damage)),
                    damageModifications: JSON.parse(JSON.stringify(this.damageModifications))
                }
                return equipment
            },
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            subtractCR(crCost) {
                this.$emit('subtractCREmit', crCost)
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