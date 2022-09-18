<template>
    <div>
        <v-app-bar dark color="secondary">
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-img alt="ME!"
                   class="shrink mr-2"
                   contain
                   src="@/assets/MeFatterTransparent.png"
                   transition="scale-transition"
                   width="40" />

            <v-spacer></v-spacer>

            <v-switch label="Dark Theme"
                      v-model="$vuetify.theme.dark"
                      @click="saveDarkTheme"
                      inset></v-switch>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list dense nav>
                <v-list-item-group>
                    <v-list-item v-for="link in links" :key="link.text" link @click="navigate(link)">
                        <v-list-item-icon>
                            <v-icon>{{link.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{link.text}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    export default {
        name: 'NavbarSection',
        data() {
            return {
                links: [
                    { icon: 'mdi-home', text: 'Home', route: '/' },
                    { icon: 'mdi-account-box', text: 'Character Sheet', route: '/charactersheet' },
                    { icon: 'mdi-account-box', text: 'Character Sheet 2', route: '/charactersheet2' },
                    { icon: 'mdi-dice-d20', text: 'Initiative Roller', route: '/initiative' }
                    //,
                    //{ icon: 'mdi-file-account', text: 'Resume', route: '/resume' }
                ],
                drawer: false
            }
        },
        mounted() {
            const theme = localStorage.getItem('darkTheme')
            if (theme) {
                this.$vuetify.theme.dark = theme === 'true'
            } else {
                this.saveDarkTheme()
            }
        },
        methods: {
            navigate(link) {
                this.$router.push(link.route)
            },
            saveDarkTheme() {
                localStorage.setItem('darkTheme', this.$vuetify.theme.dark)
            }
        }
    }
</script>