<template>
    <div>
        <h3 class="text-center">{{minion.name}}</h3>
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
        <v-row>
            <v-col cols="6" v-for="char in characteristicViewItems" :key="char.key">
                <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                        @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                        :characteristic="char"></CharacteristicViewItem>
            </v-col>
        </v-row>
        <v-form>
            <h3 class="text-center"> Health </h3>
            <v-row>
                <v-col cols="6">
                    <v-text-field type="number" min="0" v-model="damageToTake.amount">
                        <v-icon color="success" slot="append" @click="heal">mdi-plus</v-icon>
                        <v-icon color="error" slot="append" @click="takeDamage">mdi-liquid-spot</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select label="Type" :items="damageTypes" v-model="damageToTake.type"></v-select>
                </v-col>
                <v-col>
                    <v-row>
                        <v-col cols="12" v-for="input in inputWithEditModals" :key="input.key">
                            <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                @apGainEmit="apGain($event)"
                                                @updatePropEmit="updateProp($event)"
                                                :property-object="input"></InputWithEditModal>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" v-for="input in healthInputWithEditModals" :key="input.key">
                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @updatePropEmit="updateProp($event)"
                                        :property-object="input"></InputWithEditModal>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
    import CharacteristicViewItem from './CharacteristicViewItem.vue'
    import InputWithEditModal from './InputWithEditModal.vue'

    export default {
        name: 'MinionListItem',
        components: {
            CharacteristicViewItem,
            InputWithEditModal
        },
        props: {
            minion: Object
        },
        computed: {
            apMax() {
                return ((this.characterSheet.speedPreperationIsKey) ? 3 * (+this.characterSheet.speed) : 2 * (+this.characterSheet.speed))
            },
            characteristicViewItems() {
                return [
                    {
                        abbreviation: 'FIT',
                        adjustment: this.characterSheet.fitnessAdjustment,
                        key: 'fit' + this.characterSheet.id + this.characterSheet.fitnessAdjustment + this.updateCharacter,
                        name: 'fitness',
                        value: this.characterSheet.fitness,
                        characteristic: false
                    },
                    {
                        abbreviation: 'RES',
                        adjustment: this.characterSheet.resistanceAdjustment,
                        key: 'res' + this.characterSheet.id + this.characterSheet.resistanceAdjustment + this.updateCharacter,
                        name: 'resistance',
                        value: this.characterSheet.resistance,
                        characteristic: false
                    },
                    {
                        abbreviation: 'SPD',
                        adjustment: this.characterSheet.speedAdjustment,
                        key: 'spd' + this.characterSheet.id + this.characterSheet.speedAdjustment + this.updateCharacter,
                        name: 'speed',
                        value: this.characterSheet.speed,
                        characteristic: false
                    },
                    {
                        abbreviation: 'INT',
                        adjustment: this.characterSheet.intelligenceAdjustment,
                        key: 'int' + this.characterSheet.id + this.characterSheet.intelligenceAdjustment + this.updateCharacter,
                        name: 'intelligence',
                        value: this.characterSheet.intelligence,
                        characteristic: false
                    },
                    {
                        abbreviation: 'CUN',
                        adjustment: this.characterSheet.cunningAdjustment,
                        key: 'cun' + this.characterSheet.id + this.characterSheet.cunningAdjustment + this.updateCharacter,
                        name: 'cunning',
                        value: this.characterSheet.cunning,
                        characteristic: false
                    },
                    {
                        abbreviation: 'LCK',
                        adjustment: this.characterSheet.luckAdjustment,
                        key: 'lck' + this.characterSheet.id + this.characterSheet.luckAdjustment + this.updateCharacter,
                        name: 'luck',
                        value: this.characterSheet.luck,
                        characteristic: false
                    }
                ]
            },
            damageTypes() {
                var damageTypes = []
                this.damageGroups.forEach((group) => {
                    damageTypes.push(group.name)
                    group.types.forEach((type) => {
                        damageTypes.push(type.name)
                    })
                })
                return damageTypes
            },
            damageModifications() {
                let damageModifications = []

                this.characterSheet.damageModifications.forEach(dm => {
                    let damageModification = JSON.parse(JSON.stringify(dm))

                    damageModification.key = damageModification.id + damageModification.amount + this.updateCharacter
                    damageModifications.push(damageModification)
                })

                this.characterSheet.equipment.filter(equipment => { return equipment.isActive && equipment.damageModifications.length > 0 }).forEach(equipment => {
                    equipment.damageModifications.forEach((dm, index) => {
                        let damageModification = JSON.parse(JSON.stringify(dm))

                        damageModification.key = index + JSON.stringify(damageModification) + this.updateCharacter
                        damageModifications.push(damageModification)
                    })
                })

                this.characterSheet.buffs.filter(b => { return JSON.stringify(b.adjustments).includes('Damage Modification') && b.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'Damage Modification' }).forEach(adjustment => {
                        let damageModification = {
                            amount: adjustment.amount,
                            id: adjustment.id,
                            isBuff: true,
                            isResistance: adjustment.damageModification.isResistance,
                            isVulnerability: adjustment.damageModification.isVulnerability,
                            key: adjustment.amount + adjustment.id,
                            type: adjustment.damageModification.type
                        }
                        damageModifications.push(damageModification)
                    })
                })

                return damageModifications
            },
            healthInputWithEditModals() {
                return [
                    {
                        bar: true,
                        color: 'red',
                        dialogText: 'Health Points Max = (level * 5) + (RES * 3) + purchased HP + Buffs',
                        disabled: false,
                        infoText: '',
                        key: 'hp' + this.characterSheet.hpMax + this.updateHP.toString(),
                        label: 'Health Points',
                        minus: true,
                        plus: true,
                        type: 'number',
                        value: this.characterSheet.hp,
                        valueIncreases: this.characterSheet.hpIncreases,
                        valueIncreasesLabel: 'HP Purchases',
                        valueIncreasesName: 'hpIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.hpMax,
                        valueName: 'hp'
                    }
                ]
            },
            inputWithEditModals() {
                return [
                    {
                        bar: true,
                        color: 'green',
                        dialogText: 'Your maximum AP pool is increased from 2x your AP generation to 3x your generation rate.',
                        disabled: false,
                        infoText: '',
                        key: 'ap' + this.characterSheet.apMax + this.updateAP.toString(),
                        label: 'Action Points',
                        minus: true,
                        plus: true,
                        type: 'number',
                        value: this.characterSheet.ap,
                        valueName: 'ap',
                        valueIncreases: this.characterSheet.speedPreperationIsKey,
                        valueIncreasesLabel: 'Speed: Preperation is Key',
                        valueIncreasesName: 'speedPreperationIsKey',
                        valueIncreasesType: 'bool',
                        valueMax: this.characterSheet.apMax
                    }
                ]
            },
            hpMax() {
                let hp = ((this.characterSheet.level * 5) + (+this.characterSheet.resistance * 3) + +this.characterSheet.hpIncreases)
                return (hp > 1) ? hp : 1
            },
            successesFromIntelligence() {
                return Math.floor(this.characterSheet.intelligence / 3)
            }
        },
        created() {
            this.characterInit()
        },
        data() {
            return {
                characterSheet: this.minion,
                damageGroups: [
                    {
                        color: 'green lighten-3',
                        icon: 'mdi-shield-sun',
                        name: 'Elemental',
                        types: [
                            { name: 'Acid', icon: 'mdi-flask-outline' },
                            { name: 'Cold', icon: 'mdi-snowflake' },
                            { name: 'Electric', icon: 'mdi-lightning-bolt' },
                            { name: 'Fire', icon: 'mdi-fire' },
                            { name: 'Energy/Arcane', icon: 'mdi-laser-pointer' }
                        ]
                    },
                    {
                        color: 'deep-purple lighten-3',
                        icon: 'mdi-shield-cross',
                        name: 'Esoteric',
                        types: [
                            { name: 'Dark', icon: 'mdi-skull' },
                            { name: 'Force', icon: 'mdi-rotate-orbit' },
                            { name: 'Light', icon: 'mdi-centos' },
                            { name: 'Psionic', icon: 'mdi-brain' },
                            { name: 'Toxic', icon: 'mdi-biohazard' }
                        ]
                    },
                    {
                        color: 'orange lighten-3',
                        icon: 'mdi-shield-sword',
                        name: 'Physical',
                        types: [
                            { name: 'Blunt', icon: 'mdi-gavel' },
                            { name: 'Explosive', icon: 'mdi-bomb' },
                            { name: 'Piercing', icon: 'mdi-arrow-projectile' },
                            { name: 'Slashing', icon: 'mdi-sword' }
                        ]
                    },
                    {
                        color: 'yellow lighted-3',
                        icon: 'mdi-decagram',
                        name: 'True Damage',
                        types: []
                    }
                    ,
                    {
                        color: 'green lighted-3',
                        icon: 'mdi-plus',
                        name: 'Healing',
                        types: []
                    }
                ],
                damageToTake:
                {
                    amount: 0,
                    type: ''
                },
                updateAP: 0,
                updateBuff: 0,
                updateHP: 0,
                updateStatus: 0
            }
        },
        methods: {
            apGain() {
                this.updateStatus++
                this.updateBuff++
            },
            characterInit() {
                this.characterSheet.apMax = (this.characterSheet.speedPreperationIsKey) ? 3 * (+this.characterSheet.speed) : 2 * (+this.characterSheet.speed)
                this.characterSheet.attunementSlotsMax = 10 + +this.characterSheet.attunementSlotsIncreases
                this.characterSheet.bpMax = +this.resistance + +this.characterSheet.bpIncreases
                this.characterSheet.dcToHit = 3 + +this.characterSheet.dcToHitIncreases
                this.characterSheet.hpMax = ((this.characterSheet.level * 5) + (+this.characterSheet.resistance * 3) + +this.characterSheet.hpIncreases)
            },
            deleteDialog() {
                this.$emit('deleteDialogEmit', this.characterSheet)
            },
            //Health Funcitons
            heal() {
                if (this.damageToTake.amount > 0) {
                    this.characterSheet.hp = +this.characterSheet.hp + +this.damageToTake.amount
                    this.updateHP = this.updateHP + 1
                }
            },
            takeDamage() {
                var damage = this.damageToTake.amount
                var type = this.damageToTake.type
                var damageReductionAmount = 0;
                var isResistant = false
                var isVulnerable = false

                this.damageGroups.forEach((group) => {
                    //check if type is in the group.types array
                    if (type == group.name || group.types.some(x => x.name == type)) {
                        let damageModifications = this.damageModifications
                            .filter(x => { return x.type == type || x.type == group.name })
                        isResistant = damageModifications.some(x => x.isResistance)
                        isVulnerable = damageModifications.some(x => x.isVulnerability)
                        damageReductionAmount = damageModifications
                            .reduce((previousValue, entry) => {
                                return +previousValue + +entry.amount
                            }, 0)
                    }
                })

                var damageToTake = damage - damageReductionAmount
                if (isResistant)
                    damageToTake = Math.floor(damageToTake / 2)
                if (isVulnerable)
                    damageToTake = damageToTake * 2

                if (damageToTake > 0) {
                    this.characterSheet.hp = this.characterSheet.hp - damageToTake
                    this.updateHP = this.updateHP + 1
                }
            },
            //Health Funcitons End
            rollStandAloneCheck(object) {
                object.luck = this.characterSheet.luck
                object.successesFromIntelligence = this.successesFromIntelligence
                this.$emit('rollDiceCheckEmit', object)
            },
            updateCharacterBypass() {
                this.$emit('updateCharacterBypassEmit', this.characterSheet)
            },
            updateDialog() {
                this.$emit('updateDialogEmit', this.characterSheet)
            },
            updateProp(prop) {
                if (prop.type == 'number')
                    this.characterSheet[prop.propName] = +prop.value
                else
                    this.characterSheet[prop.propName] = prop.value
                this.$emit('updateEntryEmit', this.characterSheet)
            },
        },
        watch: {
            apMax() {
                this.characterSheet.apMax = this.apMax
                this.$emit('updateEntryEmit', this.characterSheet)
            },
            hpMax() {
                this.characterSheet.hpMax = this.hpMax
                this.$emit('updateEntryEmit', this.characterSheet)
            }
        }
    }
</script>