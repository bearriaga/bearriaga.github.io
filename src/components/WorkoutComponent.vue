<template>
    <div>
        <v-form>
            <v-row>
                <v-col class="text-center">
                    <v-btn color="primary" @click="saveWorkout">Save Workout</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field label="Name" v-model="workout.name"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Date" type="date" v-model="workout.date"></v-text-field>
                </v-col>
                <v-col>
                    <v-select label="Type" :items="workoutTypes" v-model="workout.type"></v-select>
                </v-col>
            </v-row>
            <v-textarea label="Notes" v-model="workout.notes" auto-grow outlined rows="1"></v-textarea>
            <template>
                <h2 class="text-center">
                    Exercises
                    <v-btn icon color="primary" @click.stop="addExercise">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </h2>
                <v-expansion-panels multiple v-model="panel">
                    <v-expansion-panel v-for="e, i in workout.exercises" :key="i">
                        <v-expansion-panel-header>
                            <h3 class="text-center">{{e.name}}</h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field label="Exercise" v-model="e.name">
                                        <v-icon slot="append" color="error" @click="deleteExercise(i)">mdi-delete</v-icon>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-select v-model="e.muscleGroups"
                                              :items="muscleGroups"
                                              label="Muscle Groups"
                                              multiple>
                                    </v-select>
                                </v-col>
                                <v-col cols="3">
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
                                            <v-col cols="6">
                                                <v-text-field label="Weight" v-model="s.weight"></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field label="Reps" v-model="s.reps">
                                                    <v-icon slot="append" color="error" @click="deleteSet(i, j)">mdi-delete</v-icon>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Notes" v-model="s.notes" auto-grow outlined rows="1"></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </template>
        </v-form>

        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2 class="text-center">Previous Workouts</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-for="w, i in workouts" :key="i">

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
                    date: new Date().toISOString().substr(0, 10),
                    exercises: [],
                    id: '',
                    name: '',
                    notes: '',
                    type: ''
                },
                workouts: [
                    //{ "exercises": [{ "name": "Trap Bar Deadlift", "notes": "", "maxes": "230x8/250x6/270x3 or 230 5x5", "muscleGroups": [], "sets": [{ "weight": "230", "notes": "", "reps": "8" }, { "notes": "", "reps": "6", "weight": "250" }, { "weight": "270", "reps": "3", "notes": "" }] }, { "muscleGroups": [], "sets": [{ "weight": "70", "notes": "", "reps": "8" }, { "notes": "", "reps": "6", "weight": "80" }, { "notes": "", "reps": "5", "weight": "90" }], "notes": "", "maxes": "70x8/80x6/90x5 or 90/90/80/80/70 5x5", "name": "Incline Press" }, { "muscleGroups": [], "maxes": "30x10/40x6/50x4 or 50/40/40/30/30 5x5", "notes": "", "name": "Overhead Press", "sets": [{ "reps": "10", "weight": "30", "notes": "" }, { "reps": "6", "weight": "40", "notes": "" }, { "notes": "", "reps": "4", "weight": "50" }] }, { "maxes": "60x10/70x8/80x4 or 70 5x5", "notes": "", "sets": [{ "reps": "10", "weight": "60", "notes": "" }, { "reps": "8", "weight": "70", "notes": "" }, { "weight": "80", "reps": "4", "notes": "" }], "muscleGroups": [], "name": "Barbell Curls" }, { "sets": [{ "weight": "15", "notes": "", "reps": "12" }, { "notes": "", "weight": "15", "reps": "12" }, { "weight": "15", "reps": "12", "notes": "" }], "muscleGroups": [], "name": "Bent Over Reverse Flys", "notes": "", "maxes": "15 12x3" }, { "notes": "", "maxes": "270 15x3", "sets": [{ "weight": "270", "reps": "15", "notes": "" }, { "notes": "", "weight": "270", "reps": "15" }, { "reps": "15", "weight": "270", "notes": "" }], "muscleGroups": [], "name": "Standing Calf Raises" }, { "maxes": "80x8/75x6/70x5 or 85 5x5", "notes": "", "muscleGroups": [], "name": "Wide Grip Pull Up", "sets": [{ "weight": "80", "notes": "", "reps": "8" }, { "reps": "6", "weight": "75", "notes": "" }, { "weight": "70", "reps": "5", "notes": "" }] }], "date": "2022-12-16", "notes": "", "name": "Day 2", "type": "Full Body", "id": "868b0574-fb14-4eea-aa92-9adb03fee863" },
                    //{ "notes": "", "name": "Day 1", "exercises": [{ "muscleGroups": ["Legs"], "name": "Back Squat", "notes": "", "sets": [{ "reps": 12, "weight": 140, "notes": "" }], "maxes": "140x12/180x12/230x6" }], "type": "Full Body", "date": "2022-12-14", "id": "1" }
                ],
                workoutTypes: ['Bro Split', 'Full Body']
            }
        },
        methods: {
            addExercise() {
                this.workout.exercises.push(JSON.parse(JSON.stringify(this.exercise)))
                this.panel.push(this.panel.length);
            },
            addSet(i) {
                this.workout.exercises[i].sets.push(JSON.parse(JSON.stringify(this.set)))
            },
            copyWorkout(i, isNew) {
                this.workout = JSON.parse(JSON.stringify(this.workouts[i]))

                let snackText = ''
                if (isNew) {
                    this.workout.id = ''
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
            },
            async saveWorkout() {
                if (this.workout.id == '')
                    this.workout.id = uuidv4()

                await setDoc(doc(db, 'workouts', this.workout.id), this.workout)
                this.snackbar = {
                    show: true,
                    text: 'Workout Saved'
                }
            }
        }
    }
</script>