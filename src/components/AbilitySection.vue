<template>
    <div>
        <template>
            <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <h3 class="text-center">
                            Abilities
                            <v-btn icon color="primary"
                                   @click.stop="addDialog">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h3>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Filter Abilities"
                                              v-model="filterText"
                                              clearable>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-data-table :headers="headers"
                                              :items="abilities"
                                              :search="filterText"
                                              item-key="key"
                                              show-expand
                                              multi-sort
                                              dense>
                                    <template v-slot:[`item.minionName`]="{ item }">
                                        <TooltipComponent :text="item.description"></TooltipComponent>
                                        {{item.name}}
                                    </template>
                                    <template v-slot:[`item.classResourceCombined`]="{ item }">
                                        {{getClassResource(item)}}
                                    </template>
                                    <template v-slot:[`item.damageSection`]="{ item }">
                                        <TooltipComponent v-if="getDamage(item).length" :text="getDamageTypes(item)"></TooltipComponent>
                                        {{getDamage(item)}}
                                    </template>
                                    <template v-slot:[`item.use`]="{ item }">
                                        <v-btn :color="useButtonColor(item)" @click="useAbility(item)" x-small>
                                            Use
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.edit`]="{ item }">
                                        <v-icon small color="primary" class="mr-2"
                                                v-if="item.canEdit"
                                                @click="updateDialog(JSON.parse(JSON.stringify(item)))">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <template v-slot:[`item.delete`]="{ item }">
                                        <v-icon small color="error"
                                                v-if="item.canEdit"
                                                @click="deleteDialog(item)">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <template v-slot:[`item.copy`]="{ item }">
                                        <v-icon small color="primary"
                                                v-if="item.canEdit"
                                                @click="duplicateAbility(item)">
                                            mdi-content-copy
                                        </v-icon>
                                    </template>
                                    <template v-slot:[`expanded-item`]=" { item }">
                                        <td :colspan="headers.length">
                                            <AbilityListItem :ability="item"
                                                             :ap="ap"
                                                             :characteristics="characteristics"
                                                             :characteristic-view-items="characteristicViewItems"
                                                             :damage-types="damageTypes"
                                                             :resources="resources"
                                                             :successes-from-intelligence="successesFromIntelligence"
                                                             @deleteEntryEmit="deleteDialog($event)"
                                                             @rollAbilityEmit="rollAbility($event)"
                                                             @rollDamageEmit="rollDamage($event)"
                                                             @subtractAP="subtractAP($event)"
                                                             @subtractCR="subtractCR($event)"
                                                             @updateDialogEmit="updateDialog($event)"
                                                             @updateEntryEmit="updateEntryBypass($event)"
                                                             @useAbility="useAbility($event)"></AbilityListItem>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500" scrollable>
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Ability
                        <template v-if="dialog.type == 'Add' || dialog.type == 'Edit'">
                            <v-spacer></v-spacer>
                            Available XP: {{xp}}
                        </template>
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Name *"
                                                  v-model="ability.name"
                                                  ref="name"
                                                  :rules="textRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field label="XP Cost *"
                                                  v-model="ability.xpCost"
                                                  type="number"
                                                  :rules="numberRules"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-switch label="Bought For Free" inset v-model="ability.boughtForFree"></v-switch>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Description" v-model="ability.description" auto-grow outlined rows="1"></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Check/Save Characteristic"
                                              :items="characteristics"
                                              v-model="ability.characteristic"
                                              clearable>
                                        <TooltipComponent slot="prepend" :text="'CHAR used to make check and gets added to damage.'"></TooltipComponent>
                                    </v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="Ability Dice" type="number" v-model="ability.dice"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-switch label="Target Saves" inset
                                              v-model="ability.save"></v-switch>
                                </v-col>
                                <template v-if="ability.save">
                                    <v-col cols="6">
                                        <v-text-field label="Save Amount"
                                                      v-model="ability.saveAmount"
                                                      type="number">
                                            <TooltipComponent slot="prepend" :text="'2 + CHAR/2 rounded up automatically added to save amount.'"></TooltipComponent>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select label="Target Save Characteristic"
                                                  :items="characteristics"
                                                  v-model="ability.saveCharacteristic"
                                                  :rules="textRules"
                                                  clearable></v-select>
                                    </v-col>
                                </template>
                                <v-card>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="12">
                                                <h3 class="text-center">
                                                    Damage
                                                </h3>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Dice" type="number" v-model="ability.damage.dice"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Flat" type="number" v-model="ability.damage.flat"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field label="Crit Dice" type="number" v-model="ability.damage.critDice"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-select label="Characteristic"
                                                          :items="characteristics"
                                                          v-model="ability.damage.characteristic"
                                                          clearable>
                                                    <TooltipComponent slot="prepend" :text="'CHAR added to damage, overrides Check/Save Characteristic value.'"></TooltipComponent>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-switch label="Melee Attack" inset v-model="ability.isMeleeAttack"></v-switch>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-switch label="Flat Damage Crits" inset v-model="ability.damage.critFlat"></v-switch>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-switch label="Max Crit" inset v-model="ability.damage.critMax"></v-switch>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-select label="Damage Types"
                                                          :items="damageTypes"
                                                          v-model="ability.damage.types"
                                                          multiple
                                                          :rules="textRules"
                                                          required></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-card>
                                <v-col cols="6" md="4">
                                    <v-text-field label="AP Cost" type="number" v-model="ability.apCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Class Resource"
                                              :items="resources.map((x) => ({ value: x.id, text: x.name }))"
                                              v-model="ability.classResource"
                                              clearable></v-select>
                                </v-col>
                                <v-col cols="6" md="4" v-if="ability.classResource">
                                    <v-text-field label="Class Resource Cost" type="number" v-model="ability.crCost"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Duration" v-model="ability.duration"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Range" type="number" v-model="ability.range"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Area of Effect" v-model="ability.areaOfEffect"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-switch label="In Class" inset v-model="ability.inClass"></v-switch>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-select label="Physical/Meta *"
                                              :items="physMetaOptions"
                                              v-model="ability.physMeta"
                                              :rules="textRules"
                                              required></v-select>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Successes" type="number" v-model="ability.successes"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Handedness" type="number" v-model="ability.handedness"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-switch label="Ability Array" inset v-model="ability.isAbilityArray"></v-switch>
                                </v-col>
                                <v-col cols="6" md="4">
                                    <v-text-field label="Max Size Category Of Mass" type="number" v-model="ability.maxSizeCategoryOfMass"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select label="Use Modes" :items="useModes" v-model="ability.useModes" multiple clearable></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <template>
                                        <v-expansion-panels v-model="componentsPanel">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">
                                                        Components
                                                        <v-btn icon color="primary"
                                                               @click.stop="addComponent">
                                                            <v-icon>
                                                                mdi-plus
                                                            </v-icon>
                                                        </v-btn>
                                                    </h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <div v-for="(c, index) in ability.components" :key="index">
                                                        <v-autocomplete label="Effect"
                                                                        :items="effects.map((x) => ({ value: x, text: x.name}))"
                                                                        v-model="c.effect">
                                                            <v-icon color="error" slot="append" @click="deleteComponent(index)">mdi-delete</v-icon>
                                                        </v-autocomplete>
                                                        <v-textarea label="Description"
                                                                    v-model="c.effect.description" disabled
                                                                    auto-grow outlined rows="1"></v-textarea>
                                                        <v-textarea label="XP Cost"
                                                                    v-model="c.effect.xpCost" disabled
                                                                    auto-grow outlined rows="1"></v-textarea>
                                                        <v-row>
                                                            <v-col cols="6">
                                                                <v-text-field label="Category" v-model="c.effect.category" disabled></v-text-field>
                                                            </v-col>
                                                            <v-col cols="6">
                                                                <v-text-field label="Duration" v-model="c.effect.duration" disabled></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12">
                                                                <v-textarea label="Notes"
                                                                            v-model="c.Notes"
                                                                            auto-grow outlined rows="1"></v-textarea>
                                                            </v-col>
                                                            <v-col cols="4">
                                                                <v-text-field label="Flat Cost" type="number" v-model="c.flatCost"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="4">
                                                                <v-text-field label="Upcharge" type="number" v-model="c.upcharge"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="4">
                                                                <v-text-field label="Discount" type="number" v-model="c.discount"></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                    <v-row>
                                                        <v-col>
                                                            <v-text-field label="Flat Costs" v-model="flatXpCosts" disabled readonly>
                                                                <TooltipComponent slot="append" :text="'Minimum 10'"></TooltipComponent>
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col>
                                                            <v-text-field label="Upcharges" v-model="upcharges" disabled readonly></v-text-field>
                                                        </v-col>
                                                        <v-col>
                                                            <v-text-field label="Discounts" v-model="discounts" disabled readonly>
                                                                <TooltipComponent slot="append" :text="'Max 90'"></TooltipComponent>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-text-field label="Calculated XP Cost" v-model="xpCost" disabled readonly>
                                                        <TooltipComponent slot="append" :text="'Calculated XP: Minimum 10, not automatically applied to Ability XP Cost'"></TooltipComponent>
                                                    </v-text-field>
                                                    <RefundedXP v-if="tier" :tier="tier" :xp-cost="xpCost"></RefundedXP>

                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
                                </v-col>
                                <v-col cols="12">
                                    <template>
                                        <v-expansion-panels v-model="subEffectPanel">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">
                                                        <!-- Have section name change based on isAbilityArray field -->
                                                        Sub Effects/Array Element
                                                        <v-btn v-if="dialog.type == 'Edit' || dialog.type == 'Add'" icon color="primary"
                                                               @click.stop="addSubEffect">
                                                            <v-icon>
                                                                mdi-plus
                                                            </v-icon>
                                                        </v-btn>
                                                    </h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-row v-for="(s, index) in ability.subEffects" :key="index">
                                                        <v-col cols="12">
                                                            <v-text-field label="Name *" v-model="s.name" :rules="textRules" required>
                                                                <TooltipComponent slot="prepend" :text="'Sub Effect can be edited in Parent once it is saved.'"></TooltipComponent>
                                                                <v-icon color="error" slot="append" @click="deleteSubEffect(index)">mdi-delete</v-icon>
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <template>
                                        <v-expansion-panels>
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">
                                                        Border Color
                                                    </h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-color-picker dot-size="15"
                                                                    hide-inputs
                                                                    v-model="ability.color"></v-color-picker>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry()">Save</v-btn>
                        <v-btn color="secondary"
                               @click="dialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import AbilityListItem from './AbilityListItem.vue'
    import RefundedXP from './RefundedXP.vue'
    import TooltipComponent from './TooltipComponent.vue'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'AbilitySection',
        components: {
            AbilityListItem,
            RefundedXP,
            TooltipComponent
        },
        props: {
            abilities: Array,
            ap: Number,
            characteristics: Array,
            characteristicViewItems: Array,
            damageTypes: Array,
            effects: Array,
            layout: String,
            panelProp: Number,
            resources: Array,
            successesFromIntelligence: Number,
            tier: Number,
            xp: Number
        },
        computed: {
            filteredAbilities() {
                let abilities = this.abilities

                if (this.filterText && this.filterText.trim().length != 0)
                    abilities = abilities.filter(x => {
                        return (
                            x.name.toUpperCase().includes(this.filterText.toUpperCase()) ||
                            x.description.toUpperCase().includes(this.filterText.toUpperCase())
                        )
                    })

                return abilities
            },
            discounts() {
                let discounts = this.ability.components.reduce((previousValue, entry) => {
                    return +previousValue + +entry.discount
                }, 0)
                return discounts > 90 ? 90 : discounts
            },
            flatXpCosts() {
                let flatXpCosts = this.ability.components.reduce((previousValue, entry) => {
                    return +previousValue + +entry.flatCost
                }, 0)
                return flatXpCosts < 10 ? 10 : flatXpCosts
            },
            headers() {
                let headers = []
                if (this.layout != 'Minion')
                    headers = [
                        { text: 'Name', value: 'name' },
                        { text: 'AP', value: 'apCost' },
                        { text: 'Resource', value: 'classResourceCombined', sortable: false },
                        { text: 'Range', value: 'range' },
                        { text: 'Damage', value: 'damageSection', sortable: false },
                        { text: 'AoE', value: 'areaOfEffect' },
                        { text: 'Description', value: 'description' },
                        { text: 'Use', value: 'use', sortable: false },
                        { text: '', value: 'edit', sortable: false },
                        { text: '', value: 'delete', sortable: false },
                        { text: '', value: 'copy', sortable: false },
                        { text: '', value: 'data-table-expand' }
                    ]
                else
                    headers = [
                        { text: 'Name', value: 'minionName' },
                        { text: 'AP', value: 'apCost' },
                        { text: 'Resource', value: 'classResourceCombined', sortable: false },
                        { text: 'Range', value: 'range' },
                        { text: 'Damage', value: 'damageSection', sortable: false },
                        { text: 'AoE', value: 'areaOfEffect' },
                        { text: 'Use', value: 'use', sortable: false },
                        { text: '', value: 'edit', sortable: false },
                        { text: '', value: 'delete', sortable: false },
                        { text: '', value: 'copy', sortable: false },
                        { text: '', value: 'data-table-expand' }
                    ]
                return headers
            },
            upcharges() {
                let upcharges = this.ability.components.reduce((previousValue, entry) => {
                    return +previousValue + +entry.upcharge
                }, 0) / 100 + 1
                return upcharges
            },
            xpCost() {
                let xpCost = 0

                let calculatedCost = Math.floor(this.flatXpCosts * this.upcharges * (1 - (this.discounts / 100)))
                xpCost = calculatedCost < 10 ? 10 : calculatedCost

                return xpCost
            }
        },
        data() {
            return {
                // Input Fields Start
                ability: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    canEdit: true,
                    classResource: '',
                    color: { alpha: 1, hex: "#000000", hexa: "#000000FF", hsla: { h: 0, s: 0, l: 0, a: 1 }, hsva: { h: 0, s: 0, v: 0, a: 1 }, hue: 0, rgba: { r: 0, g: 0, b: 0, a: 1 } },
                    crCost: 0,
                    characteristic: '',
                    damage: {
                        characteristic: '',
                        critDice: 0,
                        critFlat: false,
                        critMax: false,
                        dice: 0,
                        flat: 0,
                        types: []
                    },
                    description: '',
                    dice: 0,
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    isMeleeAttack: false,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: 'Physical',
                    range: 0,
                    save: false,
                    saveAmount: 0,
                    saveCharacteristic: '',
                    successes: 0,
                    useModes: [],
                    xpCost: 0,
                    components: [],
                    subEffects: []
                },
                clearAbility: {
                    apCost: 3,
                    areaOfEffect: 'Single Target',
                    boughtForFree: false,
                    canEdit: true,
                    classResource: '',
                    color: { alpha: 1, hex: "#000000", hexa: "#000000FF", hsla: { h: 0, s: 0, l: 0, a: 1 }, hsva: { h: 0, s: 0, v: 0, a: 1 }, hue: 0, rgba: { r: 0, g: 0, b: 0, a: 1 } },
                    crCost: 0,
                    characteristic: '',
                    damage: {
                        characteristic: '',
                        critDice: 0,
                        critFlat: false,
                        critMax: false,
                        dice: 0,
                        flat: 0,
                        types: []
                    },
                    description: '',
                    dice: 0,
                    duration: 'Instant',
                    handedness: 0,
                    id: '',
                    inClass: true,
                    isAbilityArray: false,
                    isMeleeAttack: false,
                    maxSizeCategoryOfMass: 0,
                    name: '',
                    physMeta: 'Physical',
                    range: 0,
                    save: false,
                    saveAmount: 0,
                    saveCharacteristic: '',
                    successes: 0,
                    useModes: [],
                    xpCost: 0,
                    components: [],
                    subEffects: [],
                },
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                // Input Fields End
                componentsPanel: null,
                dialog: {
                    show: false,
                    type: ''
                },
                filterText: '',
                panel: this.panelProp,
                subEffectPanel: null,
                useModes: ['Charge Up', 'Flurry', 'Focused Strike', 'Full Auto', 'Lightning', 'Prepared'],
                // Validation Start
                numberRules: [
                    v => !isNaN(+v) && v >= 0 || 'Field may not be empty and value must be 0 or higher'
                ],
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            addComponent() {
                this.componentsPanel = 0
                this.ability.components.push({
                    discount: 0,
                    effect: {},
                    flatCost: 0,
                    name: '',
                    notes: '',
                    upcharge: 0,
                })
            },
            addSubEffect() {
                this.subEffectPanel = 0
                let ability = JSON.parse(JSON.stringify(this.clearAbility))
                ability.id = uuidv4()
                this.ability.subEffects.push(ability)
            },
            deleteComponent(i) {
                this.ability.components.splice(i, 1)
            },
            deleteSubEffect(i) {
                this.ability.subEffects.splice(i, 1)
            },
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('addEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'abilities', object: this.ability })
            },
            updateEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('updateEntryEmit', { arrayName: 'abilities', object: this.ability })
                }
            },
            updateEntryBypass(ability) {
                this.$emit('updateEntryEmit', { arrayName: 'abilities', object: ability })
            },
            // CRUD Functions End
            extraLargeColumns(ability) {
                if (this.layout == 'Minion')
                    return 12
                if (ability.subEffects.length)
                    return 6
                else return 3
            },
            getClassResource(ability) {
                return (ability.classResource) ? `${ability.crCost} ${this.resources.find(x => { return x.id == ability.classResource }).name}` : ''
            },
            getDamage(ability) {
                let damage = ''
                if (ability.damage.dice && ability.damage.dice != 0)
                    damage += `${ability.damage.dice}d6 + `
                if (ability.damage.flat && ability.damage.flat != 0)
                    damage += `${ability.damage.flat}`
                if (damage.substring(damage.length - 3) == ' + ')
                    damage = damage.substring(0, damage.length - 3)
                return damage
            },
            getDamageTypes(ability) {
                return ability.damage.types.join(', ')
            },
            mediumColumns(ability) {
                if (ability.subEffects.length || this.layout == 'Minion')
                    return 12
                else return 6
            },
            // Open Dialog Functions
            addDialog() {
                this.panel = 0
                this.setDialog('Add')
                this.ability = JSON.parse(JSON.stringify(this.clearAbility))
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            deleteDialog(ability) {
                this.ability = ability
                this.setDialog('Delete')
            },
            duplicateAbility(item) {
                this.panel = 0
                this.setDialog('Add')
                this.ability = JSON.parse(JSON.stringify(item))
                this.ability.name += ' Copy'
                setTimeout(() => {
                    this.$refs.name.focus()
                }, 200)
            },
            updateDialog(ability) {
                this.ability = ability
                this.setDialog('Edit')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            // Open Dialog Functions End
            rollAbility(ability) {
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            subtractCR(crCost) {
                this.$emit('subtractCREmit', crCost)
            },
            useAbility(ability) {
                ability = JSON.parse(JSON.stringify(ability))
                this.$emit('useAbilityEmit', ability)
            },
            useButtonColor(ability) {
                let color = ''

                let apColor = ''
                if (ability.apCost > 0) {
                    if (ability.apCost < this.ap)
                        apColor = 'primary'
                    else if (ability.apCost == this.ap)
                        apColor = 'warning'
                    else if (ability.apCost > this.ap)
                        apColor = 'error'
                }

                let crColor = ''
                if (ability.crCost > 0) {
                    let resource = this.resources.find(x => { return x.id == ability.classResource })
                    if (resource) {
                        if (ability.crCost < resource.amount)
                            crColor = 'primary'
                        if (ability.crCost == resource.amount)
                            crColor = 'warning'
                        if (ability.crCost > resource.amount)
                            crColor = 'error'
                    }
                }

                if (crColor == 'error' || apColor == 'error')
                    color = 'error'
                else if (crColor == 'warning' || apColor == 'warning')
                    color = 'warning'
                else
                    color = 'primary'

                return color
            },
            validate() {
                return this.$refs.form.validate()
            }
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'abilityPanel', value: this.panel })
            }
        }
    }
</script>