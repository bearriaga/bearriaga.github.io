<template>
    <div>
        <v-row>
            <v-col cols="4" v-for="a in abilities" :key="a.id">
                {{a}}
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'AbilitySection',
        props: {
            abilities: Array
        }
    }
</script>