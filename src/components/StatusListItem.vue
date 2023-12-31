<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-text-field label="Status" v-model="statusName" disabled>
                    <v-icon slot="append" color="primary" v-if="!isBuff()" @click="moveEntry('down')">
                        mdi-arrow-down-bold
                    </v-icon>
                    <v-icon slot="append" color="primary" v-if="!isBuff()" @click="moveEntry('up')">
                        mdi-arrow-up-bold
                    </v-icon>
                    <TooltipComponent slot="append" :text="selectedStatus.effect"></TooltipComponent>
                    <v-icon slot="append" color="error"
                            v-if="!isBuff()"
                            @click="deleteEntry">
                        mdi-delete
                    </v-icon>
                </v-text-field>
            </v-col>
            <v-col cols="3">
                <v-switch label="Indefinite" v-if="indefinite" inset v-model="indefinite" disabled></v-switch>
                <v-text-field label="Duration (Rounds)"
                              v-if="!indefinite"
                              v-model="duration"
                              type="number"
                              min="0"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-switch label="Active" inset
                          v-model="isActive"></v-switch>
            </v-col>
            <v-col cols="12" v-if="description">
                <v-textarea label="Description" v-model="description"
                            auto-grow outlined rows="1"
                            :disabled="isBuff()"></v-textarea>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import TooltipComponent from './TooltipComponent.vue'
    export default {
        name: 'StatusListItem',
        components: {
            TooltipComponent
        },
        props: {
            status: Object,
            statuses: Array
        },
        computed: {
            statusName() {
                let label = this.status.status.name
                if (this.status.status.name.includes('Damage') || this.status.status.name.includes('Invulnerable') || this.status.status.name.includes('Vulnerable'))
                    label += ` - ${this.status.damageType}`
                if (this.status.status.ranked)
                    label += ` - ${this.status.ranks}`
                return label
            }
        },
        data() {
            return {
                damageType: this.status.damageType,
                description: this.status.description,
                duration: this.status.duration,
                indefinite: this.status.indefinite,
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
            moveEntry(direction) {
                this.$emit('moveEntryEmit', direction)
            },
            updateEntry() {
                let status = {
                    buffId: this.status.buffId,
                    damageType: this.damageType,
                    description: this.description,
                    duration: this.duration,
                    isActive: this.isActive,
                    id: this.status.id,
                    indefinite: this.indefinite,
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