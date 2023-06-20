<template>
    <div class="mainColumn elevation-3" v-bind:style="{ borderColor: (color)? color.hexa : 'black' }">
        <v-row>
            <v-col class="text-center" v-if="canEdit">
                <v-btn color="primary" @click="updateDialog(ability)">
                    <v-icon>mdi-pen</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center" v-if="showUseButton">
                <v-btn color="primary" @click="useAbility(ability)">
                    Use
                    <v-icon :color="useButtonIconColor">{{useButtonIcon}}</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center" v-if="canEdit">
                <v-btn color="error" @click="deleteEntry(ability)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-form disabled>
            <v-row>
                <v-col cols="6">
                    <v-text-field label="Name" v-model="name"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="XP" v-model="xpCost"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="description">
                    <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                </v-col>
                <v-col cols="12" v-if="characteristic || dice" class="text-center">
                    <v-btn color="primary" @click="rollAbility(ability)">Roll Check</v-btn>
                </v-col>
                <v-col cols="12" v-if="characteristic">
                    <v-select label="Characteristic" :items="characteristics" v-model="characteristic" readonly>
                    </v-select>
                </v-col>
                <v-col cols="12" v-if="dice">
                    <v-text-field label="Ability Dice" v-model="dice"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="save">
                    <v-text-field :label="saveCharacteristic + ' Save Amount'" v-model="saveAmount"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="showDamageSection">
                    <template>
                        <v-expansion-panels>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    <h3 class="text-center">
                                        Damage
                                        <v-icon @click.stop="rollDamage(ability)">mdi-dice-6</v-icon>
                                    </h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row>
                                        <v-col cols="12" md="4" v-if="damage.dice">
                                            <v-text-field label="Dice" v-model="damage.dice"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4" v-if="damage.flat">
                                            <v-text-field label="Flat" v-model="damage.flat"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4" v-if="damage.critDice">
                                            <v-text-field label="Crit Dice" v-model="damage.critDice"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" v-if="damage.characteristic">
                                            <v-select label="Damage Characteristic" :items="characteristics" v-model="damage.characteristic" readonly></v-select>
                                        </v-col>
                                        <v-col cols="6" v-if="isMeleeAttack">
                                            <v-switch label="Melee Attack" inset v-model="isMeleeAttack"></v-switch>
                                        </v-col>
                                        <v-col cols="6" v-if="linkToDamage">
                                            <v-switch label="Link to Ability: Damage" inset v-model="linkToDamage"></v-switch>
                                        </v-col>
                                        <v-col cols="6" v-if="damage.critFlat">
                                            <v-switch label="Flat Damage to Crit" inset v-model="damage.critFlat"></v-switch>
                                        </v-col>
                                        <v-col cols="6" v-if="damage.critMax">
                                            <v-switch label="Max Crit" inset v-model="damage.critMax"></v-switch>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field label="Type" v-model="damage.types"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="AP Cost" type="number" v-model="apCost" readonly>
                        <v-icon :color="apIconColor"
                                slot="append"
                                @click="subtractAP(apCost)"
                                v-if="apCost">{{apIcon}}</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="4" v-if="crCost && classResource">
                    <v-text-field :label="resources.find(x => x.id == classResource).name" type="number" v-model="crCost" readonly>
                        <v-icon :color="crIconColor"
                                slot="append"
                                @click="subtractCR({crCost:crCost, classResource: classResource})">{{crIcon}}</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Duration" v-model="duration"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Range" v-model="range"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="areaOfEffect">
                    <v-text-field label="Area of Effect" v-model="areaOfEffect"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select label="Physical/Meta"
                              :items="physMetaOptions"
                              v-model="physMeta"
                              required></v-select>
                </v-col>
                <v-col cols="4" v-if="successes">
                    <v-text-field label="Successes" type="number" v-model="successes"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="handedness">
                    <v-text-field label="Handedness" type="number" v-model="handedness"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="maxSizeCategoryOfMass">
                    <v-text-field label="Max Size Category Of Mass" v-model="maxSizeCategoryOfMass"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="abilityUseModes">
                    <v-select label="Use Modes" :items="useModes" v-model="abilityUseModes" multiple clearable></v-select>
                </v-col>
                <v-col cols="12" v-if="abilityBuffs">
                    <v-select label="Buffs" :items="buffs.map(x => ({ value: x.id, text: x.name }))" v-model="abilityBuffs" multiple clearable></v-select>
                </v-col>
                <v-col cols="12" v-if="subEffects.length > 0">
                    <template>
                        <v-expansion-panels v-model="subEffectsPanel">
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    <h3 class="text-center">Sub Effects</h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <AbilityListItem v-for="s in abilities" :key="s.key"
                                                     :ability="s"
                                                     :ap="ap"
                                                     :buffs="buffs"
                                                     :characteristics="characteristics"
                                                     :damage-types="damageTypes"
                                                     :resources="resources"
                                                     :successes-from-intelligence="successesFromIntelligence"
                                                     @deleteEntryEmit="deleteEntry($event)"
                                                     @updateDialogEmit="updateDialog($event)"
                                                     @updateEntryEmit="updateEntry($event)"
                                                     @rollAbilityEmit="rollAbility($event)"
                                                     @rollDamageEmit="rollDamage($event)"
                                                     @subtractAP="subtractAP($event)"
                                                     @subtractCR="subtractCR($event)"
                                                     @useAbility="useAbility($event)"></AbilityListItem>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </template>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'AbilityListItem',
        props: {
            ability: Object,
            ap: Number,
            buffs: Array,
            characteristics: Array,
            characteristicViewItems: Array,
            damageTypes: Array,
            resources: Array,
            successesFromIntelligence: Number
        },
        computed: {
            abilities() {
                let abilities = []

                this.subEffects.forEach((a) => {
                    let ability = JSON.parse(JSON.stringify(a))
                    ability.key =
                        ability.apCost +
                        ability.areaOfEffect +
                        ability.boughtForFree +
                        JSON.stringify(ability.color) +
                        JSON.stringify(ability.classResource) +
                        ability.crCost +
                        ability.characteristic +
                        ability.description +
                        ability.duration +
                        ability.handedness +
                        ability.id +
                        ability.inClass +
                        ability.isAbilityArray +
                        ability.isMeleeAttack +
                        ability.linkToDamage +
                        ability.maxSizeCategoryOfMass +
                        ability.name +
                        ability.physMeta +
                        ability.range +
                        ability.successes +
                        ability.xpCost +
                        JSON.stringify(ability.buffs) +
                        JSON.stringify(ability.components) +
                        JSON.stringify(ability.damage) +
                        JSON.stringify(ability.subEffects);
                    abilities.push(ability)
                })

                return abilities
            },
            apIcon() {
                let icon = ''

                if (this.apIconColor == 'primary' || this.apIconColor == 'warning')
                    icon = 'mdi-clock-minus-outline'
                else if (this.apIconColor == 'error')
                    icon = 'mdi-clock-alert-outline'
                else if (this.apIconColor == 'success')
                    icon = 'mdi-clock-plus-outline'

                return icon
            },
            apIconColor() {
                let color = ''

                if (this.apCost > 0) {
                    if (this.apCost < this.ap)
                        color = 'primary'
                    else if (this.ap == this.apCost)
                        color = 'warning'
                    else if (this.apCost > this.ap)
                        color = 'error'
                }
                if (this.apCost < 0)
                    color = 'success'

                return color
            },
            crIcon() {
                let icon = ''

                if (this.crIconColor == 'primary' || this.crIconColor == 'warning')
                    icon = 'mdi-battery-minus-outline'
                else if (this.crIconColor == 'error')
                    icon = 'mdi-battery-alert-variant-outline'
                else if (this.crIconColor == 'success')
                    icon = 'mdi-battery-plus-outline'

                return icon
            },
            crIconColor() {
                let color = ''

                if (this.crCost > 0) {
                    let resource = this.resources.find(x => { return x.id == this.classResource })
                    if (resource) {
                        if (this.crCost < resource.amount)
                            color = 'primary'
                        if (this.crCost == resource.amount)
                            color = 'warning'
                        if (this.crCost > resource.amount)
                            color = 'error'
                    }
                }
                if (this.crCost < 0)
                    color = 'success'

                return color
            },
            saveAmount() {
                let amount = 2

                let characteristic = this.characteristicViewItems.find(x => { return x.name == this.ability.characteristic })
                let charAmount = characteristic.value + +characteristic.valueIncreases + +characteristic.adjustment
                if (charAmount > 10)
                    charAmount = 10
                amount += +(Math.ceil(charAmount / 2))

                if (!isNaN(this.ability.saveAmount))
                    amount += +this.ability.saveAmount

                return amount
            },
            saveCharacteristic() {
                return this.characteristicViewItems.find(x => { return x.name == this.ability.saveCharacteristic }).abbreviation
            },
            showDamageSection() {
                return this.damage.dice > 0 ||
                    this.damage.flat > 0 ||
                    this.isMeleeAttack ||
                    this.linkToDamage
            },
            showUseButton() {
                return this.apCost != 0 ||
                    this.characteristic ||
                    this.classResource ||
                    this.damage.dice > 0 ||
                    this.damage.flat > 0 ||
                    this.dice ||
                    this.isMeleeAttack ||
                    this.linkToDamage ||
                    (this.save && this.saveAmount && this.saveCharacteristic)
            },
            useButtonIcon() {
                let icon = ''

                if (this.useButtonIconColor == 'warning' || this.useButtonIconColor == 'error')
                    icon = 'mdi-alert'

                return icon
            },
            useButtonIconColor() {
                let color = ''

                if (this.crIconColor == 'error' || this.apIconColor == 'error')
                    color = 'error'
                else if (this.crIconColor == 'warning' || this.apIconColor == 'warning')
                    color = 'warning'
                else
                    color = 'primary'

                return color
            }
        },
        data() {
            return {
                abilityBuffs: this.ability.buffs,
                abilityUseModes: this.ability.useModes,
                apCost: this.ability.apCost,
                areaOfEffect: this.ability.areaOfEffect,
                boughtForFree: this.ability.boughtForFree,
                canEdit: this.ability.canEdit,
                classResource: this.ability.classResource,
                color: this.ability.color,
                crCost: this.ability.crCost,
                characteristic: this.ability.characteristic,
                description: this.ability.description,
                dice: this.ability.dice,
                duration: this.ability.duration,
                handedness: this.ability.handedness,
                id: this.ability.id,
                inClass: this.ability.inClass,
                isAbilityArray: this.ability.isAbilityArray,
                isMeleeAttack: this.ability.isMeleeAttack,
                linkToDamage: this.ability.linkToDamage,
                maxSizeCategoryOfMass: this.ability.maxSizeCategoryOfMass,
                name: this.ability.name,
                physMeta: this.ability.physMeta,
                range: this.ability.range,
                save: this.ability.save,
                successes: this.ability.successes,
                xpCost: this.ability.xpCost,
                components: this.ability.components,
                damage: this.ability.damage,
                subEffects: this.ability.subEffects,
                subEffectsPanel: 0,
                physMetaOptions: ['Physical', 'Meta', 'Both'],
                useModes: ['Charge Up', 'Flurry', 'Focused Strike', 'Full Auto', 'Lightning', 'Prepared'],
            }
        },
        methods: {
            deleteEntry(object) {
                this.$emit('deleteEntryEmit', JSON.parse(JSON.stringify(object)))
            },
            rollAbility(ability) {
                this.$emit('rollAbilityEmit', ability)
            },
            rollDamage(ability) {
                this.$emit('rollDamageEmit', ability)
            },
            subtractAP(apCost) {
                this.$emit('subtractAP', apCost)
            },
            subtractCR(crCost) {
                this.$emit('subtractCR', crCost)
            },
            updateDialog(object) {
                this.$emit('updateDialogEmit', JSON.parse(JSON.stringify(object)))
            },
            /// Maybe bring this back
            //updateEntry() {
            //    let object = {
            //        apCost: this.apCost,
            //        areaOfEffect: this.areaOfEffect,
            //        boughtForFree: this.boughtForFree,
            //        color: this.color,
            //        classResource: this.classResource,
            //        crCost: this.crCost,
            //        characteristic: this.characteristic,
            //        damage: this.damage,
            //        description: this.description,
            //        duration: this.duration,
            //        handedness: this.handedness,
            //        id: this.id,
            //        inClass: this.inClass,
            //        isAbilityArray: this.isAbilityArray,
            //        isMeleeAttack: this.isMeleeAttack,
            //        maxSizeCategoryOfMass: this.maxSizeCategoryOfMass,
            //        name: this.name,
            //        physMeta: this.physMeta,
            //        range: this.range,
            //        successes: this.successes,
            //        xpCost: this.xpCost,
            //        components: this.components,
            //        subEffects: this.subEffects
            //    }

            //    this.$emit('updateEntryEmit', object)
            //},
            useAbility(ability) {
                this.$emit('useAbility', ability)
            }
        },
        //Maybe bring this back
        //watch: {
        //    apCost() { this.updateEntry() },
        //    areaOfEffect() { this.updateEntry() },
        //    boughtForFree() { this.updateEntry() },
        //    color() { this.updateEntry() },
        //    classResource() { this.updateEntry() },
        //    crCost() { this.updateEntry() },
        //    characteristic() { this.updateEntry() },
        //    description() { this.updateEntry() },
        //    duration() { this.updateEntry() },
        //    handedness() { this.updateEntry() },
        //    inClass() { this.updateEntry() },
        //    isAbilityArray() { this.updateEntry() },
        //    isMeleeAttack() { this.updateEntry() },
        //    maxSizeCategoryOfMass() { this.updateEntry() },
        //    name() { this.updateEntry() },
        //    physMeta() { this.updateEntry() },
        //    range() { this.updateEntry() },
        //    successes() { this.updateEntry() },
        //    xpCost() { this.updateEntry() },
        //    components() { this.updateEntry() },
        //    damage() { this.updateEntry() },
        //    subEffects() { this.updateEntry() }
        //}
    }
</script>