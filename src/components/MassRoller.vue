<template>
    <div>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h3 class="text-center">
                        Mass Roller
                    </h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="Enemies*" v-model="massRoller.enemies" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Dice*" v-model="massRoller.dice" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="LCK*" v-model="massRoller.luck" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Successes Required" v-model="massRoller.successesRequired" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn @click="rollMassRoller()">
                                <v-icon>mdi-dice-6</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>        
    </div>
</template>

<script>
    export default {
        name: 'MassRoller',
        data() {
            return {
                massRoller: {
                    dice: 0,
                    enemies: 0,
                    luck: 0,
                    results: [],
                    show: false,
                    successesRequired: 0
                }
            }
        },
        methods: {
            rollMassRoller() {
                if (!isNaN(this.massRoller.dice) && !isNaN(this.massRoller.enemies) && !isNaN(this.massRoller.luck)) {
                    let emitObject = {
                        generalDialog: {
                            buttonText: '',
                            buttonType: '',
                            html: '',
                            show: true,
                            text: '',
                            title: 'Mass Roller'
                        },
                        logObject: {

                        },
                        snackbarText: 'Copied Mass Roller Results to Clipboard'
                    }

                    this.massRoller.results = []
                    let successesRequired = (!isNaN(this.massRoller.successesRequired) && this.massRoller.successesRequired > 0)

                    let copyText = `&{template:default} {{name= Mass Roller}}`
                    if (successesRequired)
                        copyText += `{{Successes Required: ${ this.massRoller.successesRequired }}}`

                    let copyTextEnd = ''

                    for (var i = 0; i < this.massRoller.enemies; i++) {
                        let result = {
                            advantage: false,
                            diceResults: [],
                            fate: 0,
                            show: true,
                            selectedRerolls: [],
                            succeeded: false,
                            successes: 0,
                            successesFromLuck: 0,
                            threat: false
                        }
                        let rdResult = this.rollDice(this.massRoller.dice)

                        result.diceResults = rdResult.diceResults;
                        result.successes += +rdResult.successes
                        result.fate = result.diceResults[0]
                        if (result.fate == 6) {
                            result.advantage = true
                            result.successesFromLuck = this.massRoller.luck
                            result.successes += +result.successesFromLuck
                        } else if (result.fate == 1) {
                            result.threat = true
                        }

                        emitObject.generalDialog.html += '<div>'

                        if (successesRequired) {
                            result.succeeded = result.successes >= this.massRoller.successesRequired

                            let resultText = (result.succeeded) ? 'Succeeded' : (!result.threat) ? 'Failed' : 'Crit Failed'
                            emitObject.generalDialog.html += `<div><b>${resultText}</b></div>`
                            copyTextEnd += `{{Enemy ${i + 1} ${resultText}}}`

                            if (result.succeeded) {
                                let remainingSuccesses = +result.successes - +this.massRoller.successesRequired
                                emitObject.generalDialog.html += `<div><b>Remaining Successes: ${remainingSuccesses}</b></div>`
                                copyTextEnd += `{{Remaining Successes: ${remainingSuccesses}}}`
                            }
                        }
                        else {
                            emitObject.generalDialog.html += '<div><b>Successes: ' + result.successes + '</b></div>'
                            copyTextEnd += `{{Enemy ${i + 1} Successes = ${result.successes}}}`
                        }

                        emitObject.generalDialog.html +=
                            '<div> Fate: ' + result.fate + '</div>' +
                            '<div> Dice Results: [' + result.diceResults.join(', ') + ']</div>';

                        this.massRoller.results.push(result)
                    }

                    let successes = this.massRoller.results.filter(x => { return x.succeeded }).length
                    let critFailures = (successesRequired) ? this.massRoller.results.filter(x => { return !x.succeeded && x.threat }).length : 0
                    if (successesRequired) {
                        emitObject.generalDialog.html = `</br>` + emitObject.generalDialog.html

                        if (critFailures)
                            emitObject.generalDialog.html = `<div><b>Enemies Crit Failed: ${critFailures}</b></div>` + emitObject.generalDialog.html

                        emitObject.generalDialog.html = `<div><b>Enemies Succeeded: ${successes}</b></div>` + emitObject.generalDialog.html
                        copyText += `{{Enemies Succeeded= ${successes}}}`


                        emitObject.generalDialog.html = '<h3>Successes Required: ' + this.massRoller.successesRequired + '</h3>' + emitObject.generalDialog.html

                        if (critFailures)
                            copyText += `{{Enemies Crit Failed= ${critFailures}}}`
                    }

                    copyText += copyTextEnd

                    navigator.clipboard.writeText(copyText)

                    emitObject.logObject = {
                        copyText: copyText,
                        object: JSON.parse(JSON.stringify(emitObject.generalDialog)),
                        title: 'Mass Roller',
                        type: 'Mass Roller'
                    }

                    this.$emit('resultsEmit', emitObject)
                }
            }
        }
    }
</script>