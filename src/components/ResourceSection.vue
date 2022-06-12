<template>
    <div>
        <h3 class="text-center">
            Class Resources
            <v-btn icon color="primary"
                   @click="showDialog = true">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </h3>
        <ResourceListItem v-for="resource in resources" :key="resource.key"
                          :characteristics="characteristics"
                          :resource="resource"
                          @deleteEntryEmit="deleteEntry($event)"
                          @updateEntryEmit="updateEntry($event)"></ResourceListItem>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Add Class Resource
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Name" v-model="name"></v-text-field>
                                    <v-text-field label="Resoure Purchases" type="number" v-model="resourceIncreases"></v-text-field>
                                    <v-select label="Characteristic" v-model="primaryCharacteristic" :items="characteristics"></v-select>
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
    import ResourceListItem from './ResourceListItem.vue'


    export default {
        name: 'ResourceSection',
        components: {
            ResourceListItem
        },
        props: {
            characteristics: Array,
            resources: Array
        },
        data() {
            return {
                name: '',
                primaryCharacteristic: '',
                resourceIncreases: 0,
                showDialog: false
            }
        },
        methods: {
            addEntry() {
                var object = {
                    amount: 0,
                    amountMax: 0,
                    id: null,
                    name: this.name,
                    primaryCharacteristic: this.primaryCharacteristic,
                    resourceIncreases: this.resourceIncreases
                }
                this.amount = 0
                this.showDialog = false
                this.type = ''
                this.$emit('addEntryEmit', { arrayName: 'resources', object: object })
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