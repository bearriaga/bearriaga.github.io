<template>
    <div>
        <v-form>
            <v-row>
                <v-col class="text-center">
                    <v-btn color="primary" @click="saveWorkout">Save Workout</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field label="Name" v-model="workout.name"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Date" type="date" v-model="workout.date"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select label="Type" :items="workoutTypes" v-model="workout.type"></v-select>
                </v-col>
            </v-row>
            <v-textarea label="Notes" v-model="workout.notes" auto-grow outlined rows="1"></v-textarea>
            <template>
                <h2 class="text-center">
                    Exercises
                </h2>
                <v-expansion-panels multiple v-model="panel">
                    <v-expansion-panel v-for="e, i in workout.exercises" :key="i">
                        <v-expansion-panel-header>
                            <h3 class="text-center">{{e.name}}</h3>
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
                            <v-textarea label="Notes" v-model="e.notes" auto-grow outlined rows="1"></v-textarea>
                            <template>
                                <h3 class="text-center">
                                    Sets
                                    <v-btn icon color="primary" @click.stop="addSet(i)">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </h3>
                                <v-row>
                                    <v-col cols="4" v-for="s, j in e.sets" :key="j">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field label="Weight" type="number" v-model="s.weight"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field label="Reps" type="number" v-model="s.reps">
                                                </v-text-field>
                                                <v-row>
                                                    <v-col>
                                                        <v-icon color="error" @click="updateRep(i, j, -1)" :disabled="s.reps <= 0">mdi-minus</v-icon>
                                                    </v-col>
                                                    <v-col>
                                                        <v-icon color="success" @click="updateRep(i, j, 1)">mdi-plus</v-icon>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <v-textarea label="Notes" v-model="s.notes" auto-grow outlined rows="1"></v-textarea>
                                            </v-col>
                                            <v-col cols="12" class="text-center">
                                                <v-icon color="primary" @click="copySet(i, j)">mdi-content-copy</v-icon>
                                                <v-icon color="error" @click="deleteSet(i, j)">mdi-delete</v-icon>
                                            </v-col>
                                        </v-row>
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
            </template>
        </v-form>

        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2 class="text-center">Previous Workouts</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-for="w, i in workouts" :key="i + w.id">

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
                                                    <h3 class="text-center">{{e.name}}</h3>
                                                </v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <template>
                                                        <h3 class="text-center">Sets</h3>
                                                        <v-row>
                                                            <v-col v-for="s, j in e.sets" :key="j" class="text-center">
                                                                <b>{{s.weight}} lbs x {{s.reps}}</b>
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
    import { collection, getDocs, doc, setDoc, query } from 'firebase/firestore';
    import { v4 as uuidv4 } from 'uuid';

    export default {
        name: 'WorkoutComponent',
        created() {
            if (!this.$signedIn || this.$userData.email != 'turro92@gmail.com')
                this.$router.push({ name: 'Home' })
            else
            this.getWorkouts()
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
                            weight: 0
                        }
                    ]
                },
                exercises: [],
                muscleGroups: [
                    'Abdominals',
                    'Arms',
                    'Back',
                    'Chest',
                    'Legs',
                    'Shoulders'
                ],
                panel: [],
                set: {
                    notes: '',
                    reps: 0,
                    weight: 0
                },
                snackbar: {
                    show: false,
                    text: ''
                },
                workout: {
                    date: new Date(new Date().toLocaleDateString()).toISOString().substr(0, 10),
                    exercises: [],
                    id: '',
                    name: '',
                    notes: '',
                    type: ''
                },
                workouts: [],
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
            copySet(i, j) {
                let set = JSON.parse(JSON.stringify(this.workout.exercises[i].sets[j]))
                this.workout.exercises[i].sets.push(set)
            },
            copyWorkout(i, isNew) {
                this.workout = JSON.parse(JSON.stringify(this.workouts[i]))

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
            async getWorkouts() {
                const q = query(collection(db, 'workouts'))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    this.workouts.push(doc.data())
                })
                this.workouts.sort((a, b) => {
                    let da = new Date(a.date), db = new Date(b.date)
                    return da - db
                }).reverse()
            },
            async saveWorkout() {
                let snackbarText = ''

                if (this.workout.id == '') {
                    this.workout.id = uuidv4()
                    snackbarText = 'Workout Saved'
                } else {
                    snackbarText = 'Workout Updated'
                }

                await setDoc(doc(db, 'workouts', this.workout.id), this.workout)

                this.snackbar = {
                    show: true,
                    text: snackbarText
                }
            },
            updateRep(i, j, amount) {
                this.workout.exercises[i].sets[j].reps = +this.workout.exercises[i].sets[j].reps + +amount
            }
        }
    }
</script>