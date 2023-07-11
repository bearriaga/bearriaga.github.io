<template>
    <div>
        <v-form>
            <v-row>
                <v-col class="text-center">
                    <v-btn color="primary" @click="saveFitnessAccount">
                        Save Workout
                        <v-progress-circular indeterminate v-if="saving"></v-progress-circular>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field label="Name" v-model="workout.name"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Date" type="date" v-model="workout.date"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select label="Type" :items="workoutTypes" v-model="workout.type"></v-select>
                </v-col>
            </v-row>
            <v-textarea label="Notes" v-model="workout.notes" auto-grow outlined rows="1" clearable></v-textarea>
            <template>
                <h2 class="text-center">
                    <v-row>
                        <v-col>
                            <v-btn icon color="primary" @click="panel = []">
                                <v-icon>mdi-collapse-all</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col>
                            Exercises
                        </v-col>
                        <v-col>
                            <v-btn icon color="primary" @click="expandAll()">
                                <v-icon>mdi-expand-all</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </h2>
                <v-expansion-panels multiple v-model="panel">
                    <v-expansion-panel v-for="e, i in workout.exercises" :key="i">
                        <v-expansion-panel-header>
                            <h3 class="text-center">
                                <v-row>
                                    <v-col>
                                        <v-btn icon color="primary" @click.stop="moveExercise(i, 'down')">
                                            <v-icon>mdi-arrow-down-bold</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col>
                                        {{e.name}}
                                    </v-col>
                                    <v-col>
                                        <v-btn icon color="primary" @click.stop="moveExercise(i, 'up')">
                                            <v-icon>mdi-arrow-up-bold</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Exercise" v-model="e.name">
                                        <v-icon slot="append" color="error" @click="deleteExercise(i)">mdi-delete</v-icon>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-select v-model="e.muscleGroups"
                                              :items="muscleGroups"
                                              label="Muscle Groups"
                                              multiple>
                                    </v-select>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field label="Maxes" v-model="e.maxes"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-textarea label="Notes" v-model="e.notes" auto-grow outlined rows="1" clearable></v-textarea>
                            <div class="text-center">
                                <v-btn color="primary" @click="skipExercise(e, i)">Skip</v-btn>
                            </div>
                            <template>
                                <v-row>
                                    <v-col cols="12" v-for="s, j in e.sets" :key="j">
                                        <v-row>
                                            <v-col cols="6">
                                                <v-text-field label="Weight" type="number" v-model="s.weight">
                                                    <v-icon slot="prepend">mdi-numeric-{{j + 1}}</v-icon>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field label="Reps" type="number" v-model="s.reps">
                                                    <v-icon slot="prepend" color="error" @click="updateRep(i, j, -1)" :disabled="s.reps <= 0">mdi-minus</v-icon>
                                                    <v-icon slot="append" color="success" @click="updateRep(i, j, 1)">mdi-plus</v-icon>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field label="Time" type="text" v-model="s.time"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Notes" v-model="s.notes" auto-grow outlined rows="1" clearable>
                                                    <v-icon slot="prepend" color="primary" @click="copySet(i, j)">mdi-content-copy</v-icon>
                                                    <v-icon slot="prepend" color="error" @click="deleteSet(i, j)">mdi-delete</v-icon>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <hr v-if="j < (e.sets.length - 1)" />
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <h3 class="text-center">
                                            Sets
                                            <v-btn icon color="primary" @click.stop="addSet(i)">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </h3>
                                    </v-col>
                                </v-row>                                
                            </template>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="text-center">
                    <v-btn color="primary" @click.stop="addExercise">
                        Add Exercise
                    </v-btn>
                </div>
                <div class="text-center">
                    <v-text-field label="Search Exercises" v-model="filterExercises" clearable></v-text-field>
                    <v-form disabled>
                        <h2 class="text-center">Exercises</h2>
                        <v-expansion-panels multiple>
                            <v-expansion-panel v-for="e, i in filteredExercises" :key="i">
                                <v-expansion-panel-header>
                                    <h3 class="text-center">{{e.name}} <v-icon color="primary" @click.stop="copyExercise(e)">mdi-content-copy</v-icon></h3>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <template>
                                        <h3 class="text-center">Sets</h3>
                                        <v-row>
                                            <v-col v-for="s, j in e.sets" :key="j" class="text-center">
                                                <div v-if="s.weight != 0 || s.reps != 0">
                                                    <b>{{s.weight}} lbs x {{s.reps}}</b>
                                                </div>
                                                <div v-if="s.time">
                                                    <b>{{s.time}}</b>
                                                </div>
                                                <v-textarea label="Notes" v-model="s.notes" v-if="s.notes" auto-grow outlined rows="1"></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </template>
                                    <v-row>
                                        <v-col>
                                            <v-text-field label="Maxes" v-model="e.maxes"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-select v-model="e.muscleGroups"
                                                      :items="muscleGroups"
                                                      label="Muscle Groups"
                                                      multiple>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-textarea label="Notes" v-model="e.notes" v-if="e.notes" auto-grow outlined rows="1"></v-textarea>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-form>
                </div>
            </template>
        </v-form>

        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2 class="text-center">Previous Workouts</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-for="w, i in fitnessAccount.workouts" :key="i + w.id">

                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                <h3 class="text-center">{{w.name}} - {{w.date}}</h3>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-form disabled>
                                    <v-row>
                                        <v-col>
                                            <v-text-field label="Name" v-model="w.name" readonly>
                                                <v-icon slot="prepend" color="error" @click="deleteWorkout(i)">mdi-delete</v-icon>
                                                <v-icon slot="append" color="primary" @click="copyWorkout(i, true)">mdi-content-copy</v-icon>
                                                <v-icon slot="append" color="primary" @click="copyWorkout(i, false)">mdi-pen</v-icon>
                                            </v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field label="Date" type="date" v-model="w.date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-select label="Type" :items="workoutTypes" v-model="w.type"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-textarea label="Notes" v-model="w.notes" v-if="w.notes" auto-grow outlined rows="1"></v-textarea>
                                    <template>
                                        <h2 class="text-center">Exercises</h2>
                                        <v-expansion-panels multiple>
                                            <v-expansion-panel v-for="e, i in w.exercises" :key="i">
                                                <v-expansion-panel-header>
                                                    <h3 class="text-center">{{e.name}} <v-icon color="primary" @click.stop="copyExercise(e)">mdi-content-copy</v-icon></h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <template>
                                                        <h3 class="text-center">Sets</h3>
                                                        <v-row>
                                                            <v-col v-for="s, j in e.sets" :key="j" class="text-center">
                                                                <div v-if="s.weight != 0 || s.reps != 0">
                                                                    <b>{{s.weight}} lbs x {{s.reps}}</b>
                                                                </div>
                                                                <div v-if="s.time">
                                                                    <b>{{s.time}}</b>
                                                                </div>
                                                                <v-textarea label="Notes" v-model="s.notes" v-if="s.notes" auto-grow outlined rows="1"></v-textarea>
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                    <v-row>
                                                        <v-col>
                                                            <v-text-field label="Maxes" v-model="e.maxes"></v-text-field>
                                                        </v-col>
                                                        <v-col>
                                                            <v-select v-model="e.muscleGroups"
                                                                      :items="muscleGroups"
                                                                      label="Muscle Groups"
                                                                      multiple>
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>
                                                    <v-textarea label="Notes" v-model="e.notes" v-if="e.notes" auto-grow outlined rows="1"></v-textarea>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                    </template>
                                </v-form>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

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
    import { db } from '@/stores/db'
    import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'WorkoutComponent',
        computed: {
            filteredExercises() {
                let exercises = []

                if (this.filterExercises && this.filterExercises.trim().length != 0) {
                    this.fitnessAccount.workouts.filter(w => { return JSON.stringify(w.exercises).toLowerCase().includes(this.filterExercises.toLowerCase()) })
                        .forEach(w => {
                            exercises = exercises.concat(JSON.parse(JSON.stringify(w.exercises.filter(e => { return e.name.toLowerCase().includes(this.filterExercises.toLowerCase()) }))))
                        });
                }

                return exercises
            }
        },
        created() {
            if (!this.$signedIn || this.$userData.email != 'turro92@gmail.com')
                this.$router.push({ name: 'Home' })
            else
                this.getFitnessAccount()
        },
        data() {
            return {
                exercise: {
                    maxes: '',
                    muscleGroups: [],
                    name: '',
                    notes: '',
                    sets: [
                        {
                            notes: '',
                            reps: 0,
                            time: '',
                            weight: 0
                        }
                    ]
                },
                exercises: [],
                filterExercises: '',
                fitnessAccount: {
                    id: '',
                    name: '',
                    user: this.$userData.email,
                    workouts: []
                },
                muscleGroups: [
                    'Abdominals',
                    'Arms',
                    'Back',
                    'Chest',
                    'Legs',
                    'Shoulders'
                ],
                panel: [],
                saving: false,
                set: {
                    notes: '',
                    reps: 0,
                    time: '',
                    weight: 0
                },
                workout: {
                    date: new Date(new Date().toLocaleDateString()).toISOString().substr(0, 10),
                    exercises: [],
                    id: '',
                    name: '',
                    notes: '',
                    type: ''
                },
                workoutTypes: ['Bro Split', 'Full Body']
            }
        },
        methods: {
            addExercise() {
                this.workout.exercises.push(JSON.parse(JSON.stringify(this.exercise)))
                this.panel.push(this.workout.exercises.length - 1)
            },
            addSet(i) {
                this.workout.exercises[i].sets.push(JSON.parse(JSON.stringify(this.set)))
            },
            copyExercise(e) {
                this.workout.exercises.push(e)
                this.panel.push((+this.workout.exercises.length - 1))
            },
            copySet(i, j) {
                let set = JSON.parse(JSON.stringify(this.workout.exercises[i].sets[j]))
                this.workout.exercises[i].sets.push(set)
            },
            copyWorkout(i, isNew) {
                this.workout = JSON.parse(JSON.stringify(this.fitnessAccount.workouts[i]))

                let snackText = ''
                if (isNew) {
                    this.workout.id = ''
                    this.workout.date = new Date(new Date().toLocaleDateString()).toISOString().substr(0, 10)
                    snackText = 'Duplicated Workout'
                }
                else
                    snackText = 'Editing Workout'
                this.snackbar = {
                    show: true,
                    text: snackText
                }

                this.panel = []
                for (var j = 0; j < this.workout.exercises.length; j++) {
                    this.panel.push(j)
                }
            },
            deleteExercise(i) {
                this.workout.exercises.splice(i, 1)
                this.panel.pop()
            },
            deleteSet(i, j) {
                this.workout.exercises[i].sets.splice(j, 1)
            },
            deleteWorkout(i) {
                this.fitnessAccount.workouts.splice(i, 1)
            },
            expandAll() {
                this.panel = []
                for (var i = 0; i < this.workout.exercises.length; i++) {
                    this.panel.push(i)
                }
            },
            async getFitnessAccount() {
                const q = query(collection(db, 'fitnessAccounts'), where('user', '==', this.$userData.email))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    this.fitnessAccount = doc.data()
                })
                this.fitnessAccount.workouts.sort((a, b) => {
                    let da = new Date(a.date), db = new Date(b.date)
                    return da - db
                }).reverse()
            },
            moveExercise(index, direction) {
                if (!(index == 0 && direction == 'up') && !(index == (+this.workout.exercises.length - 1) && direction == 'down')) {
                    let targetIndex = (direction == 'up') ? +index - 1 : +index + 1
                    let targetCopy = JSON.parse(JSON.stringify(this.workout.exercises[targetIndex]))
                    this.workout.exercises[targetIndex] = this.workout.exercises[index]
                    this.workout.exercises[index] = targetCopy
                    let exercisesCopy = JSON.parse(JSON.stringify(this.workout.exercises))
                    this.workout.exercises = []
                    this.workout.exercises = exercisesCopy
                }
            },
            async saveFitnessAccount() {
                let snackbarText = ''
                this.saving = true
                this.snackbar = {
                    show: true,
                    text: 'Saving'
                }

                if (this.workout.id == '') {
                    this.workout.id = uuidv4()
                    this.fitnessAccount.workouts.push(this.workout)
                    this.fitnessAccount.workouts.sort((a, b) => {
                        let da = new Date(a.date), db = new Date(b.date)
                        return da - db
                    }).reverse()
                    snackbarText = 'Workout Saved'
                } else {
                    let index = this.fitnessAccount.workouts.findIndex(x => { return x.id == this.workout.id })
                    if (index > -1)
                        this.fitnessAccount.workouts[index] = this.workout
                    snackbarText = 'Workout Updated'
                }

                await setDoc(doc(db, 'fitnessAccounts', this.fitnessAccount.id), this.fitnessAccount)

                this.snackbar = {
                    show: true,
                    text: snackbarText
                }
                this.saving = false
            },
            skipExercise(exercise, index) {
                this.workout.exercises.push(exercise)
                this.workout.exercises.splice(index, 1)
                let notes = this.workout.exercises[this.workout.exercises.length - 1].notes
                if (!notes.includes('Skipped')) {
                    if (!notes)
                        this.workout.exercises[this.workout.exercises.length - 1].notes = 'Skipped'
                    else
                        this.workout.exercises[this.workout.exercises.length - 1].notes += '\r\nSkipped'
                }
            },
            updateRep(i, j, amount) {
                this.workout.exercises[i].sets[j].reps = +this.workout.exercises[i].sets[j].reps + +amount
            }
        }
    }
</script>