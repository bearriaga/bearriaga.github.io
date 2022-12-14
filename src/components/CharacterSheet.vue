<template>
    <div>
        <h4 class="text-center">Oatsys Chacter Sheet</h4>
        <form onsubmit="return false;" v-if="layout == 'Expanded'">
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
                    <v-text-field label="Level" v-model="characterSheet.level" disabled readonly>
                        <TooltipComponent slot="append" :text="'Level = non-class XP / 500 round down'"></TooltipComponent>
                    </v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Movement in Squares (Land Speed)" v-model="characterSheet.movement" type="number" disabled readonly>
                        <v-icon :color="movementApIconColor"
                                slot="append"
                                @click="subtractAP(1)">{{movementApIcon}}</v-icon>
                        <TooltipComponent slot="append" :text="'FIT + Land Speed Movement Entries'"></TooltipComponent>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3" md="6">
                    <div class="charColumn mainColumn elevation-3" elevation="3">
                        <h3 class="text-center"> Characteristics </h3>
                        <v-row>
                            <v-col cols="6" xl="4" v-for="char in characteristicViewItems" :key="char.key">
                                <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                                        @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                                        :characteristic="char"></CharacteristicViewItem>
                            </v-col>
                            <v-col cols="12">
                                <CharacteristicViewItem @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                                        :characteristic="genericCharacteristic"></CharacteristicViewItem>
                            </v-col>
                        </v-row>
                        <SkillSection :characteristics="characteristics"
                                      :panel-prop="skillPanel"
                                      :skills="skills"
                                      @addEntryEmit="addEntry($event)"
                                      @deleteEntryEmit="deleteEntry($event)"
                                      @updateEntryEmit="updateEntry($event)"
                                      @updatePanelEmit="updatePanel($event)"
                                      @rollDiceCheckEmit="rollStandAloneCheck($event)"></SkillSection>
                        <v-expansion-panels>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    <h3 class="text-center">
                                        Mass Roller
                                    </h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row>
                                        <v-col cols="6">
                                            <v-text-field label="Enemies*" v-model="massRoller.enemies" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Dice*" v-model="massRoller.dice" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="LCK*" v-model="massRoller.luck" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-text-field label="Successes Required" v-model="massRoller.successesRequired" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                            <v-btn @click="rollMassRoller()">
                                                <v-icon>mdi-dice-6</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </v-col>
                <v-col cols="12" lg="3" md="6">
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
                                <DamageModificationSection :can-edit="true"
                                                           :damage-modifications="damageModifications"
                                                           :damage-groups="damageGroups"
                                                           :damage-types="damageTypes"
                                                           :panel-prop="damageModificationPanel"
                                                           @addEntryEmit="addEntry($event)"
                                                           @deleteEntryEmit="deleteEntry($event)"
                                                           @updateEntryEmit="updateEntry($event)"
                                                           @updatePanelEmit="updatePanel($event)"></DamageModificationSection>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <div class="resourcesColumn mainColumn elevation-3">
                        <h3 class="text-center"> Resources </h3>
                        <v-row>
                            <v-col cols="12" v-for="input in inputWithEditModals" :key="input.key">
                                <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                    @apGainEmit="apGain($event)"
                                                    @updatePropEmit="updateProp($event)"
                                                    :hp="characterSheet.hp"
                                                    :property-object="input"></InputWithEditModal>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <div class="classResourcesColumn mainColumn elevation-3">
                        <ResourceSection :characteristics="characteristics"
                                         :panel-prop="resourcePanel"
                                         :resources="resources"
                                         @addEntryEmit="addEntry($event)"
                                         @deleteEntryEmit="deleteEntry($event)"
                                         @fillResourcesEmit="fillResources($event)"
                                         @updateEntryEmit="updateEntry($event)"
                                         @updatePanelEmit="updatePanel($event)"></ResourceSection>
                        <MovementSection :ap="characterSheet.ap"
                                         :can-edit="true"
                                         :movements="movements"
                                         :movement-ap-icon="movementApIcon"
                                         :movement-ap-icon-color="movementApIconColor"
                                         :movement-types="movementTypes"
                                         :panel-prop="movementPanel"
                                         @addEntryEmit="addEntry($event)"
                                         @deleteEntryEmit="deleteEntry($event)"
                                         @subtractAPEmit="subtractAP($event)"
                                         @updateEntryEmit="updateEntry($event)"
                                         @updatePanelEmit="updatePanel($event)"></MovementSection>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <AbilitySection :abilities="abilities"
                                    :ap="characterSheet.ap"
                                    :characteristics="characteristics"
                                    :damage-types="damageTypes"
                                    :effects="effects"
                                    :panel-prop="abilityPanel"
                                    :resources="resources"
                                    :successes-from-intelligence="successesFromIntelligence"
                                    @addEntryEmit="addEntry($event)"
                                    @deleteEntryEmit="deleteEntry($event)"
                                    @rollAbilityEmit="rollAbility($event)"
                                    @rollDamageEmit="rollAbilityDamage($event)"
                                    @subtractAPEmit="subtractAP($event)"
                                    @subtractCREmit="subtractCR($event)"
                                    @updateEntryEmit="updateEntry($event)"
                                    @updatePanelEmit="updatePanel($event)"
                                    @useAbilityEmit="useAbility($event)"></AbilitySection>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <MinionSection :clear-character="clearCharacter"
                                   :minions="minions"
                                   :panel-prop="minionPanel"
                                   @addEntryEmit="addEntry($event)"
                                   @deleteEntryEmit="deleteEntry($event)"
                                   @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                   @updateEntryEmit="updateMinion($event)"
                                   @updateEntryBypassEmit="updateEntry($event)"
                                   @updatePanelEmit="updatePanel($event)"></MinionSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3" md="6">
                    <ClassSection :characteristics="characteristics"
                                  :classes="classes"
                                  :panel-prop="classPanel"
                                  :unlocked="false"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"
                                  @updatePanelEmit="updatePanel($event)"></ClassSection>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <ClassSection :characteristics="characteristics"
                                  :classes="classesUnlocked"
                                  :panel-prop="classUnlockedPanel"
                                  :unlocked="true"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"
                                  @updatePanelEmit="updatePanel($event)"></ClassSection>
                </v-col>
                <v-col cols="12" lg="3" md="6">
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
                                <v-icon color="success" slot="append" @click="moneyAddSubtract({add: true, amount: moneyModifyAmount})">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="moneyAddSubtract({add: false, amount: moneyModifyAmount})">mdi-minus</v-icon>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <h3 class="text-center"> XP </h3>
                    <v-text-field label="Available XP" v-model="characterSheet.xp" disabled readonly>
                        <TooltipComponent slot="append" :text="'Journal Entries + Flaws - Traits - Abilty Costs'"></TooltipComponent>
                    </v-text-field>

                    <JournalSection :journal-entries="journalEntries"
                                    :panel-prop="journalPanel"
                                    :xp="characterSheet.xp"
                                    :xp-earned="characterSheet.xpEarned"
                                    :xp-total="characterSheet.xpTotal"
                                    @addEntryEmit="addEntry($event)"
                                    @deleteEntryEmit="deleteEntry($event)"
                                    @moneyAddSubtractEmit="moneyAddSubtract($event)"
                                    @updateEntryEmit="updateEntry($event)"
                                    @updatePanelEmit="updatePanel($event)"></JournalSection>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <TraitFlawSection :is-flaw="true"
                                      :items="flaws"
                                      :panel-prop="flawPanel"
                                      @addEntryEmit="addEntry($event)"
                                      @deleteEntryEmit="deleteEntry($event)"
                                      @updateEntryEmit="updateEntry($event)"
                                      @updatePanelEmit="updatePanel($event)"></TraitFlawSection>
                    <TraitFlawSection :is-flaw="false"
                                      :items="traits"
                                      :panel-prop="traitPanel"
                                      @addEntryEmit="addEntry($event)"
                                      @deleteEntryEmit="deleteEntry($event)"
                                      @updateEntryEmit="updateEntry($event)"
                                      @updatePanelEmit="updatePanel($event)"></TraitFlawSection>
                    <div>
                        <template>
                            <v-expansion-panels>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h3 class="text-center">
                                            Passives
                                        </h3>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-form>
                                            <v-switch label="Luck Favored" inset v-model="characterSheet.luckFavored"></v-switch>
                                            <v-switch label="Luck Ill Favored" inset v-model="characterSheet.luckIllFavored"></v-switch>
                                            <v-switch label="Luck Nothing to Chance" inset v-model="characterSheet.luckNothingToChance"></v-switch>                                      
                                        </v-form>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </template>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3" md="6">
                    <StatusSection :character-statuses="characterStatuses"
                                   :panel-prop="statusPanel"
                                   :statuses="statuses"
                                   @addEntryEmit="addEntry($event)"
                                   @deleteEntryEmit="deleteEntry($event)"
                                   @updateBuffEntryEmit="updateBuffStatus($event)"
                                   @updateEntryEmit="updateEntry($event)"
                                   @updatePanelEmit="updatePanel($event)"></StatusSection>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <BuffSection :buffs="buffs"
                                 :characteristics="characteristics"
                                 :damage-types="damageTypes"
                                 :movement-types="movementTypes"
                                 :panel-prop="buffPanel"
                                 :skills="characterSheet.skills"
                                 :statuses="statuses"
                                 :resources="resources"
                                 @addEntryEmit="addEntry($event)"
                                 @deleteEntryEmit="deleteEntry($event)"
                                 @updateEntryEmit="updateBuffEntry($event)"
                                 @updateEntryBypassEmit="updateEntry($event)"
                                 @updatePanelEmit="updatePanel($event)"></BuffSection>
                </v-col>
                <v-col cols="12" md="6">                    
                    <InputWithEditModal @updatePropEmit="updateProp($event)"
                                        :property-object="attunementSlotsInputWithEditModal"></InputWithEditModal>
                    <EquipmentSection :ap="characterSheet.ap"
                                      :characteristics="characteristics"
                                      :character-equipment="characterEquipment"
                                      :damage-groups="damageGroups"
                                      :damage-types="damageTypes"
                                      :movement-ap-icon="movementApIcon"
                                      :movement-ap-icon-color="movementApIconColor"
                                      :movement-types="movementTypes"
                                      :panel-prop="equipmentPanel"
                                      :resources="resources"
                                      :successes-from-intelligence="successesFromIntelligence"
                                      @addEntryEmit="addEntry($event)"
                                      @deleteEntryEmit="deleteEntry($event)"
                                      @rollAbilityEmit="rollAbility($event)"
                                      @rollDamageEmit="rollAbilityDamage($event)"
                                      @subtractAPEmit="subtractAP($event)"
                                      @subtractCREmit="subtractCR($event)"
                                      @updateEntryEmit="updateEntry($event)"
                                      @updateEntryBypassEmit="updateEntry($event)"
                                      @updatePanelEmit="updatePanel($event)"
                                      @useAbilityEmit="useAbility($event)"></EquipmentSection>
                </v-col>
            </v-row>
        </form>
        <form onsubmit="return false;" v-if="layout == 'Condensed'">
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
                    <v-text-field label="Level" v-model="characterSheet.level" disabled readonly>
                        <TooltipComponent slot="append" :text="'Level = non-class XP / 500 round down'"></TooltipComponent>
                    </v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Available XP" v-model="characterSheet.xp" disabled readonly>
                        <TooltipComponent slot="append" :text="'Journal Entries + Flaws - Traits - Abilty Costs'"></TooltipComponent>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" class="charColumn mainColumn elevation-3" elevation="3">
                    <v-row>
                        <v-col cols="4" md="6" lg="4" v-for="char in characteristicViewItems" :key="char.key">
                            <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                                    @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                                    :characteristic="char"></CharacteristicViewItem>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6" md="3" class="charColumn mainColumn elevation-3" elevation="3">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="Movement in Squares (Land Speed)" v-model="characterSheet.movement" type="number" disabled readonly>
                                <v-icon :color="movementApIconColor"
                                        slot="append"
                                        @click="subtractAP(1)">{{movementApIcon}}</v-icon>
                                <TooltipComponent slot="append" :text="'FIT + Land Speed Movement Entries'"></TooltipComponent>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" v-for="input in defenseInputWithEditModals" :key="input.key">
                            <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                @updatePropEmit="updateProp($event)"
                                                :property-object="input"></InputWithEditModal>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6" md="3" class="hpColumn mainColumn elevation-3">
                    <InputWithEditModal v-for="input in healthInputWithEditModals" :key="input.key"
                                        @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @updatePropEmit="updateProp($event)"
                                        :property-object="input"></InputWithEditModal>
                    <v-row>
                        <v-col cols="12" lg="6">
                            <v-text-field label="Take Damage/Heal" type="number" min="0" v-model="damageToTake.amount">
                                <v-icon color="success" slot="append" @click="heal">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="takeDamage">mdi-liquid-spot</v-icon>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-select label="Damage Type" :items="damageTypes" v-model="damageToTake.type"></v-select>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6" md="3" v-for="input in inputWithEditModals" :key="input.key">
                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @apGainEmit="apGain($event)"
                                        @updatePropEmit="updateProp($event)"
                                        :hp="characterSheet.hp"
                                        :property-object="input"></InputWithEditModal>
                </v-col>
                <v-col cols="6" md="3">
                    <ResourceSection :characteristics="characteristics"
                                     :panel-prop="resourcePanel"
                                     :resources="resources"
                                     @addEntryEmit="addEntry($event)"
                                     @deleteEntryEmit="deleteEntry($event)"
                                     @fillResourcesEmit="fillResources($event)"
                                     @updateEntryEmit="updateEntry($event)"
                                     @updatePanelEmit="updatePanel($event)"></ResourceSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3" class="charColumn mainColumn elevation-3" elevation="3">
                    <SkillSection :characteristics="characteristics"
                                  :panel-prop="skillPanel"
                                  :skills="skills"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"
                                  @updatePanelEmit="updatePanel($event)"
                                  @rollDiceCheckEmit="rollStandAloneCheck($event)"></SkillSection>
                    <CharacteristicViewItem @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                            :characteristic="genericCharacteristic"></CharacteristicViewItem>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                <h3 class="text-center">
                                    Mass Roller
                                </h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field label="Enemies*" v-model="massRoller.enemies" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field label="Dice*" v-model="massRoller.dice" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field label="LCK*" v-model="massRoller.luck" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field label="Successes Required" v-model="massRoller.successesRequired" type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="text-center">
                                        <v-btn @click="rollMassRoller()">
                                            <v-icon>mdi-dice-6</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col cols="12" md="9">
                    <v-tabs v-model="tab">
                        <v-tab href="#abilities">Abilities</v-tab>
                        <v-tab href="#movements">Movements</v-tab>
                        <v-tab href="#damageModifications">Damage Modifications</v-tab>
                        <v-tab href="#classesAndTraits">Classes and Traits</v-tab>
                        <v-tab href="#inventory">Inventory</v-tab>
                        <v-tab href="#statusBuffs">Statuses and Buffs</v-tab>
                        <v-tab href="#minions">Minions</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab" style="max-height:800px;overflow-y:auto;">
                        <v-tab-item value="abilities">
                            <AbilitySection :abilities="abilities"
                                            :ap="characterSheet.ap"
                                            :characteristics="characteristics"
                                            :damage-types="damageTypes"
                                            :effects="effects"
                                            :panel-prop="abilityPanel"
                                            :resources="resources"
                                            :successes-from-intelligence="successesFromIntelligence"
                                            @addEntryEmit="addEntry($event)"
                                            @deleteEntryEmit="deleteEntry($event)"
                                            @rollAbilityEmit="rollAbility($event)"
                                            @rollDamageEmit="rollAbilityDamage($event)"
                                            @subtractAPEmit="subtractAP($event)"
                                            @subtractCREmit="subtractCR($event)"
                                            @updateEntryEmit="updateEntry($event)"
                                            @updatePanelEmit="updatePanel($event)"
                                            @useAbilityEmit="useAbility($event)"></AbilitySection>
                        </v-tab-item>
                        <v-tab-item value="movements">
                            <MovementSection :ap="characterSheet.ap"
                                             :can-edit="true"
                                             :movements="movements"
                                             :movement-ap-icon="movementApIcon"
                                             :movement-ap-icon-color="movementApIconColor"
                                             :movement-types="movementTypes"
                                             :panel-prop="movementPanel"
                                             @addEntryEmit="addEntry($event)"
                                             @deleteEntryEmit="deleteEntry($event)"
                                             @subtractAPEmit="subtractAP($event)"
                                             @updateEntryEmit="updateEntry($event)"
                                             @updatePanelEmit="updatePanel($event)"></MovementSection>
                        </v-tab-item>
                        <v-tab-item value="damageModifications">
                            <DamageModificationSection :can-edit="true"
                                                       :damage-modifications="damageModifications"
                                                       :damage-groups="damageGroups"
                                                       :damage-types="damageTypes"
                                                       :panel-prop="damageModificationPanel"
                                                       @addEntryEmit="addEntry($event)"
                                                       @deleteEntryEmit="deleteEntry($event)"
                                                       @updateEntryEmit="updateEntry($event)"
                                                       @updatePanelEmit="updatePanel($event)"></DamageModificationSection>
                        </v-tab-item>
                        <v-tab-item value="classesAndTraits">
                            <ClassSection :characteristics="characteristics"
                                          :classes="classes"
                                          :panel-prop="classPanel"
                                          :unlocked="false"
                                          @addEntryEmit="addEntry($event)"
                                          @deleteEntryEmit="deleteEntry($event)"
                                          @updateEntryEmit="updateEntry($event)"
                                          @updatePanelEmit="updatePanel($event)"></ClassSection>
                            <ClassSection :characteristics="characteristics"
                                          :classes="classesUnlocked"
                                          :panel-prop="classUnlockedPanel"
                                          :unlocked="true"
                                          @addEntryEmit="addEntry($event)"
                                          @deleteEntryEmit="deleteEntry($event)"
                                          @updateEntryEmit="updateEntry($event)"
                                          @updatePanelEmit="updatePanel($event)"></ClassSection>
                            <TraitFlawSection :is-flaw="true"
                                              :items="flaws"
                                              :panel-prop="flawPanel"
                                              @addEntryEmit="addEntry($event)"
                                              @deleteEntryEmit="deleteEntry($event)"
                                              @updateEntryEmit="updateEntry($event)"
                                              @updatePanelEmit="updatePanel($event)"></TraitFlawSection>
                            <TraitFlawSection :is-flaw="false"
                                              :items="traits"
                                              :panel-prop="traitPanel"
                                              @addEntryEmit="addEntry($event)"
                                              @deleteEntryEmit="deleteEntry($event)"
                                              @updateEntryEmit="updateEntry($event)"
                                              @updatePanelEmit="updatePanel($event)"></TraitFlawSection>
                            <div>
                                <template>
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>
                                                <h3 class="text-center">
                                                    Passives
                                                </h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-form>
                                                    <v-switch label="Luck Favored" inset v-model="characterSheet.luckFavored"></v-switch>
                                                    <v-switch label="Luck Ill Favored" inset v-model="characterSheet.luckIllFavored"></v-switch>
                                                    <v-switch label="Luck Nothing to Chance" inset v-model="characterSheet.luckNothingToChance"></v-switch>
                                                </v-form>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </template>
                            </div>
                        </v-tab-item>
                        <v-tab-item value="inventory">
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
                                        <v-icon color="success" slot="append" @click="moneyAddSubtract({add: true, amount: moneyModifyAmount})">mdi-plus</v-icon>
                                        <v-icon color="error" slot="append" @click="moneyAddSubtract({add: false, amount: moneyModifyAmount})">mdi-minus</v-icon>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <JournalSection :journal-entries="journalEntries"
                                            :panel-prop="journalPanel"
                                            :xp="characterSheet.xp"
                                            :xp-earned="characterSheet.xpEarned"
                                            :xp-total="characterSheet.xpTotal"
                                            @addEntryEmit="addEntry($event)"
                                            @deleteEntryEmit="deleteEntry($event)"
                                            @moneyAddSubtractEmit="moneyAddSubtract($event)"
                                            @updateEntryEmit="updateEntry($event)"
                                            @updatePanelEmit="updatePanel($event)"></JournalSection>
                            <InputWithEditModal @updatePropEmit="updateProp($event)"
                                                :property-object="attunementSlotsInputWithEditModal"></InputWithEditModal>
                            <EquipmentSection :ap="characterSheet.ap"
                                              :characteristics="characteristics"
                                              :character-equipment="characterEquipment"
                                              :damage-groups="damageGroups"
                                              :damage-types="damageTypes"
                                              :movement-ap-icon="movementApIcon"
                                              :movement-ap-icon-color="movementApIconColor"
                                              :movement-types="movementTypes"
                                              :panel-prop="equipmentPanel"
                                              :resources="resources"
                                              :successes-from-intelligence="successesFromIntelligence"
                                              @addEntryEmit="addEntry($event)"
                                              @deleteEntryEmit="deleteEntry($event)"
                                              @rollAbilityEmit="rollAbility($event)"
                                              @rollDamageEmit="rollAbilityDamage($event)"
                                              @subtractAPEmit="subtractAP($event)"
                                              @subtractCREmit="subtractCR($event)"
                                              @updateEntryEmit="updateEntry($event)"
                                              @updateEntryBypassEmit="updateEntry($event)"
                                              @useAbilityEmit="useAbility($event)"
                                              @updatePanelEmit="updatePanel($event)"></EquipmentSection>
                        </v-tab-item>
                        <v-tab-item value="statusBuffs">
                            <StatusSection :character-statuses="characterStatuses"
                                           :panel-prop="statusPanel"
                                           :statuses="statuses"
                                           @addEntryEmit="addEntry($event)"
                                           @deleteEntryEmit="deleteEntry($event)"
                                           @updateBuffEntryEmit="updateBuffStatus($event)"
                                           @updateEntryEmit="updateEntry($event)"
                                           @updatePanelEmit="updatePanel($event)"></StatusSection>
                            <BuffSection :buffs="buffs"
                                         :characteristics="characteristics"
                                         :damage-types="damageTypes"
                                         :movement-types="movementTypes"
                                         :panel-prop="buffPanel"
                                         :skills="characterSheet.skills"
                                         :statuses="statuses"
                                         :resources="resources"
                                         @addEntryEmit="addEntry($event)"
                                         @deleteEntryEmit="deleteEntry($event)"
                                         @updateEntryEmit="updateBuffEntry($event)"
                                         @updateEntryBypassEmit="updateEntry($event)"
                                         @updatePanelEmit="updatePanel($event)"></BuffSection>
                        </v-tab-item>
                        <v-tab-item value="minions">
                            <MinionSection :clear-character="clearCharacter"
                                           :minions="minions"
                                           :panel-prop="minionPanel"
                                           @addEntryEmit="addEntry($event)"
                                           @deleteEntryEmit="deleteEntry($event)"
                                           @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                           @updateEntryEmit="updateMinion($event)"
                                           @updateEntryBypassEmit="updateEntry($event)"
                                           @updatePanelEmit="updatePanel($event)"></MinionSection>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3" md="6">
                </v-col>
                <v-col cols="12" lg="3" md="6">
                </v-col>
                <v-col cols="12" lg="3" md="6">

                </v-col>
            </v-row>
        </form>
        <v-row>
            <v-col>
                <v-btn color="primary" @click="setCharacterAs('belif')">Set as Belif</v-btn>
                <v-btn color="primary" @click="setCharacterAs('cam')">Cam</v-btn>
                <v-btn color="primary" @click="setCharacterAs('sienna')">Sienna</v-btn>
            </v-col>
            <v-col>
                <div>
                    <v-btn color="primary" @click="loadCharacter">Load Character</v-btn>
                </div>
                <div>
                    <v-btn v-if="$signedIn" color="primary" @click="loadCharacters">Load Characters</v-btn>
                </div>
            </v-col>
            <v-col>
                <div>
                    <v-btn color="primary" @click="saveCharacterConfirm">Save Character</v-btn>
                </div>
                <div>
                    <v-btn v-if="$signedIn" color="primary" @click="saveToFirebase">Save Character to Firebase</v-btn>
                </div>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        <v-btn color="primary" @click="saveCharacterAsFile">Export Character</v-btn>
                    </v-col>
                    <v-col>
                        <v-file-input label="Import Character" ref="doc" accept=".txt,.json" v-model="characterFile" @change="readCharacterFromFile"></v-file-input>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-select label="Layout" v-model="layout" :items="layoutOptions"></v-select>
            </v-col>
        </v-row>

        <!-- Ability Dialog -->
        <div class="text-center">
            <v-dialog v-model="abilityDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{abilityDialog.title}}
                        <v-btn icon color="primary"
                               @click="copyAll"
                               v-if="abilityDialog.isAbility">
                            <v-icon>
                                mdi-content-copy
                            </v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-text v-if="abilityDialog.check.show">
                        <div>
                            <b>Successes: {{abilityDialog.check.successes}}</b>
                        </div>
                        <div v-if="abilityDialog.check.successes && abilityDialog.isAbility">
                            <v-text-field label="Successes" type="number"
                                          v-model="abilityDialog.check.successesInput">
                                <v-icon color="success" slot="append" @click="successesInputAdd(1)">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="successesInputAdd(-1)">mdi-minus</v-icon>
                            </v-text-field>
                            <div v-if="abilityDialog.effects">
                                <v-row>
                                    <v-col cols="9">
                                        <v-select v-model="abilityDialog.selectedEffects"
                                                  :items="checkEffects.map(x => ({ value: x, text: x.cost + ' - ' + x.type + ' - ' + x.description}))"
                                                  label="Selected Effects"
                                                  multiple
                                                  :disabled="abilityDialog.check.successesInput <= 0">
                                            <v-icon color="error"
                                                    slot="prepend"
                                                    @click.stop="subtractSelectedEffects"
                                                    :disabled="abilityDialog.check.successesInput <= 0 || abilityDialog.selectedEffects.length == 0 || abilityDialog.selectedEffects.reduce((previousValue, entry) => {return +previousValue + +entry.cost}, 0) > abilityDialog.check.successesInput">
                                                mdi-minus
                                            </v-icon>
                                            <TooltipComponent slot="append" :text="'Effects can be purchased once per enemy'"></TooltipComponent>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-switch label="Multiple Targets?" inset v-model="abilityDialog.multipleTargets"></v-switch>
                                    </v-col>
                                </v-row>
                            </div>
                            <div v-if="abilityDialog.usedEffects.length > 0">
                                <div>Used Effects</div>
                                <div v-for="effect, i in abilityDialog.usedEffects" :key="i">
                                    Cost: {{effect.cost}} - Type: {{effect.type}} - {{effect.description}}
                                </div>
                            </div>
                        </div>
                        <div>
                            Fate: {{abilityDialog.check.fate}}

                            <template v-if="abilityDialog.check.advantage">
                                , Advantage
                            </template>

                            <template v-if="abilityDialog.check.threat">
                                , Threat
                            </template>
                        </div>
                        <div>
                            Dice Results: {{abilityDialog.check.diceResults}}
                        </div>
                        <div v-if="abilityDialog.check.successesFromIntelligence">
                            Successes From INT: {{abilityDialog.check.successesFromIntelligence}}
                        </div>
                        <div v-if="abilityDialog.check.successesFromLuck">
                            Successes From LCK: {{abilityDialog.check.successesFromLuck}}
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
                            <v-col cols="12" class="text-center">
                                <b>Rerolls Left: {{characterSheet.rerolls}}</b>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="rerollWholeCheck"
                                       :disabled="characterSheet.rerolls <= 0"
                                       width="200">Reroll Hand</v-btn>
                            </v-col>
                            <v-col cols="6">
                                <v-btn @click="rerollFailures"
                                       :disabled="characterSheet.rerolls <= 0 || abilityDialog.check.diceResults.filter(x=>{ return x < 4 }).length == 0"
                                       width="200">Reroll Failures</v-btn>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="abilityDialog.check.selectedRerolls"
                                          :items="abilityDialog.check.diceResults.map((x, i) => ({ value: i, text: x}))"
                                          label="Select Rerolls"
                                          multiple
                                          :disabled="characterSheet.rerolls <= 0">
                                    <v-icon color="primary"
                                            slot="prepend"
                                            @click.stop="rerollSelectedCheck"
                                            :disabled="characterSheet.rerolls <= 0 || abilityDialog.check.selectedRerolls.length == 0">
                                        mdi-dice-6
                                    </v-icon>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-text v-if="abilityDialog.save.show">
                        <div>
                            <b>Save: {{abilityDialog.save.characteristic}} {{abilityDialog.save.amount}}</b>
                        </div>
                        <div>
                            <v-btn icon color="primary"
                                   @click="copySave">
                                <v-icon>
                                    mdi-content-copy
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-card-text>

                    <v-card-text v-if="abilityDialog.damage.show">
                        <div>
                            <b>
                                {{abilityDialog.damage.sum}}
                                <span v-for="(type, index) in abilityDialog.damage.types" :key="index">
                                    <span v-if="index > 0">, </span>
                                    {{type.text}} <v-icon :color="type.color">{{type.icon}}</v-icon>
                                </span>
                            </b>
                        </div>
                        <div>
                            <v-btn icon color="primary" @click="copyDamage">
                                <v-icon>mdi-content-copy</v-icon>
                            </v-btn>
                        </div>
                        <div class="text-center">
                            <v-btn @click="rollCrit" width="200">Roll Crit</v-btn>
                        </div>

                        <div>
                            <div v-if="abilityDialog.damage.diceResults.length > 0">
                                Die Results:  {{abilityDialog.damage.damage.dice}}d6 [
                                <span v-for="(die, i) in abilityDialog.damage.diceResults" :key="i">
                                    <span v-if="die.type=='normal'">{{die.value}}</span>
                                    <span v-if="die.type=='crit'"><b>{{die.value}}</b></span>
                                    <span v-if="die.type=='luck'" class="red--text"><b>{{die.value}}</b></span>
                                    <span v-if="i < abilityDialog.damage.diceResults.length - 1">, </span>
                                </span>
                                ]
                                <TooltipComponent v-if="abilityDialog.damage.isCrit" :text="'Red = LCK, Bold = Crit'"></TooltipComponent>
                            </div>
                            <div v-if="abilityDialog.damage.flatTotal > 0">
                                Flat Total: {{abilityDialog.damage.flatTotal}}
                                <TooltipComponent :text="abilityDialog.damage.flatTotalBreakdown"></TooltipComponent>
                            </div>
                            <v-select v-model="abilityDialog.damage.selectedRerolls"
                                      v-if="abilityDialog.damage.diceResults.length > 0"
                                      :items="abilityDialog.damage.diceResults.map((x, i) => ({ value: i, text: x.value}))"
                                      label="Select Rerolls"
                                      multiple
                                      :disabled="characterSheet.rerolls <= 0">
                                <v-icon color="primary"
                                        slot="prepend"
                                        @click.stop="rerollSelectedDamage"
                                        :disabled="characterSheet.rerolls <= 0 || abilityDialog.damage.selectedRerolls.length == 0">
                                    mdi-dice-6
                                </v-icon>
                            </v-select>
                        </div>

                        <div class="text-center">
                            <div>
                                <b>Rerolls Left: {{characterSheet.rerolls}}</b>
                            </div>
                            <v-btn @click="rerollWholeDamage"
                                   :disabled="characterSheet.rerolls <= 0"
                                   width="200">Reroll Hand</v-btn>
                        </div>
                    </v-card-text>

                    <v-card-text v-if="abilityDialog.isAbility">
                        <div v-if="abilityDialog.ap">
                            <b>AP Used {{abilityDialog.ap}}</b>
                        </div>
                        <div v-if="abilityDialog.cr">
                            <b>CR Used {{abilityDialog.cr}}</b>
                        </div>
                        <div v-if="abilityDialog.ability.description">
                            <v-textarea label="Description" v-model="abilityDialog.ability.description" auto-grow outlined rows="1" disabled></v-textarea>
                        </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="abilityDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <!-- Ability Dialog End -->
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
                                          :items="characterStatuses.filter(x => { return x.isActive && x.status.type == 'Condition' }).map(x => ({ value: x, text: x.status.name}))"
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
        <div class="text-center">
            <v-dialog v-model="generalDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{generalDialog.title}}
                    </v-card-title>

                    <v-card-text>
                        {{generalDialog.text}}
                        <div v-html="generalDialog.html"></div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn v-if="generalDialog.buttonText && generalDialog.buttonType" @click="generalDialogFunction">{{generalDialog.buttonText}}</v-btn>
                        <v-btn color="secondary"
                               @click="generalDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <v-snackbar v-model="snackbar.show">
            {{ snackbar.text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink"
                       text
                       v-bind="attrs"
                       @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import AbilitySection from './AbilitySection.vue'
    import BuffSection from './BuffSection.vue'
    import CharacteristicViewItem from './CharacteristicViewItem.vue'
    import ClassSection from './ClassSection.vue'
    import DamageModificationSection from './DamageModificationSection.vue'
    import EquipmentSection from './EquipmentSection.vue'
    import InputWithEditModal from './InputWithEditModal.vue'
    import JournalSection from './JournalSection.vue'
    import TraitFlawSection from './TraitFlawSection.vue'
    import MinionSection from './MinionSection.vue'
    import MovementSection from './MovementSection.vue'
    import ResourceSection from './ResourceSection.vue'
    import SkillSection from './SkillSection.vue'
    import StatusSection from './StatusSection.vue'
    import TooltipComponent from './TooltipComponent.vue'
    import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
    import { db } from '@/stores/db'
    import { useCharacterStore } from '@/stores/CharacterStore'
    import { useGameDataStore } from '@/stores/GameDataStore'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'CharacterSheet',
        components: {
            AbilitySection,
            BuffSection,
            CharacteristicViewItem,
            ClassSection,
            DamageModificationSection,
            EquipmentSection,
            TraitFlawSection,
            InputWithEditModal,
            MinionSection,
            MovementSection,
            ResourceSection,
            SkillSection,
            StatusSection,
            TooltipComponent,
            JournalSection
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
                let char = this.characterSheet.cunning + this.characterSheet.cunningAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            fitness() {
                let char = this.characterSheet.fitness + this.characterSheet.fitnessAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            intelligence() {
                let char = this.characterSheet.intelligence + this.characterSheet.intelligenceAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            luck() {
                let char = this.characterSheet.luck + this.characterSheet.luckAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            resistance() {
                let char = this.characterSheet.resistance + this.characterSheet.resistanceAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            speed() {
                let char = this.characterSheet.speed + this.characterSheet.speedAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            cunningAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'cunning' })
            },
            fitnessAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'fitness' })
            },
            intelligenceAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'intelligence' })
            },
            luckAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'luck' })
            },
            resistanceAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'resistance' })
            },
            speedAdjustment() {
                return this.buffAmount({ type: 'CHAR', propName: 'characteristic', propValue: 'speed' })
            },
            //CHAR Adjustments End
            apMax() {
                return ((this.characterSheet.speedPreperationIsKey) ? 3 * (+this.speed + 2) : 2 * (+this.speed + 2))
            },
            attunementSlots() {
                return this.attunementSlotsMax - this.characterSheet.equipment.filter(x => { return x.isActive }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.attunementSlots
                }, 0)
            },
            attunementSlotsMax() {
                return (10 + +this.characterSheet.attunementSlotsIncreases)
            },
            bpMax() {
                return +this.resistance + +this.characterSheet.bpIncreases
            },
            dcToHit() {
                let adj = 0
                this.characterSheet.buffs.filter(buff => { return JSON.stringify(buff.adjustments).includes('DC to Hit') && buff.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'DC to Hit' }).forEach(adjustment => {
                        if (adjustment.amount > adj)
                            adj = adjustment.amount
                    })
                })
                let armorShield = 0
                this.characterSheet.equipment.filter(x => { return x.isActive && x.isArmorShield && x.dcToHit > 0 }).forEach(equipment => {
                    if (equipment.dcToHit > armorShield)
                        armorShield = equipment.dcToHit
                })
                let dc = 3 + +this.characterSheet.dcToHitIncreases + +adj + +armorShield
                return (dc > 0) ? dc : 0
            },
            hpMax() {
                let adj = this.buffAmount({ type: 'Health' })
                let hp = ((this.characterSheet.level * 5) + (+this.resistance * 3) + +this.characterSheet.hpIncreases + +adj)
                return (hp > 1) ? hp : 1
            },
            level() {
                let nonClassXP = this.characterSheet.journalEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.xp
                }, 0)
                return Math.floor(nonClassXP / 500)
            },
            movement() {
                return +this.fitness + this.movements.filter(x => { return x.type == 'Land Speed' && !x.isDefault }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
            },
            rerollsMax() {
                return +this.luck + +this.characterSheet.rerollsIncreases
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
                return this.characterSheet.journalEntries.reduce((previousValue, entry) => {
                    return +previousValue + +entry.xp
                }, 0)
            },
            xpTotal() {
                let healthXP = 5 * Math.floor(this.characterSheet.hpIncreases * (this.characterSheet.hpIncreases + 1) / 2)
                let flawsXP = this.characterSheet.flaws.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                let traitsXP = this.characterSheet.traits.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)
                return (+this.characterSheet.xpEarned + +flawsXP - +traitsXP - +healthXP)
            },
            //Character Properties End
            abilities() {
                let abilities = []

                this.characterSheet.abilities.forEach((a) => {
                    let ability = JSON.parse(JSON.stringify(a))

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
                        ability.save +
                        ability.saveAmount +
                        ability.saveCharacteristic +
                        ability.xpCost +
                        JSON.stringify(ability.components) +
                        JSON.stringify(ability.damage) +
                        JSON.stringify(ability.subEffects) +
                        this.updateCharacter;

                    if (ability.save)
                        ability.key += this.successesFromIntelligence;

                    abilities.push(ability)
                })

                this.characterSheet.equipment.forEach((e) => {
                    if (!e.isItem && e.isActive &&
                        (e.ability.apCost != 0 ||
                            e.ability.classResource ||
                            e.ability.damage.dice > 0 ||
                            e.ability.damage.flat > 0 ||
                            e.ability.characteristic ||
                            (e.ability.save && e.ability.saveAmount && e.ability.saveCharacteristic))) {
                        let ability = JSON.parse(JSON.stringify(e.ability))

                        ability.canEdit = false
                        ability.description = e.description
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
                            ability.save +
                            ability.saveAmount +
                            ability.saveCharacteristic +
                            ability.xpCost +
                            JSON.stringify(ability.components) +
                            JSON.stringify(ability.damage) +
                            JSON.stringify(ability.subEffects) +
                            this.updateCharacter;

                        if (ability.save)
                            ability.key += this.successesFromIntelligence;

                        abilities.push(ability)
                    }
                })

                return abilities
            },
            attunementSlotsInputWithEditModal() {
                return {
                    bar: true,
                    color: 'primary',
                    dialogText: '',
                    disabled: true,
                    infoText: '10 + Attunement Slot Purchases - Equipment Attunement Slots used',
                    key: 'attunementSlots' + this.characterSheet.attunementSlots + this.characterSheet.attunementSlotsMax,
                    label: 'Attunement Slots',
                    minus: false,
                    plus: false,
                    type: 'number',
                    value: this.characterSheet.attunementSlots,
                    valueIncreases: this.characterSheet.attunementSlotsIncreases,
                    valueIncreasesLabel: 'Attunement Slot Purchases',
                    valueIncreasesName: 'attunementSlotsIncreases',
                    valueIncreasesType: 'number',
                    valueMax: this.characterSheet.attunementSlotsMax,
                    valueName: 'attunementSlots'
                }
            },
            buffs() {
                let buffs = []

                this.characterSheet.buffs.forEach((b) => {
                    let buff = JSON.parse(JSON.stringify(b))

                    buff.key =
                        buff.id +
                        this.updateBuff +
                        JSON.stringify(buff.adjustments) +
                        this.updateCharacter;
                    buffs.push(buff)
                })

                return buffs
            },
            characterEquipment() {
                let equipment = []

                this.characterSheet.equipment.forEach(eq => {
                    let e = JSON.parse(JSON.stringify(eq))

                    e.key = e.id +
                        e.attunementSlots +
                        e.dcToHit +
                        e.description +
                        e.isArmorShield +
                        e.isItem +
                        e.isWeapon +
                        e.name +
                        e.slot +
                        JSON.stringify(e.ability) +
                        JSON.stringify(e.damageModifications) +
                        this.updateCharacter;

                    if (e.ability.save)
                        e.key += this.successesFromIntelligence;

                    equipment.push(e)
                })

                return equipment
            },
            characterStatuses() {
                let statuses = []

                this.characterSheet.statuses.forEach((s) => {
                    let status = JSON.parse(JSON.stringify(s))

                    status.key =
                        JSON.stringify(status.status) +
                        status.isActive.toString() +
                        this.updateStatus +
                        this.updateCharacter;
                    statuses.push(status)
                })

                this.characterSheet.buffs.filter(b => { return JSON.stringify(b.adjustments).includes('Status') && b.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'Status' }).forEach(adjustment => {
                        let status = JSON.parse(JSON.stringify(adjustment.status))
                        status.duration = status.currentDuration
                        status.isActive = status.currentIsActive
                        status.ranks = status.currentRanks
                        status.buffId = buff.id
                        status.buffName = buff.name
                        status.description = buff.name + ' Buff Status'
                        status.key =
                            buff.name +
                            JSON.stringify(status.status) +
                            status.isActive.toString() +
                            this.updateStatus +
                            this.updateCharacter;
                        statuses.push(status)
                    })
                })

                return statuses
            },
            characteristicViewItems() {
                let chars = this.characterSheet.classes.filter(x => { return x.active && !x.unlocked }).map(x => x.characteristic)
                return [
                    {
                        abbreviation: 'FIT',
                        adjustment: this.characterSheet.fitnessAdjustment,
                        key: 'fit' + this.characterSheet.id + this.characterSheet.fitnessAdjustment + this.updateCharacter,
                        name: 'fitness',
                        value: this.characterSheet.fitness,
                        valueMax: 10,
                        characteristic: chars.includes('fitness')
                    },
                    {
                        abbreviation: 'RES',
                        adjustment: this.characterSheet.resistanceAdjustment,
                        key: 'res' + this.characterSheet.id + this.characterSheet.resistanceAdjustment + this.updateCharacter,
                        name: 'resistance',
                        value: this.characterSheet.resistance,
                        valueMax: 10,
                        characteristic: chars.includes('resistance')
                    },
                    {
                        abbreviation: 'SPD',
                        adjustment: this.characterSheet.speedAdjustment,
                        key: 'spd' + this.characterSheet.id + this.characterSheet.speedAdjustment + this.updateCharacter,
                        name: 'speed',
                        value: this.characterSheet.speed,
                        valueMax: 10,
                        characteristic: chars.includes('speed')
                    },
                    {
                        abbreviation: 'INT',
                        adjustment: this.characterSheet.intelligenceAdjustment,
                        key: 'int' + this.characterSheet.id + this.characterSheet.intelligenceAdjustment + this.updateCharacter,
                        name: 'intelligence',
                        value: this.characterSheet.intelligence,
                        valueMax: 10,
                        characteristic: chars.includes('intelligence')
                    },
                    {
                        abbreviation: 'CUN',
                        adjustment: this.characterSheet.cunningAdjustment,
                        key: 'cun' + this.characterSheet.id + this.characterSheet.cunningAdjustment + this.updateCharacter,
                        name: 'cunning',
                        value: this.characterSheet.cunning,
                        valueMax: 10,
                        characteristic: chars.includes('cunning')
                    },
                    {
                        abbreviation: 'LCK',
                        adjustment: this.characterSheet.luckAdjustment,
                        key: 'lck' + this.characterSheet.id + this.characterSheet.luckAdjustment + this.updateCharacter,
                        name: 'luck',
                        value: this.characterSheet.luck,
                        valueMax: 10,
                        characteristic: chars.includes('luck')
                    }
                ]
            },
            checkEffects() {
                let effects = []

                this.abilityDialog.effects.filter(x => x.cost <= this.abilityDialog.check.successesInput).forEach(effect => {
                    effects.push(JSON.parse(JSON.stringify(effect)))
                })

                return effects
            },
            classes() {
                let classes = []

                this.characterSheet.classes.filter(x => { return !x.unlocked }).forEach(c => {
                    let cl = JSON.parse(JSON.stringify(c))

                    cl.key = cl.id + this.updateCharacter
                    classes.push(cl)
                })

                return classes
            },
            classesUnlocked() {
                let classes = []

                this.characterSheet.classes.filter(x => { return x.unlocked }).forEach(c => {
                    let cl = JSON.parse(JSON.stringify(c))

                    cl.key = cl.id + this.updateCharacter
                    classes.push(cl)
                })

                return classes
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
                        bar: false,
                        color: '',
                        dialogText: '',
                        disabled: true,
                        infoText: '3 + DC Purchases (Natural Armor) + Highest Buff + Highest Armor/Shield Equipment.',
                        key: 'dc' + this.characterSheet.dcToHit,
                        label: 'DC to Hit',
                        minus: false,
                        plus: false,
                        type: 'number',
                        value: this.characterSheet.dcToHit,
                        valueIncreases: this.characterSheet.dcToHitIncreases,
                        valueIncreasesLabel: 'DC to Hit Purchases',
                        valueIncreasesName: 'dcToHitIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.dcToHit,
                        valueName: 'dc'
                    },
                    {
                        bar: false,
                        color: '',
                        dialogText: 'Initiative = 1d6 + SPD + Initiative Purchases',
                        disabled: false,
                        infoText: '',
                        key: 'initiative' + this.characterSheet.initiative + this.updateInitiative,
                        label: 'Initiative',
                        minus: false,
                        plus: false,
                        type: 'number',
                        value: this.characterSheet.initiative,
                        valueIncreases: this.characterSheet.initiativeIncreases,
                        valueIncreasesLabel: 'Initiative Purchases',
                        valueIncreasesName: 'initiativeIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.initiative,
                        valueName: 'initiative'
                    }
                ]
            },
            flaws() {
                let flaws = []

                this.characterSheet.flaws.forEach(f => {
                    let flaw = JSON.parse(JSON.stringify(f))

                    flaw.key = flaw.id + this.updateCharacter
                    flaws.push(flaw)
                })

                return flaws
            },
            healthInputWithEditModals() {
                return [
                    {
                        bar: true,
                        color: 'red',
                        dialogText: '5 xp per 1 HP, increases by 5 for each purchase. Formula: 5(n*(n+1)/2)',
                        disabled: false,
                        infoText: 'Health Points Max = (level * 5) + (RES * 3) + purchased HP + Buffs',
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
                    },
                    {
                        bar: true,
                        color: 'brown lighten-2',
                        dialogText: '',
                        disabled: false,
                        infoText: '',
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
                        infoText: '',
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
                    }                    
                ]
            },
            minions() {
                let minions = []

                this.characterSheet.minions.forEach(m => {
                    let minion = JSON.parse(JSON.stringify(m))

                    minion.key = minion.id + minion.name + this.updateMinions
                    minions.push(minion)
                })

                return minions
            },
            movementApIcon() {
                let icon = ''

                if (this.movementApIconColor == 'warning' || this.movementApIconColor == 'primary')
                    icon = 'mdi-clock-minus-outline'
                else
                    icon = 'mdi-clock-alert-outline'

                return icon
            },
            movementApIconColor() {
                let color = ''

                if (this.characterSheet.ap > 1)
                    color = 'primary'
                else if (this.characterSheet.ap == 1)
                    color = 'warning'
                else
                    color = 'error'

                return color
            },
            movements() {
                let movements = []

                if (this.characterSheet.fitness) {
                    movements.push({
                        amount: this.characterSheet.fitness,
                        description: 'Default Movement from FIT',
                        id: 'defaultMovement',
                        isBuff: false,
                        isDefault: true,
                        isUnique: false,
                        key: 'defaultMovement' + this.characterSheet.fitness,
                        type: 'Land Speed'
                    })

                    let halfFit = Math.floor(this.characterSheet.fitness / 2)
                    movements.push({
                        amount: halfFit,
                        description: 'Default Movement from FIT, FIT/2',
                        id: 'defaultMovementClimb',
                        isBuff: false,
                        isDefault: true,
                        isUnique: false,
                        key: 'defaultMovementClimb' + halfFit,
                        type: 'Climb'
                    })
                    movements.push({
                        amount: halfFit,
                        description: 'Default Movement from FIT, FIT/2',
                        id: 'defaultMovementSwim',
                        isBuff: false,
                        isDefault: true,
                        isUnique: false,
                        key: 'defaultMovementSwim' + halfFit,
                        type: 'Swim'
                    })
                }

                this.characterSheet.movements.forEach(m => {
                    let movement = JSON.parse(JSON.stringify(m))

                    movement.key = movement.id + this.characterSheet.ap
                    movements.push(movement)
                })

                this.characterSheet.buffs.filter(b => { return JSON.stringify(b.adjustments).includes('Movement') && b.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'Movement' }).forEach(adjustment => {
                        let movement = {
                            amount: adjustment.amount,
                            description: buff.name + ' Buff Movement',
                            id: adjustment.id,
                            isBuff: true,
                            isDefault: false,
                            key: adjustment.id + JSON.stringify(adjustment),
                            type: adjustment.movementType
                        }
                        movements.push(movement)
                    })
                })

                this.characterSheet.equipment.filter(e => { return e.isActive && e.movements.length }).forEach((equipment, index) => {
                    equipment.movements.forEach(m => {
                        let movement = {
                            amount: m.amount,
                            description: m.description,
                            id: JSON.stringify(m) + index,
                            isBuff: true,
                            isDefault: false,
                            key: JSON.stringify(m) + index,
                            type: m.type
                        }
                        movements.push(movement)
                    })
                })

                return movements
            },
            resources() {
                let resources = []

                this.characterSheet.resources.forEach((r) => {
                    let resource = JSON.parse(JSON.stringify(r))

                    let primaryCharValue = +this[resource.characteristic]
                    let adj = this.buffAmount({ type: 'Class Resource: Commited', propName: 'classResource', propValue: resource.id })
                    resource.amountMax = +primaryCharValue + +resource.resourceIncreases - +adj
                    resource.key = resource.name + resource.characteristic + resource.resourceIncreases + primaryCharValue + this.updateCR + this.updateCharacter
                    resources.push(resource)
                })

                return resources
            },
            skills() {
                let skills = []

                this.characterSheet.skills.forEach((s) => {
                    let skill = JSON.parse(JSON.stringify(s))

                    skill.adjustment = this.buffAmount({ type: 'Skill', propName: 'skill', propValue: skill.name })
                    skill.value = +skill.skillIncreases + +this[skill.characteristic]
                    skill.key = skill.name + skill.characteristic + skill.skillIncreases + skill.value + skill.adjustment + this.updateCharacter
                    skills.push(skill)
                })

                let newSkills = []
                this.characterSheet.buffs.filter(b => { return JSON.stringify(b.adjustments).includes('Skill') && b.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'Skill' && !this.characterSheet.skills.map(x => x.name).includes(a.skill) }).forEach(adjustment => {
                        if (!newSkills.includes(adjustment.skill))
                            newSkills.push({ characteristic: adjustment.characteristic, id: adjustment.id, name: adjustment.skill })
                    })
                })

                newSkills.forEach(newSkill => {
                    let skill = {
                        adjustment: this.buffAmount({ type: 'Skill', propName: newSkill.name }),
                        characteristic: newSkill.characteristic,
                        default: false,
                        id: newSkill.id,
                        isBuff: true,
                        name: newSkill.name,
                        skillIncreases: 0,
                        value: +this[newSkill.characteristic]
                    }
                    skill.key = skill.name + skill.characteristic + skill.skillIncreases + skill.value + skill.adjustment + this.updateCharacter
                    skills.push(skill)
                })

                return skills
            },
            successesFromIntelligence() {
                return Math.floor(this.intelligence / 3)
            },
            traits() {
                let traits = []

                this.characterSheet.traits.forEach(t => {
                    let trait = JSON.parse(JSON.stringify(t))

                    trait.key = trait.id + this.updateCharacter
                    traits.push(trait)
                })

                return traits
            },
            journalEntries() {
                let journalEntries = []

                this.characterSheet.journalEntries.forEach(je => {
                    let journalEntry = JSON.parse(JSON.stringify(je))

                    journalEntry.key = journalEntry.id + this.updateCharacter
                    journalEntries.push(journalEntry)
                })

                return journalEntries
            }
        },
        created() {
            this.characterInit()
            this.loadOptions()
        },
        data() {
            return {
                abilityDialog: {
                    ability: {},
                    ap: '',
                    check: {
                        advantage: false,
                        diceCheckObject: {},
                        diceResults: [],
                        effects: [],
                        fate: 0,
                        show: false,
                        selectedRerolls: [],
                        successes: 0,
                        successesFromIntelligence: 0,
                        successesFromLuck: 0,
                        successesInput: 0,
                        threat: false
                    },
                    characters: [],
                    cr: '',
                    damage: {
                        char: 0,
                        damage: 0,
                        diceResults: [],
                        effects: [],
                        fit: 0,
                        flat: 0,
                        flatTotal: 0,
                        flatTotalBreakdown: '',
                        isCrit: false,
                        selectedRerolls: [],
                        show: false,
                        sum: 0,
                        types: []
                    },
                    effects: [],
                    isAbility: false,
                    multipleTargets: false,
                    save: {
                        amount: 0,
                        characteristic: '',
                        show: false
                    },
                    selectedEffects: [],
                    show: false,
                    title: '',
                    usedEffects: []
                },
                characteristics: [
                    'fitness',
                    'speed',
                    'intelligence',
                    'cunning',
                    'resistance',
                    'luck'
                ],
                clearCharacter: this.characterStore.getCharacterById('clear'),
                characterFile: null,
                characterSheet: this.characterStore.getCharacterById('clear'),
                // Character Sheet Options Start
                abilityPanel: 0,
                buffPanel: 0,
                classPanel: 0,
                classUnlockedPanel: 0,
                damageModificationPanel: 0,
                equipmentPanel: 0,
                flawPanel: 0,
                journalPanel: 0,
                minionPanel: 0,
                movementPanel: 0,
                resourcePanel: 0,
                skillPanel: 0,
                statusPanel: 0,
                traitPanel: 0,
                layout: 'Condensed',
                layoutOptions: ['Condensed', 'Expanded'],
                // Character Sheet Options End
                cleanseDialog: {
                    selectedStatuses: [],
                    selectRules: [
                        v => v.length <= this.characterSheet.bp || 'Not enough Breakthrough Points'
                    ],
                    show: false
                },
                damageGroups: [
                    {
                        color: 'green lighten-3',
                        effects: [],
                        icon: 'mdi-shield-sun',
                        name: 'Elemental',
                        types: [
                            {
                                effects: [
                                    { cost: 1, description: 'Apply 2 True Damage to any item equipped on target' },
                                    { cost: 1, description: 'Target is Withered for 1 round' },
                                    { cost: 2, description: 'Apply 1d6 True Damage to any item equipped on target' },
                                    { cost: 2, description: 'Target is Cursed and Excruciated(4) for 1 round' }
                                ],
                                icon: 'mdi-flask-outline',
                                name: 'Acid'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Target is Sped Up(3) and Hyper-Accelerated for 1 round' },
                                    { cost: 1, description: 'Creates a 2x2 square of difficult icy terrain under creature or 1 square mass of ice with 10 HP in an adjacent square' },
                                    { cost: 2, description: 'Target is Rooted for 2 rounds' },
                                    { cost: 2, description: 'Apply Slowed(2) for 2 rounds' }
                                ],
                                icon: 'mdi-snowflake',
                                name: 'Cold'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Damage chains to 1 additional target within 3 squares for half damage' },
                                    { cost: 1, description: 'Apply Twitching(2) for 1 round' },
                                    { cost: 2, description: 'Apply Weakened(1) to all characteristics for 1 round' },
                                    { cost: 2, description: 'Applies Wide Open for 1 round' }
                                ],
                                icon: 'mdi-lightning-bolt',
                                name: 'Electric'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Apply Burning(1d6)' },
                                    { cost: 1, description: 'Create a 1 square fire pool dealing 1d6 damage at target creature’s feet that lasts for the encounter' },
                                    { cost: 2, description: 'Apply Burning(10) and Panicked for 1 round' },
                                    { cost: 2, description: 'Apply Withered as Continuous until target is healed' }
                                ],
                                icon: 'mdi-fire',
                                name: 'Fire'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'The next time you use the same ability that triggered this, it costs 1 less AP' },
                                    { cost: 1, description: 'Give Haste(1) to an ally within line of sight' },
                                    { cost: 2, description: 'Gain 3 AP. Each time this effect is chosen in one round, reduce it by 1 AP.' },
                                    { cost: 2, description: 'Target is Silenced for 2 rounds' }
                                ],
                                icon: 'mdi-laser-pointer',
                                name: 'Energy/Arcane'
                            }
                        ]
                    },
                    {
                        color: 'deep-purple lighten-3',
                        effects: [],
                        icon: 'mdi-shield-cross',
                        name: 'Esoteric',
                        types: [
                            {
                                effects: [
                                    { cost: 1, description: 'Deal an additional 1d6 Dark Damage to the target' },
                                    { cost: 1, description: 'Target gains Cursed for 1 round' },
                                    { cost: 2, description: 'You are Strengthened(2) in the same CHAR you used to make the attack and the target is Weakened(2) in that CHAR for 1 round ' },
                                    { cost: 2, description: 'Target becomes Rotted until the next time they are healed' }
                                ],
                                icon: 'mdi-skull',
                                name: 'Dark'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Target is knocked prone' },
                                    { cost: 1, description: 'Apply Hobbled(3) for 1 round' },
                                    { cost: 2, description: 'Target has an object in their hand or on their  person knocked 1d4 squares away' },
                                    { cost: 2, description: 'Target is encumbered for 1 round' }
                                ],
                                icon: 'mdi-rotate-orbit',
                                name: 'Force'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Heal yourself or an ally that can see you for 1d6' },
                                    { cost: 1, description: 'All allies that can see the target are Bolstered(1)' },
                                    { cost: 2, description: 'Target is Repelled for 1 round against a target of your choice' },
                                    { cost: 2, description: 'Target Blinded for 1 round' }
                                ],
                                icon: 'mdi-centos',
                                name: 'Light'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Target Taunted to yourself or any allied target for 1 round' },
                                    { cost: 1, description: 'Make a dispel check against something cast by the target' },
                                    { cost: 2, description: 'Target is Taunted and Enraged for 1 round to yourself, any ally, or any enemy or is Pacified for 1 round' },
                                    { cost: 2, description: 'Apply Silenced as Affliction(DC2 RES)' }
                                ],
                                icon: 'mdi-brain',
                                name: 'Psionic'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Apply Weakened(2) for FIT, or SPD for 2 rounds' },
                                    { cost: 1, description: 'Apply Atrophied for 1 round' },
                                    { cost: 2, description: 'Apply Sealed for 1 round' },
                                    { cost: 2, description: 'Apply Cursed and Sickened(1) for 2 rounds' }
                                ],
                                icon: 'mdi-biohazard',
                                name: 'Toxic'
                            }
                        ]
                    },
                    {
                        color: 'orange lighten-3',
                        effects: [],
                        icon: 'mdi-shield-sword',
                        name: 'Physical',
                        types: [
                            {
                                effects: [
                                    { cost: 1, description: 'Target is Exposed(2) for the next attack' },
                                    { cost: 1, description: 'Target is pushed up to FIT/Primary CHAR squares backwards or sideways' },
                                    { cost: 2, description: 'Target is Staggered for 1 round' },
                                    { cost: 2, description: 'Target is knocked prone with Exposed(1) until they stand up' }
                                ],
                                icon: 'mdi-gavel',
                                name: 'Blunt'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Attack deals half damage to targets adjacent to their area of effect' },
                                    { cost: 2, description: 'Target is pushed back 1d6 squares or knocked prone' },
                                    { cost: 2, description: 'Increase the radius of the AoE of the attack by 1 square, you may repeat this choice' }
                                ],
                                icon: 'mdi-bomb',
                                name: 'Explosive'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Apply Pierce(FIT/Primary CHAR) to this attack' },
                                    { cost: 1, description: 'Apply Hobbled(1) for the encounter' },
                                    { cost: 2, description: 'Apply a called shot effect of your choice' },
                                    { cost: 2, description: 'This attack is now a critical hit' }
                                ],
                                icon: 'mdi-arrow-projectile',
                                name: 'Piercing'
                            },
                            {
                                effects: [
                                    { cost: 1, description: 'Inflict Bleeding (3) for 3 rounds' },
                                    { cost: 1, description: 'You gain Blessed for any additional attacks against this target until the end of your next turn' },
                                    { cost: 2, description: 'Inflict Bleeding (4) and Sickened(1) for 3 rounds' },
                                    { cost: 2, description: 'Inflict 3 True damage to one natural armor or equipment' }
                                ],
                                icon: 'mdi-sword',
                                name: 'Slashing'
                            }
                        ]
                    },
                    {
                        color: 'yellow lighted-3',
                        effects: [
                            { cost: 1, description: 'Increase the damage of this attack by 1, this effect may be purchased multiple times' }
                        ],
                        icon: 'mdi-decagram',
                        name: 'True Damage',
                        types: []
                    }
                    ,
                    {
                        color: 'green lighted-3',
                        effects: [],
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
                effects: this.gameDataStore.effects,
                generalDialog: {
                    buttonText: '',
                    buttonType: '',
                    html: '',
                    show: false,
                    text: '',
                    title: ''
                },
                genericCharacteristic: {
                    abbreviation: 'Generic Roller',
                    adjustment: 0,
                    name: '',
                    value: 0,
                    valueMax: 15,
                    characteristic: false
                },
                massRoller: {
                    dice: 0,
                    enemies: 0,
                    luck: 0,
                    results: [],
                    show: false,
                    successesRequired: 0
                },
                moneyModifyAmount: 0,
                movementTypes: [
                    'Burrowing',
                    'Climb',
                    'Flying',
                    'Gliding',
                    'Hover',
                    'Land Speed',
                    'Leap',
                    'Spider Climbing',
                    'Swim',
                    'Teleport'
                ],
                snackbar: {
                    show: false,
                    text: ''
                },
                statuses: this.gameDataStore.statuses,
                tab: 'abilities',
                universalEffects: [
                    { cost: 1, description: 'Gain 1 ReRoll for only your next roll', type: 'Universal' },
                    { cost: 2, description: 'Gain an additional 1d6 on your next roll', type: 'Universal' },
                    { cost: 3, description: 'Gain +1 Success on your next roll', type: 'Universal' },
                    { cost: 3, description: 'Make a successful attack roll into a critical hit', type: 'Universal' }
                ],
                updateAP: 0,
                updateBP: 0,
                updateBuff: 0,
                updateCharacter: 0,
                updateCR: 0,
                updateHP: 0,
                updateInitiative: 0,
                updateMinions: 0,
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

                this.characterSheet.buffs.filter(b => { return JSON.stringify(b.adjustments).includes('Status') && b.isActive }).forEach(buff => {
                    buff.adjustments.filter(a => { return a.type == 'Status' }).forEach(adjustment => {
                        let status = adjustment.status
                        if (status.duration > 0) {
                            status.currentDuration--
                        }
                    })
                })

                this.updateStatus++
                this.updateBuff++
            },
            //Array CRUD Functions
            addEntry(object) {
                object.object.id = uuidv4()
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
            updateMinion(object) {
                this.updateMinions++
                this.updateEntry(object)
            },
            //Array CRUD Functions End
            buffAmount(options) {
                let adj = 0
                this.characterSheet.buffs.filter(buff => { return JSON.stringify(buff.adjustments).includes(options.type) && buff.isActive }).forEach(buff => {
                    adj += +buff.adjustments.filter(a => {
                        if (options.propName && options.propValue)
                            return a.type == options.type && a[options.propName] == options.propValue
                        return a.type == options.type
                    }).reduce((previousValue, entry) => {
                        return +previousValue + +entry.amount
                    }, 0)
                })
                return adj
            },
            characterInit() {
                this.characterSheet.apMax = (this.characterSheet.speedPreperationIsKey) ? 3 * (+this.speed + 2) : 2 * (+this.speed + 2)
                this.characterSheet.attunementSlotsMax = 10 + +this.characterSheet.attunementSlotsIncreases
                /// TODO: attunement slots
                this.characterSheet.bpMax = +this.resistance + +this.characterSheet.bpIncreases
                this.characterSheet.dcToHit = 3 + +this.characterSheet.dcToHitIncreases + +this.buffAmount({ type: 'DC to Hit' })

                //handles xpEarned, level
                let nonClassXP = this.characterSheet.journalEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return +previousValue + +entry.xp
                }, 0)
                this.characterSheet.level = Math.floor(nonClassXP / 500)
                this.characterSheet.xpEarned = this.characterSheet.journalEntries.reduce((previousValue, entry) => {
                    return +previousValue + +entry.xp
                }, 0)
                //end
                this.characterSheet.rerollsMax = +this.luck + +this.characterSheet.rerollsIncreases

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
                        if (!status.buffId)
                            this.updateEntry({ arrayName: 'statuses', object: status })
                        else
                            this.updateBuffStatus({ status: status, buffId: status.buffId })
                        this.updateBP++
                        this.characterSheet.bp--
                    })

                    this.cleanseDialog.show = false
                    this.cleanseDialog.selectedStatuses = []
                }
            },
            copyAll() {
                var copyText = `&{template:default} {{name= ${this.abilityDialog.ability.name}}}`

                if (this.abilityDialog.check.show)
                    copyText += `${this.copyCheckGet()}`

                if (this.abilityDialog.damage.show)
                    copyText += `${this.copyDamageGet()}`

                if (this.abilityDialog.save.show)
                    copyText += `${this.copySaveGet()}`

                if (this.abilityDialog.ap)
                    copyText += `{{AP Used= ${this.abilityDialog.ap}}}`

                if (this.abilityDialog.cr)
                    copyText += `{{CR Used= ${this.abilityDialog.cr}}}`

                if (this.abilityDialog.ability.description)
                    copyText += `{{Description= ${this.abilityDialog.ability.description}}}`

                navigator.clipboard.writeText(copyText)
            },
            copyCheck() {
                navigator.clipboard.writeText(`&{template:default} {{name= ${this.abilityDialog.title}}} ${this.copyCheckGet()}`)
            },
            copyCheckGet() {
                var copyText =
                    '{{Successes= ' + this.abilityDialog.check.successes + '}}' +
                    '{{Fate= ' + this.abilityDialog.check.fate + ((this.abilityDialog.check.advantage) ? ', Advantage' : '') + ((this.abilityDialog.check.threat) ? ', Threat' : '') + '}}' +
                    '{{Dice Results= [' + this.abilityDialog.check.diceResults + ']}}';

                if (this.abilityDialog.check.successesFromIntelligence)
                    copyText += '{{Successes From INT= ' + this.abilityDialog.check.successesFromIntelligence + '}}'

                if (this.abilityDialog.check.successesFromLuck)
                    copyText += '{{Successes From LCK= ' + this.abilityDialog.check.successesFromLuck + '}}'

                return copyText
            },
            copyDamage() {
                navigator.clipboard.writeText(`&{template:default} {{name= ${this.abilityDialog.title}}} ${this.copyDamageGet()}`)
            },
            copyDamageGet() {
                return `{{Damage= ${this.abilityDialog.damage.sum} ${this.abilityDialog.ability.damage.types.join(', ')}}}`
            },
            copySave() {
                navigator.clipboard.writeText(`&{template:default} {{name= ${this.abilityDialog.title}}} ${this.copySaveGet()}`)
            },
            copySaveGet() {
                return `{{Save= ${this.abilityDialog.save.characteristic} ${this.abilityDialog.save.amount}}}`
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
                var failureCount = this.abilityDialog.check.diceResults.filter(x => { return x < 4 }).length
                let successDiceResults = this.abilityDialog.check.diceResults.filter(x => { return x > 3 })
                let rdResults = this.rollDice(failureCount)

                this.abilityDialog.check.selectedRerolls = []
                this.abilityDialog.check.diceResults = successDiceResults.concat(rdResults.diceResults)
                this.abilityDialog.check.successes += +rdResults.successes
                this.abilityDialog.check.successesInput += +rdResults.successes

                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rerollSelectedCheck() {
                let indexes = this.abilityDialog.check.selectedRerolls.sort().reverse()

                indexes.forEach(i => {
                    this.abilityDialog.check.diceResults.splice(i, 1)
                })

                let rdResults = this.rollDice(indexes.length)
                this.abilityDialog.check.diceResults = this.abilityDialog.check.diceResults.concat(rdResults.diceResults)

                this.abilityDialog.check.successes = 0
                this.abilityDialog.check.successesInput = 0

                this.abilityDialog.check.diceResults.forEach(d => {
                    this.abilityDialog.check.successes += +this.determineSuccesses(d)
                    this.abilityDialog.check.successesInput += +this.determineSuccesses(d)
                })

                this.abilityDialog.check.selectedRerolls = []

                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rerollWholeCheck() {
                this.rollCheck(this.abilityDialog.check.diceCheckObject)
                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rollAbility(ability) {
                let char = +this[ability.characteristic]
                this.rollCheck({
                    diceToRoll: char,
                    isSkill: false,
                    successes: ability.successes
                })
                this.abilityDialog.title = `${ability.name} Check Results`
                this.abilityDialog.isAbility = false
                this.abilityDialog.damage.show = false
                this.abilityDialog.save.show = false
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
                    effects: JSON.parse(JSON.stringify(this.universalEffects)),
                    fate: 0,
                    selectedRerolls: [],
                    show: true,
                    successes: 0,
                    successesFromIntelligence: 0,
                    successesFromLuck: 0,
                    successesInput: 0,
                    threat: false
                }

                if (diceCheckObject.diceToRoll > 0) {
                    if (diceCheckObject.isSkill) {
                        result.successesFromIntelligence = (!isNaN(diceCheckObject.successesFromIntelligence)) ? diceCheckObject.successesFromIntelligence : this.successesFromIntelligence
                        result.successes += +result.successesFromIntelligence
                        result.successesInput += +result.successesFromIntelligence
                    }

                    let rdResult = this.rollDice(diceCheckObject.diceToRoll)

                    result.diceResults = rdResult.diceResults;
                    result.successes += +rdResult.successes
                    result.successesInput += +rdResult.successes
                    result.fate = result.diceResults[0]

                    if (diceCheckObject.successes) {
                        result.successes += +diceCheckObject.successes
                        result.successesInput += +diceCheckObject.successes
                    }

                    let luck = diceCheckObject.luck ? diceCheckObject.luck : this.luck
                    if (!this.characterSheet.luckNothingToChance) {
                        if (result.fate == 6 || (this.characterSheet.luckFavored && result.fate >= 5)) {
                            result.advantage = true
                            result.successesFromLuck = luck
                            result.successes += +result.successesFromLuck
                            result.successesInput += +result.successesFromLuck
                        } else if (result.fate == 1 || (this.characterSheet.luckIllFavored && result.fate <= 2)) {
                            result.threat = true
                        }
                    }
                }

                this.abilityDialog.check = result
                this.abilityDialog.show = true
            },
            rollStandAloneCheck(diceCheckObject) {
                this.rollCheck(diceCheckObject)
                this.abilityDialog.effects = this.abilityDialog.check.effects
                this.abilityDialog.selectedEffects = []
                this.abilityDialog.usedEffects = []
                this.abilityDialog.damage.show = false
                this.abilityDialog.isAbility = false
                this.abilityDialog.save.show = false
                this.abilityDialog.title = diceCheckObject.name + ' Check Results'
                this.copyCheck()
                this.showSnackbar('Copied Check Results to Clipboard')
            },
            //Dice Roll Functions End
            fillResources() {
                this.characterSheet.resources.forEach(r => {
                    if (r.amount < r.amountMax)
                        r.amount = r.amountMax
                })
                this.updateCR++
            },
            generalDialogFunction() {
                if (this.generalDialog.buttonType) {
                    if (this.generalDialog.buttonType == 'confirmCharacter') {
                        this.saveCharacter()
                        this.generalDialog.show = false
                    }
                }
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
            //Local Storage Functions
            isCharacterSet() {
                let character = localStorage.getItem('character')
                return (character != null)
            },
            isOptionsSet() {
                let options = localStorage.getItem('characterSheetOptions')
                return (options != null)
            },
            loadCharacter() {
                if (this.isCharacterSet()) {
                    this.updateCharacter++
                    let character = JSON.parse(localStorage.getItem('character'))
                    if (!Object.hasOwn(character, 'minions'))
                        character.minions = []
                    this.characterSheet = character
                }
                else
                    this.generalDialog = {
                        buttonText: '',
                        buttonType: '',
                        html: '',
                        show: true,
                        text: 'No Character saved in Local Storage',
                        title: 'Error Loading Character'
                    }
            },
            async loadCharacters() {
                this.characters = []

                const querySnapshot = await getDocs(collection(db, 'characters'));
                querySnapshot.forEach((doc) => {
                    this.characters.push(doc.data())
                })

                console.log(this.characters)
            },
            loadOptions() {
                if (this.isOptionsSet()) {
                    let options = JSON.parse(localStorage.getItem('characterSheetOptions'))
                    this.abilityPanel = ('abilityPanel' in options) ? options.abilityPanel : null
                    this.buffPanel = ('buffPanel' in options) ? options.buffPanel : null
                    this.classPanel = ('classPanel' in options) ? options.classPanel : null
                    this.classUnlockedPanel = ('classUnlockedPanel' in options) ? options.classUnlockedPanel : null
                    this.damageModificationPanel = ('damageModificationPanel' in options) ? options.damageModificationPanel : null
                    this.equipmentPanel = ('equipmentPanel' in options) ? options.equipmentPanel : null
                    this.flawPanel = ('flawPanel' in options) ? options.flawPanel : null
                    this.journalPanel = ('journalPanel' in options) ? options.journalPanel : null
                    this.layout = ('layout' in options) ? options.layout : null
                    this.minionPanel = ('minionPanel' in options) ? options.minionPanel : null
                    this.movementPanel = ('movementPanel' in options) ? options.movementPanel : null
                    this.resourcePanel = ('resourcePanel' in options) ? options.resourcePanel : null
                    this.skillPanel = ('skillPanel' in options) ? options.skillPanel : null
                    this.statusPanel = ('statusPanel' in options) ? options.statusPanel : null
                    this.traitPanel = ('traitPanel' in options) ? options.traitPanel : null
                }
            },
            readCharacterFromFile() {
                if (this.characterFile) {
                    var reader = new FileReader()
                    reader.readAsText(this.characterFile)
                    reader.onload = () => {
                        this.characterSheet = JSON.parse(reader.result)
                        this.characterFile = null
                    }
                }
            },
            saveCharacterConfirm() {
                if (!this.isCharacterSet())
                    this.saveCharacter()
                else
                    this.generalDialog = {
                        buttonText: 'Overwrite Character',
                        buttonType: 'confirmCharacter',
                        html: '',
                        show: true,
                        text: 'Overwrite Character saved in Local Storage',
                        title: 'Confirm Character Overwrite'
                    }
            },
            saveCharacter() {
                if (this.characterSheet.id == 'default' || this.characterSheet.id == 'clear')
                    this.characterSheet.id = uuidv4()

                let character = JSON.parse(JSON.stringify(this.characterSheet))
                localStorage.setItem('character', JSON.stringify(character))
                this.showSnackbar('Character Saved')
            },
            async saveToFirebase() {
                await setDoc(doc(db, 'characters', this.characterSheet.id), this.characterSheet)

            },
            saveCharacterAsFile() {
                let filename = `${this.characterSheet.name}.txt`, type = 'type:text/plain;charset=utf-8'
                let file = new Blob([JSON.stringify(this.characterSheet)], { type: type });
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others
                    var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            },
            saveOptions() {
                let options = {
                    abilityPanel: this.abilityPanel,
                    buffPanel: this.buffPanel,
                    classPanel: this.classPanel,
                    classUnlockedPanel: this.classUnlockedPanel,
                    damageModificationPanel: this.damageModificationPanel,
                    equipmentPanel: this.equipmentPanel,
                    flawPanel: this.flawPanel,
                    journalPanel: this.journalPanel,
                    layout: this.layout,
                    minionPanel: this.minionPanel,
                    movementPanel: this.movementPanel,
                    resourcePanel: this.resourcePanel,
                    skillPanel: this.skillPanel,
                    statusPanel: this.statusPanel,
                    traitPanel: this.traitPanel
                }
                localStorage.setItem('characterSheetOptions', JSON.stringify(options))
            },
            //Local Storage Functions End
            rollMassRoller() {
                if (!isNaN(this.massRoller.dice) && !isNaN(this.massRoller.enemies) && !isNaN(this.massRoller.luck)) {
                    this.generalDialog = {
                        buttonText: '',
                        buttonType: '',
                        html: '',
                        show: false,
                        text: '',
                        title: 'Mass Roller'
                    }
                    this.massRoller.results = []
                    var copyText = `&{template:default} {{name= Mass Roller}}`
                    var copyTextEnd = ''
                    for (var i = 0; i < this.massRoller.enemies; i++) {
                        let result = {
                            advantage: false,
                            diceResults: [],
                            fate: 0,
                            show: true,
                            selectedRerolls: [],
                            succeeded: false,
                            successes: 0,
                            successesFromLuck: 0,
                            threat: false
                        }
                        let rdResult = this.rollDice(this.massRoller.dice)

                        result.diceResults = rdResult.diceResults;
                        result.successes += +rdResult.successes
                        result.fate = result.diceResults[0]
                        if (result.fate == 6) {
                            result.advantage = true
                            result.successesFromLuck = this.massRoller.luck
                            result.successes += +result.successesFromLuck
                        } else if (result.fate == 1) {
                            result.threat = true
                        }

                        if (!isNaN(this.massRoller.successesRequired) && this.massRoller.successesRequired > 0)
                            result.succeeded = result.successes >= this.massRoller.successesRequired

                        this.generalDialog.html += '<div><div><b>Successes: ' + result.successes + '</b></div>' +
                            '<div> Fate: ' + result.fate + '</div>' +
                            '<div> Dice Results: [' + result.diceResults.join(', ') + ']</div>';

                        copyTextEnd += `{{Enemy ${i + 1} Successes = ${result.successes}}}`

                        this.massRoller.results.push(result)
                    }
                    let successes = this.massRoller.results.filter(x => { return x.succeeded }).length
                    if (!isNaN(this.massRoller.successesRequired) && this.massRoller.successesRequired > 0) {
                        this.generalDialog.html = '<div><b>Enemies Succeeded: ' + successes + '</b></div>' + this.generalDialog.html
                        copyText += `{{Enemies Succeeded= ${successes}}}`
                    }

                    copyText += copyTextEnd

                    navigator.clipboard.writeText(copyText)
                    this.showSnackbar('Copied Mass Roller Results to Clipboard')

                    this.generalDialog.show = true
                }
            },
            moneyAddSubtract(moneyObj) {
                if (moneyObj.add)
                    this.characterSheet.money = +this.characterSheet.money + +moneyObj.amount
                else
                    this.characterSheet.money = +this.characterSheet.money - +moneyObj.amount

                if (!moneyObj.emit)
                    this.moneyModifyAmount = 0
            },
            //Reroll Functions
            rerollSelectedDamage() {
                if (this.abilityDialog.damage.selectedRerolls.length) {
                    let indexes = this.abilityDialog.damage.selectedRerolls.sort().reverse()
                    let removedDie = []
                    indexes.forEach(i => {
                        this.abilityDialog.damage.sum -= +this.abilityDialog.damage.diceResults[i].value
                        removedDie.push(this.abilityDialog.damage.diceResults.splice(i, 1)[0])
                    })
                    removedDie.forEach(die => {
                        let dieResult = this.getRandomIntInclusive(1, 6)
                        this.abilityDialog.damage.sum += +dieResult
                        this.abilityDialog.damage.diceResults.push({
                            value: dieResult,
                            type: die.type
                        })
                    })
                    this.abilityDialog.damage.selectedRerolls = []

                    this.characterSheet.rerolls--
                    this.updateRerolls++
                }
            },
            rerollWholeDamage() {
                for (var i = 0; i < this.abilityDialog.damage.diceResults.length; i++) {
                    this.abilityDialog.damage.selectedRerolls.push(i)
                }
                this.rerollSelectedDamage()
            },
            rollCrit() {
                let damage = this.rollDamage(this.abilityDialog.damage.damage, false, null, true)

                this.abilityDialog.damage.diceResults = this.abilityDialog.damage.diceResults.concat(damage.diceResults)
                this.abilityDialog.damage.sum += +damage.sum
            },
            rollAbilityDamage(ability) {
                this.abilityDialog.ability = ability
                this.abilityDialog.damage = this.rollDamage(ability.damage, ability.isMeleeAttack, ability.characteristic, false)
                this.abilityDialog.show = true
                this.abilityDialog.check.show = false
                this.abilityDialog.isAbility = false
                this.abilityDialog.save.show = false
                this.abilityDialog.title = `${ability.name} Damage Results`

            },
            rollDamage(damage, isMeleeAttack, characteristic, isCrit) {
                let char = 0
                let diceResults = []
                let fit = 0
                let flat = 0
                let flatTotal = 0
                let flatTotalBreakdown = ''
                let sum = 0

                if (damage.dice && !isNaN(damage.dice)) {
                    for (var i = 0; i < damage.dice; i++) {
                        diceResults.push({
                            value: this.getRandomIntInclusive(1, 6),
                            type: (!isCrit) ? 'normal' : 'crit'
                        })
                    }
                    sum += diceResults.reduce((previousValue, entry) => {
                        return +previousValue + +entry.value
                    }, 0)
                }

                if (!isCrit) {
                    if (damage.flat > 0 && !isNaN(damage.flat)) {
                        flat = +damage.flat
                        flatTotal += +damage.flat
                        flatTotalBreakdown += `Flat(${flat}) + `
                        sum += +damage.flat
                    }

                    if (characteristic) {
                        char = this[characteristic]
                        flatTotal += +char
                        flatTotalBreakdown += `${characteristic.toUpperCase()}(${char}) + `
                        sum += +char
                    }

                    if (!damage.types.includes('Healing')) {
                        if (isMeleeAttack) {
                            fit = this.fitness
                            flatTotal += +fit
                            flatTotalBreakdown += `Melee FIT(${fit})`
                            sum += +fit
                        }
                    }

                    if (flatTotalBreakdown.substring(flatTotalBreakdown.length - 3) == ' + ')
                        flatTotalBreakdown = flatTotalBreakdown.substring(0, flatTotalBreakdown.length - 3)
                }

                if (isCrit && !this.abilityDialog.damage.isCrit) {
                    this.abilityDialog.damage.isCrit = true
                    let luckDiceResults = []
                    for (var j = 0; j < Math.floor(this.luck/2); j++) {
                        luckDiceResults.push({
                            value: this.getRandomIntInclusive(1, 6),
                            type: 'luck'
                        })
                    }
                    let luckDamage = luckDiceResults.reduce((previousValue, entry) => {
                        return +previousValue + +entry.value
                    }, 0)
                    diceResults = diceResults.concat(luckDiceResults)
                    sum += +luckDamage
                }


                let types = []
                let effects = []
                damage.types.forEach(type => {
                    let color = ''
                    let icon = ''
                    let typeEffects = []
                    this.damageGroups.forEach((group) => {
                        if (type == group.name || group.types.some(x => x.name == type)) {
                            color = group.color

                            if (type == group.name) {
                                icon = group.icon
                                typeEffects = JSON.parse(JSON.stringify(group.effects))
                                typeEffects.forEach(effect => effect.type = group.name)
                            } else {
                                let damageType = group.types.find(t => t.name == type)
                                if (damageType) {
                                    icon = damageType.icon
                                    typeEffects = JSON.parse(JSON.stringify(damageType.effects))
                                    typeEffects.forEach(effect => effect.type = damageType.name)
                                }
                            }
                        }
                    })
                    effects = effects.concat(typeEffects)
                    types.push({
                        color: color,
                        icon: icon,
                        text: type
                    })
                })

                return {
                    char: char,
                    damage: damage,
                    diceResults: diceResults,
                    effects: effects,
                    fit: fit,
                    flat: flat,
                    flatTotal: flatTotal,
                    flatTotalBreakdown: flatTotalBreakdown,
                    isCrit: false,
                    selectedRerolls: [],
                    show: true,
                    sum: sum,
                    types: types
                }
            },
            //Reroll Functions End
            setCharacterAs(name) {
                this.updateCharacter++
                this.characterSheet = this.characterStore.getCharacterById(name)
            },
            showSnackbar(text) {
                this.snackbar = {
                    show: true,
                    text: text
                }
            },
            specialInputWithEditModal(valueName) {
                if (valueName == 'initiative') {
                    this.characterSheet.initiative = this.getRandomIntInclusive(1, 6) + +this.speed + +this.characterSheet.initiativeIncreases + +this.buffAmount({ type: 'Initiative' })
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
                let resource = this.characterSheet.resources.find(x => x.id == crCost.classResource)
                if (resource) {
                    resource.amount -= +crCost.crCost
                    this.updateCR++
                }
            },
            successesInputAdd(val) {
                this.abilityDialog.check.successesInput = +this.abilityDialog.check.successesInput + +val
            },
            subtractSelectedEffects() {
                let successes = 0
                this.abilityDialog.selectedEffects.forEach(selectedEffect => {
                    successes = +successes + +selectedEffect.cost
                    if (selectedEffect.type == 'Universal' || (!selectedEffect.description.includes('this effect may be purchased multiple times') && !this.abilityDialog.multipleTargets)) {
                        let index = this.abilityDialog.effects.findIndex(x => x.description == selectedEffect.description)
                        if (index > -1) {
                            let effect = this.abilityDialog.effects.splice(index, 1)
                            this.abilityDialog.usedEffects = this.abilityDialog.usedEffects.concat(effect)
                        }
                    } else {
                        this.abilityDialog.usedEffects.push(selectedEffect)
                    }
                })

                this.abilityDialog.check.successesInput -= +successes
                this.abilityDialog.selectedEffects = []
            },
            updateBuffEntry(object) {
                this.updateStatus++
                this.updateBuff++
                this.updateEntry(object)
            },
            updateBuffStatus(object) {
                let buff = JSON.parse(JSON.stringify(this.characterSheet.buffs.find(x => x.id == object.buffId)))
                let adjustment = buff.adjustments.find(x => x.status.id == object.status.id)
                adjustment.status.currentDuration = object.status.duration
                adjustment.status.currentIsActive = object.status.isActive
                adjustment.status.currentRanks = object.status.ranks

                this.updateEntry({ arrayName: 'buffs', object: buff })
            },
            updatePanel(panelObj) {
                this[panelObj.name] = panelObj.value
            },
            updateProp(prop) {
                if (prop.type == 'number')
                    this.characterSheet[prop.propName] = +prop.value
                else
                    this.characterSheet[prop.propName] = prop.value
            },
            useAbility(ability) {
                if (ability.apCost != 0) {
                    this.subtractAP(ability.apCost)
                    this.abilityDialog.ap = ability.apCost
                } else
                    this.abilityDialog.ap = ''

                if (ability.characteristic)
                    this.rollAbility(ability)

                if (ability.classResource && ability.crCost != 0) {
                    this.subtractCR({ crCost: ability.crCost, classResource: ability.classResource })
                    let resource = this.resources.find(x => { return x.id == ability.classResource })
                    this.abilityDialog.cr = `${ability.crCost} ${resource.name}`
                } else
                    this.abilityDialog.cr = ''

                if (ability.damage.dice > 0 || ability.damage.flat > 0) {
                    this.rollAbilityDamage(ability)
                    this.abilityDialog.effects = this.abilityDialog.check.effects.concat(this.abilityDialog.damage.effects)
                }

                if (ability.save && !isNaN(ability.saveAmount) && ability.saveCharacteristic)
                    this.abilityDialog.save = {
                        amount: +ability.saveAmount + +this.successesFromIntelligence,
                        characteristic: this.characteristicViewItems.find(x => { return x.name == ability.saveCharacteristic }).abbreviation,
                        show: true
                    }
                else
                    this.abilityDialog.save = {
                        amount: 0,
                        characteristic: '',
                        show: false
                    }

                this.abilityDialog.ability = JSON.parse(JSON.stringify(ability))
                this.abilityDialog.check.show = (ability.characteristic)
                this.abilityDialog.damage.show = (ability.damage.dice > 0 || ability.damage.flat > 0)
                this.abilityDialog.isAbility = true
                this.abilityDialog.selectedEffects = []
                this.abilityDialog.show = true
                this.abilityDialog.title = ability.name
                this.abilityDialog.usedEffects = []

                this.copyAll()

                this.showSnackbar('Copied Ability to Clipboard')
            }
        },
        watch: {
            // Character Sheet Watch Start
            apMax() {
                this.characterSheet.apMax = this.apMax
            },
            attunementSlots() {
                this.characterSheet.attunementSlots = this.attunementSlots
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
            },
            // Character Sheet Watch End
            // Character Sheet Options Watch Start
            abilityPanel() { this.saveOptions() },
            buffPanel() { this.saveOptions() },
            classPanel() { this.saveOptions() },
            classUnlockedPanel() { this.saveOptions() },
            damageModificationPanel() { this.saveOptions() },
            equipmentPanel() { this.saveOptions() },
            flawPanel() { this.saveOptions() },
            journalPanel() { this.saveOptions() },
            minionPanel() { this.saveOptions() },
            movementPanel() { this.saveOptions() },
            resourcePanel() { this.saveOptions() },
            skillPanel() { this.saveOptions() },
            statusPanel() { this.saveOptions() },
            traitPanel() { this.saveOptions() },
            layout() {
                this.saveOptions()
            }
            // Character Sheet Options Watch End
        }
    }
</script>