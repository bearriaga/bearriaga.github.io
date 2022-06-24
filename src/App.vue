<template>
    <v-app>
        <NavbarSection></NavbarSection>

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import NavbarSection from '@/components/NavbarSection'

    export default {
        name: 'App',
        components: {
            NavbarSection
        },
        data: () => ({
            //
        }),
    };
</script>

<style>
    @import './css/characterSheet.css'
</style>