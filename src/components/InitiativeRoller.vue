<template>
    <div>
        <h1 class="text-center">Initiative</h1>
        <v-form>
            <v-row>
                <v-col cols="3">
                    <v-subheader>
                        Add Party To Initiative Tracker
                    </v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-select label="Parties"
                              :items="parties"
                              item-text="name"
                              item-value="id"
                              append-outer-icon="mdi-account-multiple-plus"
                              v-model="partyId">
                        <template v-slot:append-outer>
                            <v-btn color="success" @click="addParty">
                                <v-icon>
                                    mdi-account-multiple-plus
                                </v-icon>
                            </v-btn>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-subheader>
                        Add Person to Initiative Tracker
                    </v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-btn color="success" @click="addPerson">
                        <v-icon>
                            mdi-account-plus
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-subheader>
                        Roll Initiative
                    </v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-btn color="primary" @click="rollPeopleInitiatives">
                        <v-icon>
                            mdi-dice-6
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-subheader>
                        Sort Initiative Descending
                    </v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-btn color="primary" @click="sortPeople">
                        <v-icon>
                            mdi-sort-numeric-descending
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-subheader>
                        Save Initiatives
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary"
                                        v-bind="attrs"
                                        v-on="on">
                                    mdi-information
                                </v-icon>
                            </template>
                            <span>This saves the current state of the Initiative Tracker in Local Storage</span>
                        </v-tooltip>
                    </v-subheader>
                </v-col>
                <v-col cols="9">
                    <v-btn color="primary" @click="savePartyToLocal">
                        <v-icon>
                            mdi-content-save
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <h2>Initiative Tracker</h2>
        <v-form>
            <v-row v-for="(person, index) in people" :key="person.id + index">
                <v-col cols="3">
                    <v-text-field label="Name"
                                  v-model="person.name"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Initiative Modifier"
                                  type="number"
                                  v-model="person.modifier"></v-text-field>

                </v-col>
                <v-col cols="2">
                    <v-text-field label="Initiative"
                                  type="number"
                                  v-model="person.initiative"></v-text-field>

                </v-col>
                <v-col cols="2">
                    <v-checkbox label="Lock Initiative" v-model="person.lock">
                        <v-icon slot="append">
                            mdi-lock
                        </v-icon>
                    </v-checkbox>
                </v-col>
                <v-col cols="2">
                    <v-btn large color="error" @click="removePerson(person.id)">
                        <v-icon>
                            mdi-account-minus
                        </v-icon>
                    </v-btn>

                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'InitiativeComponent',
        computed: {

        },
        created() {
            this.partiesInit()
        },
        data() {
            return {
                defaultParties: [
                    {
                        id: '1654991590753',
                        name: 'Friday Night',
                        people: [
                            {
                                id: '1',
                                initiative: 0,
                                lock: false,
                                modifier: 2,
                                name: "Es'tonza Asadorna"
                            },
                            {
                                id: '2',
                                name: 'Fleegan',
                                modifier: 4,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '3',
                                name: 'Flimp',
                                modifier: 0,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '4',
                                name: 'Grumph',
                                modifier: 2,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '5',
                                name: 'Hugh Mynn',
                                modifier: 2,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '6',
                                name: 'Zog Qiral',
                                modifier: 4,
                                initiative: 0,
                                lock: false
                            }
                        ]
                    },
                    {
                        id: '1654991591642',
                        name: 'Wednesday Night',
                        people: [
                            {
                                id: '7',
                                name: "Anne 'Red' Bonny",
                                modifier: 4,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '8',
                                name: "Estria/Nyx",
                                modifier: 3,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '9',
                                name: "Urios Laughingstride",
                                modifier: 4,
                                initiative: 0,
                                lock: false
                            },
                            {
                                id: '10',
                                name: "Vinder Balam",
                                modifier: -3,
                                initiative: 0,
                                lock: false
                            }
                        ]
                    }
                ],
                partyId: '',
                parties: [],
                people: []
            }
        },
        methods: {
            addParty() {
                if (this.partyId) {
                    let party = this.parties.find(x => { return x.id == this.partyId })
                    party.people.forEach((person) => {
                        this.people.push(person)
                    })
                }
            },
            addPerson() {
                let person = {
                    id: new Date().getTime().toString(),
                    name: '',
                    modifier: 0,
                    initiative: 0,
                    lock: false
                }
                this.people.push(person)
            },
            // Initiative Code Start
            getRandomInt(max) {
                return Math.floor(Math.random() * max) + 1;
            },
            rollInitiative(modifier) {
                return this.getRandomInt(20) + +modifier
            },
            rollPeopleInitiatives() {
                let peopleDup = this.people
                peopleDup.forEach((person, index) => {
                    peopleDup[index].initiative = (!isNaN(person.modifier) && !person.lock) ? this.rollInitiative(person.modifier) : (!isNaN(person.initiative)) ? person.initiative : 0
                })
                peopleDup = peopleDup.sort(({ initiative: a }, { initiative: b }) => b - a)
                this.people = []
                this.people = peopleDup
            },
            sortPeople() {
                let peopleDup = this.people
                peopleDup = peopleDup.sort(({ initiative: a }, { initiative: b }) => b - a)
                this.people = []
                this.people = peopleDup
            },
            // Initiative Code End
            //Local Storage Functions
            getPartyFromLocal() {
                return JSON.parse(localStorage.getItem('initiativeParty'))
            },
            savePartyToLocal() {
                let party = {
                    id: new Date().getTime().toString(),
                    name: 'Saved Party',
                    people: this.people
                }
                localStorage.setItem('initiativeParty', JSON.stringify(party))
                this.partiesInit()
            },
            //Local Storage Functions End
            partiesInit() {
                this.parties = []
                this.defaultParties.forEach((party) => {
                    this.parties.push(party)
                })
                let localParty = this.getPartyFromLocal()
                if (localParty)
                    this.parties.push(localParty)
            },
            removePerson(personId) {
                this.people = this.people.filter(x => { return x.id != personId })
            }
        }
    }
</script>