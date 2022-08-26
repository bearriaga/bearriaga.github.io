<template>
    <div @click="updateDialog" :class="wrapperClass">
        <v-text-field :label="label"
                      v-model="amount"
                      type="number"
                      :class="classColor"
                      disabled>
            <v-icon :color="iconColor" slot="append">{{icon}}</v-icon>
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
            classColor() {
                let classColor = ''

                if (this.resistance.isBuff) {
                    if (this.amount > 0)
                        classColor += 'text-green'
                    if (this.amount < 0)
                        classColor += 'text-red'
                }

                return classColor
            },
            iconColor() {
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
            },
            label() {
                let label = this.resistance.type

                if (this.resistance.isBuff) {
                    if (this.amount > 0)
                        label += ' - Buff'
                    if (this.amount < 0)
                        label += ' - Debuff'
                }

                return label
            },
            wrapperClass() {
                let wrapperClass = ''

                if (!this.resistance.isBuff)
                    wrapperClass = 'cursorPointer'

                return wrapperClass
            }
        },
        data() {
            return {
                amount: this.resistance.amount
            }
        },
        methods: {
            updateDialog() {
                if (!this.resistance.isBuff)
                    this.$emit('updateDialogEmit', this.resistance)
            }
        }
    }
</script>