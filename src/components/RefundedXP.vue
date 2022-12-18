<template>
    <div>
        <v-text-field :label="label" v-model="refundedXP" disabled readonly>
            <TooltipComponent slot="append" :text="tooltipText"></TooltipComponent>
        </v-text-field>
        <v-text-field label="Final Cost" v-model="finalCost" disabled readonly></v-text-field>
    </div>
</template>

<script>
    import TooltipComponent from './TooltipComponent.vue'

    export default {
        name: 'RefundedXP',
        components: { TooltipComponent },
        props: {
            tier: Number,
            xpCost: Number
        },
        computed: {
            finalCost() {
                return this.xpCost - this.refundedXP
            },
            label() {
                return `Character Tier(${this.tier}) Refunded XP`
            },
            refundedXP() {
                return Math.floor(this.xpCost * this.tier / 10)
            },
            tooltipText() {
                return `XP automatically refunded based on Character Tier: ${this.tier * 10}% of XP Cost`
            }
        }
    }
</script>