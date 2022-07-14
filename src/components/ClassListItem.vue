<template>
    <div>
        <v-row>
            <v-col cols="10">
                <v-text-field label="Class Name" v-model="name" :disabled="!active && !unlocked"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-icon color="error" @click="deleteEntry">mdi-delete</v-icon>
            </v-col>
        </v-row>
        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" :disabled="!active && !unlocked"></v-textarea>
        <v-select label="Primary Characteristic" v-model="characteristic" :items="characteristics" :disabled="!active && !unlocked"></v-select>
        <v-select label="Type" v-model="advanceRank" :items="advanceRanks" item-text="text" item-value="value" v-if="!unlocked" :disabled="!active && !unlocked"></v-select>
        <v-btn @click="updateType">{{unlockedBtnText}}</v-btn>
    </div>
</template>

<script>
    export default {
        name: 'ClassListItem',
        props: {
            characteristics: Array,
            classObj: Object
        },
        computed: {
            unlockedBtnText() { return (this.classObj.unlocked) ? 'Activate Class' : (this.classObj.active) ? 'Disable Class' : 'Enable Class' }

        },
        data() {
            return {
                active: this.classObj.active,
                advanceRank: this.classObj.advanceRank,
                advanceRanks: [
                    { value: 0, text: 'Standard' },
                    { value: 1, text: 'Advance Rank 1' },
                    { value: 2, text: 'Advance Rank 2' },
                    { value: 3, text: 'Advance Rank 3' },
                    { value: 4, text: 'Advance Rank 4' },
                    { value: 5, text: 'Advance Rank 5' },
                    { value: 6, text: 'Advance Rank 6' },
                    { value: 7, text: 'Advance Rank 7' },
                    { value: 8, text: 'Advance Rank 8' },
                    { value: 9, text: 'Advance Rank 9' }
                ],
                description: this.classObj.description,
                name: this.classObj.name,
                characteristic: this.classObj.characteristic,
                unlocked: this.classObj.unlocked
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.classObj)
            },
            updateEntry() {
                var object = {
                    active: this.active,
                    advanceRank: this.advanceRank,
                    description: this.description,
                    id: this.classObj.id,
                    name: this.name,
                    characteristic: this.characteristic,
                    unlocked: this.unlocked
                }
                this.$emit('updateEntryEmit', object)
            },
            updateType() {
                if (this.unlocked) {
                    this.active = true
                    this.unlocked = false
                } else {
                    this.active = !this.active
                }
                this.updateEntry()
            }
        },
        watch: {
            description() {
                this.updateEntry()
            },
            name() {
                this.updateEntry()
            },
            characteristic() {
                this.updateEntry()
            }
        }
    }
</script>