<template>
    <div>
        <v-form class="abilityColumn mainColumn elevation-3">
            <v-row>
                <v-col cols="6">
                    <v-text-field label="Name" v-model="dataAbility.name">
                        <v-icon color="primary" slot="append" @click="updateEntry(dataAbility)">mdi-pen</v-icon>
                        <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="XP" v-model="dataAbility.xpCost"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="dataAbility.description">
                    <v-textarea label="Description" v-model="dataAbility.description" auto-grow outlined rows="1"></v-textarea>
                </v-col>
                <v-col cols="12" v-if="dataAbility.damage.length > 0">
                    <h4 class="text-center">Damage</h4>
                    <v-row>
                        <v-col cols="6" v-for="d in dataAbility.damage" :key="d.dice + d.flat + d.percentage + d.type">
                            <v-form>
                                <v-text-field :label="d.type" v-model="d.dice" v-if="d.dice"></v-text-field>
                                <v-text-field :label="d.type" type="for" v-model="d.flat" v-if="d.flat"></v-text-field>
                                <v-text-field :label="d.type" v-model="d.percentage" v-if="d.percentage"></v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Action Points" type="number" v-model="dataAbility.apCost">
                        <v-icon color="error"
                                slot="append"
                                @click="subtractAP">mdi-clock-minus-outline</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="4" v-if="dataAbility.crCost">
                    <v-text-field label="Class Resource" type="number" v-model="dataAbility.crCost"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Duration" v-model="dataAbility.duration"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Range" v-model="dataAbility.range"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="dataAbility.areaOfEffect">
                    <v-text-field label="Area of Effect" v-model="dataAbility.areaOfEffect"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Physical/Meta" v-model="dataAbility.physMeta"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="dataAbility.successes">
                    <v-text-field label="Successes" type="number" v-model="dataAbility.successes"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="dataAbility.handedness">
                    <v-text-field label="Handedness" type="number" v-model="dataAbility.handedness"></v-text-field>
                </v-col>
                <v-col cols="4" v-if="dataAbility.maxSizeCategoryOfMass">
                    <v-text-field label="Max Size Category Of Mass" v-model="dataAbility.maxSizeCategoryOfMass"></v-text-field>
                </v-col>
                <v-col cols="12" v-if="dataAbility.subEffects.length > 0">
                    <template>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(item,i) in 1" :key="i">
                                <v-expansion-panel-header>
                                    <h3 class="text-center">Sub Effects</h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <AbilityListItem v-for="s in abilities" :key="s.key"
                                                     :ability="s"
                                                     @updateEntryEmit="updateEntry($event)"
                                                     @deleteEntryEmit="deleteDialog($event)"
                                                     @subtractAP="subtractAP($event)"></AbilityListItem>
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
            ability: Object
        },
        computed: {
            abilities() {
                let abilities = []

                this.dataAbility.subEffects.forEach((ability) => {
                    ability.key =
                        ability.apCost +
                        ability.areaOfEffect +
                        ability.boughtForFree +
                        ability.crCost +
                        ability.description +
                        ability.duration +
                        ability.handedness +
                        ability.id +
                        ability.inClass +
                        ability.isAbilityArray +
                        ability.maxSizeCategoryOfMass +
                        ability.name +
                        ability.physMeta +
                        ability.range +
                        ability.successe +
                        ability.xpCost +
                        ability.components.toString() +
                        ability.damage.toString() +
                        ability.subEffects.toString();
                    abilities.push(ability)
                })

                return abilities
            }
        },
        data() {
            return {
                dataAbility: this.ability
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.ability)
            },
            subtractAP() {
                this.$emit('subtractAP', this.dataAbility.apCost)
            },
            updateEntry(object) {                
                this.$emit('updateEntryEmit', object)
            }
        }
    }
</script>