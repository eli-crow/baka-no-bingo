<template>
    <div class="DataPage">
        <h2>Most Sold Cells</h2>
        <ol>
            <li v-for="cell in soldCellFrequencyRanking">{{cell.text}}: <strong>{{cell.count}} sold</strong></li>
        </ol>
    </div>
</template>



<script>
import session2 from '@/data/session-2'
import data from '@/data/tropes'
import { countBy } from "lodash";

export default {
    name: 'DataPage',
    data () {
        return {
            ...session2
        }
    },
    computed: {
        soldCellIds () {
            return this.playerData.reduce((acc, curr) => acc.concat(curr.soldCellIds), [])
        },
        soldCellFrequencyRanking () {
            const ranking = countBy(this.soldCellIds)
            const entries = Object.entries(ranking)
            entries.sort((a, b) => b[1] - a[1])
            return entries.map(([id, count]) => ({text: data.tropes.byId[id], count}))
        },
    },
}
</script>



<style>

</style>
