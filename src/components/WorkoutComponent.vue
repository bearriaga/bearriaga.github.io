<template>
    <div>
        <form>
            <v-row>
                <v-col>
                    <v-text-field label="Name" v-model="workout.name"></v-text-field>
                </v-col>
                <v-col>
                    <v-menu v-model="dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="workout.date"
                                          label="Date"
                                          hint="YYYY-MM-DD"
                                          persistent-hint
                                          prepend-icon="mdi-calendar"
                                          readonly
                                          v-bind="attrs"
                                          v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="workout.date"
                                       @input="dateMenu = false"></v-date-picker>
                    </v-menu>
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
                <div v-for="e, i in workout.exercises" :key="i">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="Name" v-model="e.name">
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
                    <div>
                        <h3 class="text-center">
                            Sets
                            <v-btn icon color="primary" @click.stop="addSet(i)">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </h3>
                        <div>
                            <v-row>
                                <v-col cols="2" v-for="s, j in e.sets" :key="j">
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
                    </div>
                    <hr />
                </div>
            </template>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'WorkoutComponent',
        created() {
            if (!this.$signedIn || this.$userData.email != 'turro92@gmail.com')
                this.$router.push({ name: 'Home' })
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
                dateMenu: false,
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
            }
        }
    }
</script>