<template>
    <div>
        <v-row>
            <v-col cols="12" md="4" v-for="ability in abilities" :key="ability.id">
                <AbilityListItem :ability="ability"></AbilityListItem>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import AbilityListItem from './AbilityListItem.vue'

    export default {
        name: 'AbilitySection',
        components: {
            AbilityListItem
        },
        props: {
            abilities: Array
        }
    }
</script>