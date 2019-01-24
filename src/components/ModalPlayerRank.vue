<template>
    <ModalAction class="ModalPlayerRank" 
                 title="Players"
	             description="Who's in the lead?"
	             @close="$emit('close')">
        <PlayerList class="player-list"/>
    </ModalAction>
</template>

<script>
import ModalAction from '@/components/ModalAction'
import PlayerList from '@/components/PlayerList'

export default {
    name: 'ModalPlayerRank',
    components: {
        ModalAction,
        PlayerList,
    },
}
</script>

<style scoped>

</style>
