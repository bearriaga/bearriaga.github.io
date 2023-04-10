<template>
    <div>
        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Movements
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <template>
                        <MovementListItem v-for="m in this.uniqueMovements" :key="m.key"
                                          :movement="m"
                                          :movement-ap-icon="movementApIcon"
                                          :movement-ap-icon-color="movementApIconColor"
                                          @subtractAP="subtractAP($event)"> </MovementListItem>
                    </template>

                    <v-expansion-panels v-model="subPanel" v-if="canEdit">
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                <h3 class="text-center">
                                    Add Movement
                                    <v-btn icon color="primary"
                                           @click.stop="addDialog">
                                        <v-icon>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <MovementListItem v-for="m, i in movementListItems" :key="m.key"
                                                  :movement="m"
                                                  :movement-ap-icon="movementApIcon"
                                                  :movement-ap-icon-color="movementApIconColor"
                                                  @deleteEntryEmit="deleteDialog($event)"
                                                  @moveEntryEmit="moveEntry($event, i)"
                                                  @subtractAP="subtractAP($event)"
                                                  @updateEntryEmit="updateDialog($event)"> </MovementListItem>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <div class="text-center">
            <v-dialog v-model="dialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{dialog.type}} Movement
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="form"
                                v-model="valid"
                                :disabled="dialog.type == 'Delete'">
                            <v-text-field label="Amount"
                                          type="number"
                                          v-model="movement.amount"
                                          ref="amount"
                                          required></v-text-field>
                            <!--:rules="numberRules"-->
                            <v-select label="Characteristic x2"
                                      :items="characteristics.map(x => x.name)"
                                      v-model="movement.characteristic"
                                      clearable>
                            </v-select>
                            <!--<TooltipComponent slot="prepend" :text="'CHAR used to make check and gets added to damage.'"></TooltipComponent>-->
                            <v-autocomplete label="Type"
                                            v-model="movement.type"
                                            :items="movementTypesComp"
                                            :rules="textRules"
                                            required></v-autocomplete>
                            <v-text-field label="Description"
                                          v-model="movement.description"></v-text-field>
                        </v-form>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="primary" v-if="dialog.type == 'Add'" :disabled="!valid"
                               @click="addEntry">Add</v-btn>
                        <v-btn color="primary" v-if="dialog.type == 'Edit'" :disabled="!valid"
                               @click="updateEntry">Save</v-btn>
                        <v-btn color="error" v-if="dialog.type == 'Delete'"
                               @click="deleteEntry">Delete</v-btn>
                        <v-btn color="secondary"
                               @click="dialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import MovementListItem from './MovementListItem.vue'

    export default {
        name: 'MovementSection',
        components: {
            MovementListItem
        },
        props: {
            ap: Number,
            canEdit: Boolean,
            characteristics: Array,
            movementApIcon: String,
            movementApIconColor: String,
            movements: Array,
            movementTypes: Array,
            panelProp: Number,
            statusAccelerated: Boolean,
            statusHobbled: Boolean,
            statusMovementUpDown: Number,
            statusRooted: Boolean
        },
        computed: {
            movementListItems() {
                let movements = []

                this.movements.forEach(movement => {
                    let m = JSON.parse(JSON.stringify(movement))
                    m.amount = (m.amount) ? m.amount : 0
                    let doubleChar = (m.characteristic) ? (this.characteristics.find(x => x.name == m.characteristic).adjustedAmount * 2) : 0
                    m.amount = +m.amount + +doubleChar
                    if (m.type == 'Land Speed' && !m.isBuff) {
                        let doubleFit = this.characteristics.find(x => x.name == 'fitness').adjustedAmount * 2
                        m.amount = +m.amount + +doubleFit
                    }
                    if (this.statusAccelerated || this.statusHobbled || this.statusMovementUpDown || this.statusRooted) {
                        if (this.statusRooted)
                            m.amount = 0
                        else {
                            //if (buffAmount)
                            //    m.amount = +m.amount + +buffAmount
                            if (this.statusMovementUpDown)
                                m.amount = +m.amount + +this.statusMovementUpDown
                            if (m.amount < 0)
                                m.amount = 0
                            if (this.statusAccelerated && m.amount > 0)
                                m.amount *= 2
                            if (this.statusHobbled && m.amount > 0)
                                m.amount = Math.floor(m.amount / 2)
                        }
                    }
                    m.canEdit = !m.isBuff
                    m.key = m.amount + m.description + m.id + this.ap + m.type + this.statusAccelerated + this.statusHobbled + this.statusMovementUpDown + this.statusRooted

                    movements.push(m)
                })

                return movements
            },
            movementTypesComp() {
                let usedMovements = this.movements.filter(x => { return !x.isBuff }).map(x => x.type)
                let movementTypes = this.movementTypes.filter(t => !usedMovements.includes(t))
                if (this.dialog.type == 'Edit')
                    movementTypes.push(this.movement.type)
                return movementTypes.sort()
            },
            uniqueMovements() {
                let movements = []

                let uniqueMovementTypes = [...new Set(this.movementListItems.map(x => (x.type)))].sort()

                uniqueMovementTypes.forEach((type) => {
                    let passiveMovement = this.movementListItems.filter(x => { return x.type == type && (!x.isBuff || x.isEquipment) })
                        .reduce((max, movement) => max.amount > movement.amount ? max : movement, { amount: 0 })
                    let buffMovement = this.movementListItems.filter(x => { return x.type == type && x.isBuff && !x.isEquipment })
                        .reduce((max, movement) => max.amount > movement.amount ? max : movement, { amount: 0 })
                    let amount = +passiveMovement.amount + +buffMovement.amount
                    let movement = {
                        amount: amount,
                        canEdit: false,
                        isUnique: true,
                        key: amount + type,
                        type: `Combined ${type}`
                    }
                    movements.push(movement)
                })

                return movements
            }
        },
        data() {
            return {
                dialog: {
                    show: false,
                    type: ''
                },
                // Input Fields Start
                clearMovement: {
                    amount: 0,
                    characteristic: '',
                    description: '',
                    id: '',
                    isBuff: false,
                    type: '',
                },
                movement: {
                    amount: 1,
                    characteristic: '',
                    description: '',
                    id: '',
                    isBuff: false,
                    type: ''
                },
                // Input Fields End
                panel: this.panelProp,
                subPanel: null,
                // Validation Start
                textRules: [
                    v => !!v || 'Field may not be empty'
                ],
                numberRules: [
                    v => !isNaN(+v) && v >= 1 || 'Field may not be empty and value must be 1 or higher'
                ],
                valid: false
                // Validation End
            }
        },
        methods: {
            // CRUD Functions Start
            addEntry() {
                if (this.validate()) {
                    this.dialog.show = false
                    this.$emit('addEntryEmit', { arrayName: 'movements', object: this.movement })
                }
            },
            deleteEntry() {
                this.dialog.show = false
                this.$emit('deleteEntryEmit', { arrayName: 'movements', object: this.movement })
            },
            moveEntry(direction, index) {
                this.$emit('moveEntryEmit', { arrayName: 'movements', index: index, direction: direction })
            },
            updateEntry() {
                this.dialog.show = false
                this.$emit('updateEntryEmit', { arrayName: 'movements', object: this.movement })
            },
            // CRUD Functions End
            // Open Dialog Functions
            addDialog() {
                this.subPanel = 0
                this.setDialog('Add')
                this.movement = JSON.parse(JSON.stringify(this.clearMovement))
                setTimeout(() => {
                    this.$refs.amount.focus()
                }, 200)
            },
            deleteDialog(id) {
                this.movement = JSON.parse(JSON.stringify(this.movements.find(x => x.id == id)))
                this.setDialog('Delete')
            },
            setDialog(type) {
                this.dialog = {
                    show: true,
                    type: type
                }
            },
            updateDialog(id) {
                this.movement = JSON.parse(JSON.stringify(this.movements.find(x => x.id == id)))
                this.setDialog('Edit')
            },
            // Open Dialog Functions End
            subtractAP(apCost) {
                this.$emit('subtractAPEmit', apCost)
            },
            validate() {
                return this.$refs.form.validate()
            }
        },
        watch: {
            panel() {
                this.$emit('updatePanelEmit', { name: 'movementPanel', value: this.panel })
            }
        }
    }
</script>