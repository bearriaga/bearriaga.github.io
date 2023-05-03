<template>
    <div>
        <v-text-field label="Class Name" v-model="name" :disabled="!active && !unlocked" :readonly="!active && !unlocked">
            <v-icon slot="append" color="primary" @click="moveEntry('down')">
                mdi-arrow-down-bold
            </v-icon>
            <v-icon slot="append" color="primary" @click="moveEntry('up')">
                mdi-arrow-up-bold
            </v-icon>
            <v-icon slot="append" color="error" @click="deleteEntry">mdi-delete</v-icon>
        </v-text-field>
        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" :disabled="!active && !unlocked"></v-textarea>
        <v-select label="Primary Characteristic" v-model="characteristic" :items="characteristics" :disabled="!active && !unlocked"></v-select>
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
            moveEntry(direction) {
                this.$emit('moveEntryEmit', direction)
            },
            updateEntry() {
                var object = {
                    active: this.active,
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