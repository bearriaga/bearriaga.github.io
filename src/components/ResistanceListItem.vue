<template>
    <div @click="updateEntry">
        <v-text-field :label="type" v-model="amount" type="number" disabled>
            <v-icon :color="color" slot="append">{{icon}}</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'ResistanceListItem',
        props: {
            damageGroups: Array,
            damageTypes: Array,
            resistance: Object
        },
        computed: {
            color() {
                let color = ''
                this.damageGroups.forEach((group) => {
                    if (this.resistance.type == group.name || group.types.some(x => x.name == this.resistance.type)) {
                        color = group.color                        
                    }
                })
                return color
            },
            icon() {
                let icon = ''
                this.damageGroups.forEach((group) => {
                    if (this.resistance.type == group.name || group.types.some(x => x.name == this.resistance.type)) {
                        if (this.resistance.type == group.name)
                            icon = group.icon
                        let damageType = group.types.find(type => type.name == this.resistance.type)
                        if (damageType)
                            icon = damageType.icon
                    }
                })
                return icon
            }
        },
        data() {
            return {
                amount: this.resistance.amount,
                type: this.resistance.type
            }
        },
        methods: {
            updateEntry() {
                this.$emit('updateEntryEmit', this.resistance)
            }
        }
    }
</script>