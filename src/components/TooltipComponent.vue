<template>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-icon v-on="on" color="primary" dark>
                mdi-information
            </v-icon>
        </template>
        <span>{{text}}</span>
    </v-tooltip>
</template>

<script>
    export default {
        name: 'TooltipComponent',
        props: {
            text: String
        }
    }
</script>