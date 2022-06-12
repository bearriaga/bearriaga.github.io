<template>
    <div>
        <v-row>
            <v-col cols="10">
                <v-text-field label="Class Name" v-model="name" :disabled="!active && !unlocked"></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-icon color="error" @click="showDialog = true">mdi-delete</v-icon>
            </v-col>
        </v-row>

        <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" :disabled="!active && !unlocked"></v-textarea>
        <v-select label="Primary Characteristic" v-model="primaryCharacteristic" :items="characteristics" :disabled="!active && !unlocked"></v-select>
        <v-select label="Type" v-model="advanceRank" :items="advanceRanks" item-text="text" item-value="value" v-if="!unlocked" :disabled="!active && !unlocked"></v-select>

        <v-btn @click="updateType">{{unlockedBtnText}}</v-btn>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Delete Class
                    </v-card-title>

                    <v-card-text>
                        Are you sure you want to delete the {{name}} class?
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="error"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn color="secondary"
                               @click="showDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
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
                primaryCharacteristic: this.classObj.primaryCharacteristic,
                showDialog: false,
                unlocked: this.classObj.unlocked
            }
        },
        methods: {
            deleteEntry() {
                this.showDialog = false
                this.$emit('deleteEntryEmit', { arrayName: 'classes', object: this.classObj })
            },
            updateEntry() {
                var object = {
                    active: this.active,
                    advanceRank: this.advanceRank,
                    description: this.description,
                    id: this.classObj.id,
                    name: this.name,
                    primaryCharacteristic: this.primaryCharacteristic,
                    unlocked: this.unlocked
                }
                this.$emit('updateEntryEmit', { arrayName: 'classes', object: object })
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
            primaryCharacteristic() {
                this.updateEntry()
            }
        }
    }
</script>