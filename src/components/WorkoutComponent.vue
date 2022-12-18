<template>
    <div>
        <form>
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
                    Excercises
                    <v-btn icon color="primary" @click.stop="addExercise">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </h2>
                <v-row>
                    <v-col cols="12" md="6" v-for="e, i in workout.exercises" :key="i">
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
                            <div>
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
                            </div>
                        </template>
                    </v-col>

                </v-row>
            </template>
        </form>
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
            else {
                this.getWorkouts()
            }
        },
        data() {
            return {
                exercise: {
                    maxes: '',
                    muscleGroups: [],
                    name: '',
                    notes: '',
                    sets: []
                },
                excercises: [],
                muscleGroups: [
                    'Abdominals',
                    'Arms',
                    'Back',
                    'Chest',
                    'Legs',
                    'Shoulders'
                ],
                set: {
                    notes: '',
                    reps: 0,
                    weight: 0
                },
                workout: {
                    date: new Date().toISOString().substr(0, 10),
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
            },
            addSet(i) {
                this.workout.exercises[i].sets.push(JSON.parse(JSON.stringify(this.set)))
            },
            deleteExercise(i) {
                this.workout.exercises.splice(i, 1)
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
                console.log(this.workouts)
            },
            async saveWorkout() {
                if (this.workout.id == '')
                    this.workout.id = uuidv4()

                await setDoc(doc(db, 'workouts', this.workout.id), this.workout)
                console.log('Workout Saved')
            }
        }
    }
</script>