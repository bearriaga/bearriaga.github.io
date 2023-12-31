<template>
    <div>
        <v-switch label="Is Equipped" inset
                  v-model="isActive"
                  v-if="!equipment.isItem"></v-switch>
        <v-row>
            <v-col>
        <v-text-field label="Amount"
                      type="number"
                      v-model="amount"
                      min="0"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field label="Cost"
                              v-model="cost"
                              disabled></v-text-field>
            </v-col>
        </v-row>
        <v-form disabled>
            <DamageModificationSection v-if="equipment.damageModifications.length > 0"
                                       :can-edit="false"
                                       :damage-modifications="equipment.damageModifications"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       @addEntryEmit="addEntry($event)"
                                       @deleteEntryEmit="deleteEntry($event)"
                                       @updateEntryEmit="updateEntry($event)"></DamageModificationSection>
            <MovementSection v-if="equipment.movements.length"
                             :ap="ap"
                             :can-edit="false"
                             :characteristics="characteristicViewItems"
                             :movements="equipment.movements"
                             :movement-types="movementTypes"
                             :movement-ap-icon="movementApIcon"
                             :movement-ap-icon-color="movementApIconColor"
                             @addEntryEmit="addEntry($event)"
                             @deleteEntryEmit="deleteEntry($event)"
                             @subtractAPEmit="subtractAP($event)"
                             @updateEntryEmit="updateEntry($event)"></MovementSection>
            <v-combobox label="Body Slot"
                        :items="slots"
                        v-model="slot"
                        v-if="slot"></v-combobox>
            <v-text-field label="Attunement Slots"
                          v-model="attunementSlots"
                          v-if="attunementSlots"></v-text-field>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" v-if="description"></v-textarea>
            <AbilityListItem v-if="showAbility"
                             :ability="equipment.ability"
                             :ap="ap"
                             :buffs="buffs"
                             :characteristics="characteristics"
                             :characteristic-view-items="characteristicViewItems"
                             :resources="resources"
                             :successes-from-intelligence="successesFromIntelligence"
                             @rollAbilityEmit="rollAbility($event)"
                             @rollDamageEmit="rollDamage($event)"
                             @subtractAP="subtractAP($event)"
                             @subtractCR="subtractCR($event)"
                             @useAbility="useAbility($event)"></AbilityListItem>
        </v-form>
    </div>
</template>

<script>
    import AbilityListItem from './AbilityListItem.vue'
    import DamageModificationSection from './DamageModificationSection.vue'
    import MovementSection from './MovementSection.vue'

    export default {
        name: 'EquipmentListItem',
        components: {
            AbilityListItem,
            DamageModificationSection,
            MovementSection
        },
        props: {
            ap: Number,
            buffs: Array,
            characteristics: Array,
            characteristicViewItems: Array,
            damageGroups: Array,
            damageTypes: Array,
            equipment: Object,
            movementApIcon: String,
            movementApIconColor: String,
            movementTypes: Array,
            resources: Array,
            slots: Array,
            successesFromIntelligence: Number
        },
        computed: {
            showAbility() {
                let show = !this.equipment.isItem && this.isActive &&
                    (this.equipment.ability.apCost != 0 ||
                        this.equipment.ability.classResource ||
                        this.equipment.ability.damage.dice > 0 ||
                        this.equipment.ability.damage.flat > 0 ||
                        this.equipment.ability.characteristic ||
                        (this.equipment.ability.save && this.equipment.ability.saveAmount && this.equipment.ability.saveCharacteristic))

                return show
            }
        },
        data() {
            return {
                amount: this.equipment.amount,
                attunementSlots: this.equipment.attunementSlots,
                cost: this.equipment.cost,
                description: this.equipment.description,
                handedness: this.equipment.handedness,
                isActive: this.equipment.isActive,
                slot: this.equipment.slot
            }
        },
        methods: {
            rollAbility(ability) {
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            setObject() {
                let equipment = JSON.parse(JSON.stringify(this.equipment))
                equipment.isActive = this.isActive
                equipment.amount = this.amount
                return equipment
            },
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            subtractCR(crCost) {
                this.$emit('subtractCREmit', crCost)
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.setObject())
            },
            useAbility(ability) {
                this.$emit('useAbility', ability)
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