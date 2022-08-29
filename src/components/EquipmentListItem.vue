<template>
    <div>
        <h3 class="text-center">{{equipment.name}}</h3>
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
                    v-model="isActive"
                    v-if="!equipment.isItem"></v-checkbox>
        <v-text-field label="Amount"
                      type="number"
                      v-model="amount"
                      min="0"></v-text-field>
        <v-form disabled>
            <v-text-field label="DC to Hit" v-model="dcToHit" type="number" v-if="equipment.isArmorShied">
                <v-icon slot="append">mdi-shield</v-icon>
            </v-text-field>
            <DamageModificationSection v-if="equipment.damageModifications.length > 0"
                                       :can-edit="false"
                                       :damage-modifications="equipment.damageModifications"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       @addEntryEmit="addEntry($event)"
                                       @deleteEntryEmit="deleteEntry($event)"
                                       @updateEntryEmit="updateEntry($event)"></DamageModificationSection>            
            <v-combobox label="Body Slot"
                        :items="slots"
                        v-model="slot"
                        v-if="slot"></v-combobox>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" v-if="description"></v-textarea>
            <AbilityLIstItem v-if="!equipment.isItem && isActive"
                             :ability="equipment.ability"
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
                amount: this.equipment.amount,
                dcToHit: this.equipment.dcToHit,
                description: this.equipment.description,
                handedness: this.equipment.handedness,
                isActive: this.equipment.isActive,
                slot: this.equipment.slot
            }
        },
        methods: {
            deleteDialog() {
                this.$emit('deleteDialogEmit', this.equipment)
            },
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