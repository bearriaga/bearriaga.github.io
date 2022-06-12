<template>
    <v-app>
        <NavbarSection></NavbarSection>

        <v-main class="container">
            <router-view />
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
