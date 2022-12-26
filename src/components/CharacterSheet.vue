<template>
    <div>
        <CharacterComponent @logPushEmit="logPush($event)"
                            @updateCharacterSheetEmit="updateCharacterSheet($event)"
                            @saveOptionsEmit="saveOptions($event)"
                            :character="characterSheet"
                            :layout="layout"
                            :log="logDialog.selectedLog"
                            :log-id="logDialog.selectedLog.id"
                            :options="options"
                            :key="characterString"></CharacterComponent>

        <v-row>
            <v-col>
                <div>
                    <v-btn color="primary" @click="loadCharacter">Load Character</v-btn>
                </div>
                <div>
                    <v-btn v-if="$signedIn" color="primary" @click="charactersDialog = true">Load Characters from Database</v-btn>
                </div>
            </v-col>
            <v-col>
                <div>
                    <v-btn color="primary" @click="saveCharacterConfirm">Save Character</v-btn>
                </div>
                <div>
                    <v-btn v-if="$signedIn" color="primary" @click="saveToFirebaseConfirm">Save Character to Database</v-btn>
                </div>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        <v-btn color="primary" @click="saveCharacterAsFile">Export Character</v-btn>
                    </v-col>
                    <v-col>
                        <v-file-input label="Import Character" ref="doc" accept=".txt,.json" v-model="characterFile" @change="readCharacterFromFile"></v-file-input>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-select label="Layout" v-model="layout" :items="layoutOptions"></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="3" class="text-right">
                <v-btn color="primary"
                       elevation="2"
                       fab
                       @click="logDialog.show = true">
                    <v-icon>
                        mdi-book-open-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-dialog v-model="generalDialog.show" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    {{generalDialog.title}}
                </v-card-title>

                <v-card-text>
                    {{generalDialog.text}}
                    <div v-html="generalDialog.html"></div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn v-if="generalDialog.buttonText && generalDialog.buttonType" @click="generalDialogFunction">{{generalDialog.buttonText}}</v-btn>
                    <v-btn color="secondary"
                           @click="generalDialog.show = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="charactersDialog" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Load Character
                </v-card-title>
                <v-card-text class="text-center" v-for="c in characters" :key="c.id">
                    <v-btn color="primary" @click="loadSelectedCharacter(c.id)" min-width="150">{{c.name}}</v-btn>
                </v-card-text>
                <v-card-text v-if="characters.length == 0">
                    No Characters Saved in Database
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="secondary"
                           @click="charactersDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="logDialog.show" width="500" scrollable>
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Log
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="logDialog.log = []">Clear</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row class="text-center" v-for="l, i in logDialog.log" :key="i">
                        <v-col>
                            <v-btn color="primary" @click="loadLog(l)" min-width="150">{{l.title}}</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="secondary"
                           @click="logDialog.show = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show">
            {{ snackbar.text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink"
                       text
                       v-bind="attrs"
                       @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import CharacterComponent from './CharacterComponent.vue'
    import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
    import { db } from '@/stores/db'
    import { useCharacterStore } from '@/stores/CharacterStore'
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'CharacterSheet',
        components: {
            CharacterComponent
        },
        setup() {
            const characterStore = useCharacterStore()
            characterStore.fill()

            return {
                characterStore
            }
        },
        computed: {
            characterString() {
                return JSON.stringify(this.characterSheet.id) + this.characterUpdated
            }
        },
        created() {
            this.loadOptions()
            this.loadCharactersFromFirebase()
        },
        data() {
            return {
                abilityDialog: {
                    ability: {},
                    ap: '',
                    check: {
                        advantage: false,
                        diceCheckObject: {},
                        diceResults: [],
                        effects: [],
                        fate: 0,
                        show: false,
                        selectedRerolls: [],
                        successes: 0,
                        successesFromIntelligence: 0,
                        successesFromLuck: 0,
                        successesInput: 0,
                        threat: false
                    },
                    cr: '',
                    damage: {
                        char: 0,
                        damage: 0,
                        diceResults: [],
                        effects: [],
                        fit: 0,
                        flat: 0,
                        flatTotal: 0,
                        flatTotalBreakdown: '',
                        isCrit: false,
                        selectedRerolls: [],
                        show: false,
                        sum: 0,
                        types: []
                    },
                    effects: [],
                    isAbility: false,
                    multipleTargets: false,
                    save: {
                        amount: 0,
                        characteristic: '',
                        show: false
                    },
                    selectedEffects: [],
                    show: false,
                    title: '',
                    usedEffects: []
                },
                characters: [],
                charactersDialog: false,
                clearCharacter: this.characterStore.getCharacterById('clear'),
                characterFile: null,
                characterSheet: this.characterStore.getCharacterById('clear'),
                characterUpdated: 0,
                // Character Sheet Options Start
                layout: 'Condensed',
                layoutOptions: ['Condensed', 'Expanded'],
                // Character Sheet Options End
                generalDialog: {
                    buttonText: '',
                    buttonType: '',
                    html: '',
                    show: false,
                    text: '',
                    title: ''
                },
                logDialog: {
                    log: [],
                    selectedLog: {
                        copyText: '',
                        id: null,
                        object: {},
                        title: '',
                        type: ''
                    },
                    show: false
                },
                options: null,
                snackbar: {
                    show: false,
                    text: ''
                }
            }
        },
        methods: {
            generalDialogFunction() {
                if (this.generalDialog.buttonType) {
                    if (this.generalDialog.buttonType == 'confirmOverwrite') {
                        this.saveCharacter()
                        this.generalDialog.show = false
                    }
                    if (this.generalDialog.buttonType == 'confirmFirebaseOverwrite') {
                        this.saveToFirebase('update')
                        this.generalDialog.show = false
                    }
                }
            },
            //Local Storage Functions
            isCharacterSet() {
                let character = localStorage.getItem('character')
                return (character != null)
            },
            isOptionsSet() {
                let options = localStorage.getItem('characterSheetOptions')
                return (options != null)
            },
            loadCharacter() {
                if (this.isCharacterSet()) {
                    this.updateCharacter++
                    let character = JSON.parse(localStorage.getItem('character'))
                    if (!Object.hasOwn(character, 'minions'))
                        character.minions = []
                    this.characterSheet = character
                    this.showSnackbar('Character loaded')
                    this.characterUpdated++
                }
                else
                    this.generalDialog = {
                        buttonText: '',
                        buttonType: '',
                        html: '',
                        show: true,
                        text: 'No Character Saved in Local Storage',
                        title: 'Error Loading Character'
                    }
            },
            async loadCharactersFromFirebase() {
                this.characters = []

                const q = query(collection(db, 'characters'), where('user', '==', this.$userData.email))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    this.characters.push(doc.data())
                })
            },
            loadOptions() {
                if (this.isOptionsSet()) {
                    this.options = JSON.parse(localStorage.getItem('characterSheetOptions'))                    
                    this.layout = ('layout' in this.options) ? this.options.layout : 'Condensed'
                } else
                    this.options = {
                        abilityPanel: 0,
                        buffPanel: 0,
                        classPanel: 0,
                        classUnlockedPanel: 0,
                        damageModificationPanel: 0,
                        equipmentPanel: 0,
                        flawPanel: 0,
                        journalPanel: 0,
                        layout: 'Condensed',
                        minionPanel: 0,
                        movementPanel: 0,
                        resourcePanel: 0,
                        skillPanel: 0,
                        statusPanel: 0,
                        traitPanel: 0,
                    }
            },
            loadSelectedCharacter(id) {
                let character = this.characters.filter(x => { return x.id == id })[0]
                this.characterSheet = JSON.parse(JSON.stringify(character))
                this.charactersDialog = false
                this.showSnackbar('Character loaded')
                this.characterUpdated++
            },
            readCharacterFromFile() {
                if (this.characterFile) {
                    var reader = new FileReader()
                    reader.readAsText(this.characterFile)
                    reader.onload = () => {
                        this.characterSheet = JSON.parse(reader.result)
                        this.characterFile = null
                        this.characterUpdated++
                    }
                }
            },
            saveCharacterConfirm() {
                if (!this.isCharacterSet())
                    this.saveCharacter()
                else
                    this.generalDialog = {
                        buttonText: 'Overwrite Character',
                        buttonType: 'confirmOverwrite',
                        html: '',
                        show: true,
                        text: 'Overwrite Character saved in Local Storage',
                        title: 'Confirm Character Overwrite'
                    }
            },
            saveCharacter() {
                if (this.characterSheet.id == 'default' || this.characterSheet.id == 'clear')
                    this.characterSheet.id = uuidv4()

                let character = JSON.parse(JSON.stringify(this.characterSheet))
                localStorage.setItem('character', JSON.stringify(character))
                this.showSnackbar('Character Saved')
            },
            async saveToFirebaseConfirm() {
                let characterExists = false

                characterExists = this.characters.filter(x => { return x.id == this.characterSheet.id }).length > 0

                if (!characterExists)
                    this.saveToFirebase('add')
                else
                    this.generalDialog = {
                        buttonText: 'Overwrite Character',
                        buttonType: 'confirmFirebaseOverwrite',
                        html: '',
                        show: true,
                        text: 'Overwrite Character saved in Database',
                        title: 'Confirm Character Overwrite'
                    }
            },
            async saveToFirebase(type) {
                if (this.characterSheet.id == 'default' || this.characterSheet.id == 'clear')
                    this.characterSheet.id = uuidv4()

                let character = JSON.parse(JSON.stringify(this.characterSheet))
                character.user = this.$userData.email
                await setDoc(doc(db, 'characters', character.id), character)
                this.showSnackbar('Character Saved to Database')

                if (type == 'add')
                    this.characters.push(character)
                else if (type == 'update') {
                    let index = this.characters.findIndex(x => { return x.id == character.id })
                    if (index > -1)
                        this.characters[index] = character
                }
            },
            saveCharacterAsFile() {
                let filename = `${this.characterSheet.name}.txt`, type = 'type:text/plain;charset=utf-8'
                let file = new Blob([JSON.stringify(this.characterSheet)], { type: type });
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
            saveOptions(options) {
                options.layout = this.layout
                localStorage.setItem('characterSheetOptions', JSON.stringify(options))
            },
            //Local Storage Functions End
            loadLog(log) {
                this.logDialog.show = false
                this.logDialog.selectedLog = log
                this.logDialog.selectedLog.id = uuidv4()
            },
            logPush(log) {
                this.logDialog.log.push(log)
            },
            showSnackbar(text) {
                this.snackbar = {
                    show: true,
                    text: text
                }
            },
            updateCharacterSheet(characterSheet) {
                this.characterSheet = characterSheet
            },
            updatePanel(panelObj) {
                this[panelObj.name] = panelObj.value
            }
        },
        watch: {
            // Character Sheet Options Watch Start
            abilityPanel() { this.saveOptions() },
            buffPanel() { this.saveOptions() },
            classPanel() { this.saveOptions() },
            classUnlockedPanel() { this.saveOptions() },
            damageModificationPanel() { this.saveOptions() },
            equipmentPanel() { this.saveOptions() },
            flawPanel() { this.saveOptions() },
            journalPanel() { this.saveOptions() },
            minionPanel() { this.saveOptions() },
            movementPanel() { this.saveOptions() },
            resourcePanel() { this.saveOptions() },
            skillPanel() { this.saveOptions() },
            statusPanel() { this.saveOptions() },
            traitPanel() { this.saveOptions() },
            layout() {
                this.options.layout = this.layout
                this.saveOptions(this.options)
            }
            // Character Sheet Options Watch End
        }
    }
</script>