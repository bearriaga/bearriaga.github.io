<template>
    <div>
        <v-form class="abilityColumn mainColumn elevation-3">
            <v-row>
                <v-col cols="6">
                    <v-text-field label="Name" v-model="name">
                        <v-icon color="primary" slot="append" @click="updateEntry">mdi-pen</v-icon>
                        <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="XP" v-model="xpCost"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Action Points" type="number" v-model="apCost">
                        <v-icon color="error"
                                slot="append"
                                @click="subtractAP">mdi-clock-minus-outline</v-icon>
                    </v-text-field>
                </v-col>
                <v-col cols="4" v-if="crCost">
                    <v-text-field label="Class Resource" type="number" v-model="crCost"></v-text-field>
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
                    <v-text-field label="Physical/Meta" v-model="physMeta"></v-text-field>
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
        data() {
            return {
                apCost: this.ability.apCost,
                areaOfEffect: this.ability.areaOfEffect,
                boughtForFree: this.ability.boughtForFree,
                crCost: this.ability.crCost,
                description: this.ability.description,
                duration: this.ability.duration,
                handedness: this.ability.handedness,
                id: this.ability.id,
                inClass: this.ability.inClass,
                isAbilityArray: this.ability.isAbilityArray,
                maxSizeCategoryOfMass: this.ability.maxSizeCategoryOfMass,
                name: this.ability.name,
                physMeta: this.ability.physMeta,
                range: this.ability.range,
                successes: this.ability.successes,
                xpCost: this.ability.xpCost,
                components: this.ability.components,
                damage: this.ability.damage,
                subEffects: this.ability.subEffects
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.ability)
            },
            subtractAP() {
                this.$emit('subtractAP', this.apCost)
            },
            updateEntry() {
                var object = {
                    apCost: this.ability.apCost,
                    areaOfEffect: this.ability.areaOfEffect,
                    boughtForFree: this.ability.boughtForFree,
                    crCost: this.ability.crCost,
                    description: this.ability.description,
                    duration: this.ability.duration,
                    handedness: this.ability.handedness,
                    id: this.ability.id,
                    inClass: this.ability.inClass,
                    isAbilityArray: this.ability.isAbilityArray,
                    maxSizeCategoryOfMass: this.ability.maxSizeCategoryOfMass,
                    name: this.ability.name,
                    physMeta: this.ability.physMeta,
                    range: this.ability.range,
                    successes: this.ability.successes,
                    xpCost: this.ability.xpCost,
                    components: this.ability.components,
                    damage: this.ability.damage,
                    subEffects: this.ability.subEffects
                }
                this.$emit('updateEntryEmit', object)
            }
        }
    }
</script>