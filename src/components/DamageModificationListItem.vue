<template>
    <div @click="updateDialog" :class="wrapperClass">
        <v-text-field :label="label"
                      v-model="amount"
                      type="number"
                      :class="classColor"
                      disabled>
            <v-icon v-if="damageModification.isVulnerability" color="error" slot="append">mdi-shield-remove</v-icon>
            <v-icon v-if="damageModification.isResistance" color="success" slot="append">mdi-shield-plus</v-icon>
            <v-icon :color="iconColor" slot="append">{{icon}}</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'DamageModificationListItem',
        props: {
            damageGroups: Array,
            damageTypes: Array,
            damageModification: Object
        },
        computed: {
            classColor() {
                let classColor = ''

                if (this.damageModification.isBuff) {
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
                    if (this.damageModification.type == group.name || group.types.some(x => x.name == this.damageModification.type)) {
                        color = group.color
                    }
                })
                return color
            },
            icon() {
                let icon = ''
                this.damageGroups.forEach((group) => {
                    if (this.damageModification.type == group.name || group.types.some(x => x.name == this.damageModification.type)) {
                        if (this.damageModification.type == group.name)
                            icon = group.icon
                        let damageType = group.types.find(type => type.name == this.damageModification.type)
                        if (damageType)
                            icon = damageType.icon
                    }
                })
                return icon
            },
            label() {
                let label = this.damageModification.type

                if (this.damageModification.isBuff) {
                    if (this.amount > 0)
                        label += ' - Buff'
                    if (this.amount < 0)
                        label += ' - Debuff'
                }

                return label
            },
            wrapperClass() {
                let wrapperClass = ''

                if (!this.damageModification.isBuff)
                    wrapperClass = 'cursorPointer'

                return wrapperClass
            }
        },
        data() {
            return {
                amount: this.damageModification.amount
            }
        },
        methods: {
            updateDialog() {
                if (!this.damageModification.isBuff)
                    this.$emit('updateDialogEmit', this.damageModification)
            }
        }
    }
</script>