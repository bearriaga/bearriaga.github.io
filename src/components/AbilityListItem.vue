<template>
    <div class="mainColumn elevation-3" v-bind:style="{ borderColor: (color)? color.hexa : 'black' }">
        <v-row>
            <v-col class="text-center" v-if="canEdit">
                <v-btn color="primary" @click="updateDialog(ability)">
                    <v-icon>mdi-pen</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-center" v-if="apCost != 0 || classResource || damage.dice > 0 || damage.flat > 0 || characteristic">
                <v-btn color="primary" @click="useAbility(ability)">Use</v-btn>
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
                <v-col cols="12" v-if="characteristic">
                    <v-select label="Characteristic" :items="characteristics" v-model="characteristic" readonly>
                        <v-icon slot="prepend" @click="rollAbility(ability)">mdi-dice-6</v-icon>
                    </v-select>
                </v-col>
                <v-col cols="12" v-if="damage.dice > 0 || damage.flat > 0">
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
                                        <v-col cols="12" md="6" v-if="damage.dice">
                                            <v-text-field label="Dice" v-model="damage.dice"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" v-if="damage.flat">
                                            <v-text-field label="Flat" v-model="damage.flat"></v-text-field>
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
                        <v-icon :color="crcIconColor"
                                slot="append"
                                @click="subtractCR({crCost:crCost, classResource: classResource})">{{crcIcon}}</v-icon>
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
                <v-col cols="12" v-if="components.length > 0">
                    <h4 class="text-center">Components</h4>
                    <v-row>
                        <v-col cols="6" v-for="c in components" :key="c.name">
                            <v-form>
                                <v-text-field label="Name" v-model="c.name"></v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" v-if="subEffects.length > 0">
                    <template>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(item,i) in 1" :key="i">
                                <v-expansion-panel-header>
                                    <h3 class="text-center">Sub Effects</h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <AbilityListItem v-for="s in abilities" :key="s.key"
                                                     :ability="s"
                                                     :ap="ap"
                                                     :can-edit="true"
                                                     :characteristics="characteristics"
                                                     :damage-types="damageTypes"
                                                     :resources="resources"
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
            canEdit: Boolean,
            characteristics: Array,
            damageTypes: Array,
            resources: Array
        },
        computed: {
            abilities() {
                let abilities = []

                this.subEffects.forEach((ability) => {
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
            apIcon() {
                let icon = ''

                if (this.apCost > 0) {
                    if (this.apCost > this.ap)
                        icon = 'mdi-clock-alert-outline'
                    else
                        icon = 'mdi-clock-minus-outline'
                }
                if (this.apCost < 0)
                    icon = 'mdi-clock-plus-outline'

                return icon
            },
            apIconColor() {
                let color = ''

                if (this.apCost > -1)
                    color = 'error'
                if (this.apCost <= -1)
                    color = 'success'

                return color
            },
            crcIcon() {
                let icon = ''

                if (this.crCost > 0) {
                    let resource = this.resources.find(x => { return x.id == this.classResource.id })
                    if (resource && this.crCost > resource.amount)
                        icon = 'mdi-battery-alert-variant-outline'
                    else
                        icon = 'mdi-battery-minus-outline'
                }
                if (this.crCost < 0)
                    icon = 'mdi-battery-plus-outline'

                return icon
            },
            crcIconColor() {
                let color = ''

                if (this.crCost > 0)
                    color = 'error'
                if (this.crCost < 0)
                    color = 'success'

                return color
            }
        },
        data() {
            return {
                apCost: this.ability.apCost,
                areaOfEffect: this.ability.areaOfEffect,
                boughtForFree: this.ability.boughtForFree,
                color: this.ability.color,
                classResource: this.ability.classResource,
                crCost: this.ability.crCost,
                characteristic: this.ability.characteristic,
                description: this.ability.description,
                duration: this.ability.duration,
                handedness: this.ability.handedness,
                id: this.ability.id,
                inClass: this.ability.inClass,
                isAbilityArray: this.ability.isAbilityArray,
                isMeleeAttack: this.ability.isMeleeAttack,
                maxSizeCategoryOfMass: this.ability.maxSizeCategoryOfMass,
                name: this.ability.name,
                physMeta: this.ability.physMeta,
                range: this.ability.range,
                successes: this.ability.successes,
                xpCost: this.ability.xpCost,
                components: this.ability.components,
                damage: this.ability.damage,
                subEffects: this.ability.subEffects,
                physMetaOptions: ['Physical', 'Meta', 'Both']
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
            updateEntry() {
                let object = {
                    apCost: this.apCost,
                    areaOfEffect: this.areaOfEffect,
                    boughtForFree: this.boughtForFree,
                    color: this.color,
                    classResource: this.classResource,
                    crCost: this.crCost,
                    characteristic: this.characteristic,
                    damage: this.damage,
                    description: this.description,
                    duration: this.duration,
                    handedness: this.handedness,
                    id: this.id,
                    inClass: this.inClass,
                    isAbilityArray: this.isAbilityArray,
                    isMeleeAttack: this.isMeleeAttack,
                    maxSizeCategoryOfMass: this.maxSizeCategoryOfMass,
                    name: this.name,
                    physMeta: this.physMeta,
                    range: this.range,
                    successes: this.successes,
                    xpCost: this.xpCost,
                    components: this.components,
                    subEffects: this.subEffects
                }

                this.$emit('updateEntryEmit', object)
            },
            useAbility(ability) {
                this.$emit('useAbility', ability)
            }
        },
        watch: {
            apCost() { this.updateEntry() },
            areaOfEffect() { this.updateEntry() },
            boughtForFree() { this.updateEntry() },
            color() { this.updateEntry() },
            classResource() { this.updateEntry() },
            crCost() { this.updateEntry() },
            characteristic() { this.updateEntry() },
            description() { this.updateEntry() },
            duration() { this.updateEntry() },
            handedness() { this.updateEntry() },
            inClass() { this.updateEntry() },
            isAbilityArray() { this.updateEntry() },
            isMeleeAttack() { this.updateEntry() },
            maxSizeCategoryOfMass() { this.updateEntry() },
            name() { this.updateEntry() },
            physMeta() { this.updateEntry() },
            range() { this.updateEntry() },
            successes() { this.updateEntry() },
            xpCost() { this.updateEntry() },
            components() { this.updateEntry() },
            damage() { this.updateEntry() },
            subEffects() { this.updateEntry() }
        }
    }
</script>