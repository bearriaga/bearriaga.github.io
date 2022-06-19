<template>
    <div>

        <h4 class="text-center">Oatsys Chacter Sheet</h4>
        <form onsubmit="return false;">
            <v-row>
                <v-col cols="4" md="2">
                    <v-text-field label="Name" v-model="characterSheet.name"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Race" v-model="characterSheet.race"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Age" v-model="characterSheet.age" type="number"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Size" v-model="characterSheet.size" type="number"></v-text-field>
                </v-col>
                <v-col cols="4" md="2">
                    <v-row>
                        <v-col cols="10">
                            <v-text-field label="Level" v-model="characterSheet.level" disabled></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" color="primary" dark>
                                        mdi-information
                                    </v-icon>
                                </template>
                                <span>Level = XP Earned / 500 round down</span>
                            </v-tooltip>

                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="4" md="2">
                    <v-text-field label="Movement in Squares" v-model="characterSheet.movement" type="number" disabled></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="3">
                    <h3 class="text-center"> Characteristics </h3>
                    <v-row>
                        <v-col cols="6" md="4" v-for="char in characteristicViewItems" :key="char.key">
                            <CharacteristicViewItem @updatePropEmit="updateProp($event)"
                                                    @rollDiceCheckEmit="rollDiceCheck($event)"
                                                    :characteristic="{
                                                abbreviation: char.abbreviation,
                                                name: char.name,
                                                value: char.value}"></CharacteristicViewItem>
                        </v-col>
                    </v-row>

                    <SkillSection :characteristics="characteristics"
                                  :skills="skills"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"
                                  @rollDiceCheckEmit="rollDiceCheck($event)"></SkillSection>
                </v-col>
                <v-col cols="12" md="3">
                    <!-- TODO: Add green plus or medical bag icon to heal -->
                    <h3 class="text-center"> Health </h3>
                    <v-form>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field type="number" min="0" v-model="damageToTake.amount">
                                    <v-icon color="success" slot="append" @click="heal">mdi-plus</v-icon>
                                    <v-icon color="error" slot="append" @click="takeDamage">mdi-liquid-spot</v-icon>
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-select label="Type" :items="damageTypes" v-model="damageToTake.type"></v-select>
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-row>
                        <v-col cols="12" xl="6" v-for="input in inputWithEditModals" :key="input.key">
                            <InputWithEditModal @updatePropEmit="updateProp($event)"
                                                :property-object="input"></InputWithEditModal>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3">
                    <ResourceSection :resources="resources"
                                     :characteristics="characteristics"
                                     @addEntryEmit="addEntry($event)"
                                     @deleteEntryEmit="deleteEntry($event)"
                                     @updateEntryEmit="updateEntry($event)"></ResourceSection>
                    <ResistanceSection :resistances="characterSheet.resistances"
                                       :damage-groups="damageGroups"
                                       :damage-types="damageTypes"
                                       @addEntryEmit="addEntry($event)"
                                       @deleteEntryEmit="deleteEntry($event)"
                                       @updateEntryEmit="updateEntry($event)"></ResistanceSection>
                    <MovementSection :movements="characterSheet.movements"
                                     :movement-types="movementTypes"
                                     @addEntryEmit="addEntry($event)"
                                     @deleteEntryEmit="deleteEntry($event)"
                                     @updateEntryEmit="updateEntry($event)"></MovementSection>
                </v-col>
                <v-col cols="12" md="3">
                    <h3 class="text-center"> Money </h3>
                    <v-text-field label="Money"
                                  type="number"
                                  v-model="characterSheet.money"></v-text-field>

                    <h3 class="text-center"> XP </h3>
                    <v-text-field label="Available XP" v-model="characterSheet.xp" disabled></v-text-field>

                    <XPSection :xp="characterSheet.xp"
                               :xp-earned="characterSheet.xpEarned"
                               :xp-total="characterSheet.xpTotal"
                               :xp-entries="characterSheet.xpEntries"
                               @addEntryEmit="addEntry($event)"
                               @deleteEntryEmit="deleteEntry($event)"
                               @updateEntryEmit="updateEntry($event)"></XPSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6" md="3">
                    <ClassSection :unlocked="false"
                                  :characteristics="characteristics"
                                  :classes="characterSheet.classes.filter(x => { return !x.unlocked })"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"></ClassSection>
                </v-col>
                <v-col cols="6" md="3">
                    <ClassSection :unlocked="true"
                                  :characteristics="characteristics"
                                  :classes="characterSheet.classes.filter(x => { return x.unlocked })"
                                  @addEntryEmit="addEntry($event)"
                                  @deleteEntryEmit="deleteEntry($event)"
                                  @updateEntryEmit="updateEntry($event)"></ClassSection>
                </v-col>
                <v-col cols="6" md="3"></v-col>
                <v-col cols="6" md="3">
                    <FlawSection :flaws="characterSheet.flaws"
                                 @addEntryEmit="addEntry($event)"
                                 @deleteEntryEmit="deleteEntry($event)"
                                 @updateEntryEmit="updateEntry($event)"></FlawSection>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn color="primary" @click="setCharacterAsTupoc">Set as Tupoc</v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" @click="loadCharacter">Load Character</v-btn>
                </v-col>
                <v-col>
                    <v-btn color="primary" @click="saveCharacter">Save Character</v-btn>
                </v-col>
            </v-row>
        </form>

        <div class="text-center">
            <v-dialog v-model="checkDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Dice Check Results
                    </v-card-title>

                    <v-card-text>
                        Dice Results: {{checkDialog.diceResults}}
                    </v-card-text>

                    <v-card-text>
                        Successes: {{checkDialog.successes}}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="checkDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <div class="text-center">
            <v-dialog v-model="generalDialog.show" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        {{generalDialog.title}}
                    </v-card-title>

                    <v-card-text>
                        {{generalDialog.text}}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="justify-end">
                        <v-btn color="secondary"
                               @click="generalDialog.show = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import CharacteristicViewItem from './CharacteristicViewItem.vue'
    import ClassSection from './ClassSection.vue'
    import FlawSection from './FlawSection.vue'
    import InputWithEditModal from './InputWithEditModal.vue'
    import MovementSection from './MovementSection.vue'
    import ResistanceSection from './ResistanceSection.vue'
    import ResourceSection from './ResourceSection.vue'
    import SkillSection from './SkillSection.vue'
    import XPSection from './XPSection.vue'

    export default {
        name: 'CharacterSheet',
        components: {
            CharacteristicViewItem,
            ClassSection,
            FlawSection,
            InputWithEditModal,
            MovementSection,
            ResistanceSection,
            ResourceSection,
            SkillSection,
            XPSection
        },
        computed: {
            //Character Properties
            apMax() {
                return ((this.characterSheet.speedPreperationIsKey) ? 3 * (parseInt(this.characterSheet.speed) + 2) : 2 * (parseInt(this.characterSheet.speed) + 2))
            },
            attunementSlotsMax() {
                return (10 + parseInt(this.characterSheet.attunementSlotsIncreases))
            },
            bpMax() {
                return parseInt(this.characterSheet.resistance) + parseInt(this.characterSheet.bpIncreases)
            },
            dcToHit() {
                return 1 + (Math.floor(this.characterSheet.dexterity / 2)) + parseInt(this.characterSheet.dcToHitIncreases)
            },
            hpMax() {
                return ((this.characterSheet.level * 5) + ((parseInt(this.characterSheet.strength) + parseInt(this.characterSheet.resistance)) * 3) + parseInt(this.characterSheet.hpIncreases))
            },
            initiative() {
                return this.characterSheet.speed + this.characterSheet.initiativeIncreases
            },
            level() {
                let nonClassXP = this.characterSheet.xpEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
                return Math.floor(nonClassXP / 500)
            },
            movement() {
                return parseInt(this.characterSheet.dexterity) + this.characterSheet.movements.filter(x => { return x.type == 'Land Speed' }).reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
            },
            rerollsMax() {
                return parseInt(this.characterSheet.luck) + parseInt(this.characterSheet.rerollsIncreases)
            },
            xp() {
                return this.characterSheet.xpTotal - this.characterSheet.abilities.reduce((previousValue, entry) => {
                    if (!entry.boughtForFree)
                        return parseInt(previousValue) + parseInt(entry.xpCost)
                    else
                        return parseInt(previousValue)
                }, 0)
            },
            xpEarned() {
                return this.characterSheet.xpEntries.reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
            },
            /// TODO: remove logic adding xp for classes that are not unlocked
            xpTotal() {
                var flawsXP = this.characterSheet.flaws.reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
                return (this.characterSheet.xpEarned + flawsXP)
            },
            //Character Properties End
            characteristicViewItems() {
                return [
                    {
                        abbreviation: 'STR',
                        key: 'str' + this.characterSheet.id,
                        name: 'strength',
                        value: this.characterSheet.strength
                    },
                    {
                        abbreviation: 'DEX',
                        key: 'dex' + this.characterSheet.id,
                        name: 'dexterity',
                        value: this.characterSheet.dexterity
                    },
                    {
                        abbreviation: 'SPD',
                        key: 'spd' + this.characterSheet.id,
                        name: 'speed',
                        value: this.characterSheet.speed
                    },
                    {
                        abbreviation: 'INT',
                        key: 'int' + this.characterSheet.id,
                        name: 'intelligence',
                        value: this.characterSheet.intelligence
                    },
                    {
                        abbreviation: 'CUN',
                        key: 'cun' + this.characterSheet.id,
                        name: 'cunning',
                        value: this.characterSheet.cunning
                    },
                    {
                        abbreviation: 'RES',
                        key: 'res' + this.characterSheet.id,
                        name: 'resistance',
                        value: this.characterSheet.resistance
                    },
                    {
                        abbreviation: 'LCK',
                        key: 'lck' + this.characterSheet.id,
                        name: 'luck',
                        value: this.characterSheet.luck
                    }
                ]
            },
            damageTypes() {
                var resistances = []
                this.damageGroups.forEach((group) => {
                    resistances.push(group.name)
                    group.types.forEach((type) => {
                        resistances.push(type.name)
                    })
                })
                return resistances
            },
            /// TODO: Break out DC to own component and make look like DND Beyond
            /// TODO: Break out AP or modify it to have plus button in front to add AP gain
            /// TODO: Add minus to BP, Rerolls to lower value by one
            inputWithEditModals() {
                return [
                    {
                        dialogText: 'Health Points Max = (level * 5) + ((STR + RES) * 3) + purchased HP',
                        key: 'hp' + this.characterSheet.hpMax + this.updateHP.toString(),
                        label: 'Health Points',
                        type: 'number',
                        value: this.characterSheet.hp,
                        valueName: 'hp',
                        valueIncreases: this.characterSheet.hpIncreases,
                        valueIncreasesLabel: 'HP Purchases',
                        valueIncreasesName: 'hpIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.hpMax,
                        disabled: false,
                        plus: true,
                        minus: true
                    },
                    {
                        dialogText: 'Your maximum AP pool is increased from 2x your AP generation to 3x your generation rate.',
                        key: 'ap' + this.characterSheet.apMax,
                        label: 'Action Points',
                        type: 'number',
                        value: this.characterSheet.ap,
                        valueName: 'ap',
                        valueIncreases: this.characterSheet.speedPreperationIsKey,
                        valueIncreasesLabel: 'Speed: Preperation is Key',
                        valueIncreasesName: 'speedPreperationIsKey',
                        valueIncreasesType: 'bool',
                        valueMax: this.characterSheet.apMax,
                        disabled: false,
                        plus: true,
                        minus: true
                    },
                    {
                        dialogText: '',
                        key: 'dc' + this.characterSheet.dcToHit,
                        label: 'DC to Hit',
                        type: 'number',
                        value: this.characterSheet.dcToHit,
                        valueName: 'dc',
                        valueIncreases: this.characterSheet.dcToHitIncreases,
                        valueIncreasesLabel: 'DC to Hit Purchases',
                        valueIncreasesName: 'dcToHitIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.dcToHit,
                        disabled: false,
                        plus: false,
                        minus: false
                    },
                    {
                        dialogText: '',
                        key: 'bp' + this.characterSheet.bpMax,
                        label: 'Breakthrough Points',
                        type: 'number',
                        value: this.characterSheet.bp,
                        valueName: 'bp',
                        valueIncreases: this.characterSheet.bpIncreases,
                        valueIncreasesLabel: 'Breakthrough Points Purchases',
                        valueIncreasesName: 'bpIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.bpMax,
                        disabled: false,
                        plus: false,
                        minus: true
                    },
                    {
                        dialogText: '',
                        key: 'rerolls' + this.characterSheet.rerollsMax,
                        label: 'Rerolls',
                        type: 'number',
                        value: this.characterSheet.rerolls,
                        valueName: 'rerolls',
                        valueIncreases: this.characterSheet.rerollsIncreases,
                        valueIncreasesLabel: 'Rerolls Purchases',
                        valueIncreasesName: 'rerollsIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.rerollsMax,
                        disabled: false,
                        plus: false,
                        minus: true
                    },
                    {
                        dialogText: '',
                        key: 'attunementSlots' + this.characterSheet.attunementSlotsMax,
                        label: 'Attunement Slots',
                        type: 'number',
                        value: this.characterSheet.attunementSlots,
                        valueName: 'attunementSlots',
                        valueIncreases: this.characterSheet.attunementSlotsIncreases,
                        valueIncreasesLabel: 'Attunement Slot Purchases',
                        valueIncreasesName: 'attunementSlotsIncreases',
                        valueIncreasesType: 'number',
                        valueMax: this.characterSheet.attunementSlotsMax,
                        disabled: false,
                        plus: false,
                        minus: false
                    }
                ]
            },
            resources() {
                let resources = []

                this.characterSheet.resources.forEach((resource) => {
                    let primaryCharValue = this.characterSheet[resource.primaryCharacteristic]
                    resource.amountMax = parseInt(primaryCharValue) + parseInt(resource.resourceIncreases)
                    resource.key = resource.name + resource.primaryCharacteristic + resource.resourceIncreases + primaryCharValue
                    resources.push(resource)
                })

                return resources
            },
            skills() {
                let skills = []

                this.characterSheet.skills.forEach((skill) => {
                    skill.value = parseInt(skill.skillIncreases) + parseInt(this.characterSheet[skill.characteristic])
                    skill.key = skill.name + skill.characteristic + skill.skillIncreases + this.characterSheet[skill.characteristic]
                    skills.push(skill)
                })

                return skills
            }
        },
        created() {
            this.characterInit()
        },
        data() {
            return {
                characteristics: [
                    'strength',
                    'dexterity',
                    'speed',
                    'intelligence',
                    'cunning',
                    'resistance',
                    'luck'
                ],
                characterSheet: {
                    id: '',
                    age: 0,
                    ap: 0,
                    apMax: 0, //2 * [AP Gain(SPD + 2)]
                    attunementSlots: 0, //10 + attunementSlotsIncreases - attunements.sum(amount)
                    attunementSlotsIncreases: 0,
                    attunementSlotsMax: 0,
                    background: '',
                    bp: 0,
                    bpMax: 0, //RES + bpIncreases
                    bpIncreases: 0,
                    //Characteristics Start
                    strength: 0,
                    dexterity: 0,
                    speed: 0,
                    intelligence: 0,
                    cunning: 0,
                    resistance: 0,
                    luck: 0,
                    //Characteristics End
                    dcToHit: 0, //1 + (DEX/2 Rounded Down) + dcToHitIncreases
                    dcToHitIncreases: 0,
                    hp: 0,
                    hpMax: 0, //(level * 5) + ((STR+RES) * 3) + hpIncreases
                    hpIncreases: 0,
                    initiative: 0, //SPD + initiativeIncreases
                    initiativeIncreases: 0,
                    level: 0, //xpEarned/500 round down
                    luckFavored: false,
                    luckNothingToChance: false,
                    money: 0,
                    movement: 0, // DEX + movements.where(land speed).sum
                    name: '',
                    race: '',
                    rerolls: 0,
                    rerollsMax: 0, //LCK + rerollsIncreases
                    rerollsIncreases: 0,
                    size: 1,
                    speedPreperationIsKey: false,
                    xp: 0, //xpTotal - abilities.where(!boughtForFree).sum(xpCost)
                    xpEarned: 0, //xpEntries sum
                    xpTotal: 0, //xpEntries sum + flaws sum
                    abilities: [
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 0,
                            components: []
                        }
                    ],
                    armor: [
                        {
                            effect: '',
                            name: '',
                            slot: '',
                            resistances: [
                                {
                                    amount: 0,
                                    type: 'Physical'
                                }
                            ],
                        }
                    ],
                    attunements: [
                        {
                            amount: 0,
                            name: ''
                        }
                    ],
                    classes: [
                        {
                            active: true,
                            advanceRank: 0,
                            description: 'Class 1',
                            id: '058a51e2-b2d1-420b-9a95-85794b03b3a5',
                            name: '',
                            primaryCharacteristic: 'strength', //Selected from above characteristics
                            unlocked: false
                        },
                        {
                            active: false,
                            advanceRank: 0,
                            description: 'Unlocked Class 1',
                            id: '988d5a1e-a994-4ecc-b61c-191d5e85c6d9',
                            name: '',
                            primaryCharacteristic: 'strength', //Selected from above characteristics
                            unlocked: true
                        }
                    ],
                    flaws: [
                        {
                            amount: 0,
                            description: '',
                            id: '1655066475111',
                            name: ''
                        }
                    ],
                    items: [
                        {
                            amount: 0,
                            description: '',
                            name: ''
                        }
                    ],
                    movements: [
                        {
                            amount: 0,
                            description: '',
                            id: '1654453228548',
                            type: 'Flying'
                        }
                    ],
                    resistances: [
                        {
                            amount: 0,
                            id: '1654401755465',
                            type: 'Physical'
                        }
                    ],
                    resources: [
                        //default first entry based on primaryCharacteristic
                        {
                            amount: 0,
                            amountMax: 0, // default ? primaryCharacteristic + resourceIncreases : 1 + resourceIncreases
                            id: '1654827507939',
                            name: 'Default Resource',
                            primaryCharacteristic: 'strength',
                            resourceIncreases: 0
                        }
                    ],
                    skills: [
                        {
                            characteristic: 'strength',
                            default: true,
                            id: '1654717712607',
                            name: 'Athletics',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713076',
                            name: 'Deception',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713536',
                            name: 'Perception',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713981',
                            name: 'Persuasion',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'dexterity',
                            default: true,
                            id: '1654717715257',
                            name: 'Stealth',
                            skillIncreases: 0,
                            value: 0
                        }
                    ],
                    xpEntries: [
                        {
                            amount: 500,
                            classXP: false,
                            description: 'Character Creation',
                            date: null,
                            id: '1654386228029'
                        }
                    ]
                },
                checkDialog: {
                    show: false,
                    diceResults: [],
                    successes: 0
                },
                damageGroups: [
                    {
                        color: 'green lighten-3',
                        icon: 'mdi-shield-sun',
                        name: 'Elemental',
                        types: [
                            { name: 'Acid', icon: 'mdi-flask-outline' },
                            { name: 'Cold', icon: 'mdi-snowflake' },
                            { name: 'Electric', icon: 'mdi-lightning-bolt' },
                            { name: 'Fire', icon: 'mdi-fire' },
                            { name: 'Energy/Arcane', icon: 'mdi-laser-pointer' }
                        ]
                    },
                    {
                        color: 'deep-purple lighten-3',
                        icon: 'mdi-shield-cross',
                        name: 'Esoteric',
                        types: [
                            { name: 'Dark', icon: 'mdi-skull' },
                            { name: 'Force', icon: 'mdi-rotate-orbit' },
                            { name: 'Light', icon: 'mdi-centos' },
                            { name: 'Psionic', icon: 'mdi-brain' },
                            { name: 'Toxic', icon: 'mdi-biohazard' }
                        ]
                    },
                    {
                        color: 'orange lighten-3',
                        icon: 'mdi-shield-sword',
                        name: 'Physical',
                        types: [
                            { name: 'Blunt', icon: 'mdi-gavel' },
                            { name: 'Explosive', icon: 'mdi-bomb' },
                            { name: 'Piercing', icon: 'mdi-arrow-projectile' },
                            { name: 'Slashing', icon: 'mdi-sword' }
                        ]
                    }
                ],
                damageToTake:
                {
                    amount: 0,
                    type: ''
                },
                generalDialog: {
                    show: false,
                    text: '',
                    title: ''
                },
                movementTypes: [
                    'Burrowing',
                    'Flying',
                    'Gliding',
                    'Hover',
                    'Land Speed',
                    'Leap',
                    'Spider Climbing',
                    'Swim Speed',
                    'Teleport'
                ],
                updateHP: 0
            }
        },
        methods: {
            //Array CRUD Functions
            addEntry(object) {
                object.object.id = new Date().getTime().toString()
                this.characterSheet[object.arrayName].push(object.object)
            },
            deleteEntry(object) {
                this.characterSheet[object.arrayName] = this.characterSheet[object.arrayName].filter(x => { return x.id != object.object.id })
            },
            updateEntry(object) {
                var entriesDup = this.characterSheet[object.arrayName]
                var index = entriesDup.findIndex(x => x.id == object.object.id)
                entriesDup[index] = object.object
                this.characterSheet[object.arrayName] = []
                this.characterSheet[object.arrayName] = entriesDup
            },
            //Array CRUD Functions End
            characterInit() {
                this.characterSheet.apMax = (this.characterSheet.speedPreperationIsKey) ? 3 * (parseInt(this.characterSheet.speed) + 2) : 2 * (parseInt(this.characterSheet.speed) + 2)
                this.characterSheet.attunementSlotsMax = 10 + parseInt(this.characterSheet.attunementSlotsIncreases)
                /// TODO: attunement slots
                this.characterSheet.bpMax = parseInt(this.characterSheet.resistance) + parseInt(this.characterSheet.bpIncreases)
                this.characterSheet.dcToHit = 1 + (Math.floor(this.characterSheet.dexterity / 2)) + parseInt(this.characterSheet.dcToHitIncreases)

                //hpMax start, handles xpEarned, level, hpMax
                let nonClassXP = this.characterSheet.xpEntries.filter(entry => { return !entry.classXP }).reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
                this.characterSheet.level = Math.floor(nonClassXP / 500)
                this.characterSheet.xpEarned = this.characterSheet.xpEntries.reduce((previousValue, entry) => {
                    return parseInt(previousValue) + parseInt(entry.amount)
                }, 0)
                //hpMax end
                this.characterSheet.initiative = this.characterSheet.speed + this.characterSheet.initiativeIncreases
                this.characterSheet.rerollsMax = parseInt(this.characterSheet.luck) + parseInt(this.characterSheet.rerollsIncreases)

                this.characterSheet.xp = this.characterSheet.xpTotal - this.characterSheet.abilities.reduce((previousValue, entry) => {
                    if (!entry.boughtForFree)
                        return parseInt(previousValue) + parseInt(entry.xpCost)
                    else
                        return parseInt(previousValue)
                }, 0)

                var resourcesDup = this.characterSheet.resources
                resourcesDup.forEach((resource) => {
                    var primaryCharValue = this.characterSheet[resource.primaryCharacteristic]
                    resource.amountMax = primaryCharValue + resource.resourceIncreases
                })
                this.characterSheet.resources = []
                this.characterSheet.resources = resourcesDup
            },
            //Dice Roll Functions
            determineSuccesses(dieResult) {
                if (dieResult < 4)
                    return 0
                if (dieResult < 6)
                    return 1
                if (dieResult >= 6)
                    return 2
            },
            getRandomIntInclusive(min, max) {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
            },
            rollDiceCheck(diceToRoll) {
                var result = {
                    show: true,
                    diceResults: [],
                    successes: 0
                }

                if (diceToRoll > 0) {
                    diceToRoll = parseInt(diceToRoll) + Math.floor(this.characterSheet.intelligence / 2)

                    for (var i = 0; i < diceToRoll; i++) {
                        var dieResult = this.getRandomIntInclusive(1, 6)
                        result.diceResults.push(dieResult)
                        result.successes += this.determineSuccesses(dieResult)
                    }

                    if (!this.characterSheet.luckNothingToChance) {
                        if (result.diceResults[0] == 6 || (this.characterSheet.luckFavored && result.diceResults[0] >= 5))
                            result.successes += this.characterSheet.luck
                    }
                }

                this.checkDialog = result
            },
            //Dice Roll Functions End
            //Local Storage Functions
            loadCharacter() {
                this.characterSheet = JSON.parse(localStorage.getItem('character'))
            },
            saveCharacter() {
                var character = this.characterSheet
                character.id = new Date().getTime().toString()
                localStorage.setItem('character', JSON.stringify(character))
            },
            //Local Storage Functions End
            setCharacterAsTupoc() {
                this.characterSheet =
                {
                    id: 'tupoc',
                    age: 30,
                    ap: 0,
                    apMax: 0,
                    attunementSlots: 0,
                    attunementSlotsIncreases: 0,
                    attunementSlotsMax: 0,
                    background: 'Slave Warrior',
                    bp: 0,
                    bpMax: 0,
                    bpIncreases: 0,
                    //Characteristics Start
                    strength: 6,
                    dexterity: 4,
                    speed: 5,
                    intelligence: 2,
                    cunning: 2,
                    resistance: 5,
                    luck: 3,
                    //Characteristics End
                    dcToHit: 0,
                    dcToHitIncreases: 1,
                    hp: 0,
                    hpMax: 0,
                    hpIncreases: 20,
                    initiative: 0,
                    initiativeIncreases: 0,
                    level: 0,
                    luckFavored: false,
                    luckNothingToChance: false,
                    money: 0,
                    movement: 0,
                    name: 'Tupoc',
                    race: 'Human',
                    rerolls: 0,
                    rerollsMax: 0,
                    rerollsIncreases: 0,
                    size: 1,
                    speedPreperationIsKey: false,
                    xp: 0,
                    xpEarned: 0,
                    xpTotal: 0,
                    abilities: [
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 270,
                            components: []
                        },
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 60,
                            components: []
                        },
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 45,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 10,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 100,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 30,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 10,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 150,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 200,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 30,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 250,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 230,
                            components: []
                        }
                        ,
                        {
                            apCost: '',
                            areaOfEffect: '',
                            boughtForFree: false,
                            crCost: '',
                            damage: '',
                            description: '',
                            duration: '',
                            handedness: '',
                            inClass: true,
                            maxSizeCategoryOfMass: '',
                            physMeta: '',
                            range: '',
                            xpCost: 40,
                            components: []
                        }
                    ],
                    armor: [
                        {
                            effect: '',
                            name: '',
                            slot: '',
                            resistances: [
                                {
                                    amount: 0,
                                    type: 'Physical'
                                }
                            ],
                        }
                    ],
                    attunements: [
                        {
                            amount: 0,
                            name: ''
                        }
                    ],
                    classes: [
                        {
                            active: true,
                            advanceRank: 0,
                            description: '',
                            id: '97ed5125-220f-45b6-8af4-8138742681d8',
                            name: 'Totem Warrior',
                            primaryCharacteristic: 'strength',
                            unlocked: false
                        },
                        {
                            active: true,
                            advanceRank: 0,
                            description: '',
                            id: 'e93df7c1-0bf0-459f-9a73-6f92e628bb30',
                            name: 'Game Hunter',
                            primaryCharacteristic: 'strength',
                            unlocked: false
                        },
                        {
                            active: false,
                            advanceRank: 0,
                            description: '',
                            id: '9edd8ab9-20f1-44c4-9d4d-aad4c61005d2',
                            name: 'Necromancer',
                            primaryCharacteristic: '',
                            unlocked: true
                        }
                    ],
                    flaws: [
                        {
                            amount: 80,
                            description: 'It is hard for me to turn down anyone in authority.',
                            id: '1655066483036',
                            name: 'Subservient'
                        }
                    ],
                    items: [
                        {
                            amount: 0,
                            description: '',
                            name: ''
                        }
                    ],
                    movements: [
                    ],
                    resistances: [
                        {
                            amount: 10,
                            id: '1654401769902',
                            type: 'Physical'
                        },
                        {
                            amount: 10,
                            id: '1654656967612',
                            type: 'Dark'
                        }
                    ],
                    resources: [
                        //default first entry based on primaryCharacteristic
                        {
                            amount: 0,
                            amountMax: 0, // default ? primaryCharacteristic + resourceIncreases : 1 + resourceIncreases
                            id: '1654827508408',
                            name: 'Stamina',
                            primaryCharacteristic: 'strength',
                            resourceIncreases: 0
                        },
                        {
                            amount: 0,
                            amountMax: 0, // default ? primaryCharacteristic + resourceIncreases : 1 + resourceIncreases
                            id: '1654827539670',
                            name: 'Hunter Sense',
                            primaryCharacteristic: 'cunning',
                            resourceIncreases: 0
                        }
                    ],
                    skills: [
                        {
                            characteristic: 'strength',
                            default: true,
                            id: '1654717712607',
                            name: 'Athletics',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713076',
                            name: 'Deception',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713536',
                            name: 'Perception',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: true,
                            id: '1654717713981',
                            name: 'Persuasion',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'dexterity',
                            default: true,
                            id: '1654717715257',
                            name: 'Stealth',
                            skillIncreases: 0,
                            value: 0
                        },
                        {
                            characteristic: 'cunning',
                            default: false,
                            id: '1654740071550',
                            name: 'Big Game Tracking',
                            skillIncreases: 2,
                            value: 0
                        }
                    ],
                    xpEntries: [
                        {
                            amount: 500,
                            classXP: false,
                            description: 'Character Creation',
                            date: '2022-04-22',
                            id: '1654386228019'
                        },
                        {
                            amount: 310,
                            classXP: false,
                            description: '',
                            date: '2022-05-06',
                            id: '1654386228018'
                        },
                        {
                            amount: 315,
                            classXP: false,
                            description: '',
                            date: '2022-06-20',
                            id: '1654386228017'
                        }
                    ]
                }
            },
            heal() {
                if (this.damageToTake.amount > 0) {
                    this.characterSheet.hp = parseInt(this.characterSheet.hp) + parseInt(this.damageToTake.amount)
                    this.updateHP = this.updateHP + 1
                }
            },
            takeDamage() {
                var damage = this.damageToTake.amount
                var type = this.damageToTake.type
                var resistanceAmount = 0;

                this.damageGroups.forEach((group) => {
                    //check if type is in the group.types array
                    if (type == group.name || group.types.some(x => x.name == type)) {
                        resistanceAmount = this.characterSheet.resistances
                            .filter(x => { return x.type == type || x.type == group.name })
                            .reduce((previousValue, entry) => {
                                return parseInt(previousValue) + parseInt(entry.amount)
                            }, 0)

                        if (group.name == 'Physical')
                            resistanceAmount += parseInt(this.characterSheet.strength)
                    }
                })

                var damageToTake = damage - resistanceAmount
                if (damageToTake > 0) {
                    this.characterSheet.hp = this.characterSheet.hp - damageToTake
                    this.updateHP = this.updateHP + 1
                }
            },
            updateProp(prop) {
                if (prop.type == 'number')
                    this.characterSheet[prop.propName] = parseInt(prop.value)
                else
                    this.characterSheet[prop.propName] = prop.value
            }
        },
        watch: {
            apMax() {
                this.characterSheet.apMax = this.apMax
            },
            attunementSlotsMax() {
                this.characterSheet.attunementSlotsMax = this.attunementSlotsMax
            },
            bpMax() {
                this.characterSheet.bpMax = this.bpMax
            },
            dcToHit() {
                this.characterSheet.dcToHit = this.dcToHit
            },
            hpMax() {
                this.characterSheet.hpMax = this.hpMax
            },
            initiative() {
                this.characterSheet.initiative = this.initiative
            },
            level() {
                this.characterSheet.level = this.level
            },
            movement() {
                this.characterSheet.movement = this.movement
            },
            rerollsMax() {
                this.characterSheet.rerollsMax = this.rerollsMax
            },
            xp() {
                this.characterSheet.xp = this.xp
            },
            xpEarned() {
                this.characterSheet.xpEarned = this.xpEarned
            },
            xpTotal() {
                this.characterSheet.xpTotal = this.xpTotal
            }
        }
    }
</script>