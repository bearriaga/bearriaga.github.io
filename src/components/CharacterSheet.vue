<template>
    <div>

        <h4 class="text-center">Oatsys Chacter Sheet</h4>
        <form onsubmit="return false;">
            <v-row>
                <v-col cols="4" md="2">
                    <v-text-field label="Name" v-model="characterSheet.name"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Race" v-model="characterSheet.race"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Age" v-model="characterSheet.age" type="number"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Size" v-model="characterSheet.size" type="number"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-row>
                        <v-col cols="10">
                            <v-text-field label="Level" v-model="characterSheet.level" disabled></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" color="primary" dark>
                                        mdi-information
                                    </v-icon>
                                </template>
                                <span>Level = XP Earned / 500 round down</span>
                            </v-tooltip>

                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Movement in Squares" v-model="characterSheet.movement" type="number" disabled></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3">
                    <div class="charColumn mainColumn elevation-3" elevation="3">
                        <h3 class="text-center"> Characteristics </h3>
                        <v-row>
                            <v-col cols="6" v-for="char in characteristicViewItems" :key="char.key">
                                <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                                        @rollDiceCheckEmit="rollCheck($event)"
                                                        :characteristic="char"></CharacteristicViewItem>
                            </v-col>
                        </v-row>

                        <SkillSection :characteristics="characteristics"
                                      :skills="skills"
                                      @addEntryEmit="addEntry($event)"
                                      @deleteEntryEmit="deleteEntry($event)"
                                      @updateEntryEmit="updateEntry($event)"
                                      @rollDiceCheckEmit="rollCheck($event)"></SkillSection>
                    </div>
                </v-col>
                <v-col cols="12" md="3">
                    <div class="hpColumn mainColumn elevation-3">
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
                                <v-col cols="12" v-for="input in healthInputWithEditModals" :key="input.key">
                                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                        @updatePropEmit="updateProp($event)"
                                                        :property-object="input"></InputWithEditModal>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-row>
                            <v-col cols="12" md="6" v-for="input in defenseInputWithEditModals" :key="input.key">
                                <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                    @updatePropEmit="updateProp($event)"
                                                    :property-object="input"></InputWithEditModal>
                            </v-col>
                            <v-col cols="12">
                                <ResistanceSection :resistances="characterSheet.resistances"
                                                   :damage-groups="damageGroups"
                                                   :damage-types="damageTypes"
                                                   @addEntryEmit="addEntry($event)"
                                                   @deleteEntryEmit="deleteEntry($event)"
                                                   @updateEntryEmit="updateEntry($event)"></ResistanceSection>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="3">
                    <div class="resourcesColumn mainColumn elevation-3">
                        <h3 class="text-center"> Resources </h3>
                        <v-row>
                            <v-col cols="12" v-for="input in inputWithEditModals" :key="input.key">
                                <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                    @apGainEmit="apGain($event)"
                                                    @updatePropEmit="updateProp($event)"
                                                    :property-object="input"></InputWithEditModal>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" md="3">
                    <div class="classResourcesColumn mainColumn elevation-3">
                        <ResourceSection :resources="resources"
                                         :characteristics="characteristics"
                                         @addEntryEmit="addEntry($event)"
                                         @deleteEntryEmit="deleteEntry($event)"
                                         @fillResourcesEmit="fillResources($event)"
                                         @updateEntryEmit="updateEntry($event)"></ResourceSection>
                        <MovementSection :ap="characterSheet.ap"
                                         :movements="characterSheet.movements"
                                         :movement-types="movementTypes"
                                         @addEntryEmit="addEntry($event)"
                                         @deleteEntryEmit="deleteEntry($event)"
                                         @subtractAPEmit="subtractAP($event)"
                                         @updateEntryEmit="updateEntry($event)"></MovementSection>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <AbilitySection :abilities="abilities"
                                    :ap="characterSheet.ap"
                                    :characteristics="characteristics"
                                    :damage-types="damageTypes"
                                    :resources="resources"
                                    @addEntryEmit="addEntry($event)"
                                    @deleteEntryEmit="deleteEntry($event)"
                                    @rollAbilityEmit="rollAbility($event)"
                                    @rollDamageEmit="rollDamage($event)"
                                    @subtractAPEmit="subtractAP($event)"
                                    @subtractCREmit="subtractCR($event)"
                                    @updateEntryEmit="updateEntry($event)"></AbilitySection>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3">
                    <ClassSection :unlocked="false"
                                  :characteristics="characteristics"
                                  :classes="characterSheet.classes.filter(x => { return !x.unlocked })"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"></ClassSection>
                </v-col>
                <v-col cols="12" md="3">
                    <ClassSection :unlocked="true"
                                  :characteristics="characteristics"
                                  :classes="characterSheet.classes.filter(x => { return x.unlocked })"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"></ClassSection>
                </v-col>
                <v-col cols="12" md="3">
                    <h3 class="text-center"> Money </h3>
                    <v-row>
                        <v-col col="12" md="6">
                            <v-text-field label="Money"
                                          type="number"
                                          v-model="characterSheet.money"></v-text-field>
                        </v-col>
                        <v-col col="12" md="6">
                            <v-text-field type="number" min="0"
                                          v-model="moneyModifyAmount"
                                          label="Add/Subtract Money">
                                <v-icon color="success" slot="append" @click="moneyAddSubtract(true)">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="moneyAddSubtract(false)">mdi-minus</v-icon>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <h3 class="text-center"> XP </h3>
                    <v-text-field label="Available XP" v-model="characterSheet.xp" disabled></v-text-field>

                    <XPSection :xp="characterSheet.xp"
                               :xp-earned="characterSheet.xpEarned"
                               :xp-total="characterSheet.xpTotal"
                               :xp-entries="characterSheet.xpEntries"
                               @addEntryEmit="addEntry($event)"
                               @deleteEntryEmit="deleteEntry($event)"
                               @updateEntryEmit="updateEntry($event)"></XPSection>
                </v-col>
                <v-col cols="12" md="3">
                    <FlawSection :flaws="characterSheet.flaws"
                                 @addEntryEmit="addEntry($event)"
                                 @deleteEntryEmit="deleteEntry($event)"
                                 @updateEntryEmit="updateEntry($event)"></FlawSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3">
                    <StatusSection :statuses="statuses"
                                   :character-statuses="characterStatuses"
                                   @addEntryEmit="addEntry($event)"
                                   @deleteEntryEmit="deleteEntry($event)"
                                   @updateEntryEmit="updateEntry($event)"></StatusSection>
                </v-col>
                <v-col cols="12" md="3">
                    <BuffSection :buffs="buffs"
                                 :characteristics="characteristics"
                                 :damage-types="damageTypes"
                                 @addEntryEmit="addEntry($event)"
                                 @deleteEntryEmit="deleteEntry($event)"
                                 @updateEntryEmit="updateBuffEntry($event)"
                                 @updateEntryBypassEmit="updateEntry($event)"></BuffSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn color="primary" @click="setCharacterAsTupoc">Set as Tupoc</v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" @click="loadCharacter">Load Character</v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" @click="saveCharacter">Save Character</v-btn>
                </v-col>
            </v-row>
        </form>

        <!-- Check Dialog -->
        <div class="text-center">
            <v-dialog v-model="checkDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Dice Check Results
                    </v-card-title>

                    <v-card-text>
                        <div>
                            <b>Successes: {{checkDialog.successes}}</b>
                        </div>
                        <div>
                            Fate: {{checkDialog.fate}}

                            <template v-if="checkDialog.advantage">
                                , Advantage, LCK added to successes
                            </template>

                            <template v-if="checkDialog.threat">
                                , Threat
                            </template>
                        </div>
                        <div>
                            Dice Results: {{checkDialog.diceResults}}
                        </div>

                        <v-row>
                            <v-col cols="12">
                                <v-btn icon color="primary"
                                       @click="copyCheck">
                                    <v-icon>
                                        mdi-content-copy
                                    </v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="rerollWholeCheck"
                                       :disabled="characterSheet.rerolls <= 0"
                                       width="200">Reroll Hand</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="rerollFailures"
                                       :disabled="characterSheet.rerolls <= 0 || checkDialog.diceResults.filter(x=>{ return x < 4 }).length == 0"
                                       width="200">Reroll Failures</v-btn>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="checkDialog.selectedRerolls"
                                          :items="checkDialog.diceResults.map((x, i) => ({ value: i, text: x}))"
                                          label="Select Rerolls"
                                          multiple
                                          :disabled="characterSheet.rerolls <= 0">
                                    <v-icon color="primary"
                                            slot="prepend"
                                            @click.stop="rerollSelected"
                                            :disabled="characterSheet.rerolls <= 0 || checkDialog.selectedRerolls.length == 0">
                                        mdi-dice-6
                                    </v-icon>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="checkDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <!-- Check Dialog End -->
        <!-- Cleanse Dialog -->
        <div class="text-center">
            <v-dialog v-model="cleanseDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Cleanse
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select v-model="cleanseDialog.selectedStatuses"
                                          :items="characterSheet.statuses.filter(x => { return x.isActive && x.status.type == 'Condition' }).map(x => ({ value: x, text: x.status.name}))"
                                          label="Selected Conditions"
                                          multiple
                                          :disabled="characterSheet.bp <= 0"
                                          :rules="cleanseDialog.selectRules">
                                    <v-icon color="brown"
                                            slot="prepend"
                                            @click.stop="cleanseStatuses"
                                            :disabled="characterSheet.bp <= 0 || cleanseDialog.selectedStatuses.length == 0 || cleanseDialog.selectedStatuses.length > characterSheet.bp">
                                        mdi-hospital-box
                                    </v-icon>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="cleanseDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <!-- Cleanse Dialog End -->
        <!-- Damage Results Dialog -->
        <div class="text-center">
            <v-dialog v-model="damageDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Damage Results
                    </v-card-title>

                    <v-card-text>
                        <div v-for="(damage, index) in damageDialog.damages" :key="index">
                            <div>
                                <v-icon :color="damage.color">{{damage.icon}}</v-icon>
                                <b>{{damage.sum}} {{damage.type}}</b>
                            </div>
                        </div>
                        <v-btn icon color="primary"
                               @click="copyDamage">
                            <v-icon>
                                mdi-content-copy
                            </v-icon>
                        </v-btn>

                    </v-card-text>

                    <v-card-text>
                        <div v-for="(damage, index) in damageDialog.damages" :key="index">
                            <div>
                                <b>{{damage.damage.type}}</b>
                            </div>
                            <div v-if="damage.damage.dice">
                                Die Results:  {{damage.damage.dice}}d6 {{damage.diceResults}}
                            </div>
                            <div v-if="damage.charDamage">
                                CHAR damage: {{damage.charDamage}}
                            </div>
                            <div v-if="damage.damage.flat">
                                Flat Damage: {{damage.damage.flat}}
                            </div>
                            <v-select v-model="damage.selectedRerolls"
                                      v-if="damage.diceResults.length > 0"
                                      :items="damage.diceResults.map((x, i) => ({ value: i, text: x}))"
                                      label="Select Rerolls"
                                      multiple
                                      :disabled="characterSheet.rerolls <= 0">
                            </v-select>
                        </div>

                        <v-row>
                            <v-col cols="6">
                                <v-btn @click="rerollWholeDamage"
                                       :disabled="characterSheet.rerolls <= 0"
                                       width="200">Reroll Hand</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="rerollSelectedDamage"
                                       :disabled="characterSheet.rerolls <= 0 || !damageSelected"
                                       width="200">Reroll Selected</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="damageDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <!-- Damage Results Dialog End -->
        <div class="text-center">
            <v-dialog v-model="generalDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{generalDialog.title}}
                    </v-card-title>

                    <v-card-text>
                        {{generalDialog.text}}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="generalDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import AbilitySection from './AbilitySection.vue'
    import BuffSection from './BuffSection.vue'
    import CharacteristicViewItem from './CharacteristicViewItem.vue'
    import ClassSection from './ClassSection.vue'
    import FlawSection from './FlawSection.vue'
    import InputWithEditModal from './InputWithEditModal.vue'
    import MovementSection from './MovementSection.vue'
    import ResistanceSection from './ResistanceSection.vue'
    import ResourceSection from './ResourceSection.vue'
    import SkillSection from './SkillSection.vue'
    import StatusSection from './StatusSection.vue'
    import XPSection from './XPSection.vue'
    import { useCharacterStore } from '@/stores/CharacterStore'
    import { useGameDataStore } from '@/stores/GameDataStore'

    export default {
        name: 'CharacterSheet',
        components: {
            AbilitySection,
            BuffSection,
            CharacteristicViewItem,
            ClassSection,
            FlawSection,
            InputWithEditModal,
            MovementSection,
            ResistanceSection,
            ResourceSection,
            SkillSection,
            StatusSection,
            XPSection
        },
        setup() {
            const characterStore = useCharacterStore()
            characterStore.fill()

            const gameDataStore = useGameDataStore()
            gameDataStore.fill()

            return {
                characterStore, gameDataStore
            }
        },
        computed: {
            //Character Properties
            //CHAR Adjustments
            cunning() {
                return this.characterSheet.cunnning + this.characterSheet.cunningAdjustment
            },
            fitness() {
                return this.characterSheet.fitness + this.characterSheet.fitnessAdjustment
            },
            intelligence() {
                return this.characterSheet.intelligence + this.characterSheet.intelligenceAdjustment
            },
            luck() {
                return this.characterSheet.luck + this.characterSheet.luckAdjustment
            },
            resistance() {
                return this.characterSheet.resistance + this.characterSheet.resistanceAdjustment
            },
            speed() {
                return this.characterSheet.speed + this.characterSheet.speedAdjustment
            },
            cunningAdjustment() {
                return this.charBuff('cunning')
            },
            fitnessAdjustment() {
                return this.charBuff('fitness')
            },
            intelligenceAdjustment() {
                return this.charBuff('intelligence')
            },
            luckAdjustment() {
                return this.charBuff('luck')
            },
            resistanceAdjustment() {
                return this.charBuff('resistance')
            },
            speedAdjustment() {
                return this.charBuff('speed')
            },
            //CHAR Adjustments End
            apMax() {
                return ((this.characterSheet.speedPreperationIsKey) ? 3 * (+this.speed + 2) : 2 * (+this.speed + 2))
            },
            attunementSlotsMax() {
                return (10 + +this.characterSheet.attunementSlotsIncreases)
            },
            bpMax() {
                return +this.resistance + +this.characterSheet.bpIncreases
            },
            dcToHit() {
                return 3 + +this.characterSheet.dcToHitIncreases
            },
            hpMax() {
                return ((this.characterSheet.level * 5) + (+this.resistance * 3) + +this.characterSheet.hpIncreases)
            },
            level() {
                let nonClassXP = this.characterSheet.xpEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                return Math.floor(nonClassXP / 500)
            },
            movement() {
                return +this.fitness + this.characterSheet.movements.filter(x => { return x.type == 'Land Speed' }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
            },
            rerollsMax() {
                return +this.characterSheet.luck + +this.characterSheet.rerollsIncreases
            },
            xp() {
                return this.characterSheet.xpTotal - this.characterSheet.abilities.reduce((previousValue, entry) => {
                    if (!entry.boughtForFree)
                        return +previousValue + +entry.xpCost
                    else
                        return +previousValue
                }, 0)
            },
            xpEarned() {
                return this.characterSheet.xpEntries.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
            },
            xpTotal() {
                var flawsXP = this.characterSheet.flaws.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                return (this.characterSheet.xpEarned + flawsXP)
            },
            //Character Properties End
            abilities() {
                let abilities = []

                this.characterSheet.abilities.forEach((ability) => {
                    ability.key =
                        ability.apCost +
                        ability.areaOfEffect +
                        ability.boughtForFree +
                        JSON.stringify(ability.color) +
                        ability.crCost +
                        ability.characteristic +
                        ability.description +
                        ability.duration +
                        ability.handedness +
                        ability.id +
                        ability.inClass +
                        ability.isAbilityArray +
                        ability.isMeleeAttack +
                        ability.maxSizeCategoryOfMass +
                        ability.name +
                        ability.physMeta +
                        ability.range +
                        ability.successes +
                        ability.xpCost +
                        JSON.stringify(ability.components) +
                        JSON.stringify(ability.damage) +
                        JSON.stringify(ability.subEffects);
                    abilities.push(ability)
                })

                return abilities
            },
            characterStatuses() {
                let statuses = []

                this.characterSheet.statuses.forEach((status) => {
                    status.key =
                        JSON.stringify(status.status) +
                        status.isActive.toString() +
                        this.updateStatus;
                    statuses.push(status)
                })

                return statuses
            },
            buffs() {
                let buffs = []

                this.characterSheet.buffs.forEach((buff) => {
                    buff.key =
                        buff.id +
                        this.updateBuff +
                        JSON.stringify(buff.adjustments)
                    buffs.push(buff)
                })

                return buffs
            },
            characteristicViewItems() {
                let chars = this.characterSheet.classes.filter(x => { return x.active && !x.unlocked }).map(x => x.characteristic)
                return [
                    {
                        abbreviation: 'FIT',
                        adjustment: this.characterSheet.fitnessAdjustment,
                        key: 'fit' + this.characterSheet.id + this.characterSheet.fitnessAdjustment,
                        name: 'fitness',
                        value: this.characterSheet.fitness,
                        characteristic: chars.includes('fitness')
                    },
                    {
                        abbreviation: 'RES',
                        adjustment: this.characterSheet.resistanceAdjustment,
                        key: 'res' + this.characterSheet.id + this.characterSheet.resistanceAdjustment,
                        name: 'resistance',
                        value: this.characterSheet.resistance,
                        characteristic: chars.includes('resistance')
                    },
                    {
                        abbreviation: 'SPD',
                        adjustment: this.characterSheet.speedAdjustment,
                        key: 'spd' + this.characterSheet.id + this.characterSheet.speedAdjustment,
                        name: 'speed',
                        value: this.characterSheet.speed,
                        characteristic: chars.includes('speed')
                    },
                    {
                        abbreviation: 'INT',
                        adjustment: this.characterSheet.intelligenceAdjustment,
                        key: 'int' + this.characterSheet.id + this.characterSheet.intelligenceAdjustment,
                        name: 'intelligence',
                        value: this.characterSheet.intelligence,
                        characteristic: chars.includes('intelligence')
                    },
                    {
                        abbreviation: 'CUN',
                        adjustment: this.characterSheet.cunningAdjustment + this.characterSheet.cunningAdjustment,
                        key: 'cun' + this.characterSheet.id,
                        name: 'cunning',
                        value: this.characterSheet.cunning,
                        characteristic: chars.includes('cunning')
                    },
                    {
                        abbreviation: 'LCK',
                        adjustment: this.characterSheet.luckAdjustment + this.characterSheet.luckAdjustment,
                        key: 'lck' + this.characterSheet.id,
                        name: 'luck',
                        value: this.characterSheet.luck,
                        characteristic: chars.includes('luck')
                    }
                ]
            },
            damageSelected() {
                const hasSelected = (obj) => obj.selectedRerolls.length
                return this.damageDialog.damages.some(hasSelected)
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
            defenseInputWithEditModals() {
                return [
                    {
                        dialogText: '',
                        key: 'dc' + this.characterSheet.dcToHit,
                        label: 'DC to Hit',
                        type: 'number',
                        value: this.characterSheet.dcToHit,
                        valueName: 'dc',
                        valueIncreases: this.characterSheet.dcToHitIncreases,
                        valueIncreasesLabel: 'DC to Hit Purchases',
                        valueIncreasesName: 'dcToHitIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.dcToHit,
                        bar: false,
                        disabled: true,
                        plus: false,
                        minus: false
                    },
                    {
                        dialogText: 'Initiative = 1d6 + SPD + Initiative Purchases',
                        key: 'initiative' + this.characterSheet.initiative + this.updateInitiative,
                        label: 'Initiative',
                        type: 'number',
                        value: this.characterSheet.initiative,
                        valueName: 'initiative',
                        valueIncreases: this.characterSheet.initiativeIncreases,
                        valueIncreasesLabel: 'Initiative Purchases',
                        valueIncreasesName: 'initiativeIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.initiative,
                        bar: false,
                        disabled: false,
                        plus: false,
                        minus: false
                    }
                ]
            },
            healthInputWithEditModals() {
                return [
                    {
                        bar: true,
                        color: 'red',
                        dialogText: 'Health Points Max = (level * 5) + (RES * 3) + purchased HP',
                        disabled: false,
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
                    },
                    {
                        bar: true,
                        color: 'brown lighten-2',
                        dialogText: '',
                        disabled: false,
                        key: 'bp' + this.characterSheet.bpMax + this.updateBP.toString(),
                        label: 'Breakthrough Points',
                        minus: true,
                        plus: false,
                        type: 'number',
                        value: this.characterSheet.bp,
                        valueName: 'bp',
                        valueIncreases: this.characterSheet.bpIncreases,
                        valueIncreasesLabel: 'Breakthrough Points Purchases',
                        valueIncreasesName: 'bpIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.bpMax
                    },
                    {
                        bar: true,
                        color: 'yellow',
                        dialogText: '',
                        disabled: false,
                        key: 'rerolls' + this.characterSheet.rerollsMax + this.updateRerolls.toString(),
                        label: 'Rerolls',
                        minus: true,
                        plus: false,
                        type: 'number',
                        value: this.characterSheet.rerolls,
                        valueName: 'rerolls',
                        valueIncreases: this.characterSheet.rerollsIncreases,
                        valueIncreasesLabel: 'Rerolls Purchases',
                        valueIncreasesName: 'rerollsIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.rerollsMax
                    },
                    {
                        bar: true,
                        dialogText: '',
                        key: 'attunementSlots' + this.characterSheet.attunementSlotsMax,
                        label: 'Attunement Slots',
                        type: 'number',
                        value: this.characterSheet.attunementSlots,
                        valueName: 'attunementSlots',
                        valueIncreases: this.characterSheet.attunementSlotsIncreases,
                        valueIncreasesLabel: 'Attunement Slot Purchases',
                        valueIncreasesName: 'attunementSlotsIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.attunementSlotsMax,
                        disabled: false,
                        plus: false,
                        minus: false
                    }
                ]
            },
            resources() {
                let resources = []

                this.characterSheet.resources.forEach((resource) => {
                    let primaryCharValue = +this[resource.characteristic]
                    resource.amountMax = +primaryCharValue + +resource.resourceIncreases
                    resource.key = resource.name + resource.characteristic + resource.resourceIncreases + primaryCharValue + this.updateCR
                    resources.push(resource)
                })

                return resources
            },
            skills() {
                let skills = []

                this.characterSheet.skills.forEach((skill) => {
                    skill.value = +skill.skillIncreases + +this[skill.characteristic]
                    skill.key = skill.name + skill.characteristic + skill.skillIncreases + skill.value
                    skills.push(skill)
                })

                return skills
            }
        },
        created() {
            this.characterInit()
        },
        data() {
            return {
                characteristics: [
                    'fitness',
                    'speed',
                    'intelligence',
                    'cunning',
                    'resistance',
                    'luck'
                ],
                characterSheet: this.characterStore.getCharacterById('default'),
                checkDialog: {
                    advantage: false,
                    diceCheckObject: {},
                    diceResults: [],
                    fate: 0,
                    selectedRerolls: [],
                    show: false,
                    successes: 0,
                    threat: false
                },
                cleanseDialog: {
                    selectedStatuses: [],
                    selectRules: [
                        v => v.length <= this.characterSheet.bp || 'Not enough Breakthrough Points'
                    ],
                    show: false
                },
                damageDialog: {
                    ability: {},
                    damages: [],
                    show: false
                },
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
                generalDialog: {
                    show: false,
                    text: '',
                    title: ''
                },
                moneyModifyAmount: 0,
                movementTypes: [
                    'Burrowing',
                    'Flying',
                    'Gliding',
                    'Hover',
                    'Land Speed',
                    'Leap',
                    'Spider Climbing',
                    'Swim Speed',
                    'Teleport'
                ],
                statuses: this.gameDataStore.statuses,
                updateAP: 0,
                updateBP: 0,
                updateBuff: 0,
                updateCR: 0,
                updateHP: 0,
                updateInitiative: 0,
                updateStatus: 0,
                updateRerolls: 0,
            }
        },
        methods: {
            apGain() {
                this.characterSheet.statuses.forEach(status => {
                    if (status.duration > 0) {
                        status.duration--
                    }
                })
                this.updateStatus++
            },
            //Array CRUD Functions
            addEntry(object) {
                object.object.id = new Date().getTime().toString()
                this.characterSheet[object.arrayName].push(object.object)
            },
            deleteEntry(object) {
                let index = this.characterSheet[object.arrayName].findIndex(x => x.id == object.object.id)

                if (index == -1 && object.arrayName == 'abilities')
                    this.deleteEntryRecursive(this.characterSheet[object.arrayName], object.object)

                this.characterSheet[object.arrayName] = this.characterSheet[object.arrayName].filter(x => { return x.id != object.object.id })
            },
            deleteEntryRecursive(array, object) {
                array.filter(x => { return x.subEffects.length > 0; }).forEach(ability => {
                    if (JSON.stringify(ability).includes(object.id)) {
                        let index = ability.subEffects.findIndex(x => x.id == object.id)
                        if (index == -1)
                            this.deleteEntryRecursive(ability.subEffects, object)
                        else {
                            ability.subEffects = ability.subEffects.filter(x => { return x.id != object.id })
                            return
                        }
                    }
                })
            },
            updateEntry(object) {
                let entriesDup = this.characterSheet[object.arrayName]
                let index = entriesDup.findIndex(x => x.id == object.object.id)

                if (index == -1 && object.arrayName == 'abilities')
                    this.updateEntryRecursive(entriesDup, object.object)

                if (index > -1)
                    entriesDup[index] = object.object

                this.characterSheet[object.arrayName] = []
                this.characterSheet[object.arrayName] = entriesDup
            },
            updateEntryRecursive(array, object) {
                array.filter(x => { return x.subEffects.length > 0; }).forEach(ability => {
                    if (JSON.stringify(ability).includes(object.id)) {
                        let index = ability.subEffects.findIndex(x => x.id == object.id)
                        if (index == -1)
                            this.updateEntryRecursive(ability.subEffects, object)
                        else {
                            ability.subEffects[index] = object
                            return
                        }
                    }
                })
            },
            //Array CRUD Functions End
            charBuff(characteristic) {
                let adj = 0
                this.characterSheet.buffs.filter(buff => { return buff.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'CHAR' && a.characteristic == characteristic }).forEach(a => {
                        adj += +a.amount
                    })
                })
                return adj
            },
            characterInit() {
                this.characterSheet.apMax = (this.characterSheet.speedPreperationIsKey) ? 3 * (+this.speed + 2) : 2 * (+this.speed + 2)
                this.characterSheet.attunementSlotsMax = 10 + +this.characterSheet.attunementSlotsIncreases
                /// TODO: attunement slots
                this.characterSheet.bpMax = +this.resistance + +this.characterSheet.bpIncreases
                this.characterSheet.dcToHit = 3 + +this.characterSheet.dcToHitIncreases

                //hpMax start, handles xpEarned, level, hpMax
                let nonClassXP = this.characterSheet.xpEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                this.characterSheet.level = Math.floor(nonClassXP / 500)
                this.characterSheet.xpEarned = this.characterSheet.xpEntries.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                //hpMax end
                this.characterSheet.rerollsMax = +this.characterSheet.luck + +this.characterSheet.rerollsIncreases

                this.characterSheet.xp = this.characterSheet.xpTotal - this.characterSheet.abilities.reduce((previousValue, entry) => {
                    if (!entry.boughtForFree)
                        return +previousValue + +entry.xpCost
                    else
                        return +previousValue
                }, 0)

                var resourcesDup = this.characterSheet.resources
                resourcesDup.forEach((resource) => {
                    var primaryCharValue = +this[resource.characteristic]
                    resource.amountMax = primaryCharValue + resource.resourceIncreases
                })
                this.characterSheet.resources = []
                this.characterSheet.resources = resourcesDup
            },
            cleanseStatuses() {
                if (this.cleanseDialog.selectedStatuses.length <= this.characterSheet.bp) {
                    this.cleanseDialog.selectedStatuses.forEach(status => {
                        status.isActive = false
                        this.updateEntry({ arrayName: 'statuses', object: status })

                        this.characterSheet.bp--
                        this.updateBP++
                    })

                    this.cleanseDialog.show = false
                    this.cleanseDialog.selectedStatuses = []
                }
            },
            copyCheck() {
                var copyText =
                    'Successes: ' + this.checkDialog.successes + '\n' +
                    'Fate: ' + this.checkDialog.fate + ((this.checkDialog.advantage) ? ', Advantage' : '') + ((this.checkDialog.threat) ? ', Threat' : '') + '\n' +
                    'Dice Results: [' + this.checkDialog.diceResults + ']';

                navigator.clipboard.writeText(copyText)
            },
            copyDamage() {
                var copyText =
                    'Damage \n';

                this.damageDialog.damages.forEach((damage) => {
                    copyText += damage.sum + ' ' + damage.type + '\n'
                })

                navigator.clipboard.writeText(copyText)
            },
            //Dice Roll Functions
            determineSuccesses(dieResult) {
                if (dieResult < 4)
                    return 0
                if (dieResult < 6)
                    return 1
                if (dieResult >= 6)
                    return 2
            },
            getRandomIntInclusive(min, max) {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
            },
            rerollFailures() {
                var failureCount = this.checkDialog.diceResults.filter(x => { return x < 4 }).length
                let successDiceResults = this.checkDialog.diceResults.filter(x => { return x > 3 })
                let rdResults = this.rollDice(failureCount)

                this.checkDialog.selectedRerolls = []
                this.checkDialog.diceResults = successDiceResults.concat(rdResults.diceResults)
                this.checkDialog.successes += +rdResults.successes

                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rerollSelected() {
                let indexes = this.checkDialog.selectedRerolls.sort().reverse()

                indexes.forEach(i => {
                    this.checkDialog.diceResults.splice(i, 1)
                })

                let rdResults = this.rollDice(indexes.length)
                this.checkDialog.diceResults = this.checkDialog.diceResults.concat(rdResults.diceResults)

                this.checkDialog.successes = 0

                this.checkDialog.diceResults.forEach(d => {
                    this.checkDialog.successes += +this.determineSuccesses(d)
                })

                this.checkDialog.selectedRerolls = []

                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rerollWholeCheck() {
                this.rollCheck(this.checkDialog.diceCheckObject)
                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rollAbility(ability) {
                let char = +this[ability.characteristic]
                this.rollCheck({
                    diceToRoll: char,
                    isSave: false,
                    successes: ability.successes
                })
            },
            rollDice(diceToRoll) {
                let result = {
                    diceResults: [],
                    successes: 0
                }

                for (var i = 0; i < diceToRoll; i++) {
                    var dieResult = this.getRandomIntInclusive(1, 6)
                    result.diceResults.push(dieResult)
                    result.successes += this.determineSuccesses(dieResult)
                }

                return result
            },
            rollCheck(diceCheckObject) {
                var result = {
                    advantage: false,
                    diceCheckObject: diceCheckObject,
                    diceResults: [],
                    fate: 0,
                    show: true,
                    selectedRerolls: [],
                    successes: 0,
                    threat: false
                }

                if (diceCheckObject.diceToRoll > 0) {
                    if (!diceCheckObject.isSave)
                        result.successes += Math.floor(this.intelligence / 3)

                    let rdResult = this.rollDice(diceCheckObject.diceToRoll)

                    result.diceResults = rdResult.diceResults;
                    result.successes += +rdResult.successes
                    result.fate = result.diceResults[0]

                    if (diceCheckObject.successes)
                        result.successes += +diceCheckObject.successes

                    if (!this.characterSheet.luckNothingToChance) {
                        if (result.fate == 6 || (this.characterSheet.luckFavored && result.fate >= 5)) {
                            result.advantage = true
                            result.successes += this.characterSheet.luck
                        } else if (result.fate == 1 || (this.characterSheet.luckIllFavored && result.fate <= 2)) {
                            result.threat = true
                        }
                    }
                }

                this.checkDialog = result
            },
            //Dice Roll Functions End
            fillResources() {
                this.characterSheet.resources.forEach(r => {
                    if (r.amount < r.amountMax)
                        r.amount = r.amountMax
                })
                this.updateCR++
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
                var resistanceAmount = 0;

                this.damageGroups.forEach((group) => {
                    //check if type is in the group.types array
                    if (type == group.name || group.types.some(x => x.name == type)) {
                        resistanceAmount = this.characterSheet.resistances
                            .filter(x => { return x.type == type || x.type == group.name })
                            .reduce((previousValue, entry) => {
                                return +previousValue + +entry.amount
                            }, 0)
                    }
                })

                var damageToTake = damage - resistanceAmount
                if (damageToTake > 0) {
                    this.characterSheet.hp = this.characterSheet.hp - damageToTake
                    this.updateHP = this.updateHP + 1
                }
            },
            //Health Funcitons End
            //Local Storage Functions
            loadCharacter() {
                this.characterSheet = JSON.parse(localStorage.getItem('character'))
            },
            saveCharacter() {
                var character = this.characterSheet
                character.id = new Date().getTime().toString()
                localStorage.setItem('character', JSON.stringify(character))
            },
            //Local Storage Functions End
            moneyAddSubtract(add) {
                if (add)
                    this.characterSheet.money = +this.characterSheet.money + +this.moneyModifyAmount
                else
                    this.characterSheet.money = +this.characterSheet.money - +this.moneyModifyAmount
                this.moneyModifyAmount = 0
            },
            //Reroll Functions
            rerollSelectedDamage() {
                const hasSelected = (obj) => obj.selectedRerolls.length
                if (this.damageDialog.damages.some(hasSelected)) {
                    this.damageDialog.damages.forEach((damage) => {
                        if (damage.selectedRerolls.length) {
                            let indexes = damage.selectedRerolls.sort().reverse()
                            indexes.forEach(i => {
                                damage.sum -= +damage.diceResults[i]
                                damage.diceResults.splice(i, 1)
                            })
                            for (var i = 0; i < indexes.length; i++) {
                                let dieResult = this.getRandomIntInclusive(1, 6)
                                damage.sum += +dieResult
                                damage.diceResults.push(dieResult)
                            }
                            damage.selectedRerolls = []
                        }
                    })
                    this.characterSheet.rerolls--
                    this.updateRerolls++
                }
            },
            rerollWholeDamage() {
                this.rollDamage(this.damageDialog.ability)
                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rollDamage(ability) {
                let result = {
                    ability: ability,
                    damages: [],
                    show: true
                }

                ability.damage.forEach((d) => {
                    let sum = 0
                    let diceResults = [];

                    if (d.dice) {
                        for (var i = 0; i < d.dice; i++) {
                            diceResults.push(this.getRandomIntInclusive(1, 6))
                        }
                        sum += diceResults.reduce((previousValue, entry) => {
                            return +previousValue + +entry
                        }, 0)

                    }
                    if (d.flat)
                        sum += +d.flat

                    let charDamage = 0
                    if (d.addChar && d.type != 'Healing') {
                        if (ability.characteristic) {
                            let char = +this[ability.characteristic]
                            charDamage += +char
                        }

                        if (ability.isMeleeAttack) {
                            let char = +this.fitness
                            charDamage += +char
                        }
                    }

                    sum += +charDamage

                    let color = ''
                    this.damageGroups.forEach((group) => {
                        if (d.type == group.name || group.types.some(x => x.name == d.type)) {
                            color = group.color
                        }
                    })
                    let icon = ''
                    this.damageGroups.forEach((group) => {
                        if (d.type == group.name || group.types.some(x => x.name == d.type)) {
                            if (d.type == group.name)
                                icon = group.icon
                            let damageType = group.types.find(type => type.name == d.type)
                            if (damageType)
                                icon = damageType.icon
                        }
                    })

                    let damage = {
                        charDamage: charDamage,
                        color: color,
                        damage: d,
                        icon: icon,
                        diceResults: diceResults,
                        selectedRerolls: [],
                        sum: sum,
                        type: d.type
                    }
                    result.damages.push(damage)
                })
                this.damageDialog = result
            },
            //Reroll Functions End
            setCharacterAsTupoc() {
                this.characterSheet = this.characterStore.getCharacterById('tupoc')
            },
            specialInputWithEditModal(valueName) {
                if (valueName == 'initiative') {
                    this.characterSheet.initiative = this.getRandomIntInclusive(1, 6) + +this.speed + +this.characterSheet.initiativeIncreases
                    this.updateInitiative++
                }
                if (valueName == 'bp') {
                    this.cleanseDialog.show = true
                }
            },
            subtractAP(apCost) {
                this.characterSheet.ap -= apCost
                this.updateAP++
            },
            subtractCR(crCost) {
                let resource = this.characterSheet.resources.find(x => x.id == crCost.classResource.id)
                if (resource) {
                    resource.amount -= +crCost.crCost
                    this.updateCR++
                }
            },
            updateBuffEntry(object) {
                this.updateBuff++
                this.updateEntry(object)
            },
            updateProp(prop) {
                if (prop.type == 'number')
                    this.characterSheet[prop.propName] = +prop.value
                else
                    this.characterSheet[prop.propName] = prop.value
            }
        },
        watch: {
            apMax() {
                this.characterSheet.apMax = this.apMax
            },
            attunementSlotsMax() {
                this.characterSheet.attunementSlotsMax = this.attunementSlotsMax
            },
            bpMax() {
                this.characterSheet.bpMax = this.bpMax
            },
            cunningAdjustment() {
                this.characterSheet.cunningAdjustment = this.cunningAdjustment
            },
            dcToHit() {
                this.characterSheet.dcToHit = this.dcToHit
            },
            fitnessAdjustment() {
                this.characterSheet.fitnessAdjustment = this.fitnessAdjustment
            },
            hpMax() {
                this.characterSheet.hpMax = this.hpMax
            },
            intelligenceAdjustment() {
                this.characterSheet.intelligenceAdjustment = this.intelligenceAdjustment
            },
            level() {
                this.characterSheet.level = this.level
            },
            luckAdjustment() {
                this.characterSheet.luckAdjustment = this.luckAdjustment
            },
            movement() {
                this.characterSheet.movement = this.movement
            },
            rerollsMax() {
                this.characterSheet.rerollsMax = this.rerollsMax
            },
            resistanceAdjustment() {
                this.characterSheet.resistanceAdjustment = this.resistanceAdjustment
            },
            speedAdjustment() {
                this.characterSheet.speedAdjustment = this.speedAdjustment
            },
            xp() {
                this.characterSheet.xp = this.xp
            },
            xpEarned() {
                this.characterSheet.xpEarned = this.xpEarned
            },
            xpTotal() {
                this.characterSheet.xpTotal = this.xpTotal
            }
        }
    }
</script>