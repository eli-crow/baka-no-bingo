<template>
    <div class="DataPage">
        <h2>Most Sold Tiles</h2>
        <ol>
            <li v-for="tile in soldTileFrequencyRanking">{{tile.text}}: <strong>{{tile.count}} sold</strong></li>
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
        soldTileIds () {
            return this.playerData.reduce((acc, curr) => acc.concat(curr.soldTileIds), [])
        },
        soldTileFrequencyRanking () {
            const ranking = countBy(this.soldTileIds)
            const entries = Object.entries(ranking)
            entries.sort((a, b) => b[1] - a[1])
            return entries.map(([id, count]) => ({text: data.tropes.byId[id], count}))
        },
    },
}
</script>



<style>

</style>
