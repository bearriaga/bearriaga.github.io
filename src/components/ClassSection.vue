<template>
    <div>
        <div>
            <h3 class="text-center">
                {{sectionTitle}}
                <v-btn icon color="primary"
                       @click="showDialog = true">
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </h3>
        </div>
        <div>
            <ClassListItem v-for="c in classes" :key="c.id"
                           @updateEntryEmit="updateEntry($event)"
                           @deleteEntryEmit="deleteEntry($event)"
                           :characteristics="characteristics"
                           :class-obj="c"></ClassListItem>
        </div>
        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add Class
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Class Name" type="text" v-model="name"></v-text-field>
                                    <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
                                    <v-select :items="characteristics" v-model="primaryCharacteristic" label="Primary Characteristic"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary"
                               @click="addEntry()">Add</v-btn>
                        <v-btn color="secondary"
                               @click="showDialog = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import ClassListItem from './ClassListItem.vue'

    export default {
        name: 'ClassSection',
        components: {
            ClassListItem
        },
        props: {
            unlocked: Boolean,
            characteristics: Array,
            classes: Array
        },
        computed: {
            sectionTitle() {
                return (this.unlocked) ? 'Unlocked Classes' : 'Classes'
            }
        },
        data() {
            return {
                active: !this.unlocked,
                advanceRank: 0,
                description: '',
                name: '',
                primaryCharacteristic: '',
                showDialog: false
            }
        },
        methods: {
            addEntry() {
                var object = {
                    active: this.active,
                    advanceRank: this.advanceRank,
                    description: this.description,
                    id: null,
                    name: this.name,
                    primaryCharacteristic: this.primaryCharacteristic,
                    unlocked: this.unlocked
                }
                this.name = ''
                this.description = ''
                this.primaryCharacteristic = ''
                this.showDialog = false
                this.$emit('addEntryEmit', { arrayName: 'classes', object: object })
            },
            deleteEntry(object) {
                this.$emit('deleteEntryEmit', object)
            },
            updateEntry(object) {
                this.$emit('updateEntryEmit', object)
            }
        }
    }
</script>