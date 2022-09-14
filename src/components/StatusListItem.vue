<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-switch label="Is Active" inset
                            v-model="isActive"></v-switch>
                <v-autocomplete label="Status"
                                :items="statuses.map((x) => ({ value: x, text: x.name }))"
                                v-model="selectedStatus"
                                :disabled="isBuff()"
                                required>
                    <v-icon slot="prepend" color="error"
                            v-if="!isBuff()"
                            @click="deleteEntry">
                        mdi-delete
                    </v-icon>
                </v-autocomplete>
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
                <v-textarea label="Description" v-model="description"
                            auto-grow outlined rows="1"
                            :disabled="isBuff()"></v-textarea>
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
            isBuff() {
                if (this.status.buffId)
                    return true
                return false
            },
            updateEntry() {
                let status = {
                    buffId: this.status.buffId,
                    description: this.description,
                    duration: this.duration,
                    isActive: this.isActive,
                    id: this.status.id,
                    ranks: this.ranks,
                    status: this.selectedStatus,
                }
                if (!this.status.buffId)
                    this.$emit('updateEntryEmit', status)
                else
                    this.$emit('updateBuffEntryEmit', { status: status, buffId: this.status.buffId })
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