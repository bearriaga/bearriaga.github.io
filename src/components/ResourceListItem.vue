<template>
    <!-- Add Bars to Class resource showing how full they are-->
    <!-- <div class="progressBar red" ng-style="{'width': Char.HP / Char.MaxHP * 100 + '%'}">{{Char.HP / Char.MaxHP * 100}}%</div> -->
    <div>
        <v-text-field :label="resource.name"
                      type="number"
                      v-model="amount">
            <v-icon slot="append">/{{resource.amountMax}} </v-icon>
            <v-icon color="primary" slot="append" @click="updateEntry">mdi-pen</v-icon>
            <v-icon color="error" slot="append" @click="deleteEntry">mdi-delete</v-icon>
        </v-text-field>
    </div>
</template>

<script>
    export default {
        name: 'ResourceListItem',
        props: {
            resource: Object
        },
        data() {
            return {
                amount: this.resource.amount                
            }
        },
        methods: {            
            deleteEntry() {
                this.$emit('deleteEntryEmit', this.resource)
            },
            updateEntry() {
                this.$emit('updateEntryEmit', this.resource)
            }
        }
    }
</script>