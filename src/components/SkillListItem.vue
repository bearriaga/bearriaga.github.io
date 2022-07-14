<template>
    <div>
        <v-text-field :label="skill.name"
                      type="number"
                      v-model="value"
                      @keyup.enter="rollDiceCheck">
            <v-icon slot="append" @click="rollDiceCheck">mdi-dice-6</v-icon>
            <v-icon color="primary" slot="append" @click="updateEntry">mdi-pen</v-icon>
            <v-icon color="error" slot="append" @click="deleteEntry" v-if="!skill.default">mdi-delete</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'SkillListItem',
        props: {
            skill: Object
        },
        data() {
            return {
                value: this.skill.value
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.skill)
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.skill)
            },
            rollDiceCheck() {
                this.$emit('rollDiceCheckEmit', { diceToRoll: this.value, isSave: false, successes: 0 })
            }
        }
    }
</script>