<template>
    <div>
        <ul>
            <li>
                <v-row>
                    <v-col cols="3">
                        <v-btn color="primary" @click="useSubEffect()" :disabled="used">Use</v-btn>
                    </v-col>
                    <v-col cols="9">
                        {{subEffect.name}}
                    </v-col>
                </v-row>
                <SubEffect v-for="ability in subEffect.subEffects" :key="ability.id"
                           :sub-effect="ability"
                           @useSubEffectEmit="useSubEffectEmit($event)"></SubEffect>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'SubEffect',
        props: {
            subEffect: Object
        },
        data() {
            return {
                used: false
            }
        },
        methods: {
            useSubEffect() {
                this.used = true
                this.useSubEffectEmit(this.subEffect)
            },
            useSubEffectEmit(ability) {
                this.$emit('useSubEffectEmit', ability)
            }
        }
    }
</script>