<template>
    <div>
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
                        <MassRoller @resultsEmit="massRollerResults($event)"></MassRoller>
                    </div>
                </v-col>
                <v-col cols="12" lg="3" md="6">
                    <div class="hpColumn mainColumn elevation-3">
                        <v-form>
                            <h3 class="text-center"> Health </h3>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field type="number" min="0" v-model="damageToTake.amount">
                                        <v-icon color="success" slot="append" @click="heal(null)">mdi-plus</v-icon>
                                        <v-icon color="error" slot="append" @click="takeDamage(null)">mdi-liquid-spot</v-icon>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-select label="Type" :items="damageTypes" v-model="damageToTake.type"></v-select>
                                </v-col>
                                <v-col cols="12" v-for="input in healthInputWithEditModals" :key="input.key">
                                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                        @updatePropEmit="updateProp($event)"
                                                        :property-object="input"
                                                        :tier="characterSheet.tier"
                                                        :xp="xp"></InputWithEditModal>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-row>
                            <v-col cols="12" md="6" v-for="input in defenseInputWithEditModals" :key="input.key">
                                <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                                    @updatePropEmit="updateProp($event)"
                                                    :property-object="input"
                                                    :tier="characterSheet.tier"
                                                    :xp="xp"></InputWithEditModal>
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
                                                    :hastened="hastened"
                                                    :hp="characterSheet.hp"
                                                    :property-object="input"
                                                    :tier="characterSheet.tier"
                                                    :xp="xp"></InputWithEditModal>
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
                                    :layout="layout"
                                    :panel-prop="abilityPanel"
                                    :resources="resources"
                                    :successes-from-intelligence="successesFromIntelligence"
                                    :tier="characterSheet.tier"
                                    :xp="xp"
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
                    <PassivesSection :character-sheet="characterSheet" @updatePropEmit="updateProp($event)"></PassivesSection>

                    <div>
                        <v-text-field type="number" label="Character Tier" v-model="characterSheet.tier" min="0" max="9" disabled readonly>
                            <v-icon color="error" slot="append" @click="updateTier('subtract')">mdi-minus</v-icon>
                            <v-icon color="success" slot="append" @click="updateTier('add')">mdi-plus</v-icon>
                            <TooltipComponent slot="append" :text="'Global xp cost reduced by 10% per tier after all other calculations: Ability, HP, Traits. Increasing Tier automatically updates available xp.'"></TooltipComponent>
                        </v-text-field>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3" md="6">
                    <StatusSection :character-statuses="characterStatuses"
                                   :characteristics="characteristics"
                                   :damage-types="damageTypes"
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
                        <TooltipComponent slot="append" :text="'Journal Entries + Flaws - ((Traits + Abilty Costs)[Discounted by Character Tier * 10])'"></TooltipComponent>
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
                                                :property-object="input"
                                                :tier="characterSheet.tier"
                                                :xp="xp"></InputWithEditModal>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6" md="3" class="hpColumn mainColumn elevation-3">
                    <InputWithEditModal v-for="input in healthInputWithEditModals" :key="input.key"
                                        @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @updatePropEmit="updateProp($event)"
                                        :property-object="input"
                                        :tier="characterSheet.tier"
                                        :xp="xp"></InputWithEditModal>
                    <v-row>
                        <v-col cols="12" lg="6">
                            <v-text-field label="Take Damage/Heal" type="number" min="0" v-model="damageToTake.amount">
                                <v-icon color="success" slot="append" @click="heal(null)">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="takeDamage(null)">mdi-liquid-spot</v-icon>
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
                                        :hastened="hastened"
                                        @updatePropEmit="updateProp($event)"
                                        :hp="characterSheet.hp"
                                        :property-object="input"
                                        :tier="characterSheet.tier"
                                        :xp="xp"></InputWithEditModal>
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
                    <MassRoller @resultsEmit="massRollerResults($event)"></MassRoller>
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
                                            :layout="layout"
                                            :panel-prop="abilityPanel"
                                            :resources="resources"
                                            :successes-from-intelligence="successesFromIntelligence"
                                            :tier="characterSheet.tier"
                                            :xp="xp"
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
                            <PassivesSection :character-sheet="characterSheet" @updatePropEmit="updateProp($event)"></PassivesSection>
                            <div>
                                <v-text-field type="number" label="Character Tier" v-model="characterSheet.tier" min="0" max="9" disabled readonly>
                                    <v-icon color="error" slot="append" @click="updateTier('subtract')">mdi-minus</v-icon>
                                    <v-icon color="success" slot="append" @click="updateTier('add')">mdi-plus</v-icon>
                                    <TooltipComponent slot="append" :text="'Global xp cost reduced by 10% per tier after all other calculations: Ability, HP, Traits. Increasing Tier automatically updates available xp.'"></TooltipComponent>
                                </v-text-field>
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
                                           :characteristics="characteristics"
                                           :damage-types="damageTypes"
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
        <form onsubmit="return false;" v-if="layout == 'Minion'">
            <h3 class="text-center">{{characterSheet.name}}</h3>
            <v-row>
                <v-col cols="6" v-for="char in characteristicViewItems" :key="char.key">
                    <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                            @rollDiceCheckEmit="rollStandAloneCheck($event)"
                                            :characteristic="char"></CharacteristicViewItem>
                </v-col>
            </v-row>
            <h3 class="text-center"> Health </h3>
            <v-row>
                <v-col cols="6">
                    <v-text-field type="number" min="0" v-model="damageToTake.amount">
                        <v-icon color="success" slot="append" @click="heal(null)">mdi-plus</v-icon>
                        <v-icon color="error" slot="append" @click="takeDamage(null)">mdi-liquid-spot</v-icon>
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
                <v-col cols="12" v-for="input in inputWithEditModals.filter(x => { return x.label == 'Action Points' })" :key="input.key">
                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @apGainEmit="apGain($event)"
                                        :hastened="hastened"
                                        @updatePropEmit="updateProp($event)"
                                        :property-object="input"></InputWithEditModal>
                </v-col>
                <v-col cols="12" v-for="input in defenseInputWithEditModals.filter(x => { return x.label == 'DC to Hit' })" :key="input.key">
                    <InputWithEditModal @specialInputWithEditModalEmit="specialInputWithEditModal($event)"
                                        @apGainEmit="apGain($event)"
                                        :hastened="hastened"
                                        @updatePropEmit="updateProp($event)"
                                        :property-object="input"></InputWithEditModal>
                </v-col>
                <v-col cols="12">
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
                    <DamageModificationSection :can-edit="true"
                                               :damage-modifications="damageModifications"
                                               :damage-groups="damageGroups"
                                               :damage-types="damageTypes"
                                               :panel-prop="damageModificationPanel"
                                               @addEntryEmit="addEntry($event)"
                                               @deleteEntryEmit="deleteEntry($event)"
                                               @updateEntryEmit="updateEntry($event)"
                                               @updatePanelEmit="updatePanel($event)"></DamageModificationSection>
                    <AbilitySection :abilities="abilities"
                                    :ap="characterSheet.ap"
                                    :characteristics="characteristics"
                                    :damage-types="damageTypes"
                                    :effects="effects"
                                    :layout="layout"
                                    :panel-prop="abilityPanel"
                                    :resources="resources"
                                    :successes-from-intelligence="successesFromIntelligence"
                                    :tier="characterSheet.tier"
                                    :xp="xp"
                                    @addEntryEmit="addEntry($event)"
                                    @deleteEntryEmit="deleteEntry($event)"
                                    @rollAbilityEmit="rollAbility($event)"
                                    @rollDamageEmit="rollAbilityDamage($event)"
                                    @subtractAPEmit="subtractAP($event)"
                                    @subtractCREmit="subtractCR($event)"
                                    @updateEntryEmit="updateEntry($event)"
                                    @updatePanelEmit="updatePanel($event)"
                                    @useAbilityEmit="useAbility($event)"></AbilitySection>
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
                    <StatusSection :character-statuses="characterStatuses"
                                   :characteristics="characteristics"
                                   :damage-types="damageTypes"
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
                    <PassivesSection :character-sheet="characterSheet" @updatePropEmit="updateProp($event)"></PassivesSection>
                </v-col>
            </v-row>
        </form>

        <!-- Ability Dialog -->
        <v-dialog v-model="abilityDialog.show" width="500" scrollable>
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

                <v-card-text>
                    <template v-if="abilityDialog.check.show">
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
                        <div v-if="cursed && !abilityDialog.check.isReroll">
                            <span style="color: red;">Cursed</span>: Die number {{abilityDialog.check.cursed.oldDiePosition}} rerolled from {{abilityDialog.check.cursed.oldDie}} to {{abilityDialog.check.cursed.newDie}} and moved to end
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
                                            @click.stop="rerollSelectedCheck('luck')"
                                            :disabled="characterSheet.rerolls <= 0 || abilityDialog.check.selectedRerolls.length == 0">
                                        mdi-dice-6
                                    </v-icon>
                                </v-select>
                            </v-col>
                            <v-col cols="12" v-if="blessed">
                                <v-select v-model="abilityDialog.check.blessed.selectedReroll"
                                          :items="abilityDialog.check.diceResults.map((x, i) => ({ value: i, text: x}))"
                                          label="Select Blessed Reroll"
                                          :disabled="abilityDialog.check.blessed.used">
                                    <v-icon color="primary"
                                            slot="prepend"
                                            @click.stop="rerollSelectedCheck('blessed')"
                                            :disabled="abilityDialog.check.blessed.selectedReroll == null || abilityDialog.check.blessed.used">
                                        mdi-dice-6
                                    </v-icon>
                                </v-select>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-if="abilityDialog.save.show">
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
                    </template>
                    <template v-if="abilityDialog.damage.show">
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
                            <i v-if="abilityDialog.damage.atrophied" style="color: red;">Damage halved from atrophied status</i>
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
                    </template>
                    <template v-if="abilityDialog.isAbility">
                        <div v-if="abilityDialog.ap">
                            <b>AP Used {{abilityDialog.ap}}</b>
                        </div>
                        <div v-if="abilityDialog.cr">
                            <b>CR Used {{abilityDialog.cr}}</b>
                        </div>
                        <div v-if="abilityDialog.ability.description">
                            <v-textarea label="Description" v-model="abilityDialog.ability.description" auto-grow outlined rows="1" disabled></v-textarea>
                        </div>
                    </template>
                </v-card-text>




                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="secondary"
                           @click="abilityDialog.show = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Ability Dialog End -->
        <!-- Cleanse Dialog -->
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
        <!-- Cleanse Dialog End -->

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
    import MassRoller from './MassRoller.vue'
    import MinionSection from './MinionSection.vue'
    import MovementSection from './MovementSection.vue'
    import PassivesSection from './PassivesSection.vue'
    import ResourceSection from './ResourceSection.vue'
    import SkillSection from './SkillSection.vue'
    import StatusSection from './StatusSection.vue'
    import TooltipComponent from './TooltipComponent.vue'
    import { useCharacterStore } from '@/stores/CharacterStore'
    import { useGameDataStore } from '@/stores/GameDataStore'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'CharacterComponent',
        components: {
            AbilitySection,
            BuffSection,
            CharacteristicViewItem,
            ClassSection,
            DamageModificationSection,
            EquipmentSection,
            TraitFlawSection,
            InputWithEditModal,
            MassRoller,
            MinionSection,
            MovementSection,
            PassivesSection,
            ResourceSection,
            SkillSection,
            StatusSection,
            TooltipComponent,
            JournalSection
        },
        props: {
            character: Object,
            layout: String,
            log: Object,
            logId: String,
            options: Object
        },
        created() {
            this.characterInit()
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
                let char = +this.characterSheet.cunning + +this.characterSheet.cunningAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            fitness() {
                let char = +this.characterSheet.fitness + +this.characterSheet.fitnessAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            intelligence() {
                let char = +this.characterSheet.intelligence + +this.characterSheet.intelligenceAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            luck() {
                let char = +this.characterSheet.luck + +this.characterSheet.luckAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            resistance() {
                let char = +this.characterSheet.resistance + +this.characterSheet.resistanceAdjustment
                return (char > 10) ? 10 : (char < 0) ? 0 : char
            },
            speed() {
                let char = +this.characterSheet.speed + +this.characterSheet.speedAdjustment
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
            age() { return this.characterSheet.age },
            apMax() {
                let parenNum = (this.layout == 'Minion') ? this.speed : +this.speed + 2
                return ((this.characterSheet.speedPreperationIsKey) ? 3 * (parenNum) : 2 * (parenNum))
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
                let hp = ((this.characterSheet.level * 3) + (+this.resistance * 5) + +this.characterSheet.hpIncreases + +adj)
                return (hp > 1) ? hp : 1
            },
            level() {
                if (this.layout == 'Minion')
                    return 1

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
            name() { return this.characterSheet.name },
            race() { return this.characterSheet.race },
            rerollsMax() {
                return +this.luck + +this.characterSheet.rerollsIncreases
            },
            size() { return this.characterSheet.size },
            xp() {
                if (this.layout == 'Minion')
                    return 0

                let abilityXP = this.characterSheet.abilities.reduce((previousValue, entry) => {
                    if (!entry.boughtForFree)
                        return +previousValue + +entry.xpCost
                    else
                        return +previousValue
                }, 0)
                let apXP = (this.characterSheet.speedPreperationIsKey) ? 50 : 0
                let bpXP = (this.characterSheet.bpIncreases > 0) ? this.xpBP : 0
                let dcXP = (this.characterSheet.dcToHitIncreases > 0) ? this.xpDC : 0
                let hpXP = (this.characterSheet.hpIncreases > 0) ? this.xpHP : 0
                let initiativeXP = (this.characterSheet.initiativeIncreases > 0) ? this.xpInitiative : 0
                let rerollXP = (this.characterSheet.rerollsIncreases > 0) ? this.xpRerolls : 0
                let traitsXP = this.characterSheet.traits.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)

                let spentXP = +abilityXP + apXP + +bpXP + +dcXP + +hpXP + +initiativeXP + +rerollXP + +traitsXP

                let subtractedXP = Math.floor((spentXP) / 100 * (100 - (10 * this.characterSheet.tier)))

                return +this.xpTotal - +subtractedXP
            },
            xpBP() { return Math.floor(60 * (Math.abs(this.characterSheet.bpIncreases) * (+Math.abs(this.characterSheet.bpIncreases) + 1) / 2)) },
            xpDC() { return (Math.pow(2, +Math.abs(this.characterSheet.dcToHitIncreases)) - 1) * 160 },
            xpHP() { return (Math.floor(5 * Math.abs(this.characterSheet.hpIncreases) * (+Math.abs(this.characterSheet.hpIncreases) + 1) / 2)) },
            xpInitiative() { return Math.floor(30 * (Math.abs(this.characterSheet.initiativeIncreases) * (+Math.abs(this.characterSheet.initiativeIncreases) + 1) / 2)) },
            xpRerolls() { return Math.floor(60 * Math.abs(this.characterSheet.rerollsIncreases)) },
            xpTotal() {
                let xpEarned = this.characterSheet.journalEntries.reduce((previousValue, entry) => {
                    return +previousValue + +entry.xp
                }, 0)

                let flawsXP = this.characterSheet.flaws.reduce((previousValue, entry) => {
                    return +previousValue + +entry.amount
                }, 0)

                let bpXP = (this.characterSheet.bpIncreases < 0) ? this.xpBP : 0
                let dcXP = (this.characterSheet.dcToHitIncreases < 0) ? this.xpDC : 0
                let hpXP = (this.characterSheet.hpIncreases < 0) ? this.xpHP : 0
                let initiativeXP = (this.characterSheet.initiativeIncreases < 0) ? this.xpInitiative : 0
                let rerollXP = (this.characterSheet.rerollsIncreases < 0) ? this.xpRerolls : 0

                return +xpEarned + +flawsXP + +bpXP + +dcXP + +hpXP + +initiativeXP + +rerollXP
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
                        ability.dice +
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
            blessed() {
                return this.characterSheet.statuses.filter(x => { return x.status.name == 'Blessed' && x.isActive && x.duration > 0 }).length > 0
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

                this.characterSheet.statuses.forEach((s, i) => {
                    let status = JSON.parse(JSON.stringify(s))

                    status.key =
                        JSON.stringify(status.status) +
                        status.isActive.toString() +
                        this.updateStatus +
                        this.updateCharacter +
                        i;
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
            cursed() {
                return this.characterSheet.statuses.filter(x => { return x.status.name == 'Cursed' && x.isActive && x.duration > 0 }).length > 0
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
                            isImmunity: adjustment.damageModification.isImmunity,
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
                        dialogInfoText: 'Formula: (2^n - 1) * 160',
                        dialogText: '160 xp, doubling for each purchase.',
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
                        dialogInfoText: 'Formula: 30 * (n * (n + 1) / 2)',
                        dialogText: '30 or -30 xp per point, increasing/decreasing by 30 for each purchase. Can\'t be decreased below your SPD',
                        disabled: false,
                        infoText: 'Initiative = 1d6 + SPD + Initiative Purchases',
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
            hastened() {
                let haste = this.characterSheet.statuses.filter(x => { return x.status.name.includes('Hastened') && x.isActive && x.duration > 0 })
                    .reduce((previousValue, entry) => {
                        return +previousValue + +entry.ranks
                    }, 0)

                return haste
            },
            healthInputWithEditModals() {
                return [
                    {
                        bar: true,
                        color: 'red',
                        dialogInfoText: 'Formula: 5 * (n * (n + 1) / 2)',
                        dialogText: '5 xp per 1 HP, increases by 5 for each purchase.',
                        disabled: false,
                        infoText: 'Health Points Max = (level * 3) + (RES * 5) + purchased HP + Buffs',
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
                        dialogInfoText: '',
                        dialogText: '50 xp. Your maximum AP pool is increased from 2x your AP generation to 3x your generation rate.',
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
                        dialogInfoText: 'Formula: 60 * (n * (n + 1) / 2)',
                        dialogText: '60 xp per point, increasing by 60 for each purchase.',
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
                        dialogInfoText: '',
                        dialogText: '60 xp per Reroll',
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
                characterSheet: this.characterStore.getCharacterById('clear'),
                // Character Sheet Options Start
                abilityPanel: (this.layout == 'Minion') ? null : ('abilityPanel' in this.options) ? this.options.abilityPanel : null,
                buffPanel: (this.layout == 'Minion') ? null : ('buffPanel' in this.options) ? this.options.buffPanel : null,
                classPanel: (this.layout == 'Minion') ? null : ('classPanel' in this.options) ? this.options.classPanel : null,
                classUnlockedPanel: (this.layout == 'Minion') ? null : ('classUnlockedPanel' in this.options) ? this.options.classUnlockedPanel : null,
                damageModificationPanel: (this.layout == 'Minion') ? null : ('damageModificationPanel' in this.options) ? this.options.damageModificationPanel : null,
                equipmentPanel: (this.layout == 'Minion') ? null : ('equipmentPanel' in this.options) ? this.options.equipmentPanel : null,
                flawPanel: (this.layout == 'Minion') ? null : ('flawPanel' in this.options) ? this.options.flawPanel : null,
                journalPanel: (this.layout == 'Minion') ? null : ('journalPanel' in this.options) ? this.options.journalPanel : null,
                minionPanel: (this.layout == 'Minion') ? null : ('minionPanel' in this.options) ? this.options.minionPanel : null,
                movementPanel: (this.layout == 'Minion') ? null : ('movementPanel' in this.options) ? this.options.movementPanel : null,
                resourcePanel: (this.layout == 'Minion') ? null : ('resourcePanel' in this.options) ? this.options.resourcePanel : null,
                skillPanel: (this.layout == 'Minion') ? null : ('skillPanel' in this.options) ? this.options.skillPanel : null,
                statusPanel: (this.layout == 'Minion') ? null : ('statusPanel' in this.options) ? this.options.statusPanel : null,
                traitPanel: (this.layout == 'Minion') ? null : ('traitPanel' in this.options) ? this.options.traitPanel : null,
                // Character Sheet Options End
                cleanseDialog: {
                    selectedStatuses: [],
                    selectRules: [
                        v => v.length <= this.characterSheet.bp || 'Not enough Breakthrough Points'
                    ],
                    show: false
                },
                damageGroups: this.gameDataStore.damageGroups,
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
                statuses: this.gameDataStore.statuses,
                tab: 'abilities',
                universalEffects: this.gameDataStore.universalEffects,
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
                //Take damage for all DoT statuses
                this.characterSheet.statuses.filter(x => { return x.status.name.includes('DoT') && x.isActive && x.duration > 0 }).forEach(x => {
                    this.takeDamage({amount: x.ranks, type: x.damageType})
                })

                this.characterSheet.statuses.filter(x => { return x.status.name.includes('HoT') && x.isActive && x.duration > 0 }).forEach(x => {
                    this.heal({ amount: x.ranks, type: '' })
                })

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
                this.updateCharacterSheet()
            },
            deleteEntry(object) {
                let index = this.characterSheet[object.arrayName].findIndex(x => x.id == object.object.id)

                if (index == -1 && object.arrayName == 'abilities')
                    this.deleteEntryRecursive(this.characterSheet[object.arrayName], object.object)

                this.characterSheet[object.arrayName] = this.characterSheet[object.arrayName].filter(x => { return x.id != object.object.id })
                this.updateCharacterSheet()
            },
            deleteEntryRecursive(array, object) {
                array.filter(x => { return x.subEffects.length > 0; }).forEach(ability => {
                    if (JSON.stringify(ability).includes(object.id)) {
                        let index = ability.subEffects.findIndex(x => x.id == object.id)
                        if (index == -1)
                            this.deleteEntryRecursive(ability.subEffects, object)
                        else {
                            ability.subEffects = ability.subEffects.filter(x => { return x.id != object.id })
                            this.updateCharacterSheet()
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
                this.updateCharacterSheet()
            },
            updateEntryRecursive(array, object) {
                array.filter(x => { return x.subEffects.length > 0; }).forEach(ability => {
                    if (JSON.stringify(ability).includes(object.id)) {
                        let index = ability.subEffects.findIndex(x => x.id == object.id)
                        if (index == -1)
                            this.updateEntryRecursive(ability.subEffects, object)
                        else {
                            ability.subEffects[index] = object
                            this.updateCharacterSheet()
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
                //By setting characterSheet here it forces all computed variables and watch methods to run
                this.characterSheet = JSON.parse(JSON.stringify(this.character))
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
                navigator.clipboard.writeText(this.copyAllGet())
            },
            copyAllGet() {
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

                return copyText
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
            rerollSelectedCheck(type) {
                let indexes = []

                if (type == 'blessed') {
                    indexes = [this.abilityDialog.check.blessed.selectedReroll]
                    this.abilityDialog.check.blessed.selectedReroll = null
                    this.abilityDialog.check.blessed.used = true
                }
                if (type == 'cursed') {
                    indexes = [+this.abilityDialog.check.cursed.oldDiePosition - 1]
                }
                if (type == 'luck') {
                    indexes = this.abilityDialog.check.selectedRerolls.sort().reverse()
                    this.abilityDialog.check.selectedRerolls = []
                    this.characterSheet.rerolls--
                    this.updateRerolls++
                }

                indexes.forEach(i => {
                    this.abilityDialog.check.diceResults.splice(i, 1)
                })

                let rdResults = this.rollDice(indexes.length)
                if (type == 'cursed')
                    this.abilityDialog.check.cursed.newDie = rdResults.diceResults[0]
                this.abilityDialog.check.diceResults = this.abilityDialog.check.diceResults.concat(rdResults.diceResults)

                this.abilityDialog.check.successes = 0
                this.abilityDialog.check.successesInput = 0

                this.abilityDialog.check.diceResults.forEach(d => {
                    this.abilityDialog.check.successes += +this.determineSuccesses(d)
                    this.abilityDialog.check.successesInput += +this.determineSuccesses(d)
                })
            },
            rerollWholeCheck() {
                this.rollCheck(this.abilityDialog.check.diceCheckObject, true)
                this.characterSheet.rerolls--
                this.updateRerolls++
            },
            rollAbility(ability) {
                let diceToRoll = 0
                if (ability.characteristic)
                    diceToRoll += +this[ability.characteristic]
                if (ability.dice)
                    diceToRoll += +ability.dice
                this.rollCheck({
                    diceToRoll: diceToRoll,
                    isSkill: false,
                    successes: ability.successes
                }, false)
                this.abilityDialog.title = `${ability.name} Check Results`
                this.abilityDialog.isAbility = false
                this.abilityDialog.damage.show = false
                this.abilityDialog.save.show = false
            },
            rollCheck(diceCheckObject, isReroll) {
                var result = {
                    advantage: false,
                    blessed: {
                        used: (isReroll) ? this.abilityDialog.check.blessed.used : false,
                        selectedReroll: null
                    },
                    cursed: {
                        newDie: 0,
                        newSuccess: 0,
                        oldDie: 0,
                        oldDiePosition: 0
                    },
                    diceCheckObject: diceCheckObject,
                    diceResults: [],
                    effects: JSON.parse(JSON.stringify(this.universalEffects)),
                    fate: 0,
                    isReroll: isReroll,
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

                if (this.cursed && this.abilityDialog.check.successes && diceCheckObject.diceToRoll > 0 && !isReroll) {
                    this.abilityDialog.check.cursed.oldDie = this.abilityDialog.check.diceResults.filter(x => { return x > 3 })[0]
                    this.abilityDialog.check.cursed.oldDiePosition = this.abilityDialog.check.diceResults.indexOf(result.cursed.oldDie) + 1

                    this.rerollSelectedCheck('cursed')
                }

                this.abilityDialog.show = true
            },
            rollStandAloneCheck(diceCheckObject) {
                this.rollCheck(diceCheckObject, false)
                this.abilityDialog.effects = this.abilityDialog.check.effects
                this.abilityDialog.selectedEffects = []
                this.abilityDialog.usedEffects = []
                this.abilityDialog.damage.show = false
                this.abilityDialog.isAbility = false
                this.abilityDialog.save.show = false
                this.abilityDialog.title = diceCheckObject.name + ' Check Results'
                this.copyCheck()
                this.showSnackbar('Copied Check Results to Clipboard')
                this.$emit('logPushEmit', {
                    copyText: `&{template:default} {{name= ${this.abilityDialog.title}}} ${this.copyCheckGet()}`,
                    object: JSON.parse(JSON.stringify(this.abilityDialog)),
                    title: this.abilityDialog.title,
                    type: 'Check Result'
                })
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
                    if (this.generalDialog.buttonType == 'confirmOverwrite') {
                        this.saveCharacter()
                        this.generalDialog.show = false
                    }
                    if (this.generalDialog.buttonType == 'confirmFirebaseOverwrite') {
                        this.saveToFirebase('update')
                        this.generalDialog.show = false
                    }
                }
            },
            //Health Funcitons
            heal(damageObj) {
                let damage = (damageObj) ? damageObj.amount : this.damageToTake.amount
                if (damage) {
                    this.characterSheet.hp = +this.characterSheet.hp + +damage
                    this.updateHP = this.updateHP + 1
                }
            },
            takeDamage(damageObj) {
                let damage = (damageObj) ? damageObj.amount : this.damageToTake.amount
                let type = (damageObj) ? damageObj.amount : this.damageToTake.type
                let damageReductionAmount = 0;
                let isImmune = false
                let isResistant = false
                let isVulnerable = false

                this.damageGroups.forEach((group) => {
                    //check if type is in the group.types array
                    if (type == group.name || group.types.some(x => x.name == type)) {
                        let damageModifications = this.damageModifications
                            .filter(x => { return x.type == type || x.type == group.name })
                        isImmune = damageModifications.some(x => x.isImmunity)
                        isResistant = damageModifications.some(x => x.isResistance)
                        isVulnerable = damageModifications.some(x => x.isVulnerability)
                        damageReductionAmount = damageModifications
                            .reduce((previousValue, entry) => {
                                return +previousValue + +entry.amount
                            }, 0)
                    }
                })

                var damageToTake = damage - damageReductionAmount
                if (isImmune)
                    damageToTake = 0
                if (isResistant && !isVulnerable)
                    damageToTake = Math.floor(damageToTake / 2)
                if (isVulnerable && !isResistant)
                    damageToTake = damageToTake * 2

                if (damageToTake > 0) {
                    this.characterSheet.hp = this.characterSheet.hp - damageToTake
                    this.updateHP = this.updateHP + 1
                }
            },
            //Health Funcitons End
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
                    layout: '',
                    minionPanel: this.minionPanel,
                    movementPanel: this.movementPanel,
                    resourcePanel: this.resourcePanel,
                    skillPanel: this.skillPanel,
                    statusPanel: this.statusPanel,
                    traitPanel: this.traitPanel
                }
                this.$emit('saveOptionsEmit', options)
            },
            loadLog(log) {
                navigator.clipboard.writeText(log.copyText)
                this.showSnackbar(`Copied ${log.type} to Clipboard`)

                if (log.type == 'Mass Roller')
                    this.generalDialog = JSON.parse(JSON.stringify(log.object))
                if (log.type == 'Ability' || log.type == 'Check Result')
                    this.abilityDialog = JSON.parse(JSON.stringify(log.object))
            },
            massRollerResults(emitObject) {
                this.generalDialog = emitObject.generalDialog
                this.showSnackbar(emitObject.snackbarText)
                this.$emit('logPushEmit', emitObject.logObject)
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
                let char = (this.abilityDialog.ability.damage.characteristic) ? this.abilityDialog.ability.damage.characteristic : this.abilityDialog.ability.characteristic
                this.abilityDialog.damage = this.rollDamage(this.abilityDialog.damage.damage, false, char, true)
                //let damage = this.rollDamage(this.abilityDialog.damage.damage, false, null, true)

                //this.abilityDialog.damage.diceResults = this.abilityDialog.damage.diceResults.concat(damage.diceResults)
                //this.abilityDialog.damage.sum += +damage.sum
            },
            rollAbilityDamage(ability) {
                this.abilityDialog.ability = ability
                //TODO: move this char stuff to rollDamage function
                let char = (ability.damage.characteristic) ? ability.damage.characteristic : ability.characteristic
                this.abilityDialog.damage = this.rollDamage(ability.damage, ability.isMeleeAttack, char, false)
                this.abilityDialog.show = true
                this.abilityDialog.check.show = false
                this.abilityDialog.isAbility = false
                this.abilityDialog.save.show = false
                this.abilityDialog.title = `${ability.name} Damage Results`

            },
            rollDamage(damage, isMeleeAttack, characteristic, isCrit) {
                let damageObj = (isCrit) ? JSON.parse(JSON.stringify(this.abilityDialog.damage)) : {
                    atrophied: false,
                    char: 0,
                    damage: damage,
                    diceResults: [],
                    effects: [],
                    fit: 0,
                    flat: 0,
                    flatTotal: 0,
                    flatTotalBreakdown: '',
                    isCrit: false,
                    selectedRerolls: [],
                    show: true,
                    sum: 0,
                    types: []
                }

                //Roll Die
                if (damage.dice && !isNaN(damage.dice)) {
                    for (let i = 0; i < damage.dice; i++) {
                        damageObj.diceResults.push({
                            value: this.getRandomIntInclusive(1, 6),
                            type: (!isCrit) ? 'normal' : 'crit'
                        })
                    }
                }

                //Add Flat
                if ((!isCrit || (isCrit && damage.critFlat)) && (damage.flat > 0 && !isNaN(damage.flat))) {
                    damageObj.flat += +damage.flat
                    damageObj.flatTotal += +damage.flat
                }

                //Add Char
                if (!isCrit && characteristic) {
                    damageObj.char = this[characteristic]
                    damageObj.flatTotal += +damageObj.char
                }

                //Add Fit
                if (!isCrit && isMeleeAttack && !damage.types.includes('Healing')) {
                    damageObj.fit = this.fitness
                    damageObj.flatTotal += +damageObj.fit
                }

                //Set info text
                damageObj.flatTotalBreakdown = ''
                damageObj.flatTotalBreakdown += (damageObj.flat) ? `Flat(${damageObj.flat}) + ` : ''
                damageObj.flatTotalBreakdown += (damageObj.char) ? `${characteristic.toUpperCase()}(${damageObj.char}) + ` : ''
                damageObj.flatTotalBreakdown += (damageObj.fit) ? `Melee FIT(${damageObj.fit})` : ''
                if (damageObj.flatTotalBreakdown.substring(damageObj.flatTotalBreakdown.length - 3) == ' + ')
                    damageObj.flatTotalBreakdown = damageObj.flatTotalBreakdown.substring(0, damageObj.flatTotalBreakdown.length - 3)

                //Add Crit Dice
                if (isCrit && damage.critDice && !isNaN(damage.critDice)) {
                    for (let i = 0; i < damage.critDice; i++) {
                        damageObj.diceResults.push({
                            value: this.getRandomIntInclusive(1, 6),
                            type: 'crit'
                        })
                    }
                }

                //Add Luck
                if (isCrit && !damageObj.isCrit) {
                    damageObj.isCrit = true
                    for (let i = 0; i < Math.floor(this.luck / 2); i++) {
                        damageObj.diceResults.push({
                            value: this.getRandomIntInclusive(1, 6),
                            type: 'luck'
                        })
                    }
                }

                if (!isCrit) {
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
                    damageObj.types = types
                    damageObj.effects = effects
                }

                if (isCrit && damage.critMax)
                    damageObj.diceResults.forEach(d => { d.value = 6 })

                damageObj.sum = +damageObj.diceResults.reduce((previousValue, entry) => {
                    return +previousValue + +entry.value
                }, 0) + +damageObj.flatTotal

                damageObj.atrophied = this.characterSheet.statuses.filter(x => { return x.status.name == 'Atrophied' && x.duration > 0 && x.isActive }).length > 0
                if (damageObj.atrophied)
                    damageObj.sum = Math.floor(damageObj.sum / 2)

                return damageObj
            },
            //Reroll Functions End
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
            updateCharacterSheet() {
                this.$emit('updateCharacterSheetEmit', JSON.parse(JSON.stringify(this.characterSheet)))
            },
            updatePanel(panelObj) {
                this[panelObj.name] = panelObj.value
            },
            updateProp(prop) {
                if (prop.type == 'number')
                    this.characterSheet[prop.propName] = +prop.value
                else
                    this.characterSheet[prop.propName] = prop.value
                this.updateCharacterSheet()
            },
            updateTier(type) {
                if ((type == 'add' && this.characterSheet.tier < 9) || (type == 'subtract' && this.characterSheet.tier > 0)) {
                    this.characterSheet.tier = (type == 'add') ? +this.characterSheet.tier + 1 : +this.characterSheet.tier - 1
                }
            },
            useAbility(ability) {
                if (ability.apCost != 0) {
                    this.subtractAP(ability.apCost)
                    this.abilityDialog.ap = ability.apCost
                } else
                    this.abilityDialog.ap = ''

                if (ability.characteristic || ability.dice)
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
                this.abilityDialog.check.show = (ability.characteristic || ability.dice)
                this.abilityDialog.damage.show = (ability.damage.dice > 0 || ability.damage.flat > 0)
                this.abilityDialog.isAbility = true
                this.abilityDialog.selectedEffects = []
                this.abilityDialog.show = true
                this.abilityDialog.title = ability.name
                this.abilityDialog.usedEffects = []

                this.copyAll()

                this.showSnackbar('Copied Ability to Clipboard')

                this.$emit('logPushEmit', {
                    copyText: this.copyAllGet(),
                    object: JSON.parse(JSON.stringify(this.abilityDialog)),
                    title: this.abilityDialog.title,
                    type: 'Ability'
                })
            }
        },
        watch: {
            // Character Sheet Watch Start
            age() {
                this.updateCharacterSheet()
            },
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
            name() {
                this.updateCharacterSheet()
            },
            race() {
                this.updateCharacterSheet()
            },
            rerollsMax() {
                this.characterSheet.rerollsMax = this.rerollsMax
            },
            resistanceAdjustment() {
                this.characterSheet.resistanceAdjustment = this.resistanceAdjustment
            },
            size() {
                this.updateCharacterSheet()
            },
            speedAdjustment() {
                this.characterSheet.speedAdjustment = this.speedAdjustment
            },
            xp() {
                this.characterSheet.xp = this.xp
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
            logId() {
                this.loadLog(this.log)
            }
            //,
            //layout() {
            //    this.saveOptions()
            //}
            // Character Sheet Options Watch End
        }
    }
</script>