<template>
    <div class="DataPage">
        <h2>Most Sold Tiles</h2>
        <ol>
            <li v-for="tile in soldTileFrequencyRanking">{{tile.text}}: <strong>{{tile.count}} sold</strong></li>
        </ol>

        <h2>Most Sold Tiles</h2>
        <p>{{ message }}</p>
    </div>
</template>



<script>
import session2 from '@/data/session-2'
import data from '@/data/tropes'

import { mapState } from 'vuex'
import { countBy } from "lodash";

export default {
    name: 'DataPage',
    computed: {
        ...mapState(['isConnected', 'sessions']),
        message () {
            return this.isConnected ? `I'm connected!` :  `Not connected, sorry`
        },
        soldTileIds () {
            // sessions --> playerData(concatenated) --> soldTileIds(concatenated)
            return this.sessions.map(s => s.playerData).reduce((acc, cur) => acc.concat(cur))
                                .map(pd => pd.soldTileIds).reduce((acc, cur) => acc.concat(cur))
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
