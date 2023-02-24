<template>
    <div>
        <v-form>
            <v-switch label="Is Active" inset
                      v-model="isActive"></v-switch>
            <v-text-field label="Name" v-model="name">
                <v-icon slot="append" color="primary"
                        @click="updateDialog">mdi-pen</v-icon>
                <v-icon slot="append" color="error"
                        @click="deleteDialog">mdi-delete</v-icon>
            </v-text-field>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1"></v-textarea>
            <h3 class="text-center">Adjustments</h3>
            <div v-for="a, index in adjustments" :key="index">
                <v-text-field :label="returnLabel(a)"
                              v-model="a.amount"
                              v-if="a.type != 'Status' && a.type != 'Other' && a.type != 'Damage: Convert Damage Type' && a.type != 'Damage Additional'"
                              type="number"
                              disabled></v-text-field>
                <v-form v-if="a.type == 'Damage Additional'" disabled>
                    <v-card>
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="12">
                                    <h3 class="text-center">
                                        Damage Additional
                                    </h3>
                                </v-col>
                                <v-col cols="12" md="4" v-if="a.damage.dice">
                                    <v-text-field label="Dice" type="number" v-model="a.damage.dice"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" v-if="a.damage.flat">
                                    <v-text-field label="Flat" type="number" v-model="a.damage.flat"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" v-if="a.damage.critDice">
                                    <v-text-field label="Crit Dice" type="number" v-model="a.damage.critDice"></v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="a.damage.characteristic">
                                    <v-text-field label="Characteristic" v-model="a.damage.characteristic"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" v-if="a.damage.critFlat">
                                    <v-switch label="Flat Damage Crits" inset v-model="a.damage.critFlat"></v-switch>
                                </v-col>
                                <v-col cols="12" md="6" v-if="a.damage.critMax">
                                    <v-switch label="Max Crit" inset v-model="a.damage.critMax"></v-switch>
                                </v-col>
                                <v-col cols="12" v-if="a.damage.types.length > 0">
                                    <v-text-field label="Damage Types" v-model="a.damage.types"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card>
                </v-form>
                <v-text-field :label="returnLabel(a)"
                              v-model="a.damageConvertType"
                              v-if="a.type == 'Damage: Convert Damage Type'"
                              disabled></v-text-field>
                <v-text-field :label="returnLabel(a)"
                              v-model="a.status.duration"
                              v-if="a.type == 'Status'"
                              type="number"
                              disabled></v-text-field>
                <v-textarea label="Other"
                            v-model="a.description"
                            v-if="a.type == 'Other'"
                            auto-grow outlined rows="1" disabled></v-textarea>
            </div>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'BuffListItem',
        props: {
            buff: Object,
            resources: Array
        },
        data() {
            return {
                description: this.buff.description,
                isActive: this.buff.isActive,
                name: this.buff.name,
                adjustments: this.buff.adjustments
            }
        },
        methods: {
            deleteDialog() {
                this.$emit('deleteDialogEmit', this.buff)
            },
            returnLabel(adjustment) {
                let label = adjustment.type

                if (adjustment.type == 'CHAR')
                    label += ' - ' + adjustment.characteristic
                if (adjustment.type == 'Class Resource: Commited') {
                    let resource = this.resources.find(x => { return x.id == adjustment.classResource })
                    if (resource)
                        label += ' - ' + resource.name
                }
                if (adjustment.type == 'Damage Modification')
                    label += ' - ' + adjustment.damageModification.type
                if (adjustment.type == 'Movement')
                    label += ' - ' + adjustment.movementType
                if (adjustment.type == 'Skill')
                    label += ' - ' + adjustment.skill
                if (adjustment.type == 'Status') {
                    label += ' - ' + adjustment.status.status.name
                    if (adjustment.status.status.ranked)
                        label += ` ${adjustment.status.rankType} ${adjustment.status.ranks}`
                    label = label.replace('{CHAR}', adjustment.status.characteristic)
                    label = label.replace('{Type}', adjustment.status.damageType)
                    label = label.replace('{Group}', adjustment.status.damageType)
                    label += ' Duration'
                }

                return label
            },
            setObject() {
                let buff = {
                    description: this.description,
                    isActive: this.isActive,
                    id: this.buff.id,
                    name: this.name,
                    adjustments: JSON.parse(JSON.stringify(this.adjustments)),
                }
                return buff
            },
            updateDialog() {
                this.$emit('updateDialogEmit', this.setObject())
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.setObject())
            },
            updateStatuses() {
                if (this.isActive && JSON.stringify(this.adjustments).includes('Status')) {
                    this.adjustments.filter(a => { return a.type == 'Status' }).forEach(adjustment => {
                        adjustment.status.currentDuration = adjustment.status.duration
                        adjustment.status.currentIsActive = adjustment.status.isActive
                        adjustment.status.currentRanks = adjustment.status.ranks
                    })
                }
            }
        },
        watch: {
            description() {
                this.updateEntry()
            },
            isActive() {
                this.updateStatuses()
                this.updateEntry()
            },
            name() {
                this.updateEntry()
            }
        }
    }
</script>