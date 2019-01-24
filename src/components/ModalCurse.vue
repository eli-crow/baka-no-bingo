<template>
    <ModalAction class="ModalCurse" 
                 title="Curse!"
	             description="Pick a friend to curse!"
	             @close="$emit('close')">
        <PlayerList class="player-list"
		            @select="curse($event)"/>
    </ModalAction>
</template>

<script>
import { sample } from 'lodash'
import { mapGetters } from 'vuex'

import curses from '@/data/curses'

import ModalAction from '@/components/ModalAction'
import PlayerList from '@/components/PlayerList'

export default {
    name: 'ModalCurse',
    components: {
        ModalAction,
        PlayerList,
    },
    computed: {
        ...mapGetters(['curseCost']),
    },
    methods: {
        curse (playerId) {
            this.$store.commit('ADJUST_SCORE', -this.curseCost)
			this.$socket.emit('curse', {
				targetPlayerId: playerId,
				curseId: sample(curses.allIds),
			})
		},
    },
}
</script>

<style scoped>

</style>
