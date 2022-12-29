<template>
    <div>
        <h1 class="text-center">DM Page</h1>

        <v-card>
            <v-card-title>
                Mass Roller
            </v-card-title>
            <v-card-text>
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
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Enemy Manager
            </v-card-title>
            <v-card-text>
                <v-select v-model="selectedTemplate"
                          :items="enemyTemplates.map(x => ({ value: x, text: x.name}))"
                          label="Add Enemy from Templates">
                    <v-icon color="primary"
                            slot="prepend"
                            @click.stop="addEntry({arrayName:'minions', object: selectedTemplate})"
                            :disabled="!selectedTemplate">
                        mdi-plus
                    </v-icon>
                </v-select>
                <MinionSection :clear-character="clearCharacter"
                               :minions="minionsComp"
                               :panel-prop="minionPanel"
                               :key="updateMinions"
                               @addEntryEmit="addEntry($event)"
                               @deleteEntryEmit="deleteEntry($event)"
                               @rollDiceCheckEmit="rollStandAloneCheck($event)"
                               @updateEntryEmit="updateMinion($event)"
                               @updateEntryBypassEmit="updateEntry($event)"
                               @updatePanelEmit="updatePanel($event)"></MinionSection>
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title>
                Statuses
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="statusSearch"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details></v-text-field>
                <v-data-table :headers="statusHeaders" :items="statuses" :search="statusSearch">
                    <template v-slot:top="{ pagination, options, updateOptions }">
                        <v-data-footer :pagination="pagination"
                                       :options="options"
                                       @update:options="updateOptions"
                                       items-per-page-text="$vuetify.dataTable.itemsPerPageText" />
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>


        <v-card>
            <v-card-title>
                Damage Types and Effects
            </v-card-title>
            <v-card-text>
                <v-expansion-panels multiple>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3 class="text-center">
                                <v-icon>mdi-vector-circle</v-icon>
                                Universal Effects
                            </h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                                <v-data-table :headers="effectHeaders" :items="universalEffects"></v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel v-for="d in damageGroups" color="d.color" :key="d.name">
                        <v-expansion-panel-header>
                            <h3 class="text-center">
                                <v-icon :color="d.color">{{d.icon}}</v-icon>
                                {{d.name}}
                            </h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-data-table v-if="d.effects.length" :headers="effectHeaders" :items="d.effects"></v-data-table>
                            <div v-for="t in d.types" :key="t.name">
                                <v-row>
                                    <v-col cols="3">
                                        <v-icon :color="d.color">{{t.icon}}</v-icon>
                                        {{t.name}}
                                    </v-col>
                                    <v-col cols="9">
                                        <v-data-table :headers="effectHeaders" :items="t.effects"></v-data-table>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>        

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
    import MinionSection from './MinionSection.vue'
    import { useCharacterStore } from '@/stores/CharacterStore'
    import { useGameDataStore } from '@/stores/GameDataStore'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'DMComponent',
        components: {
            MinionSection
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
            minionsComp() {
                let minions = []

                this.minions.forEach((e, i) => {
                    let enemy = JSON.parse(JSON.stringify(e))
                    enemy.key = i + e.id + e.name + this.updateMinions
                    minions.push(enemy)
                })

                return minions
            }
        },
        data() {
            return {
                clearCharacter: this.characterStore.getCharacterById('clear'),
                damageGroups: this.gameDataStore.damageGroups,
                effectHeaders: [
                    {
                        sortable: false,
                        text: 'Cost',
                        value: 'cost'
                    },
                    {
                        sortable: false,
                        text: 'Description',
                        value: 'description'
                    }
                ],
                enemyTemplates: [{ "id": "5d5532a7-d328-4618-9d4e-c86f3a98e091", "age": 0, "ap": 0, "apMax": 6, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 2, "bpIncreases": 0, "fitness": "3", "fitnessAdjustment": 0, "speed": "3", "speedAdjustment": 0, "intelligence": "2", "intelligenceAdjustment": 0, "cunning": "2", "cunningAdjustment": 0, "resistance": 2, "resistanceAdjustment": 0, "luck": "2", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 10, "hpIncreases": 0, "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 5, "name": "Grunt (Melee)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 2, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "daccb41b-c930-483f-851e-facd099a6a59", "inClass": true, "isAbilityArray": false, "isMeleeAttack": true, "maxSizeCategoryOfMass": 0, "name": "Melee Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "3Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0fitness0Instant0daccb41b-c930-483f-851e-facd099a6a59truefalsetrue0Melee AttackPhysical00false30[]{\"dice\":\"1\",\"flat\":\"2\",\"types\":[\"Physical\"]}[]0" }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [{ "amount": "2", "description": "", "id": "c6ee4167-7675-43e1-b46f-228b7a48d13e", "isBuff": false, "isDefault": false, "type": "Land Speed" }], "damageModifications": [], "resources": [], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "5d5532a7-d328-4618-9d4e-c86f3a98e091Grunt (Melee)0" }, { "id": "df4ebb3e-e45f-4367-b7da-9fc5ae043b0e", "age": 0, "ap": 0, "apMax": 6, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 2, "bpIncreases": 0, "fitness": "3", "fitnessAdjustment": 0, "speed": "3", "speedAdjustment": 0, "intelligence": "2", "intelligenceAdjustment": 0, "cunning": "2", "cunningAdjustment": 0, "resistance": "2", "resistanceAdjustment": 0, "luck": "2", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 10, "hpIncreases": 0, "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 3, "name": "Grunt (Ranged)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 2, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "38554021-b746-498d-a21e-eb94f5d72890", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Ranged Attack", "physMeta": "Physical", "range": "10", "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [], "damageModifications": [], "resources": [], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "df4ebb3e-e45f-4367-b7da-9fc5ae043b0eGrunt (Ranged)0" }, { "id": "9b81e68f-1295-465a-bb1b-d806734c1466", "age": 0, "ap": 0, "apMax": 8, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 3, "bpIncreases": 0, "fitness": "4", "fitnessAdjustment": 0, "speed": "4", "speedAdjustment": 0, "intelligence": "3", "intelligenceAdjustment": 0, "cunning": "3", "cunningAdjustment": 0, "resistance": "3", "resistanceAdjustment": 0, "luck": "3", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 25, "hpIncreases": 10, "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 8, "name": "Troop (Light)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 3, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "efbf7f73-bbbc-413d-8425-67b3560b906a", "inClass": true, "isAbilityArray": false, "isMeleeAttack": true, "maxSizeCategoryOfMass": 0, "name": "Melee Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "1866052a-8434-4ff4-bae7-0fc631079287", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Ranged Attack", "physMeta": "Physical", "range": "15", "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "b9b49b1a-e10e-4657-a710-607bd28e0fe0", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to trigger an 8 square move as a 0 AP action", "dice": 0, "duration": "Instant", "handedness": 0, "id": "4d5279f4-e78c-4542-bfd5-94b58943fd7e", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Movement Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Spend 1 CR to trigger an 8 square move as a 0 AP action0Instant04d5279f4-e78c-4542-bfd5-94b58943fd7etruefalsefalse0Movement BurstPhysical00false30[]{\"dice\":0,\"flat\":0,\"types\":[]}[]0" }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "b9b49b1a-e10e-4657-a710-607bd28e0fe0", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to add 1 AC as a reaction when attacked", "dice": 0, "duration": "Instant", "handedness": 0, "id": "c05747e3-38dd-491b-8982-c9a6d645a17c", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Evasive Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Spend 1 CR to add 1 AC as a reaction when attacked0Instant0c05747e3-38dd-491b-8982-c9a6d645a17ctruefalsefalse0Evasive BurstPhysical00false30[]{\"dice\":0,\"flat\":0,\"types\":[]}[]0" }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [{ "amount": "4", "description": "", "id": "60af82c9-f599-4086-88d4-79962aea02b9", "isBuff": false, "isDefault": false, "type": "Land Speed" }], "damageModifications": [], "resources": [{ "amount": 0, "amountMax": 4, "id": "b9b49b1a-e10e-4657-a710-607bd28e0fe0", "name": "Light", "characteristic": "fitness", "resourceIncreases": 0, "key": "Lightfitness0420" }], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "9b81e68f-1295-465a-bb1b-d806734c1466Troop (Light)0" }, { "id": "5f828421-259d-4f35-9256-9a832090b450", "age": 0, "ap": 0, "apMax": 8, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 3, "bpIncreases": 0, "fitness": "4", "fitnessAdjustment": 0, "speed": "4", "speedAdjustment": 0, "intelligence": "3", "intelligenceAdjustment": 0, "cunning": "3", "cunningAdjustment": 0, "resistance": "3", "resistanceAdjustment": 0, "luck": "3", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 30, "hpIncreases": 15, "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 5, "name": "Troop (Damage)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 3, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "2", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "5d758964-1f3f-456f-9f4f-bd33c48735d8", "inClass": true, "isAbilityArray": false, "isMeleeAttack": true, "maxSizeCategoryOfMass": 0, "name": "Melee Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "3Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0fitness0Instant05d758964-1f3f-456f-9f4f-bd33c48735d8truefalsetrue0Melee AttackPhysical00false30[]{\"dice\":\"1\",\"flat\":\"2\",\"types\":[]}[]0" }, { "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "2", "flat": "2", "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "1a5a33d0-31b3-494e-a590-4d6d13a67d4a", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Ranged Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "3Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0fitness0Instant01a5a33d0-31b3-494e-a590-4d6d13a67d4atruefalsefalse0Ranged AttackPhysical00false30[]{\"dice\":\"1\",\"flat\":\"2\",\"types\":[]}[]0" }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "54d1a74f-78b4-4fd8-a13c-b7ba34616a1d", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": "", "damage": { "dice": "1", "flat": 0, "types": [] }, "description": "Spend 1 CR to add 1d6 damage to the next attack", "dice": 0, "duration": "Instant", "handedness": 0, "id": "93cbbd4a-086a-4043-a47f-4df89e1241c4", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Damage Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Spend 1 CR to add 1d6 damage to the next attack0Instant093cbbd4a-086a-4043-a47f-4df89e1241c4truefalsefalse0Damage BurstPhysical00false30[]{\"dice\":\"1\",\"flat\":0,\"types\":[]}[]0" }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "54d1a74f-78b4-4fd8-a13c-b7ba34616a1d", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": null, "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to add +1 success to the next attack", "dice": 0, "duration": "Instant", "handedness": 0, "id": "f597c90f-321a-484e-8a84-f2b172df7401", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Accuracy Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": "1", "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0nullSpend 1 CR to add +1 success to the next attack0Instant0f597c90f-321a-484e-8a84-f2b172df7401truefalsefalse0Accuracy BurstPhysical01false30[]{\"dice\":0,\"flat\":0,\"types\":[]}[]0" }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [{ "amount": "1", "description": "", "id": "88648f97-f8ac-484e-8e89-449f37007612", "isBuff": false, "isDefault": false, "type": "Land Speed" }], "damageModifications": [], "resources": [{ "amount": 0, "amountMax": 0, "id": "54d1a74f-78b4-4fd8-a13c-b7ba34616a1d", "name": "Damage", "characteristic": "fitness", "resourceIncreases": 0 }], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "5f828421-259d-4f35-9256-9a832090b450Troop (Damage)0" }, { "id": "09aceb4d-2666-4144-9b78-8986d81daa60", "age": 0, "ap": 0, "apMax": 8, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 3, "bpIncreases": 0, "fitness": "4", "fitnessAdjustment": 0, "speed": "4", "speedAdjustment": 0, "intelligence": "3", "intelligenceAdjustment": 0, "cunning": "3", "cunningAdjustment": 0, "resistance": "3", "resistanceAdjustment": 0, "luck": "3", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 35, "hpIncreases": "20", "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 6, "name": "Troop (Vanguard)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 3, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": 0, "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "b64cdce9-4558-40ab-8fcf-4cc2e436e09f", "inClass": true, "isAbilityArray": false, "isMeleeAttack": true, "maxSizeCategoryOfMass": 0, "name": "Melee Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": 0, "types": [] }, "description": "", "dice": 0, "duration": "Instant", "handedness": 0, "id": "f7953184-2cb9-41a8-a8cb-bad8812a62c7", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Ranged Attack", "physMeta": "Physical", "range": "15", "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": "2", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Choose a target to bodyguard for 1 round, must be in melee", "dice": 0, "duration": "1 Round", "handedness": 0, "id": "f554956b-d80c-48f0-aeca-8e81a8627f0f", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Bodyguard", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "ba17cfbe-d182-4d14-8044-f001c03b74c2", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to add 5 DR to primary DR type for a round", "dice": 0, "duration": "Instant", "handedness": 0, "id": "e9bf9612-274f-4852-9ad6-147e8b837cf4", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "DR Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Spend 1 CR to add 5 DR to primary DR type for a round0Instant0e9bf9612-274f-4852-9ad6-147e8b837cf4truefalsefalse0DR BurstPhysical00false30[]{\"dice\":0,\"flat\":0,\"types\":[]}[]0" }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "ba17cfbe-d182-4d14-8044-f001c03b74c2", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": "1", "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to move 3 squares towards an ally and use Bodyguard as a reaction", "dice": 0, "duration": "Instant", "handedness": 0, "id": "5428063e-5769-4053-a96e-d266e4d3ea59", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Protection Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "0Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Spend 1 CR to move 3 squares towards an ally and use Bodyguard as a reaction0Instant05428063e-5769-4053-a96e-d266e4d3ea59truefalsefalse0Protection BurstPhysical00false30[]{\"dice\":0,\"flat\":0,\"types\":[]}[]0" }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [{ "amount": "2", "description": "", "id": "bcf76d73-5914-4a9c-93b9-643e4760e5e2", "isBuff": false, "isDefault": false, "type": "Land Speed" }], "damageModifications": [], "resources": [{ "amount": 0, "amountMax": 0, "id": "ba17cfbe-d182-4d14-8044-f001c03b74c2", "name": "Vanguard", "characteristic": "fitness", "resourceIncreases": 0 }], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "09aceb4d-2666-4144-9b78-8986d81daa60Troop (Vanguard)0" }, { "id": "71b899b1-5a5e-4b1d-99c8-33437e0aad6e", "age": 0, "ap": 0, "apMax": 8, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 3, "bpIncreases": 0, "fitness": "3", "fitnessAdjustment": 0, "speed": "4", "speedAdjustment": 0, "intelligence": "4", "intelligenceAdjustment": 0, "cunning": "4", "cunningAdjustment": 0, "resistance": "3", "resistanceAdjustment": 0, "luck": "3", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 25, "hpIncreases": "10", "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 3, "name": "Troop (Controller)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 3, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [{ "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "3", "types": [] }, "description": "Applies a weak status on hit (up to 80 xp), 3 round duration", "dice": 0, "duration": "Instant", "handedness": 0, "id": "69b897c9-e8c6-43eb-b0b7-25cb23c6e6c5", "inClass": true, "isAbilityArray": false, "isMeleeAttack": true, "maxSizeCategoryOfMass": 0, "name": "Melee Attack", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": 3, "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "fitness", "damage": { "dice": "1", "flat": "3", "types": [] }, "description": "Applies a weak status on hit (up to 80 xp), 3 round duration", "dice": 0, "duration": "Instant", "handedness": 0, "id": "e8783fab-2587-4de1-a33f-26f1adc78bbf", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Ranged Attack", "physMeta": "Physical", "range": "15", "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "3Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0fitness0Instant0e8783fab-2587-4de1-a33f-26f1adc78bbftruefalsefalse0Ranged AttackPhysical150false30[]{\"dice\":\"1\",\"flat\":\"3\",\"types\":[]}[]0" }, { "apCost": "2", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Applies a status with RES DC 4", "dice": 0, "duration": "Instant", "handedness": 0, "id": "2901a348-d988-4d93-8bb8-340c128208c6", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Save Attack", "physMeta": "Physical", "range": "15", "save": true, "saveAmount": "3", "saveCharacteristic": "resistance", "successes": 0, "xpCost": 0, "components": [], "subEffects": [], "key": "2Single Targetfalse{\"alpha\":1,\"hex\":\"#000000\",\"hexa\":\"#000000FF\",\"hsla\":{\"h\":0,\"s\":0,\"l\":0,\"a\":1},\"hsva\":{\"h\":0,\"s\":0,\"v\":0,\"a\":1},\"hue\":0,\"rgba\":{\"r\":0,\"g\":0,\"b\":0,\"a\":1}}0Applies a status with RES DC 40Instant02901a348-d988-4d93-8bb8-340c128208c6truefalsefalse0Save AttackPhysical150true4resistance0[]{\"dice\":0,\"flat\":0,\"types\":[]}[]01" }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to increase a status duration by 2 rounds", "dice": 0, "duration": "Instant", "handedness": 0, "id": "396cb7f7-1958-4dcb-bf9a-3fb15bc4e231", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Affliction Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }, { "apCost": "0", "areaOfEffect": "Single Target", "boughtForFree": false, "canEdit": true, "classResource": "", "color": { "alpha": 1, "hex": "#000000", "hexa": "#000000FF", "hsla": { "h": 0, "s": 0, "l": 0, "a": 1 }, "hsva": { "h": 0, "s": 0, "v": 0, "a": 1 }, "hue": 0, "rgba": { "r": 0, "g": 0, "b": 0, "a": 1 } }, "crCost": 0, "characteristic": "", "damage": { "dice": 0, "flat": 0, "types": [] }, "description": "Spend 1 CR to add +1 DC to a save", "dice": 0, "duration": "Instant", "handedness": 0, "id": "2adaef8b-6da9-4af3-9daa-1f42fde31449", "inClass": true, "isAbilityArray": false, "isMeleeAttack": false, "maxSizeCategoryOfMass": 0, "name": "Difficulty Burst", "physMeta": "Physical", "range": 0, "save": false, "saveAmount": 3, "saveCharacteristic": "", "successes": 0, "xpCost": 0, "components": [], "subEffects": [] }], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [], "damageModifications": [], "resources": [], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "71b899b1-5a5e-4b1d-99c8-33437e0aad6eTroop (Controller)0" }, { "id": "99bc07cf-c830-48f7-9a59-5476c6e6d5ad", "age": 0, "ap": 0, "apMax": 8, "attunementSlots": 10, "attunementSlotsIncreases": 0, "attunementSlotsMax": 10, "background": "", "bp": 0, "bpMax": 4, "bpIncreases": 0, "fitness": "3", "fitnessAdjustment": 0, "speed": "4", "speedAdjustment": 0, "intelligence": "3", "intelligenceAdjustment": 0, "cunning": "4", "cunningAdjustment": 0, "resistance": "4", "resistanceAdjustment": 0, "luck": "3", "luckAdjustment": 0, "dcToHit": 3, "dcToHitIncreases": 0, "hp": 0, "hpMax": 25, "hpIncreases": "5", "initiative": 0, "initiativeIncreases": 0, "level": 0, "luckFavored": false, "luckIllFavored": false, "luckNothingToChance": false, "money": 0, "movement": 3, "name": "Troop (Healer)", "race": "", "tier": 0, "rerolls": 0, "rerollsMax": 0, "rerollsIncreases": 0, "size": 1, "speedPreperationIsKey": false, "xp": 0, "xpEarned": 0, "xpTotal": 0, "abilities": [], "buffs": [], "classes": [], "equipment": [], "flaws": [], "minions": [], "movements": [], "damageModifications": [], "resources": [], "skills": [{ "characteristic": "intelligence", "default": true, "id": "1654717712607", "name": "Analyze", "skillIncreases": 0, "value": 0, "adjustment": 0 }, { "characteristic": "fitness", "default": true, "id": "1", "name": "Athletics", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "2", "name": "Deception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "3", "name": "Perception", "skillIncreases": 0, "value": 0 }, { "characteristic": "cunning", "default": true, "id": "4", "name": "Persuasion", "skillIncreases": 0, "value": 0 }, { "characteristic": "fitness", "default": true, "id": "5", "name": "Stealth", "skillIncreases": 0, "value": 0 }], "statuses": [], "traits": [], "journalEntries": [], "key": "99bc07cf-c830-48f7-9a59-5476c6e6d5adTroop (Healer)0" }],
                generalDialog: {
                    buttonText: '',
                    buttonType: '',
                    html: '',
                    show: false,
                    text: '',
                    title: ''
                },
                massRoller: {
                    dice: 0,
                    enemies: 0,
                    luck: 0,
                    results: [],
                    show: false,
                    successesRequired: 0
                },
                minions: [],
                minionPanel: null,
                selectedTemplate: null,
                snackbar: {
                    show: false,
                    text: ''
                },
                statuses: this.gameDataStore.statuses,
                statusHeaders: [
                    {
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        text: 'Effect',
                        value: 'effect'
                    },
                    {
                        text: 'Type',
                        value: 'type'
                    },
                    {
                        text: 'XP Cost',
                        value: 'cost'
                    }
                ],
                statusSearch: '',
                universalEffects: this.gameDataStore.universalEffects,
                updateMinions: 0
            }
        },
        methods: {
            addEntry(object) {
                let minion = JSON.parse(JSON.stringify(object.object))
                minion.id = uuidv4()
                this[object.arrayName].push(minion)
                if (object.arrayName == 'minions' && this.minionPanel !== 0) {
                    this.minionPanel = 0
                    this.updateMinions++
                }
            },
            deleteEntry(object) {
                this[object.arrayName] = this[object.arrayName].filter(x => { return x.id != object.object.id })
            },
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
                    let copyText = `&{template:default} {{name= Mass Roller}}`
                    let copyTextEnd = ''
                    let successesRequired = (!isNaN(this.massRoller.successesRequired) && this.massRoller.successesRequired > 0)
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

                        if (successesRequired)
                            result.succeeded = result.successes >= this.massRoller.successesRequired

                        this.generalDialog.html += '<div><div><b>Successes: ' + result.successes + '</b></div>' +
                            '<div> Fate: ' + result.fate + '</div>' +
                            '<div> Dice Results: [' + result.diceResults.join(', ') + ']</div>';

                        copyTextEnd += `{{Enemy ${i + 1} Successes = ${result.successes}}}`
                        if (successesRequired && !result.succeeded && result.threat)
                            copyTextEnd += `{{Enemy ${i + 1} Crit Failed = }}`

                        this.massRoller.results.push(result)
                    }
                    let successes = this.massRoller.results.filter(x => { return x.succeeded }).length
                    let critFailures = (successesRequired) ? this.massRoller.results.filter(x => { return !x.succeeded && x.threat }).length : 0
                    if (successesRequired) {
                        if (critFailures)
                            this.generalDialog.html = `<div><b>Enemies Crit Failed: ${critFailures}</b></div>` + this.generalDialog.html

                        this.generalDialog.html = `<div><b>Enemies Succeeded: ${successes}</b></div>` + this.generalDialog.html
                        copyText += `{{Enemies Succeeded= ${successes}}}`

                        if (critFailures)
                            copyText += `{{Enemies Crit Failed= ${critFailures}}}`
                    }

                    copyText += copyTextEnd

                    navigator.clipboard.writeText(copyText)
                    this.showSnackbar('Copied Mass Roller Results to Clipboard')

                    this.generalDialog.show = true

                    this.$emit('logPushEmit', {
                        copyText: copyText,
                        object: JSON.parse(JSON.stringify(this.generalDialog)),
                        title: 'Mass Roller',
                        type: 'Mass Roller'
                    })
                }
            },
            showSnackbar(text) {
                this.snackbar = {
                    show: true,
                    text: text
                }
            },
            updateEntry(object) {
                let entriesDup = this[object.arrayName]
                let index = entriesDup.findIndex(x => x.id == object.object.id)

                if (index > -1)
                    entriesDup[index] = object.object

                this[object.arrayName] = []
                this[object.arrayName] = entriesDup
            },
            updateMinion(object) {
                this.updateMinions++
                this.updateEntry(object)
            },
            updatePanel(panelObj) {
                this[panelObj.name] = panelObj.value
            }
        }
    }
</script>