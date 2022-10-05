<template>
    <div>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <v-row>
                        <v-col>
                            <h3 class="text-center">
                                {{name}}
                            </h3>
                        </v-col>
                        <v-col v-if="xp != 0 || money != 0">
                            <div v-if="xp != 0">XP: {{xp}}</div>
                            <div v-if="money != 0">Money: {{money}}</div>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="Title" v-model="name">
                                <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
                            </v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="XP"
                                          type="number"
                                          v-model="xp"
                                          ref="xp"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-switch label="Class XP" inset v-model="classXP"></v-switch>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Money" v-model="money" disabled></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Add/Subtract Money" type="number" min="0" v-model="moneyModifyAmount">
                                <v-icon color="success" slot="append" @click="moneyAddSubtract({add: true, amount: moneyModifyAmount})">mdi-plus</v-icon>
                                <v-icon color="error" slot="append" @click="moneyAddSubtract({add: false, amount: moneyModifyAmount})">mdi-minus</v-icon>
                            </v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Date" type="date" v-model="date"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Game Date" placeholder="Ex: Stardate 46635.2" v-model="gameDate"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea label="Notes" v-model="description"
                                        auto-grow outlined rows="1"></v-textarea>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
    export default {
        name: 'XPEntryListItem',
        props: {
            entry: Object
        },
        data() {
            return {
                classXP: this.entry.classXP,
                date: this.entry.date,
                description: this.entry.description,
                gameDate: this.entry.gameDate,
                money: this.entry.money,
                moneyModifyAmount: 0,
                name: this.entry.name,
                xp: this.entry.xp,
            }
        },
        methods: {
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.entry)
            },
            moneyAddSubtract(moneyObj) {
                if (moneyObj.add)
                    this.money = +this.money + +moneyObj.amount
                else
                    this.money = +this.money - +moneyObj.amount
                this.moneyModifyAmount = 0
                this.$emit('moneyAddSubtractEmit', moneyObj)
            },
            updateEntry() {
                var object = {
                    classXP: this.classXP,
                    date: this.date,
                    description: this.description,
                    gameDate: this.gameDate,
                    id: this.entry.id,
                    money: this.money,
                    name: this.name,
                    xp: this.xp
                }
                this.$emit('updateEntryEmit', object)
            }
        },
        watch: {
            classXP() {
                this.updateEntry()
            },
            date() {
                this.updateEntry()
            },
            description() {
                this.updateEntry()
            },
            gameDate() {
                this.updateEntry()
            },
            money() {
                this.updateEntry()
            },
            name() {
                this.updateEntry()
            },
            xp() {
                this.updateEntry()
            },
        }
    }
</script>