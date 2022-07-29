<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-checkbox label="Is Active"
                            v-model="isActive"></v-checkbox>
                <v-select label="Status"
                          :items="statuses.map((x) => ({ value: x, text: x.name }))"
                          v-model="selectedStatus"
                          required>
                    <v-icon slot="prepend" color="error"
                            @click="deleteEntry">
                        mdi-delete
                    </v-icon>
                </v-select>
                <v-textarea label="Effect"
                            v-model="selectedStatus.effect"
                            :disabled="selectedStatus.name != 'Other'"
                            auto-grow outlined rows="1"></v-textarea>
                <v-text-field label="Type"
                              v-model="selectedStatus.type"
                              :disabled="selectedStatus.name != 'Other'"></v-text-field>
                <v-text-field label="Ranks"
                              v-model="ranks"
                              type="number"
                              min="0"
                              v-if="selectedStatus.name.includes('rank')"></v-text-field>
                <v-text-field label="Duration (Rounds)"
                              v-model="duration"
                              type="number"
                              min="0"></v-text-field>
                <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'StatusListItem',
        props: {
            status: Object,
            statuses: Array
        },
        data() {
            return {
                description: this.status.description,
                duration: this.status.duration,
                isActive: this.status.isActive,
                ranks: this.status.ranks,
                selectedStatus: this.status.status
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.status)
            },
            updateEntry() {
                let status = {
                    description: this.description,
                    duration: this.duration,
                    isActive: this.isActive,
                    id: this.status.id,
                    ranks: this.ranks,
                    status: this.selectedStatus,
                }
                this.$emit('updateEntryEmit', status)
            }
        },
        watch: {
            description() {
                this.updateEntry()
            },
            duration() {
                this.updateEntry()
            },
            isActive() {
                this.updateEntry()
            },
            ranks() {
                this.updateEntry()
            },
            selectedStatus() {
                this.updateEntry()
            }
        }
    }
</script>