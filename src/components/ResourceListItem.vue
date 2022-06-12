<template>
    <div>
        <v-text-field :label="resource.name"
                      v-model="amount"
                      type="number">
            <v-icon slot="append">/{{resource.amountMax}} </v-icon>
            <v-icon color="primary" slot="append" @click="updateDialog">mdi-pen</v-icon>
            <v-icon color="error" slot="append" @click="deleteDialog">mdi-delete</v-icon>
        </v-text-field>

        <div class="text-center">
            <v-dialog v-model="showDialog" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialogTitle}}
                    </v-card-title>

                    <v-card-text v-if="dialogType == 'delete'">
                        Are you sure you want to delete the {{resource.name}} resource?
                    </v-card-text>

                    <v-card-text>
                        <v-text-field label="Name" v-model="name" :disabled="dialogType == 'delete'"></v-text-field>
                        <v-text-field label="Resoure Purchases" type="number" v-model="resourceIncreases" :disabled="dialogType == 'delete'"></v-text-field>
                        <v-select label="Characteristic" v-model="primaryCharacteristic" :items="characteristics" :disabled="dialogType == 'delete'"></v-select>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="error" v-if="dialogType == 'delete'"
                               @click="deleteEntry()">Delete</v-btn>
                        <v-btn color="primary" v-if="dialogType == 'edit'"
                               @click="updateEntry()">Save</v-btn>
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
        name: 'ResourceListItem',
        props: {
            characteristics: Array,
            resource: Object
        },
        data() {
            return {
                amount: this.resource.amount,
                dialogTitle: '',
                dialogType: '',
                name: this.resource.name,
                primaryCharacteristic: this.resource.primaryCharacteristic,
                resourceIncreases: this.resource.resourceIncreases,
                showDialog: false
            }
        },
        methods: {
            deleteDialog() {
                this.dialogTitle = 'Delete Resource'
                this.dialogType = 'delete'
                this.showDialog = true
            },
            deleteEntry() {
                this.$emit('deleteEntryEmit', { arrayName: 'resources', object: this.resource })
            },
            updateDialog() {
                this.dialogTitle = 'Edit Resource'
                this.dialogType = 'edit'
                this.showDialog = true
            },
            updateEntry() {
                var object = {
                    amount: this.resource.amount,
                    amountMax: this.resource.amountMax,
                    id: this.resource.id,
                    name: this.name,
                    primaryCharacteristic: this.primaryCharacteristic,
                    resourceIncreases: this.resourceIncreases
                }
                this.showDialog = false
                this.$emit('updateEntryEmit', { arrayName: 'resources', object: object })
            }
        }
    }
</script>