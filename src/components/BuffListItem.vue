<template>
    <div>
        <v-form>
            <v-switch label="Active" inset
                      v-model="isActive"></v-switch>
            <v-text-field label="Name" v-model="name" disabled>
                <v-icon slot="append" color="primary" @click="moveEntry('down')">
                    mdi-arrow-down-bold
                </v-icon>
                <v-icon slot="append" color="primary" @click="moveEntry('up')">
                    mdi-arrow-up-bold
                </v-icon>
                <v-icon slot="append" color="primary"
                        @click="exportBuff()">mdi-export-variant </v-icon>
                <v-icon slot="append" color="primary"
                        @click="updateDialog">mdi-pen</v-icon>
                <v-icon slot="append" color="error"
                        @click="deleteDialog">mdi-delete</v-icon>
            </v-text-field>
            <v-textarea label="Description" v-model="description" auto-grow outlined rows="1" disabled></v-textarea>
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
                              v-if="a.type == 'Status' && !a.status.indefinite"
                              type="number"
                              disabled></v-text-field>
                <v-switch :label="returnLabel(a)"
                          v-model="a.status.indefinite"
                          v-if="a.type == 'Status' && a.status.indefinite"
                          disabled></v-switch>
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
            exportBuff() {
                let filename = `${this.buff.name} - Buff.txt`, type = 'type:text/plain;charset=utf-8'
                let file = new Blob([JSON.stringify(this.buff)], { type: type });
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others
                    var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            },
            deleteDialog() {
                this.$emit('deleteDialogEmit', this.buff)
            },
            moveEntry(direction) {
                this.$emit('moveEntryEmit', direction)
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
                        label += ` ${adjustment.status.ranks}`
                    label = label.replace('{Type}', adjustment.status.damageType)
                    label = label.replace('{Group}', adjustment.status.damageType)
                    label += ' Duration'
                    if (adjustment.status.indefinite)
                        label += ' Indefinite'
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
            isActive() {
                this.updateStatuses()
                this.updateEntry()
            }
        }
    }
</script>