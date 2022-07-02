<template>
    <div>
        <v-form class="abilityColumn mainColumn elevation-3">
            <v-row>
                <v-col cols="6">
                    <v-text-field label="Name" v-model="name"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="XP" v-model="xpCost"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Action Points" v-model="apCost"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Class Resource" v-model="crCost"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Range" v-model="range"></v-text-field>
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
        }
    }
</script>